import { Request } from "express";

export interface User {
    fullname: string;
    username: string;
  email: string;
  userID: string;
  role: string;
}

export interface LoginUser extends Request {
  email: string;
  pass: string;
}
export interface updateUser {
  userID: string;
  fullname: string;
  profileUrl: string;
  profileCaption: string;
}

export interface User1 {
  name: string;
  email: string;
  userID: string;
  role: string;
  phone_no: number;
}
