import mssql from "mssql";
import bcrypt from "bcrypt";
import { Request } from "express";
import { createPost, createComment, editComment, deleteComment } from "./postController";


describe("Post Tests", () => {
    let res: any;
  
    beforeEach(() => {
      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      };
    });
  
  
    it("Create Post successfully", async () => {
      const req = {
        body: {
            postImage:["https://avatars.githubusercontent.com/u/65470823?v=4","https://res.cloudinary.com/dqquyjsap/image/upload/v1702895857/ikwqmug3eaq7k1zsznwd.webp"], 
            created_by_user_id:"0c7212ca-b57d-4913-b021-de4dc7f467a8", 
            caption:"I am good", 
            postType:"post"    },
      };
  
      const mockedInput = jest.fn().mockReturnThis();
  
      const mockedExecute = jest.fn().mockResolvedValue({ rowsAffected: [1] });
  
      const mockedRequest = {
        input: mockedInput,
        execute: mockedExecute,
      };
  
      const mockedPool = {
        request: jest.fn().mockReturnValue(mockedRequest),
      };
  
      jest.spyOn(mssql, "connect").mockResolvedValue(mockedPool as never);
  
      await createPost(req as Request, res as never);
  
          expect(res.json).toHaveBeenCalledWith({
            message: "Post created successfully",
          });
          expect(res.status).toHaveBeenCalledWith(200)
    });

  

    // it("Update Post successfully", async () => {
    //     const req = {
    //       body: {
    //           postImage:["https://avatars.githubusercontent.com/u/65470823?v=4","https://res.cloudinary.com/dqquyjsap/image/upload/v1702895857/ikwqmug3eaq7k1zsznwd.webp"], 
    //           created_by_user_id:"0c7212ca-b57d-4913-b021-de4dc7f467a8", 
    //           caption:"I am good", 
    //           },
    //     };
    
    //     const mockedInput = jest.fn().mockReturnThis();
    
    //     const mockedExecute = jest.fn().mockResolvedValue({ rowsAffected: [1] });
    
    //     const mockedRequest = {
    //       input: mockedInput,
    //       execute: mockedExecute,
    //     };
    
    //     const mockedPool = {
    //       request: jest.fn().mockReturnValue(mockedRequest),
    //     };
    
    //     jest.spyOn(mssql, "connect").mockResolvedValue(mockedPool as never);
    
    //     await deletePost(req as Request, res as never);
    
    //         expect(res.json).toHaveBeenCalledWith({
    //           message: "Post updated successfully",
    //         });

    //         expect(res.status).toHaveBeenCalledWith(200)
    //   });
    

  });

  describe("Comments test", () => {
    it("should create a comment", async () => {
      const req: any = {
        body: {
            created_by_user_id:"0c7212ca-b57d-4913-b021-de4dc7f467a8",
            post_id:"", 
            comment:"This is my comment body", 
            comment_replied_to_id:""
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
            created_by_user_id:"0c7212ca-b57d-4913-b021-de4dc7f467a8",
            post_id:"", 
            comment:"This is my comment body", 
            comment_replied_to_id:""
        },
        params:{
            comment_id:"224e84fb-b45b-48c4-9648-5752d59643aa"
        }
      } as any;
  
      const res: any = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      } as any;
  
      await editComment(req, res);
  
      //  expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith({
        message: "Comment updated successfully",
      });
    });
  
    it("should delete a comment", async () => {
      const req: any = {
        params: {
            comment_id: "224e84fb-b45b-48c4-9648-5752d59643aa",
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
  
    

})