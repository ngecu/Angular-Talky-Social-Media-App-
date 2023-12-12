import { Router } from "express";
import { createPost } from "../controller/postController";


const post_router = Router()

post_router.post('/', createPost)



export default post_router;