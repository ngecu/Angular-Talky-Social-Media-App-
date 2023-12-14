import { Router } from "express";
import { createComment, createPost, deleteComment, deletePost, editComment, editPost, followingPosts, getPostLikes, toggleLikePost } from "../controller/postController";


const post_router = Router()

post_router.post('/', createPost)
post_router.put('/:post_id', editPost);
post_router.delete('/:post_id', deletePost);

post_router.get('/followingPosts/:following_user_id', followingPosts)
post_router.post('/comment', createComment)
post_router.post('/toggleLikePost', toggleLikePost)
post_router.get('/like/:post_id', getPostLikes)


post_router.put('/comment/:comment_id', editComment);
post_router.delete('/comment/:comment_id', deleteComment);



export default post_router;