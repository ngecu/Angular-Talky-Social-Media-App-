import joi from "joi";

export const validateComment = joi.object().keys({
  comment: joi.string(),
  userID: joi.string(),
  postID: joi.string().required(),
});

export const validateReplyComment = joi.object().keys({
  comment: joi.string(),
  userID: joi.string(),
  parentCommentID: joi.string(),
  postID: joi.string().required(),
});

export const validateUpdateComment = joi.object().keys({
  postID: joi.string().required(),
  comment: joi.string().required(),
  userID: joi.string().required(),
  commentID: joi.string().required(),
});

export const validateCommentId = joi.object().keys({
  commentID: joi.string().min(8).required(),
});
