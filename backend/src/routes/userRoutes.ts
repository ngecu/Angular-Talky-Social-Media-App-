import { Router } from "express";
import { getAllUsers, getFollowers, getFollowings, loginUser, registerUser, toggleFollowUser } from "../controller/userController";


const user_router = Router()

user_router.post('/register', registerUser)
user_router.post('/login', loginUser)
user_router.post('/toggleFollowUser', toggleFollowUser)
user_router.post('/getFollowers', getFollowers)
user_router.post('/getFollowings', getFollowings)

user_router.get('/', getAllUsers)





export default user_router;