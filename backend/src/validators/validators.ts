import joi from 'joi'

export const registerUserSchema = joi.object({
        profileImage: joi.string().required(),    
        fullName: joi.string().required(),
        email : joi.string().email().required(),
        password: joi.string().required(),
        confirmPassword: joi.string(),
        username:joi.string().required(),
        phone_no: joi.number().min(10).required(),
})


export const loginUserSchema = joi.object({
    Email: joi.string().required(), 
    Password: joi.string().required()
})


export const createPostSchema = joi.object({
    postImage: joi.any(),    
    created_by_user_id: joi.string(),
    caption : joi.string(),
    postType: joi.string()
})

export const updateProfileSchema = joi.object({
    profileImage: joi.string(),    
    fullName: joi.string(),
    username:joi.string(),
    phone_no: joi.number().min(10),
})

export const updatePostSchema = joi.object({
    postImage: joi.any(),    
    created_by_user_id: joi.string(),
    caption : joi.string(),
    postType: joi.string()
})

