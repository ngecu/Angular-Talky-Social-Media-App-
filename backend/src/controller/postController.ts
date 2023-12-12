import { createPostSchema } from "../validators/validators";
import { Request, Response } from 'express'
import {v4} from 'uuid'
import dbHelper from '../dbhelpers/dbhelpers'
import { forEach } from "lodash";
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
        // If media creation fails, throw an error
        throw new Error("Something went wrong, Post Media not created");
      }

      // Return the created post media ID
      return post_media_id;
    });

    // Wait for all media creation promises to resolve
    const postMediaIds = await Promise.all(mediaCreationPromises);

    // Send the response after all media is created
    return res.status(200).json({
      message: 'Post created successfully',
      post_id,
      postMediaIds,
    });
  } catch (error) {
    console.log(error);

    return res.status(404).json({
      error: error.message,
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
  

