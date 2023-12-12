"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPostSchema = exports.loginUserSchema = exports.registerUserSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.registerUserSchema = joi_1.default.object({
    profileImage: joi_1.default.string(),
    fullName: joi_1.default.string(),
    email: joi_1.default.string().email(),
    password: joi_1.default.string(),
    confirmPassword: joi_1.default.string(),
    username: joi_1.default.string(),
    phone_no: joi_1.default.string().min(10),
    created_at: joi_1.default.string(),
});
exports.loginUserSchema = joi_1.default.object({
    Email: joi_1.default.string().required(),
    Password: joi_1.default.string().required()
});
exports.createPostSchema = joi_1.default.object({
    postImage: joi_1.default.any(),
    created_by_user_id: joi_1.default.string(),
    caption: joi_1.default.string(),
    postType: joi_1.default.string(),
    created_at: joi_1.default.string(),
});
