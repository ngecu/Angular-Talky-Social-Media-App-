import { createPostSchema } from "../validators/validators";
import { Request, Response } from 'express'
import {v4} from 'uuid'
import dbHelper from '../dbhelpers/dbhelpers'

export const createPost = async(req:Request, res: Response) =>{

    try {
        console.log(req.body);
        
        let {postImage, created_by_user_id,caption,postType,created_at  } = req.body

        let {error} = createPostSchema.validate(req.body)

        if(error){
            return res.status(404).json({error: error.details})
        }


        let post_id = v4()

         
        let result = await dbHelper.execute('registerUser', {
            post_id,postImage, created_by_user_id,caption,postType,created_at
        })
        
        if(result.rowsAffected[0] === 0){
            return res.status(404).json({
                message: "Something went wrong, user not registered"
            })
        }else{
            return res.status(200).json({
                message: 'Post created successfully'
            })
        }

        
        
    } catch (error) {  
        return res.json({
            error: error
        })
    }
}