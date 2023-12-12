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
exports.createComment = exports.followingPosts = exports.createPost = void 0;
const validators_1 = require("../validators/validators");
const uuid_1 = require("uuid");
const dbhelpers_1 = __importDefault(require("../dbhelpers/dbhelpers"));
const lodash_1 = require("lodash");
const mssql_1 = __importDefault(require("mssql"));
const sqlConfig_1 = require("../config/sqlConfig");
const createPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(req.body);
        let { postImage, created_by_user_id, caption, postType, created_at } = req.body;
        let { error } = validators_1.createPostSchema.validate(req.body);
        if (error) {
            return res.status(404).json({ error: error.details });
        }
        let post_id = (0, uuid_1.v4)();
        let result = yield dbhelpers_1.default.execute('createPost', {
            post_id, created_by_user_id, caption, postType, created_at
        });
        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({
                message: "Something went wrong, Post not created"
            });
        }
        else {
            postImage.forEach((media_file) => __awaiter(void 0, void 0, void 0, function* () {
                let post_media_id = (0, uuid_1.v4)();
                let result = yield dbhelpers_1.default.execute('createPostMedia', {
                    post_media_id, post_id, media_file, created_at
                });
                if (result.rowsAffected[0] === 0) {
                    return res.status(404).json({
                        message: "Something went wrong, Post Media not created"
                    });
                }
                else {
                    return res.status(200).json({
                        message: 'Post created successfully'
                    });
                }
            }));
        }
    }
    catch (error) {
        return res.json({
            error: error
        });
    }
});
exports.createPost = createPost;
const followingPosts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { following_user_id } = req.params;
        const followers = (yield dbhelpers_1.default.execute('fetchFollowings', {
            following_user_id
        })).recordset;
        const userIds = followers.map((follower) => ({ UserId: follower.user_id }));
        const pool = yield mssql_1.default.connect(sqlConfig_1.sqlConfig);
        const result = yield pool
            .request()
            .input('UserIds', mssql_1.default.TVP, userIds)
            .execute('fetchPostsForUsers');
        const followingPosts = result.recordset;
        return res.status(200).json({
            posts: followingPosts
        });
    }
    catch (error) {
        return res.json({
            error: error
        });
    }
});
exports.followingPosts = followingPosts;
const createComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(req.body);
        let { created_by_user_id, post_id, comment, comment_replied_to_id, created_at } = req.body;
        let comment_id = (0, uuid_1.v4)();
        let result = yield dbhelpers_1.default.execute('createComment', {
            comment_id,
            created_by_user_id,
            post_id,
            comment,
            comment_replied_to_id,
            created_at,
        });
        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({
                message: 'Something went wrong, Comment not created',
            });
        }
        else {
            if (comment.includes('@')) {
                const username_tagged = comment.split('@')[1].split(' ')[0]; // Extract username after @
                console.log("username_tagged is ", username_tagged);
                const userExists = (yield dbhelpers_1.default.query(`SELECT * FROM user WHERE username = '${username_tagged}'`)).recordset;
                if (!(0, lodash_1.isEmpty)(userExists)) {
                    const user_id = userExists[0].user_id;
                    const post_user_tag_id = (0, uuid_1.v4)();
                    let result = yield dbhelpers_1.default.execute('addToPostTaggedTable', {
                        post_user_tag_id,
                        post_id,
                        user_id,
                        created_at,
                    });
                    if (result.rowsAffected[0] === 0) {
                        return res.status(404).json({
                            message: 'Something went wrong, user not added to tags',
                        });
                    }
                }
            }
            return res.status(200).json({
                message: 'Comment created successfully',
            });
        }
    }
    catch (error) {
        console.log(error);
        return res.json({
            error: error,
        });
    }
});
exports.createComment = createComment;
