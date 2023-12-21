import { Request, Response } from "express";
import mssql from "mssql";

import { v4 } from "uuid";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sqlConfig } from "../config/sqlConfig";
import {
  validatePost,
  validatePostId,
  validateUpdatePost,
  validateUserPostID,
} from "../Validators/post";
import { Post, Comment, replyCommentBody } from "../interface/post";
import { execute, query } from "../helpers/dbHelper";
import {
  validateComment,
  validateCommentId,
  validateReplyComment,
  validateUpdateComment,
} from "../Validators/comment";
import { isEmpty } from "lodash";

//CREATE POSTS
export const createPost = async (req: Request, res: Response) => {
  try {
    const { imageUrl, postContent, userID } = req.body;

    // console.log(req.body);

    const { error } = validatePost.validate(req.body);

    // console.log(error);

    if (error)
      return res.status(400).send({ error: "please place correct details" });

    const newPost: Post = {
      postID: v4(),
      postContent,
      imageUrl,
      userID,
    };

    const procedure = "createPost";
    const params = newPost;

    await execute(procedure, params);
    return res.send({ message: "post created successfully" });
  } catch (error) {
    console.log(error);
    res.send((error as Error).message);
  }
};

//GET ALL POSTS
export const getAllPosts = async (req: Request, res: Response) => {
  try {
    const procedureName = "getPosts";
    const result = await query(`EXEC ${procedureName}`);
    // console.log(result.recordset);

    return res.json(result.recordset);
  } catch (error) {
    console.log(error);
    res.status(404).send({ message: "internal server error" });
  }
};

//UPDATE POSTS
export const updatePost = async (req: Request, res: Response) => {
  try {
    const { postID, userID, postContent, imageUrl } = req.body;
    console.log(req.body);

    const { error } = validateUpdatePost.validate(req.body);

    console.log(error);

    if (error)
      return res.status(400).send({ error: "please put correct details" });

    const newProject: Post = {
      postID,
      userID,
      postContent,
      imageUrl,
    };

    const ProcedureName = "updatePost";
    const params = newProject;

    await execute(ProcedureName, params);

    return res.status(200).send({ message: "Product updated successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      error: (error as Error).message,
      message: "Internal Server Error",
    });
  }
};

//DELETE POST
export const deletePost = async (req: Request, res: Response) => {
  try {
    const postID = req.params.ID;
    if (!postID) return res.status(400).send({ error: "Id is required" });

    const { error } = validatePostId.validate({ postID });

    if (error) return res.status(400).send({ error: "please input id" });

    const procedureName = "deletePost";
    await execute(procedureName, { postID });

    res.status(201).send({ message: "product deleted Successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      error: (error as Error).message,
      message: "Internal Sever Error",
    });
  }
};

// GET SINGLE POST
export const getSinglePost = async (req: Request, res: Response) => {
  try {
    const postID = req.params.ID;
    console.log(postID);

    if (!postID) return res.status(400).send({ error: "Id is required" });

    const { error } = validatePostId.validate({ postID });
    console.log(error);

    if (error) return res.status(400).send({ error: error.details[0].message });
    // console.log("hello");

    const procedureName = "getPostById";
    const result = await execute(procedureName, { postID });

    res.json(result.recordset);
  } catch (error) {
    console.log(error);
    res.status(404).send({ message: "internal server error" });
  }
};

//GET ALL POSTS BY USERID
export const getPostByUserID = async (req: Request, res: Response) => {
  try {
    const userID = req.params.ID;
    console.log(userID);

    if (!userID) return res.status(400).send({ error: "Id is required" });

    const { error } = validateUserPostID.validate({ userID });
    console.log(error);

    if (error) return res.status(400).send({ error: error.details[0].message });
    // console.log("hello");

    const procedureName = "getPostsByUserID";
    const result = await execute(procedureName, { userID });

    res.json(result.recordset);
  } catch (error) {
    console.log(error);
    res.status(404).send({ message: "internal server error" });
  }
};

//CREATE COMMENT
export const createComment = async (req: Request, res: Response) => {
  try {
    const { comment, userID, postID } = req.body;

    const { error } = validateComment.validate(req.body);

    if (error)
      return res.status(400).send({ error: "please place correct details" });

    const newPost: Comment = {
      commentID: v4(),
      comment,
      postID,
      userID,
    };

    const procedure = "createComment";
    const params = newPost;

    await execute(procedure, params);
    return res.send({ message: "comment created successfully" });
  } catch (error) {
    console.log(error);
    res.send((error as Error).message);
  }
};

//UPDATE COMMENT
export const updateComment = async (req: Request, res: Response) => {
  try {
    const { postID, userID, comment, commentID } = req.body;
    console.log(req.body);

    const { error } = validateUpdateComment.validate(req.body);

    console.log(error);

    if (error)
      return res.status(400).send({ error: "please put correct details" });

    const newProject: Comment = {
      postID,
      userID,
      comment,
      commentID,
    };

    const ProcedureName = "updateComment";
    const params = newProject;

    await execute(ProcedureName, params);

    return res.status(200).send({ message: "Comment updated successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      error: (error as Error).message,
      message: "Internal Server Error",
    });
  }
};

//DELETE COMMENT
export const deleteComment = async (req: Request, res: Response) => {
  try {
    const commentID = req.params.ID;
    console.log(commentID);
    
    if (!commentID) return res.status(400).send({ error: "Id is required" });

    const { error } = validateCommentId.validate({ commentID });

    if (error) return res.status(400).send({ error: "please input id" });

    const procedureName = "deleteComment";
    await execute(procedureName, { commentID });

    res.status(201).send({ message: "comment deleted Successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      error: (error as Error).message,
      message: "Internal Sever Error",
    });
  }
};

//GET ALL COMMENTS
export const getAllComments = async (req: Request, res: Response) => {
  try {
    const procedureName = "getComments";
    const result = await query(`EXEC ${procedureName}`);
    // console.log(result.recordset);

    return res.json(result.recordset);
  } catch (error) {
    console.log(error);
    res.status(404).send({ message: "internal server error" });
  }
};

//GET ALL COMMENTS USING POSTID
export const getPostComments = async (req: Request, res: Response) => {
  try {
    const postID = req.params.ID;
    console.log(postID);

    if (!postID) return res.status(400).send({ error: "Id is required" });

    const { error } = validatePostId.validate({ postID });
    console.log(error);

    if (error) return res.status(400).send({ error: error.details[0].message });
    // console.log("hello");

    const procedureName = "getAllComments";
    const result = await execute(procedureName, { postID });

    res.json(result.recordset);
  } catch (error) {
    console.log(error);
    res.status(404).send({ message: "internal server error" });
  }
};

//REPLY ON A COMMENT
export const replyComment = async (req: Request, res: Response) => {
  try {
    const { parentCommentID, comment, userID, postID } = req.body;

    const { error } = validateReplyComment.validate(req.body);

    if (error)
      return res.status(400).send({ error: "please place correct details" });

    const newReplyComment: replyCommentBody = {
      commentID: v4(),
      parentCommentID,
      comment,
      postID,
      userID,
    };

    const procedure = "createReplyComment";
    const params = newReplyComment;

    await execute(procedure, params);
    return res.send({ message: "comment created successfully" });
  } catch (error) {
    console.log(error);
    res.send((error as Error).message);
  }
};

//TOGGLE BETWEEN LIKE AND UNLIKE
export const toggleLikePost = async (req: Request, res: Response) => {
  console.log(req.body);

  try {
    let likeID = v4();

    let { userID, postID } = req.body;
    const likeexists = (
      await query(
        `SELECT * FROM likes WHERE userID = '${userID}' AND postID= '${postID}'`
      )
    ).recordset;

    if (!isEmpty(likeexists)) {
      let result = await execute("unLikePost", {
        userID,
        postID,
      });

      if (result.rowsAffected[0] === 0) {
        return res.status(404).json({
          message: "Something went wrong, Pots not unliked",
        });
      } else {
        return res.status(200).json({
          message: "Post Unliked",
        });
      }
    } else {
      let result = await execute("likePost", {
        likeID,
        userID,
        postID,
      });

      if (result.rowsAffected[0] === 0) {
        return res.status(404).json({
          message: "Something went wrong, Post not lked",
        });
      } else {
        return res.status(200).json({
          message: "Post Liked",
        });
      }
    }
  } catch (error) {
    console.log(error);

    return res.json({
      error,
    });
  }
};

export const getPostLikes = async (req: Request, res: Response) => {
  try {
    const { postID } = req.params;

    const likes = await query(`
      SELECT *
      FROM likes
      WHERE postID = '${postID}'
    `);

    console.log(likes);

    // Check if there are any likes for the post
    if (likes.recordset.length === 0) {
      return res.status(404).json({
        message: "No likes found for the specified post",
      });
    }

    // Return the likes information
    return res.status(200).json({
      likes: likes.recordset,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Internal Server Error",
    });
  }
};

// TOGGLE BETWEEN LIKE AND UNLIKE
export const toggleLikePost2 = async (req: Request, res: Response) => {
  console.log(req.body);

  try {
    let likeID = v4();

    let { userID, postID } = req.body;
    const likeExists = (
      await query(
        `SELECT * FROM likes WHERE userID = '${userID}' AND postID = '${postID}'`
      )
    ).recordset;

    if (!isEmpty(likeExists)) {
      let result = await execute("unLikePost2", {
        userID,
        postID,
      });
      console.log("the result is:",result);
      

      if (result.rowsAffected[0] === 0) {
        return res.status(404).json({
          message: "Something went wrong, Post not unliked",
        });
      } else {
        // Get updated like count
        const updatedLikes = await query(`
                    SELECT likeCount FROM likes
                    WHERE userID = '${userID}' AND postID = '${postID}'
                `);

        console.log("userID:", userID);
        console.log("postID:", postID);
        console.log("updatedLikes:", updatedLikes);

        if (updatedLikes.recordset.length > 0) {
          const likeCount = updatedLikes.recordset[0].likeCount;
          console.log("meeee",likeCount);
          

          return res.status(200).json({
            message: "Post Unliked",
            likeCount,
          });
        } else {
          // Handle the case where no rows were returned (likeCount is undefined)
          return res.status(404).json({
            message: "Post Unliked, but likeCount not available",
          });
        }
      }
    } else {
      let result = await execute("likePost2", {
        likeID,
        userID,
        postID,
      });

      if (result.rowsAffected[0] === 0) {
        return res.status(404).json({
          message: "Something went wrong, Post not liked",
        });
      } else {
        // Get updated like count
        const updatedLikes = await query(`
                    SELECT likeCount FROM likes
                    WHERE userID = '${userID}' AND postID = '${postID}'
                `);

        console.log("userID:", userID);
        console.log("postID:", postID);
        console.log("updatedLikes:", updatedLikes);

        if (updatedLikes.recordset.length > 0) {
          const likeCount = updatedLikes.recordset[0].likeCount;

          return res.status(200).json({
            message: "Post Liked",
            likeCount,
          });
        } else {
          // Handle the case where no rows were returned (likeCount is undefined)
          return res.status(404).json({
            message: "Post Liked, but likeCount not available",
          });
        }
      }
    }
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error",
      error,
    });
  }
};

export const getPostLikes2 = async (req: Request, res: Response) => {
  try {
    const { postID } = req.params;

    const likesCountResult = await query(`
      SELECT COUNT(*) AS likeCount
      FROM likes
      WHERE postID = '${postID}'
    `);

    const likeCount = likesCountResult.recordset[0].likeCount;

    // Return the likes count
    return res.status(200).json({
      likeCount: likeCount,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Internal Server Error",
    });
  }
};

