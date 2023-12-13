"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../controller/userController");
const verifyToken_1 = require("../middlewares/verifyToken");
const user_router = (0, express_1.Router)();
user_router.post('/register', userController_1.registerUser);
user_router.post('/login', userController_1.loginUser);
user_router.get('/check_user_details', verifyToken_1.verifyToken, userController_1.checkUserDetails);
user_router.post('/toggleFollowUser', userController_1.toggleFollowUser);
user_router.post('/getFollowers', userController_1.getFollowers);
user_router.post('/getFollowings', userController_1.getFollowings);
user_router.route('/reset-password').post(userController_1.sendRestPassword);
user_router.route('/change-password/:id/:token').post(userController_1.setNewPassword);
user_router.get('/', userController_1.getAllUsers);
exports.default = user_router;
