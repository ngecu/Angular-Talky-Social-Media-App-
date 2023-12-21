import joi from "joi";

export const validatePost = joi.object().keys({
  postContent: joi.string(),
  imageUrl: joi.string(),
  userID: joi.string().required(),
});

export const validateUpdatePost = joi.object().keys({
  postID: joi.string().required(),
  imageUrl: joi.string().required(),
  userID: joi.string().required(),
  postContent: joi.string().required(),
});

export const validatePostId = joi.object().keys({
  postID: joi.string().min(8).required(),
});

export const validateUserPostID = joi.object().keys({
  userID: joi.string().required()
})
