import joi from 'joi'

export const registerUserSchema = joi.object({
        profileImage: joi.string(),    
        fullName: joi.string(),
        email : joi.string().email(),
        password: joi.string(),
        confirmPassword: joi.string(),
        username:joi.string(),
        phone_no: joi.string().min(10),
        created_at : joi.string(),
})


export const loginUserSchema = joi.object({
    Email: joi.string().required(), 
    Password: joi.string().required()
})


export const createPostSchema = joi.object({
    postImage: joi.any(),    
    created_by_user_id: joi.string(),
    caption : joi.string(),
    postType: joi.string(),
    created_at : joi.string(),
})