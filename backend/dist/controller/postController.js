"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPost = void 0;
const validators_1 = require("../validators/validators");
const uuid_1 = require("uuid");
const dbhelpers_1 = __importDefault(require("../dbhelpers/dbhelpers"));
const createPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(req.body);
        let { postImage, created_by_user_id, caption, postType, created_at } = req.body;
        let { error } = validators_1.createPostSchema.validate(req.body);
        if (error) {
            return res.status(404).json({ error: error.details });
        }
        let post_id = (0, uuid_1.v4)();
        let result = yield dbhelpers_1.default.execute('registerUser', {
            post_id, postImage, created_by_user_id, caption, postType, created_at
        });
        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({
                message: "Something went wrong, user not registered"
            });
        }
        else {
            return res.status(200).json({
                message: 'Post created successfully'
            });
        }
    }
    catch (error) {
        return res.json({
            error: error
        });
    }
});
exports.createPost = createPost;
