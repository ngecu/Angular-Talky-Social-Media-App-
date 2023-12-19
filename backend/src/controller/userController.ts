import { loginUserSchema, registerUserSchema, updateProfileSchema } from '../validators/validators'
import { Request, Response } from 'express'
import mssql from 'mssql'
import {v4} from 'uuid'
import bcrypt from 'bcrypt'
import { sqlConfig } from '../config/sqlConfig'
import jwt from 'jsonwebtoken'
import { isEmpty } from 'lodash'
import dbHelper from '../dbhelpers/dbhelpers'
import { ExtendedUser } from '../middlewares/verifyToken'
import crypto from 'crypto';
import fs from 'fs';
import handlebars from 'handlebars'
import useragent from 'useragent'
import sendEmail from '../utils/sendEmail'

import path from 'path'
const templateFilePath = path.join(__dirname,"../templates/email-template.hbs")

const readHTMLFile = (path:string) => {
    return new Promise((resolve, reject) => {
      fs.readFile(path, { encoding: 'utf-8' }, (error, htmlContent) => {
        if (error) {
          reject(error);
        } else {
          resolve(htmlContent);
        }
      });
    });
  };
  

  const renderEmailTemplate = (template:any, data:any) => {
    const compiledTemplate = handlebars.compile(template);
    return compiledTemplate(data);
  };

export const registerUser = async(req:Request, res: Response) =>{

    try {
        console.log(req.body);
        
        let {profileImage, fullName,email,password,username, phone_no  } = req.body
        let {error} = registerUserSchema.validate(req.body)

        if(error){
            return res.status(404).json({error: error.details[0].message})
        }


        let user_id = v4()

        const hashedPwd = await bcrypt.hash(password, 5)
         if(isEmpty(profileImage)){
          profileImage = ""
         }
        let result = await dbHelper.execute('registerUser', {
            user_id,profileImage, fullName, email,password:hashedPwd,username, phone_no
        })
        
        if(result.rowsAffected[0] === 0){
            return res.status(404).json({
                message: "Something went wrong, user not registered"
            })
        }else{
            console.log("Uder Registered successfully");
            
            return res.status(200).json({
                message: 'User registered successfully'
            })
        }

        
        
    } catch (error) {  
        console.log(error);
        
        return res.status(404).json({
            error
        })
    }
}

export const loginUser = async(req:Request, res: Response) =>{
    
    
    try {  
        const {email, password} = req.body

        const {error} = loginUserSchema.validate(req.body)

        if(error){
            return res.status(422).json({error: error.message})
        }

        const pool = await mssql.connect(sqlConfig)

        let user = await (await pool.request().input("email", email).input("password", password).execute('loginUser')).recordset
        

        if(user[0]?.email  == email || user[0]?.fullName  == email || user[0]?.username  == email || user[0]?.phone_no  == email ){
            const CorrectPwd = await bcrypt.compare(password, user[0]?.password)

            if(!CorrectPwd){   
              console.log("Incorrect Password");
                return res.status(401).json({
                    error: "Incorrect password"
                })
            }

             if (user[0]?.active === 0) {
                return res.status(401).json({
                    error: "Account deactivated, please contact admin"
                });
            }

            const LoginCredentials = user.map(records =>{
                const {password, welcomed, ...rest}=records

                return rest
            })

            
            const token = jwt.sign(LoginCredentials[0], process.env.SECRET as string, {
                expiresIn: '24h'
            }) 
            console.log("Logged in successfully");
            
            return res.status(200).json({
                message: "Logged in successfully", token
            })
            
        }else{
            return res.status(404).json({
                error: "User not found"
            })
        }

    } catch (error) {
        console.log(error);
        
        return res.status(404).json({
            error
        })
    }
}

export const toggleSoftDeleteUser = async (req: Request, res: Response) => {
    try {  
      let { user_id } = req.params;
      
      console.log(req.params);
      
  

      if (!user_id) {
        return res.status(400).json({
          message: 'User ID is required for toggling soft delete',
        });
      }
  
      const user = (await dbHelper.query(`SELECT * FROM users WHERE user_id = '${user_id}'`)).recordset[0];
  
      if (!user) {
        return res.status(404).json({
          message: 'User not found',
        });
      }
  
      const active = user.active === 1 ? 0 : 1;
  
      let result = await dbHelper.execute('toggleSoftDeleteUser', {
        user_id,
        active,
      });
  
      if (result.rowsAffected[0] === 0) {
        return res.status(404).json({
          message: 'Something went wrong, Soft delete not toggled',
        });
      } else {
        return res.status(200).json({
          message: `Soft delete toggled successfully for user ${user_id}`,
          active,
        });
      }
    } catch (error) {
      console.log(error);
  
      return res.status(500).json({
        error: 'Internal Server Error',
      });
    }
  };

export const updateProfile = async (req: Request, res: Response) => {
    try {
      console.log(req.body);
      const {user_id} = req.params
    //   let {error} = updateProfileSchema.validate(req.body)
    //   if(error){
    //     console.log(error);
        
    //     return res.status(404).json({error: error.details})
    // }
      let {
        
        profileImage,
        fullName,
        username,
        phone_no,
      } = req.body;
  
      if (!user_id) {
        return res.status(400).json({
          message: 'User ID is required for updating profile',
        });
      }
  
  
      let result = await dbHelper.execute('updateUserProfile', {
        user_id,
        profileImage,
        fullName,
        username,
        phone_no
      });
  
      if (result.rowsAffected[0] === 0) {
        return res.status(404).json({
          message: 'Something went wrong, Profile not updated',
        });
      } else {
        return res.status(200).json({
          message: 'Profile updated successfully',
        });
      }
    } catch (error) {
      console.log(error);
  
      return res.status(500).json({
        error: 'Internal Server Error',
      });
    }
  };
  
  export const getUserDetails = async (req: Request, res: Response) => {
    try {
      const { user_id } = req.params;
  
      if (!user_id) {
        return res.status(400).json({
          message: 'User ID is required to fetch user details',
        });
      }
  
      const result = await dbHelper.execute('getUserDetails', {
        user_id,
      });
  
      if (result.rowsAffected[0] !== 0) {
        const userDetails = result.recordset[0];
        return res.status(200).json({
          userDetails,
        });
      } else {
        return res.status(404).json({
          message: 'User not found',
        });
      }
    } catch (error) {
      console.log(error);
  
      return res.status(500).json({
        error: 'Internal Server Error',
      });
    }
  };
  


export const checkUserDetails = async (req:ExtendedUser, res:Response)=>{
    
    if(req.info){
        console.log(req.info);
        
        return res.json({
            info: req.info 
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

export const toggleFollowUser =  async(req:Request, res: Response) =>{
    console.log(req.body);

    try {
        let follower_id = v4()

        let {following_user_id, followed_user_id  } = req.body
        
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
            follower_id,following_user_id, followed_user_id
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


export const getFollowers = async(req:Request, res:Response)=>{
    try {

        let {followed_user_id  } = req.params

        let followers = (await dbHelper.execute('fetchFollowers', {
            followed_user_id
        })).recordset

     
            return res.status(200).json({
                followers: followers
            })
        }
        
     catch (error) {
        return res.json({
            error: error
        })
    }
}

export const getFollowings = async(req:Request, res:Response)=>{
    try {

        let {following_user_id  } = req.params

        let followings = (await dbHelper.execute('fetchFollowings', {
            following_user_id
        })).recordset

     
            return res.status(200).json({
                followings: followings
            })
        }
        
     catch (error) {
        return res.json({
            error: error
        })
    }
}


export const sendRestPassword = async (req:Request, res:Response) => {
    const { email } = req.body
  console.log(req.body);
  

    const user = (await dbHelper.query(`SELECT * FROM users WHERE fullName='${email}' OR email='${email}' OR username ='${email}' OR phone_no = '${email}'`)).recordset

    console.log("user is ",user);  
    if (isEmpty(user)) return res.status(400).send({ message: "No such user details" });

    else {

        const token = (await dbHelper.query(`SELECT * FROM token WHERE user_id = '${user[0].user_id}'`)).recordset

        console.log("token is ",token);
        
        if (isEmpty(token)) {
            const token = crypto.randomBytes(32).toString('hex');
             let token_id = v4()
             let user_id =user[0].user_id;
           

            let result = await dbHelper.execute('registerToken', {
                token_id,user_id,token
            })

            if(result.rowsAffected[0] === 0){
                return res.status(404).json({
                    message: "Something went wrong, user not followed"
                })
            }else{
               console.log("token added")
            }
        }
        else{
              
          
  
  
  
      const url = `http://localhost:4200/new-password/${user[0].user_id}/${token[0].token}`;
  
      // Example user agent string
      const userAgentString = req.headers['user-agent'];
  
      // Parse the user agent string
      const agent = useragent.parse(userAgentString);
  
      // Retrieve the browser name
      const browserName = agent.family;
  
      // Retrieve the operating system
      const operatingSystem = agent.os.toString();
  
      console.log(userAgentString)
      console.log(operatingSystem)
  
      readHTMLFile(templateFilePath)
    .then((templateContent) => {
      // Define the data for the template variables
      const templateData = {
        name: user[0].fullName,
        email: user[0].email,
        browserName,
        operatingSystem,
        action_url:url
      };
  
      // Render the email template with the data
      const renderedTemplate = renderEmailTemplate(templateContent, templateData);
  
      // Send the email
      sendEmail(user[0].email, "Reset Email", renderedTemplate)
        .then(() => {
          console.log('Email sent successfully');
          res.status(200).send({ message: "Password reset link sent to your email account" });
  
        })
        .catch((error) => {
          console.log('Failed to send email:', error);
        });
    })
    .catch((error) => {
      console.log('Failed to read template file:', error);
    });
}
    }
  }
  
// export  const verifyResetPassword = async (req:Request,res:Response)=>{
//       try {
//         const {Email } = req.body
//         const user = (await dbHelper.query(`SELECT * FROM users WHERE fullName= ${Email} OR email=${Email} OR username =${Email} OR phone_no = ${Email}`)).recordset
//         if (!user) return res.status(400).send({ message: "Invalid link" });
  
//         const token = (await dbHelper.query(`SELECT * FROM token WHERE user_id = ${user[0].user_id}`)).recordset

//         if (isEmpty(token)) return res.status(400).send({ message: "Invalid link" });
//       console.log(user[0].user_id.toString())
//       const resetPasswordLink = `http://localhost:4200/new-password/${user[0].user_id.toString()}/${token[0].token}`;
//       res.redirect(resetPasswordLink);
//       res.status(200).send(`http://localhost:4200/new-password/${user[0].user_id.toString()}/${token[0].token}`);
//       } catch (error) {
//       console.log(error)
//           res.status(500).send({ message: "Internal Server Error ",error });
//       }
//   }
  
  export const setNewPassword = async (req:Request, res:Response) => {
    try {
        const { user_id } = req.params;
        const {password} = req.body        

        const userResult = await dbHelper.query(`SELECT * FROM users WHERE user_id='${user_id}'`);
        const user = userResult.recordset[0];
        console.log(user.user_id);
        
      
        if (!user) return res.status(400).send({ message: "User doesn't exist" });
      

        const tokenResult = await dbHelper.query(`SELECT * FROM token WHERE user_id = '${user.user_id}'`);
        const token = tokenResult.recordset[0];
      
        if (isEmpty(token)) return res.status(400).send({ message: "Invalid link or token expired" });
      

        if (password) {
          const hashedPwd = await bcrypt.hash(password, 5)
          await dbHelper.query(`UPDATE users SET password='${hashedPwd}' WHERE user_id='${user.user_id}'`);
        }
      
        
        await dbHelper.query(`DELETE FROM token WHERE user_id='${user.user_id}'`);
      
        res.status(200).send({ message: "Password reset successfully" });
      } catch (error) {
        console.error("Error updating user and deleting token:", error);
        res.status(500).send({ message: "Internal Server Error" });
      }
      
  }

  export const getFollowSuggestions = async (req: Request, res: Response) => {
    try {
      const { user_id } = req.params;
  
      const pool = await mssql.connect(sqlConfig);
  
      const result = await pool
        .request()
        .input('user_id', mssql.VarChar(500), user_id)
        .execute('GetFollowSuggestions');
  
      const suggestions = result.recordset;
  
      return res.status(200).json({
        suggestions: suggestions,
      });
    } catch (error) {
      console.error('Error:', error);
      return res.status(500).json({
        error: 'Internal Server Error',
      });
    } 
  };
  