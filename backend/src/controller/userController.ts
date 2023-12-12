import { loginUserSchema, registerUserSchema } from '../validators/validators'
import { Request, Response } from 'express'
import mssql from 'mssql'
import {v4} from 'uuid'
import bcrypt from 'bcrypt'
import { sqlConfig } from '../config/sqlConfig'
import jwt from 'jsonwebtoken'
import { isEmpty } from 'lodash'
import dbHelper from '../dbhelpers/dbhelpers'

export const registerUser = async(req:Request, res: Response) =>{

    try {
        console.log(req.body);
        
        let {profileImage, fullName,email,password,username, phone_no,created_at  } = req.body

        let {error} = registerUserSchema.validate(req.body)

        if(error){
            return res.status(404).json({error: error.details})
        }


        let user_id = v4()

        const hashedPwd = await bcrypt.hash(password, 5)
         
        let result = await dbHelper.execute('registerUser', {
            user_id,profileImage, fullName, email,password:hashedPwd,username, phone_no,created_at
        })
        
        if(result.rowsAffected[0] === 0){
            return res.status(404).json({
                message: "Something went wrong, user not registered"
            })
        }else{
            return res.status(200).json({
                message: 'User registered successfully'
            })
        }

        
        
    } catch (error) {  
        return res.json({
            error: error
        })
    }
}

export const loginUser = async(req:Request, res: Response) =>{
    console.log(req.body);
    
    try {  
        const {email, password} = req.body

        const {error} = loginUserSchema.validate(req.body)

        if(error){
            return res.status(422).json({error: error.message})
        }

        const pool = await mssql.connect(sqlConfig)

        let user = await (await pool.request().input("email", email).input("password", password).execute('loginUser')).recordset

        
        if(user[0]?.email  == email){
            const CorrectPwd = await bcrypt.compare(password, user[0]?.password)

            if(!CorrectPwd){   
                return res.status(401).json({
                    error: "Incorrect password"
                })
            }

            const LoginCredentials = user.map(records =>{
                const {phone_no, password, welcomed, ...rest}=records

                return rest
            })

            
            const token = jwt.sign(LoginCredentials[0], process.env.SECRET as string, {
                expiresIn: '24h'
            }) 

            return res.status(200).json({
                message: "Logged in successfully", token
            })
            
        }else{
            return res.json({
                error: "User not found"
            })
        }

    } catch (error) {
        return res.json({
            error: "Internal server error"
        })
    }
}



export const toggleFollowUser =  async(req:Request, res: Response) =>{
    console.log(req.body);

    try {
        let follower_id = v4()

        let {following_user_id, followed_user_id,created_at  } = req.body

 const relationsexists = (await dbHelper.query(`SELECT * FROM follower WHERE following_user_id = '${following_user_id}' AND followed_user_id= '${followed_user_id}'`)).recordset

     if(!isEmpty(relationsexists)){
        let result = await dbHelper.execute('unfollowUser', {
            following_user_id, followed_user_id
        })

        if(result.rowsAffected[0] === 0){
            return res.status(404).json({
                message: "Something went wrong, user not followed"
            })
        }else{
            return res.status(200).json({
                message: 'User Unfollowed'
            })
        }
    
    }
    else{

        let result = await dbHelper.execute('followUser', {
            follower_id,following_user_id, followed_user_id,created_at
        })
        
        if(result.rowsAffected[0] === 0){
            return res.status(404).json({
                message: "Something went wrong, user not followed"
            })
        }else{
            return res.status(200).json({
                message: 'User Followed'
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

export const getAllUsers = async(req:Request, res:Response)=>{
    try {

        const pool = await mssql.connect(sqlConfig)

        let users = (await pool.request().execute('fetchAllUsers')).recordset

        return res.status(200).json({
            users: users
        })
        
    } catch (error) {
        return res.json({
            error: error
        })
    }
}