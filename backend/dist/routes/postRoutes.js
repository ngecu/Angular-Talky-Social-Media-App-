"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const postController_1 = require("../controller/postController");
const post_router = (0, express_1.Router)();
post_router.post('/', postController_1.createPost);
exports.default = post_router;
