import { Router } from "express";
import { checkUserDetails, getAllUsers, getFollowers, getFollowings, loginUser, registerUser, toggleFollowUser } from "../controller/userController";
import { verifyToken } from "../middlewares/verifyToken";


const user_router = Router()

user_router.post('/register', registerUser)
user_router.post('/login', loginUser)
user_router.get('/check_user_details',verifyToken, checkUserDetails)

user_router.post('/toggleFollowUser', toggleFollowUser)
user_router.post('/getFollowers', getFollowers)
user_router.post('/getFollowings', getFollowings)

user_router.get('/', getAllUsers)





export default user_router;