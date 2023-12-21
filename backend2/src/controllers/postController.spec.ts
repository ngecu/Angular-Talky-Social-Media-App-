import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { v4 } from "uuid";
import { execute, query } from "../helpers/dbHelper";

import {
  createComment,
  createPost,
  deleteComment,
  deletePost,
  replyComment,
  updateComment,
  updatePost,
} from "./postController";

jest.mock("../helpers/dbHelper", () => ({
  execute: jest.fn(),
  query: jest.fn(),
}));

describe("should create a comment", () => {
  it("should create a comment", async () => {
    const req: any = {
      body: {
        comment: "hello World",
        userID: "User123",
        postID: "Post123",
      },
    } as any;

    const res: any = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    } as any;

    await createComment(req, res);

    //  expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith({
      message: "comment created successfully",
    });
  });

  it("should edit a comment", async () => {
    const req: any = {
      body: {
        commentID: "comment123",
        comment: "hello World. 10 days from 2024",
        userID: "User123",
        postID: "Post123",
      },
    } as any;

    const res: any = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    } as any;

    await updateComment(req, res);

    //  expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith({
      message: "Comment updated successfully",
    });
  });

  it("should delete a comment", async () => {
    const req: any = {
      params: {
        ID: "comment123",
      },
    } as any;

    const res: any = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    } as any;

    await deleteComment(req, res);

    //  expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith({
      message: "comment deleted Successfully",
    });
  });

  it("should reply a comment", async () => {
    const req: any = {
      body: {
        comment: "hello World",
        userID: "User123",
        postID: "Post123",
        parentCommentID: "Comment123",
      },
    } as any;

    const res: any = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    } as any;

    await replyComment(req, res);

    //  expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith({
      message: "comment created successfully",
    });
  });

  it("should delete a post", async () => {
    const req: any = {
      params: {
        ID: "comment123",
      },
    } as any;

    const res: any = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    } as any;

    await deletePost(req, res);

    //  expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith({
      message: "product deleted Successfully",
    });
  });

  it("should edit a post", async () => {
    const req: any = {
      body: {
        imageUrl: "https://image.12345",
        userID: "User123",
        postID: "Post123",
        postContent: "This is my post",
      },
    } as any;

    const res: any = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    } as any;

    await updatePost(req, res);

    //  expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith({
      message: "Product updated successfully",
    });
  });

  it("should create a post", async () => {
    const req: any = {
      body: {
        imageUrl: "https://imageUrl.1234",
        postContent: "Qwerty1234567890",
        userID: "User123",
      },
    } as any;

    const res: any = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    } as any;

    await createPost(req, res);

    //  expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith({
      message: "post created successfully",
    });
  });
});
