import { Router } from "express";
import { checkUserDetails, getAllUsers, getFollowers, getFollowings, loginUser, registerUser, sendRestPassword, setNewPassword, toggleFollowUser, toggleSoftDeleteUser, updateProfile } from "../controller/userController";
import { verifyToken } from "../middlewares/verifyToken";


const user_router = Router()

user_router.post('/register', registerUser)
user_router.post('/login', loginUser)

user_router.put('/toggleSoftDeleteUser/:user_id',verifyToken,toggleSoftDeleteUser)
user_router.put('/:user_id/profile',verifyToken, updateProfile);

user_router.get('/check_user_details',verifyToken, checkUserDetails)

user_router.post('/toggleFollowUser',verifyToken, toggleFollowUser)
user_router.get('/getFollowers/:followed_user_id',verifyToken, getFollowers)
user_router.get('/getFollowings/:following_user_id',verifyToken, getFollowings)
user_router.post('/reset-password',verifyToken, sendRestPassword)
user_router.post('/setNewPassword/:user_id',verifyToken, setNewPassword)


setNewPassword
user_router.get('/', getAllUsers)





export default user_router;