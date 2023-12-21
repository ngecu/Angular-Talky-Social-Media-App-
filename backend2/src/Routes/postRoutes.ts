import Router from "express";

import { verifyToken } from "../middlewares/verfiyToken";
import { createComment, replyComment, createPost, deleteComment, deletePost, getAllComments, getAllPosts, getPostByUserID, getPostComments, getPostLikes, getPostLikes2, getSinglePost, toggleLikePost, toggleLikePost2, updateComment, updatePost } from "../controllers/postController";


const post_router = Router();

post_router.post("/create", createPost);
post_router.get("/single/:ID",verifyToken, getSinglePost);
post_router.get("/all",verifyToken, getAllPosts)
post_router.put("/update",verifyToken, updatePost);
post_router.delete("/delete/:ID", deletePost);
post_router.post("/createcomment", createComment)
post_router.post("/replycomment", replyComment);
post_router.get("/allcomments", verifyToken, getAllComments)
post_router.put("/updatecomment", verifyToken, updateComment)
post_router.delete("/deletecomment/:ID", verifyToken, deleteComment)
post_router.get("/getcomments/:ID", verifyToken, getPostComments)
post_router.post('/likepost', verifyToken, toggleLikePost2)
post_router.get("/getlikes/:postID", verifyToken, getPostLikes2)
post_router.get("/byUserID/:ID", verifyToken, getPostByUserID)

export default post_router;
