"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFollowings = exports.getFollowers = exports.toggleFollowUser = exports.getAllUsers = exports.loginUser = exports.registerUser = void 0;
const validators_1 = require("../validators/validators");
const mssql_1 = __importDefault(require("mssql"));
const uuid_1 = require("uuid");
const bcrypt_1 = __importDefault(require("bcrypt"));
const sqlConfig_1 = require("../config/sqlConfig");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const lodash_1 = require("lodash");
const dbhelpers_1 = __importDefault(require("../dbhelpers/dbhelpers"));
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(req.body);
        let { profileImage, fullName, email, password, username, phone_no, created_at } = req.body;
        let { error } = validators_1.registerUserSchema.validate(req.body);
        if (error) {
            return res.status(404).json({ error: error.details });
        }
        let user_id = (0, uuid_1.v4)();
        const hashedPwd = yield bcrypt_1.default.hash(password, 5);
        let result = yield dbhelpers_1.default.execute('registerUser', {
            user_id, profileImage, fullName, email, password: hashedPwd, username, phone_no, created_at
        });
        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({
                message: "Something went wrong, user not registered"
            });
        }
        else {
            console.log("Uder Registered successfully");
            return res.status(200).json({
                message: 'User registered successfully'
            });
        }
    }
    catch (error) {
        console.log(error);
        return res.status(404).json({
            error: error
        });
    }
});
exports.registerUser = registerUser;
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    console.log(req.body);
    try {
        const { email, password } = req.body;
        const { error } = validators_1.loginUserSchema.validate(req.body);
        if (error) {
            return res.status(422).json({ error: error.message });
        }
        const pool = yield mssql_1.default.connect(sqlConfig_1.sqlConfig);
        let user = yield (yield pool.request().input("email", email).input("password", password).execute('loginUser')).recordset;
        if (((_a = user[0]) === null || _a === void 0 ? void 0 : _a.email) == email) {
            const CorrectPwd = yield bcrypt_1.default.compare(password, (_b = user[0]) === null || _b === void 0 ? void 0 : _b.password);
            if (!CorrectPwd) {
                return res.status(401).json({
                    error: "Incorrect password"
                });
            }
            const LoginCredentials = user.map(records => {
                const { phone_no, password, welcomed } = records, rest = __rest(records, ["phone_no", "password", "welcomed"]);
                return rest;
            });
            const token = jsonwebtoken_1.default.sign(LoginCredentials[0], process.env.SECRET, {
                expiresIn: '24h'
            });
            return res.status(200).json({
                message: "Logged in successfully", token
            });
        }
        else {
            return res.json({
                error: "User not found"
            });
        }
    }
    catch (error) {
        return res.json({
            error: "Internal server error"
        });
    }
});
exports.loginUser = loginUser;
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const pool = yield mssql_1.default.connect(sqlConfig_1.sqlConfig);
        let users = (yield pool.request().execute('fetchAllUsers')).recordset;
        return res.status(200).json({
            users: users
        });
    }
    catch (error) {
        return res.json({
            error: error
        });
    }
});
exports.getAllUsers = getAllUsers;
const toggleFollowUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.body);
    try {
        let follower_id = (0, uuid_1.v4)();
        let { following_user_id, followed_user_id } = req.body;
        let created_at = new Date().toISOString();
        const relationsexists = (yield dbhelpers_1.default.query(`SELECT * FROM follower WHERE following_user_id = '${following_user_id}' AND followed_user_id= '${followed_user_id}'`)).recordset;
        if (!(0, lodash_1.isEmpty)(relationsexists)) {
            let result = yield dbhelpers_1.default.execute('unfollowUser', {
                following_user_id, followed_user_id
            });
            if (result.rowsAffected[0] === 0) {
                return res.status(404).json({
                    message: "Something went wrong, user not followed"
                });
            }
            else {
                return res.status(200).json({
                    message: 'User Unfollowed'
                });
            }
        }
        else {
            let result = yield dbhelpers_1.default.execute('followUser', {
                follower_id, following_user_id, followed_user_id, created_at
            });
            if (result.rowsAffected[0] === 0) {
                return res.status(404).json({
                    message: "Something went wrong, user not followed"
                });
            }
            else {
                return res.status(200).json({
                    message: 'User Followed'
                });
            }
        }
    }
    catch (error) {
        console.log(error);
        return res.json({
            error
        });
    }
});
exports.toggleFollowUser = toggleFollowUser;
const getFollowers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { followed_user_id } = req.body;
        let followers = (yield dbhelpers_1.default.execute('fetchFollowers', {
            followed_user_id
        })).recordset;
        return res.status(200).json({
            followers: followers
        });
    }
    catch (error) {
        return res.json({
            error: error
        });
    }
});
exports.getFollowers = getFollowers;
const getFollowings = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { following_user_id } = req.body;
        let followers = (yield dbhelpers_1.default.execute('fetchFollowings', {
            following_user_id
        })).recordset;
        return res.status(200).json({
            followers: followers
        });
    }
    catch (error) {
        return res.json({
            error: error
        });
    }
});
exports.getFollowings = getFollowings;
