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
exports.setNewPassword = exports.verifyResetPassword = exports.sendRestPassword = exports.getFollowings = exports.getFollowers = exports.toggleFollowUser = exports.getAllUsers = exports.checkUserDetails = exports.loginUser = exports.registerUser = void 0;
const validators_1 = require("../validators/validators");
const mssql_1 = __importDefault(require("mssql"));
const uuid_1 = require("uuid");
const bcrypt_1 = __importDefault(require("bcrypt"));
const sqlConfig_1 = require("../config/sqlConfig");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const lodash_1 = require("lodash");
const dbhelpers_1 = __importDefault(require("../dbhelpers/dbhelpers"));
const crypto_1 = __importDefault(require("crypto"));
const fs_1 = __importDefault(require("fs"));
const handlebars_1 = __importDefault(require("handlebars"));
const useragent_1 = __importDefault(require("useragent"));
const sendEmail_js_1 = __importDefault(require("../utils/sendEmail.js"));
const templateFilePath = "backend/controllers/email-template.hbs";
const readHTMLFile = (path) => {
    return new Promise((resolve, reject) => {
        fs_1.default.readFile(path, { encoding: 'utf-8' }, (error, htmlContent) => {
            if (error) {
                reject(error);
            }
            else {
                resolve(htmlContent);
            }
        });
    });
};
// Function to compile and render the email template
const renderEmailTemplate = (template, data) => {
    const compiledTemplate = handlebars_1.default.compile(template);
    return compiledTemplate(data);
};
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
            error
        });
    }
});
exports.registerUser = registerUser;
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e;
    console.log(req.body);
    try {
        const { Email, Password } = req.body;
        const { error } = validators_1.loginUserSchema.validate(req.body);
        if (error) {
            return res.status(422).json({ error: error.message });
        }
        const pool = yield mssql_1.default.connect(sqlConfig_1.sqlConfig);
        let user = yield (yield pool.request().input("email", Email).input("password", Password).execute('loginUser')).recordset;
        console.log(user);
        if (((_a = user[0]) === null || _a === void 0 ? void 0 : _a.email) == Email || ((_b = user[0]) === null || _b === void 0 ? void 0 : _b.fullName) == Email || ((_c = user[0]) === null || _c === void 0 ? void 0 : _c.username) == Email || ((_d = user[0]) === null || _d === void 0 ? void 0 : _d.phone_no) == Email) {
            const CorrectPwd = yield bcrypt_1.default.compare(Password, (_e = user[0]) === null || _e === void 0 ? void 0 : _e.password);
            if (!CorrectPwd) {
                return res.status(401).json({
                    error: "Incorrect password"
                });
            }
            const LoginCredentials = user.map(records => {
                const { password, welcomed } = records, rest = __rest(records, ["password", "welcomed"]);
                return rest;
            });
            const token = jsonwebtoken_1.default.sign(LoginCredentials[0], process.env.SECRET, {
                expiresIn: '24h'
            });
            console.log("Logged in successfully");
            return res.status(200).json({
                message: "Logged in successfully", token
            });
        }
        else {
            return res.status(404).json({
                error: "User not found"
            });
        }
    }
    catch (error) {
        console.log(error);
        return res.status(404).json({
            error
        });
    }
});
exports.loginUser = loginUser;
const checkUserDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.info) {
        console.log(req.info);
        return res.json({
            info: req.info
        });
    }
});
exports.checkUserDetails = checkUserDetails;
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
const sendRestPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { Email } = req.body;
    const pool = yield mssql_1.default.connect(sqlConfig_1.sqlConfig);
    const user = (yield dbhelpers_1.default.query(`SELECT * FROM users WHERE fullName= ${Email} OR email=${Email} OR username =${Email} OR phone_no = ${Email}`)).recordset;
    console.log(user);
    if (user) {
        const token = (yield dbhelpers_1.default.query(`SELECT * FROM token WHERE user_id = ${user[0].user_id}`)).recordset;
        if (!token) {
            const newToken = crypto_1.default.randomBytes(32).toString('hex');
            let token_id = (0, uuid_1.v4)();
            let user_id = user[0].user_id;
            let created_at = new Date().toISOString();
            let result = yield dbhelpers_1.default.execute('registerToken', {
                token_id, user_id, created_at
            });
            if (result.rowsAffected[0] === 0) {
                return res.status(404).json({
                    message: "Something went wrong, user not followed"
                });
            }
            else {
                console.log("token added");
            }
        }
        // const token =  crypto.randomBytes(32).toString("hex")
        const url = `${process.env.BASE_URL}new-password/${user[0].user_id}/${token[0].token}`;
        // Example user agent string
        const userAgentString = req.headers['user-agent'];
        // Parse the user agent string
        const agent = useragent_1.default.parse(userAgentString);
        // Retrieve the browser name
        const browserName = agent.family;
        // Retrieve the operating system
        const operatingSystem = agent.os.toString();
        console.log(userAgentString);
        console.log(operatingSystem);
        readHTMLFile(templateFilePath)
            .then((templateContent) => {
            // Define the data for the template variables
            const templateData = {
                name: user[0].name,
                email: user[0].email,
                browserName,
                operatingSystem,
                action_url: url
            };
            // Render the email template with the data
            const renderedTemplate = renderEmailTemplate(templateContent, templateData);
            // Send the email
            (0, sendEmail_js_1.default)(user[0].email, "Reset Email", renderedTemplate)
                .then(() => {
                console.log('Email sent successfully');
                res.status(200).send({ message: "Password reset link sent to your email account" });
            })
                .catch((error) => {
                console.log('Failed to send email:', error);
            });
        })
            .catch((error) => {
            console.log('Failed to read template file:', error);
        });
    }
    else {
        res.status(401);
        throw new Error('User Does Not Exist');
    }
});
exports.sendRestPassword = sendRestPassword;
const verifyResetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { Email } = req.body;
        const user = (yield dbhelpers_1.default.query(`SELECT * FROM users WHERE fullName= ${Email} OR email=${Email} OR username =${Email} OR phone_no = ${Email}`)).recordset;
        if (!user)
            return res.status(400).send({ message: "Invalid link" });
        const token = (yield dbhelpers_1.default.query(`SELECT * FROM token WHERE user_id = ${user[0].user_id}`)).recordset;
        if (!token)
            return res.status(400).send({ message: "Invalid link" });
        console.log(user[0].user_id.toString());
        const resetPasswordLink = `http://localhost:4200/new-password/${user[0].user_id.toString()}/${token[0].token}`;
        res.redirect(resetPasswordLink);
        res.status(200).send(`http://localhost:4200/new-password/${user._id.toString()}/${token[0].token}`);
    }
    catch (error) {
        console.log(error);
        res.status(500).send({ message: "Internal Server Error ", error });
    }
});
exports.verifyResetPassword = verifyResetPassword;
const setNewPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield User.findOne({ _id: req.params.id });
        if (!user)
            return res.status(400).send({ message: "Invalid link" });
        const token = yield Token.findOne({
            userId: user._id,
            token: req.params.token,
        });
        if (!token)
            return res.status(400).send({ message: "Invalid link" });
        // if (!user.verified) return res.status(400).send({ message: "Invalid link" });
        // $2a$10$NkwMc8U5nV214hHBIQVNau6POGP2R4mv49Lb9cirTLY/Cb96I9sGi
        if (req.body.password) {
            user.password = req.body.password;
        }
        // const updatedUser = await user.save()
        // const salt = await bcrypt.genSalt(Number(process.env.SALT));
        // const hashPassword = await bcrypt.hash(req.body.password, salt);
        // user.password = hashPassword;
        yield user.save();
        yield token.remove();
        res.status(200).send({ message: "Password reset successfully" });
    }
    catch (error) {
        res.status(500).send({ message: "Internal Server Error" });
    }
});
exports.setNewPassword = setNewPassword;
