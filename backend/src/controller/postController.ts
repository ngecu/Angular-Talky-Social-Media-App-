import { createPostSchema } from "../validators/validators";
import { Request, Response } from 'express'
import {v4} from 'uuid'
import dbHelper from '../dbhelpers/dbhelpers'
import { isEmpty } from 'lodash'
import mssql from 'mssql'
import { sqlConfig } from '../config/sqlConfig'
import { Post } from "../interface/post";

export const createPost = async (req: Request, res: Response) => {
  try {
    console.log(req.body);

    let { postImage, created_by_user_id, caption, postType, created_at } = req.body;

    let { error } = createPostSchema.validate(req.body);

    if (error) {
      return res.status(404).json({ error: error.details });
    }

    let post_id = v4();

    let result = await dbHelper.execute('createPost', {
      post_id,
      created_by_user_id,
      caption,
      postType,
      created_at,
    });

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({
        message: "Something went wrong, Post not created",
      });
    }

    // Array to hold promises for media creation
    const mediaCreationPromises = postImage.map(async (media_file: string) => {
      let post_media_id = v4();
      let result = await dbHelper.execute('createPostMedia', {
        post_media_id,
        post_id,
        media_file,
        created_at,
      });

      if (result.rowsAffected[0] === 0) {
        throw new Error("Something went wrong, Post Media not created");
      }

      // Return the created post media ID
      return post_media_id;
    });

    // Wait for all media creation promises to resolve
    const postMediaIds = await Promise.all(mediaCreationPromises);

    // Check for tagged users in the caption
    if (caption.includes('@')) {
      const usernamesTagged = caption.match(/@(\S+)/g) || [];
      
      const taggedUserPromises = usernamesTagged.map(async (usernameTagged: string) => {
        const username = usernameTagged.substring(1); // Remove the @ symbol
        const userExists = (await dbHelper.query(`SELECT * FROM user WHERE username = '${username}'`)).recordset;

        if (!isEmpty(userExists)) {
          const user_id = userExists[0].user_id;
          const post_user_tag_id = v4();

          let result = await dbHelper.execute('addToPostTaggedTable', {
            post_user_tag_id,
            post_id,
            user_id,
            created_at,
          });

          if (result.rowsAffected[0] === 0) {
            throw new Error("Something went wrong, user not added to tags");
          }
        }
      });

      // Wait for all tagged user promises to resolve
      await Promise.all(taggedUserPromises);
    }

    // Send the response after all media is created and tagged users are processed
    return res.status(200).json({
      message: 'Post created successfully',
      post_id,
      postMediaIds,
    });
  } catch (error) {
    console.log(error);

    return res.status(404).json({
      error: error,
    });
  }
};

export const editPost = async (req: Request, res: Response) => {
  try {
    console.log(req.body);

    let {
      post_id,
      updatedCaption,
      updatedPostType,
      updated_at,
    } = req.body;

    // Check if the post_id is provided
    if (!post_id) {
      return res.status(400).json({
        message: 'Post ID is required for editing',
      });
    }

    // Perform a database update to edit the post
    let result = await dbHelper.execute('editPost', {
      post_id,
      updatedCaption,
      updatedPostType,
      updated_at,
    });

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({
        message: 'Something went wrong, Post not updated',
      });
    } else {
      return res.status(200).json({
        message: 'Post updated successfully',
      });
    }
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      error: 'Internal Server Error',
    });
  }
};

export const deletePost = async (req: Request, res: Response) => {
  try {
    console.log(req.body);

    let { post_id } = req.params;

    // Check if the post_id is provided
    if (!post_id) {
      return res.status(400).json({
        message: 'Post ID is required for deletion',
      });
    }

    // Perform a database delete to remove the post
    let result = await dbHelper.execute('deletePost', {
      post_id,
    });

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({
        message: 'Something went wrong, Post not deleted',
      });
    } else {
      return res.status(200).json({
        message: 'Post deleted successfully',
      });
    }
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      error: 'Internal Server Error',
    });
  }
};

export const followingPosts = async (req: Request, res: Response) => {
    try {
      console.log(req.params);
      
        const { following_user_id } = req.params;

        const followers = (await dbHelper.execute('fetchFollowings', {
            following_user_id
        })).recordset;

        console.log("followers ",followers);
        if(followers.length > 0){
        const userIds = followers.map((follower) => ({ UserId: follower.user_id }));

        const pool = await mssql.connect(sqlConfig);

        const result = await pool
            .request()
            .input('UserIds', mssql.TVP, userIds)
            .execute('fetchPostsForUsers');

            const followingPosts: Post[] = result.recordset.map((row: any) => {
              return {
                  post_id: row.post_id,
                  created_by_user_id: row.created_by_user_id,
                  caption: row.caption,
                  postType: row.postType,
                  created_at: row.created_at,
                  post_media_id: row.post_media_id,
                  media_file: row.media_file
              };
          });
          
          return res.status(200).json({
              posts: followingPosts
          });
        }
        else{
          return res.status(200).json({
            posts: []
        });
        }

    } catch (error) {
      console.log(error);
      
        return res.json({
            error: error
        });
    }
};


export const createComment = async (req: Request, res: Response) => {
    try {
      console.log(req.body);
  
      let { created_by_user_id, post_id, comment, comment_replied_to_id, created_at } = req.body;
  
      let comment_id = v4();
  
      let result = await dbHelper.execute('createComment', {
        comment_id,
        created_by_user_id,
        post_id,
        comment,
        comment_replied_to_id,
        created_at,
      });
  
      if (result.rowsAffected[0] === 0) {
        return res.status(404).json({
          message: 'Something went wrong, Comment not created',
        });
      } else {
        if (comment.includes('@')) {
          const username_tagged = comment.split('@')[1].split(' ')[0]; // Extract username after @
          
          console.log("username_tagged is ",username_tagged);
          
          const userExists = (await dbHelper.query(`SELECT * FROM user WHERE username = '${username_tagged}'`)).recordset;
  
          if (!isEmpty(userExists)) {
            const user_id = userExists[0].user_id;
            const post_user_tag_id = v4();
  
            let result = await dbHelper.execute('addToPostTaggedTable', {
              post_user_tag_id,
              post_id,
              user_id,
              created_at,
            });
  
            if (result.rowsAffected[0] === 0) {
              return res.status(404).json({
                message: 'Something went wrong, user not added to tags',
              });
            }
          }
        }
  
        return res.status(200).json({
          message: 'Comment created successfully',
        });
      }
    } catch (error) {
      console.log(error);
      
      return res.json({
        error: error,
      });
    }
  };

export const editComment = async (req: Request, res: Response) => {
    try {
      console.log(req.body);
  
      let { comment_id, updated_comment, updated_at } = req.body;
  
      // Check if the comment_id is provided
      if (!comment_id) {
        return res.status(400).json({
          message: 'Comment ID is required for editing',
        });
      }
  
      // Perform a database update to edit the comment
      let result = await dbHelper.execute('editComment', {
        comment_id,
        updated_comment,
        updated_at,
      });
  
      if (result.rowsAffected[0] === 0) {
        return res.status(404).json({
          message: 'Something went wrong, Comment not updated',
        });
      } else {
        return res.status(200).json({
          message: 'Comment updated successfully',
        });
      }
    } catch (error) {
      console.log(error);
  
      return res.status(500).json({
        error: 'Internal Server Error',
      });
    }
  };

  export const deleteComment = async (req: Request, res: Response) => {
    try {
      console.log(req.body);
  
      let { comment_id } = req.params;
  

      if (!comment_id) {
        return res.status(400).json({
          message: 'Comment ID is required for deletion',
        });
      }
  

      let result = await dbHelper.execute('deleteComment', {
        comment_id,
      });
  
      if (result.rowsAffected[0] === 0) {
        return res.status(404).json({
          message: 'Something went wrong, Comment not deleted',
        });
      } else {
        return res.status(200).json({
          message: 'Comment deleted successfully',
        });
      }
    } catch (error) {
      console.log(error);
  
      return res.status(500).json({
        error: 'Internal Server Error',
      });
    }
  };

  export const toggleLikePost =  async(req:Request, res: Response) =>{
    console.log(req.body);

    try {
        let reaction_id = v4()

        let {user_id, post_id  } = req.body
        let created_at  = new Date().toISOString();
 const likeexists = (await dbHelper.query(`SELECT * FROM reaction WHERE user_id = '${user_id}' AND post_id= '${post_id}'`)).recordset

     if(!isEmpty(likeexists)){
        let result = await dbHelper.execute('unLikePost', {
          user_id, post_id 
        })

        if(result.rowsAffected[0] === 0){
            return res.status(404).json({
                message: "Something went wrong, Pots not unliked"
            })
        }else{
            return res.status(200).json({
                message: 'Post Unliked'
            })
        }
    
    }
    else{

        let result = await dbHelper.execute('likePost', {
          reaction_id,user_id, post_id ,created_at
        })
        
        if(result.rowsAffected[0] === 0){
            return res.status(404).json({
                message: "Something went wrong, Post not lked"
            })
        }else{
            return res.status(200).json({
                message: 'Post Liked'
            })
        }

    }

    } catch (error) {
        console.log(error);

        return res.json({
            error
        })
    }
}

export const getPostLikes = async (req: Request, res: Response) => {
  try {
    const { post_id } = req.params; 

    const likes = await dbHelper.query(`
      SELECT user_id, created_at
      FROM reaction
      WHERE post_id = '${post_id}'
    `);

    // Check if there are any likes for the post
    if (likes.recordset.length === 0) {
      return res.status(404).json({
        message: 'No likes found for the specified post',
      });
    }

    // Return the likes information
    return res.status(200).json({
      likes: likes.recordset,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: 'Internal Server Error',
    });
  }
};