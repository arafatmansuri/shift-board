import { CookieOptions } from "express";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { Company } from "../models/companyModel";
import { User } from "../models/userModel";
import { Handler, StatusCode } from "../types";
const loginSchema = z.object({
  companyName: z.string({ error: "company name must be string" }).trim(),
  username: z.string({ error: "Username must be string" }).trim().optional(),
  email: z.email({ error: "Invalid email address" }).optional(),
  password: z.string({ error: "Password must be string" }),
});
export const login: Handler = async (req, res) => {
  try {
    const loginParse = loginSchema.safeParse(req.body);
    if (!loginParse.success) {
      res.status(StatusCode.InputError).json({
        message:
          loginParse.error.issues[0].message || "Invalid username/password",
        success: false,
      });
      return;
    }
    const { password, email, username, companyName } = loginParse.data;
    const company = await Company.findOne({ companyName });
    if (!company) {
      res
        .status(StatusCode.NotFound)
        .json({ message: "Company not found", success: false });
      return;
    }
    const user = await User.findOne({ $or: [{ email }, { username }] })
      .select("-refreshToken")
      .populate("company", "-companyPassword");
    if (!user) {
      res
        .status(StatusCode.NotFound)
        .json({ message: "User not found", success: false });
      return;
    }
    const isPasswordCorrect = user.comparePassword(password);
    if (!isPasswordCorrect) {
      res
        .status(StatusCode.NotFound)
        .json({ message: "Incorrect password", success: false });
      return;
    }
    const { accessToken, refreshToken } = user.generateAccessAndRefreshToken();
    await User.findByIdAndUpdate(user._id, {
      $set: {
        refreshToken,
      },
    });
    const cookieOptions: CookieOptions = {
      sameSite: "none",
      secure: true,
      path: "/",
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: true,
    };
    res
      .cookie("accessToken", accessToken, cookieOptions)
      .cookie("refreshToken", refreshToken, cookieOptions)
      .status(StatusCode.Success)
      .json({ message: "login successfull", success: true, user });
    return;
  } catch (error) {
    res.status(StatusCode.ServerError).json({
      message: "Something went wrong from our side",
      success: false,
      error,
    });
    return;
  }
};
export const me: Handler = async (req, res) => {
  try {
    const _id = req._id;
    const user = await User.findById(_id)
      .select("-password -refreshToken")
      .populate("company", "-companyPassword")
      .populate("department");
    if (!user) {
      res
        .status(StatusCode.NotFound)
        .json({ message: "user not found", success: false });
      return;
    }
    res
      .status(StatusCode.Success)
      .json({ message: "User data fetched successfully", user });
  } catch (error) {
    res.status(StatusCode.ServerError).json({
      message: "Something went wrong from our side",
      success: false,
    });
    return;
  }
};
export const refreshAccessToken: Handler = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      res
        .status(StatusCode.Unauthorized)
        .json({ message: "Unauthorized", success: false });
      return;
    }
    const decodedRefreshToken = jwt.verify(
      refreshToken,
      <string>process.env.JWT_REFRESH_TOKEN_SECRET
    );
    if (!decodedRefreshToken) {
      res
        .status(StatusCode.Unauthorized)
        .json({ message: "Unauthorized", success: false });
      return;
    }
    //@ts-ignore
    const user = await User.findById(decodedRefreshToken._id)
      .select("-password -refreshToken")
      .populate("company", "-companyPassword");
    if (!user) {
      res
        .status(StatusCode.Unauthorized)
        .json({ message: "Unauthorized", success: false });
      return;
    }
    const { accessToken } = user.generateAccessAndRefreshToken();
    const cookieOptions: CookieOptions = {
      sameSite: "none",
      secure: true,
      path: "/",
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: true,
    };
    res
      .cookie("accessToken", accessToken, cookieOptions)
      .status(StatusCode.Success)
      .json({ message: "login successfull", success: true, user });
    return;
  } catch (error) {
    res
      .status(StatusCode.Unauthorized)
      .json({ message: "Unauthorized", success: false });
    return;
  }
};
export const logout: Handler = async (req, res) => {
  try {
    res
      .clearCookie("accessToken", { path: "/" })
      .clearCookie("refreshToken", { path: "/" })
      .json({ message: "logout successfull", success: true })
      .end();
  } catch (error) {
    res
      .status(StatusCode.ServerError)
      .json({ message: "Something went wrong from ourside", success: false });
    return;
  }
};
