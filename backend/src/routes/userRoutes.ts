import { Router } from "express";
import { getPostsByUser } from "../controller/postController";
import { checkUserDetails, getAllUsers, getFollowers, getFollowings, getUserDetails, loginUser, registerUser, sendRestPassword, setNewPassword, toggleFollowUser, toggleSoftDeleteUser, updateProfile } from "../controller/userController";
import { verifyToken } from "../middlewares/verifyToken";


const user_router = Router()

user_router.post('/register', registerUser)
user_router.post('/login', loginUser)

user_router.put('/toggleSoftDeleteUser/:user_id',verifyToken,toggleSoftDeleteUser)
user_router.put('/:user_id/profile',verifyToken, updateProfile);

user_router.get('/user_id', loginUser)
user_router.get('/check_user_details',verifyToken, checkUserDetails)

user_router.post('/toggleFollowUser',verifyToken, toggleFollowUser)
user_router.get('/getFollowers/:followed_user_id',verifyToken, getFollowers)
user_router.get('/getFollowings/:following_user_id',verifyToken, getFollowings)
user_router.post('/reset-password',verifyToken, sendRestPassword)
user_router.post('/setNewPassword/:user_id',verifyToken, setNewPassword)


user_router.get('/', getAllUsers)
user_router.get('/:user_id', getUserDetails)




export default user_router;