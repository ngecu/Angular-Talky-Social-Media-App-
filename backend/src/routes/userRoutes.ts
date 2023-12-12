import { Router } from "express";
import { loginUser, registerUser, toggleFollowUser } from "../controller/userController";


const user_router = Router()

user_router.post('/register', registerUser)
user_router.post('/login', loginUser)
user_router.post('/toggleFollowUser', toggleFollowUser)




export default user_router;