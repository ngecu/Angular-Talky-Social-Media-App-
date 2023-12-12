import { Router } from "express";
import { createComment, createPost, followingPosts } from "../controller/postController";


const post_router = Router()

post_router.post('/', createPost)
post_router.get('/:following_user_id', followingPosts)
post_router.post('/comment', createComment)





export default post_router;