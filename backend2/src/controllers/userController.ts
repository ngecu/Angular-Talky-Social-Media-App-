import { Request, Response } from "express";
import mssql from "mssql";

import { v4 } from "uuid";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sqlConfig } from "../config/sqlConfig";
import {
  userLoginValidationSchema,
  userRegisterValidationSchema,
  validateResetpassword,
  validateUserEmailForgotPassword,
} from "../Validators/user";
import { query, execute } from "../helpers/dbHelper";
import { ExtendedUser } from "../middlewares/verfiyToken";
import { updateUser } from "../interface/user";
import { hashPass } from "../Services/passwordHash";
import { isEmpty } from "lodash";
import { generateResetToken } from "../Utils/generateResetToken";
// import { execute } from "../helpers/dbHelper";
// import { ExtendedUser, ExtendedUser1 } from "../middlewares/verifytoken";

//REGISTER USER
export const registerUser = async (req: Request, res: Response) => {
  try {
    let { email, fullname, username, password } = req.body;

    console.log(req.body);

    const { error } = userRegisterValidationSchema.validate(req.body);

    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    console.log(error);

    let userID = v4();
    const hashedPwd = await bcrypt.hash(password, 8);

    const Procedure1 = "getUserByEmail";
    const Param = { email };

    const result = await execute(Procedure1, Param);

    // const user = result.recordset[0];
    const user =
      result.recordset && result.recordset.length > 0
        ? result.recordset[0]
        : undefined;

    // console.log(user);

    if (user) {
      return res.json({ error: "Email already exists. User not registered." });
    } else {
      const procedureName2 = "registerUser";
      const params = {
        userID,
        username,
        fullname,
        email,
        password: hashedPwd,
      };
      console.log("here");

      await execute(procedureName2, params);

      res.status(200).json({
        message: "user registered successfully",
      });
    }
  } catch (error) {
    console.log(error);
  }
};

//LOGIN USER
export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const { error } = userLoginValidationSchema.validate(req.body);

    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const pool = await mssql.connect(sqlConfig);

    console.log(email, password);

    let user = await (
      await pool
        .request()
        .input("email", mssql.VarChar, email)
        .input("password", mssql.VarChar, password)
        .execute("loginUser")
    ).recordset;
    console.log("user is", user);

    if (user.length === 1) {
      const correctPwd = await bcrypt.compare(password, user[0].password);

      if (!correctPwd) {
        return res.status(401).json({
          message: "Incorrect password",
        });
      }

      const loginCredentials = user.map((record) => {
        const { password, ...rest } = record;
        console.log(rest);

        return rest;
      });

      const token = jwt.sign(
        loginCredentials[0],
        process.env.SECRET as string,
        {
          expiresIn: "86400s",
        }
      );

      return res.status(200).json({
        message: "Logged in successfully",
        token,
      });
    } else {
      return res.status(401).json({
        message: "Email not found",
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

//CHECK USER DETAILS
export const checkUserDetails = async (req: ExtendedUser, res: Response) => {
  if (req.info) {
    return res.json({
      info: req.info,
    });
  }
};

//GET SINGLE USER USING EMAIL
export const getOneUser = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const pool = await mssql.connect(sqlConfig);
    const singleUser = await pool
      .request()
      .input("email", mssql.VarChar, email)
      .execute("getSingleUser");
    console.log(singleUser);

    return res.status(200).json({
      user: singleUser.recordset[0],
      message: "Single User retrieved successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: error,
    });
  }
};

//GET ONE USER USING ID
export const getOneUserById = async (req: Request, res: Response) => {
  try {
    const userID = req.params.userID;
    console.log("user id is:", userID);
    
    const pool = await mssql.connect(sqlConfig);
    const result =  (await pool
      .request()
      .input("userID", userID)
      .execute("getById")).recordset;
    
     if (result.length === 0) {
       return res.status(404).json({
         message: "User not found",
       });
     }
    const singleUser = result;
    console.log(singleUser);
    
    return res.status(200).json(
       singleUser
    );
  } catch (error) {
    return res.status(500).json({
      message: error,
    });
  }
};

//FETCH ALL USERS
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const pool = await mssql.connect(sqlConfig);

    let users = (await pool.request().execute("fetchAllUsers")).recordset;
    return res.json({
      users: users,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: error,
    });
  }
};

//UPDATE USER
export const updateUserDetails = async (req: Request, res: Response) => {
  try {
    const { userID, fullname, profileUrl, profileCaption } = req.body;

    if (!userID || !fullname || !profileUrl || !profileCaption) {
      return res.status(400).json({
        error: "Invalid request",
        details:
          "Both userID, profileUrl,profileCaption and fullname are required for updating user details.",
      });
    }

    const updatedUser: updateUser = {
      userID,
      fullname,
      profileUrl,
      profileCaption
    };
    const updateuserprocedureName = "updateUserDetails";
    const params = updatedUser;
    await execute(updateuserprocedureName, params);
    return res.send({ message: "User updated successfully" }, );
    //  const updateSuccess = await execute(updateuserprocedureName, params);
    //  if (!updateSuccess) {
    //    return res.send({ message: "User updated unsuccessfully" });
    //  } else {
    //    return res.send({ message: "User updated successfully" });
    //  }
  } catch (error) {
    console.error("Error updating user details:", error);
    res.status(500).send({
      error: "Internal server error",
    });
  }
};

//DELETE USER
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const userID = req.params.id;

    if (!userID) {
      return res.send({ message: "enter id" });
    }

    const result = await execute("deleteUser", { userID });

    console.log(result.recordset);

    res.send({ message: "user deleted successfuly" });
  } catch (error) {
    return res.status(500).json({
      message: error,
    });
  }
};

export const initiatePasswordReset = async (
  req: Request,
  res: Response
) => {
  try {
    const { email } = req.body;

    const user = await execute("getUserByEmail", { email });

    if (!user.recordset || user.recordset.length === 0) {
      return res.status(404).json({ message: "User not found." });
    }

    const resetToken = generateResetToken();
    console.log(resetToken);

    const expiration = new Date();
    expiration.setHours(expiration.getHours() + 1);

    await execute("SetResetTokenAndExpiration", {
      email,
      resetToken,
      expiryTime: expiration.toISOString(),
    });


    res.status(200).json({ message: "Reset token sent successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//RESET PASSWORD
export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { email, resetToken, newPassword } = req.body;
    console.log("reset token ", resetToken);
    newPassword;
    // Hash the new password before updating
    const hashedPassword = await bcrypt.hash(newPassword, 8);

    const result = await execute("ResetPassword", {
      email,
      resetToken,
      newPassword: hashedPassword,
    });

    console.log("rows affected", result.rowsAffected[1]);

    if (result.rowsAffected[0] > 0) {
      res.status(200).json({ message: "Password reset successful." });
      return;
    }

    console.log("Record sets", result.recordset);

    if (result.recordset && result.recordset.length > 0) {
      const message = result.recordset[0].message;
      console.log("message:", message);

      if (message === "Password updated successfully") {
        res.status(200).json({ message: "Password reset successful" });
      } else if (message === "Invalid token") {
        res.status(400).json({ message: "Invalid reset token" });
      } else if (message === "Invalid email") {
        res.status(400).json({ message: "Invalid email" });
      } else {
        res.status(500).json({
          message: "Error resetting password",
        });
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//GET FOLLOWERS
export const getFollowers = async (req: Request, res: Response) => {
  try {
    let  followed_userID  = req.params.ID;

    let followers = (
      await execute("fetchFollowers", {
        followed_userID,
      })
    ).recordset;

    return res.status(200).json(
      followers,
    );
  } catch (error) {
    return res.json({
      error: error,
    });
  }
};

//GET FOLLOWINGS
export const getFollowings = async (req: Request, res: Response) => {
  try {
    let  following_userID  = req.params.ID;

    let followers = (
      await execute("fetchFollowings", {
        following_userID,
      })
    ).recordset;

    return res.status(200).json(
      followers,
    );
  } catch (error) {
    return res.json({
      error: error,
    });
  }
};

//FOLLOW AND UNFOLLOW USER
export const toggleFollowUser = async (req: Request, res: Response) => {
  console.log(req.body);

  try {
    let followerID = v4();

    let { following_userID, followed_userID } = req.body;
    const relationsexists = (
      await query(
        `SELECT * FROM Followers WHERE following_userID = '${following_userID}' AND followed_userID= '${followed_userID}'`
      )
    ).recordset;

    if (!isEmpty(relationsexists)) {
      let result = await execute("unfollowUser", {
        following_userID,
        followed_userID,
      });

      if (result.rowsAffected[0] === 0) {
        return res.status(404).json({
          message: "Something went wrong, user not followed",
        });
      } else {
        return res.status(200).json({
          message: "User Unfollowed",
        });
      }
    } else {
      let result = await execute("followUser", {
        followerID,
        following_userID,
        followed_userID,
      });

      if (result.rowsAffected[0] === 0) {
        return res.status(404).json({
          message: "Something went wrong, user not followed",
        });
      } else {
        return res.status(200).json({
          message: "User Followed",
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
