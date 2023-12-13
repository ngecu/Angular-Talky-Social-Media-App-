import { Router } from "express";
import { createComment, createPost, deleteComment, editComment, followingPosts, getPostLikes, toggleLikePost } from "../controller/postController";


const post_router = Router()

post_router.post('/', createPost)
post_router.get('/:following_user_id', followingPosts)
post_router.post('/comment', createComment)
post_router.post('/toggleLikePost', toggleLikePost)
post_router.get('/getPostLikes', getPostLikes)
post_router.put('/comment/:comment_id', editComment);
post_router.delete('/comment/:comment_id', deleteComment);



export default post_router;