import Router from "express";
import {
  checkUserDetails,
  initiatePasswordReset,
  getAllUsers,
  getOneUser,
  loginUser,
  registerUser,
  resetPassword,
  updateUserDetails,
  getFollowers,
  getFollowings,
  toggleFollowUser,
  deleteUser,
  getOneUserById,
} from "../controllers/userController";
import { verifyToken } from "../middlewares/verfiyToken";
// import { verifyToken } from "../middlewares/verifytoken";

const user_router = Router();

user_router.get("/getallusers", verifyToken, getAllUsers);
user_router.post("/register", registerUser);
user_router.post("/login", loginUser);
user_router.get("/checkuserdetails", verifyToken, checkUserDetails);
user_router.post("/getoneuser", getOneUser);
user_router.get("/byId/:userID",  getOneUserById);
user_router.put("/updateuser", verifyToken, updateUserDetails);
user_router.delete("/deleteuser/:id", verifyToken, deleteUser);
user_router.post("/resetpassword", resetPassword);
user_router.post("/forgot", initiatePasswordReset);

user_router.get("/getFollowers/:ID", verifyToken, getFollowers);
user_router.get("/getFollowings/:ID",verifyToken, getFollowings);
user_router.post("/toggleFollowUser", toggleFollowUser);

export default user_router;
