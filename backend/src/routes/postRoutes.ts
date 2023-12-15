import { Router } from "express";
import { createComment, createPost, deleteComment, deletePost, editComment, editPost, followingPosts, getPostLikes, toggleLikePost } from "../controller/postController";
import { verifyToken } from "../middlewares/verifyToken";


const post_router = Router()

post_router.post('/', createPost)
post_router.put('/:post_id',verifyToken, editPost);
post_router.delete('/:post_id',verifyToken, deletePost);

post_router.get('/followingPosts/:following_user_id',verifyToken, followingPosts)
post_router.post('/comment',verifyToken, createComment)
post_router.post('/toggleLikePost',verifyToken, toggleLikePost)
post_router.get('/like/:post_id',verifyToken, getPostLikes)


post_router.put('/comment/:comment_id',verifyToken, editComment);
post_router.delete('/comment/:comment_id',verifyToken, deleteComment);



export default post_router;