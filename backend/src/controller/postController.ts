import { createPostSchema } from "../validators/validators";
import { Request, Response } from 'express'
import {v4} from 'uuid'
import dbHelper from '../dbhelpers/dbhelpers'
import { forEach } from "lodash";
import { isEmpty } from 'lodash'

export const createPost = async(req:Request, res: Response) =>{

    try {
        console.log(req.body);
        
        let {postImage, created_by_user_id,caption,postType,created_at  } = req.body

        let {error} = createPostSchema.validate(req.body)

        if(error){
            return res.status(404).json({error: error.details})
        }


        let post_id = v4()

         
        let result = await dbHelper.execute('createPost', {
            post_id, created_by_user_id,caption,postType,created_at
        })
        
        if(result.rowsAffected[0] === 0){


            return res.status(404).json({
                message: "Something went wrong, Post not created"
            })
        }else{

            postImage.forEach(async (media_file:string) => {
                let post_media_id = v4()
                let result = await dbHelper.execute('createPostMedia', {
                    post_media_id,post_id,media_file, created_at
                })

                if(result.rowsAffected[0] === 0){
                    return res.status(404).json({
                        message: "Something went wrong, Post Media not created"
                    })
                }

                else{
                    return res.status(200).json({
                        message: 'Post created successfully'
                    })
                }


            });

          
        }

        
        
    } catch (error) {  
        return res.json({
            error: error
        })
    }
}

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
      return res.json({
        error: error,
      });
    }
  };
  

