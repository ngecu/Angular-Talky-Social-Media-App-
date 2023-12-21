import dotenv from "dotenv";
import { NextFunction, Request, Response } from "express";
dotenv.config({ path: "./.env" });
import jwt from "jsonwebtoken";
import { User, User1 } from "../interface/user";

export interface ExtendedUser extends Request {
  info?: User;
}
// export interface ExtendedUser1 extends Request {
//   info?: User1;
// }

export const verifyToken = (
  req: ExtendedUser,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers["token"] as string;
    if (!token) {
      return res.status(404).json({
        message: "You do not have access",
      });
    }
    const data = jwt.verify(token, process.env.SECRET as string) as User;
    req.info = data;
  } catch (error) {
    return res.json({
      message: error,
    });
  }

  next();
};
