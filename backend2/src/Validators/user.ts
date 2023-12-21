import joi from "joi";

export const userRegisterValidationSchema = joi.object({
  username: joi.string().required().min(2).max(30),
  fullname: joi.string().required().min(2).max(30),
  email: joi.string().email({
    minDomainSegments: 1,
    tlds: {
      allow: ["com"],
    },
  }),
  password: joi
    .string()
    .required()
    .min(8)
    .pattern(new RegExp("^[a-zA-Z0-9!@#%$&*()]{0,30}$")),
});

export const userLoginValidationSchema = joi.object({
  email: joi.string().email({
    minDomainSegments: 2,
    tlds: {
      allow: ["ke", "com"],
    },
  }),
  password: joi
    .string()
    .required()
    .pattern(new RegExp("^[a-zA-Z0-9!@#%$&*()]{0,30}$")),
});

export const validateUserEmail = joi.object().keys({
  email: joi.string().email().required(),
  password: joi.string().required(),
});

export const validateResetpassword = joi.object().keys({
  userID: joi.string().min(8).required(),
  password: joi.string().pattern(new RegExp("^[a-zA-Z0-9!@#%$&*()]{0,30}$")),
});

export const validateUserEmailForgotPassword = joi.object().keys({
  email: joi.string().email().required(),
});