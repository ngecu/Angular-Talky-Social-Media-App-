import { createPostSchema, updatePostSchema } from "../validators/validators";
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

    let { postImage, created_by_user_id, caption, postType } = req.body;

    let { error } = createPostSchema.validate(req.body);

    if (error) {
      return res.status(404).json({ error: error.details });
    }

    let post_id = v4();
    let created_at = new Date().toISOString()

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
    const {post_id} = req.params
    let { postImage, caption } = req.body;

    let { error } = updatePostSchema.validate(req.body);

    if (error) {
      return res.status(404).json({ error: error.details });
    }

    let updated_at = new Date().toISOString();

    // Delete existing post media
    await dbHelper.execute('deletePostMedia', {
      post_id,
    });

    // Create new post media
    const mediaCreationPromises = postImage.map(async (media_file: string) => {
      let post_media_id = v4();
      let created_at = new Date().toISOString()
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

    // Update post information
    let result = await dbHelper.execute('updatePost', {
      post_id,
      caption
    });

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({
        message: "Something went wrong, Post not updated",
      });
    }

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
            updated_at,
          });

          if (result.rowsAffected[0] === 0) {
            throw new Error("Something went wrong, user not added to tags");
          }
        }
      });

      // Wait for all tagged user promises to resolve
      await Promise.all(taggedUserPromises);
    }

    // Send the response after all media is updated and tagged users are processed
    return res.status(200).json({
      message: 'Post updated successfully',
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

export const getAllPosts = async (req: Request, res: Response) => {
  try {
    const pool = await mssql.connect(sqlConfig);
    const result = await pool.request().execute('fetchAllPosts');
    const posts = result.recordset;

    const postsWithDetails = await Promise.all(posts.map(async (post) => {
      // Fetch comments
      const commentsResult = await pool
        .request()
        .input('post_id', mssql.VarChar(500), post.post_id)
        .execute('fetchCommentsByPostId');
      const comments = commentsResult.recordset;

      // Fetch media files
      const mediaResult = await pool
        .request()
        .input('post_id', mssql.VarChar(500), post.post_id)
        .execute('fetchMediaByPostId');
      const mediaFiles = mediaResult.recordset;

      // Fetch likes
      const likesResult = await pool
        .request()
        .input('post_id', mssql.VarChar(500), post.post_id)
        .execute('fetchLikesByPostId');
      const likes = likesResult.recordset;

      return {
        ...post,
        comments: comments,
        mediaFiles: mediaFiles,
        likes: likes,
      };
    }));

    return res.status(200).json({
      posts: postsWithDetails,
    });
  } catch (error) {
    console.error('Error:', error);
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

    console.log(result);
    
    if (result.rowsAffected.length < 1) {
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

export const getPostsByUser = async (req: Request, res: Response) => {
  try {
    const { user_id } = req.params;

    if (!user_id) {
      return res.status(400).json({
        message: 'User ID is required to fetch posts',
      });
    }

    const result = await dbHelper.execute('getPostsByUser', {
      user_id,
    });

    console.log(result);
    
    if (result.rowsAffected[0] !== 0) {
      const posts = result.recordset;
      return res.status(200).json({
        posts,
      });
    } else {
      return res.status(200).json({
        posts: [],
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
      const { following_user_id } = req.params;
      const followers = (await dbHelper.execute('fetchFollowings', {
          following_user_id
      })).recordset;

      const posts: any[] = [];

      if (followers.length > 0) {
          for (const follower of followers) {
              const user_id = follower.following_user_id;
              const result = await dbHelper.execute('getFollowerPost', {
                  user_id,
              });

              if (result.rowsAffected[0] !== 0) {
                  posts.push(...result.recordset);
              }
          }

          // Combine media files for each post
          const postsWithMedia = await Promise.all(
              posts.map(async (post) => {
                  const mediaResult = await dbHelper.execute('getPostMedia', {
                      post_id: post.post_id,
                  });

                  post.media = mediaResult.recordset;
                  return post;
              })
          );

          return res.status(200).json({
              posts: postsWithMedia,
          });
      } else {
          return res.status(200).json({
              posts: [],
          });
      }
  } catch (error) {
      console.log(error);
      return res.json({
          error: error,
      });
  }
};


export const createComment = async (req: Request, res: Response) => {
    try {
      console.log(req.body);
  
      let { created_by_user_id, post_id, comment, comment_replied_to_id } = req.body;
  
      let comment_id = v4();
      let created_at = new Date().toISOString()

      if (comment.includes('@')) {
        const username_tagged = comment.split('@')[1].split(' ')[0]; 
        
        console.log("username_tagged is ",username_tagged);
        
        const userExists = (await dbHelper.query(`SELECT * FROM users WHERE username = '${username_tagged}'`)).recordset;
        console.log(userExists);
        
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
        else{
          return res.status(404).json({
            message: "User Tagged doesn't exist"
        })
        }
      }

      if(comment_replied_to_id){

        const comment_exists = (await dbHelper.query(`SELECT * FROM comment WHERE comment_id='${comment_replied_to_id}'`)).recordset
        if (isEmpty(comment_exists)) return res.status(400).send({ message: "No such Comment" });
        else {
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
            return res.status(200).json({
              message: 'Comment created successfully',
            });
          }

        }

      }

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
      const {comment_id} = req.params

      console.log(req.body);
  
      let {comment, comment_replied_to_id } = req.body;
  

      if (!comment_id) {
        return res.status(400).json({
          message: 'Comment ID is required for editing',
        });
      }
  
    
      let result = await dbHelper.execute('editComment', {
        comment_id,
        comment, 
        comment_replied_to_id 
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
      SELECT *
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