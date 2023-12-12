import { Request } from "express";

export interface User {
    user_id: string;
    profileImage: string;
    fullName: string;
    email: string;
    password: string; // Assuming hashedPwd is a string
    username: string;
    phone_no: string;
    created_at: string;
  }
  

export interface LoginUser extends Request {
    email: string,
    password: string
}