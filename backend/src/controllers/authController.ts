import bcrypt from "bcrypt";
import { CookieOptions } from "express";
import jwt from "jsonwebtoken";
import otpGenerator from "otp-generator";
import { z } from "zod";
import { Company } from "../models/companyModel";
import { OTP } from "../models/otpModel";
import { User } from "../models/userModel";
import { canResendOTP, getOTPData, saveOTP, verifyOTP } from "../services/otpService";
import { Handler, StatusCode } from "../types";
import { emailQueue } from "../queues/emailQueue";
import { c } from "vite/dist/node/moduleRunnerTransport.d-DJ_mE5sf";
const loginSchema = z.object({
  companyName: z.string({ error: "company name must be string" }).trim(),
  companyEmail: z.email({ error: "Invalid email address" }),
  companyPassword: z.string({ error: "Password must be string" }),
});
const forgetInputSchema = z.object({
  OTP: z.number(),
  companyPassword: z
    .string()
    .regex(/[A-Z]/, {
      message: "Pasword should include atlist 1 uppercasecharacter",
    })
    .regex(/[a-z]/, {
      message: "Pasword should include atlist 1 lowercasecharacter",
    })
    .regex(/[0-9]/, {
      message: "Pasword should include atlist 1 number character",
    })
    .regex(/[^A-Za-z0-9]/, {
      message: "Pasword should include atlist 1 special character",
    })
    .min(8, { message: "Password length shouldn't be less than 8" }),
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
    const { companyPassword, companyEmail, companyName } = loginParse.data;
    const company = await Company.findOne({ companyName });
    if (!company) {
      res
        .status(StatusCode.NotFound)
        .json({ message: "Company not found", success: false });
      return;
    }
    const user = await User.findOne({
      $and: [{ email: companyEmail }, { company: company._id }],
    })
      .select("-refreshToken")
      .populate("company", "-companyPassword");
    if (!user) {
      res
        .status(StatusCode.NotFound)
        .json({ message: "User not found", success: false });
      return;
    }
    const isPasswordCorrect = user.comparePassword(companyPassword);
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
      <string>process.env.JWT_REFRESH_TOKEN_SECRET,
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
export const forgetSendOTP: Handler = async (req, res): Promise<void> => {
  try {
    const userEmail = z.email({ message: "Invalid email address" });
    const userInput = userEmail.safeParse(req.body.companyEmail);
    if (!userInput.success) {
      res.status(StatusCode.InputError).json({
        message: userInput.error.message || "Invalid email address",
      });
      return;
    }
    const email = userInput.data;
    const user = await User.findOne({ email });
    if (!user) {
      res
        .status(StatusCode.DocumentExists)
        .json({ message: "User not found with this email" });
      return;
    }
    const isOTPExists = await getOTPData(email);
    const canResend = await canResendOTP(email);
    let otp:string;
    if (isOTPExists && !canResend && isOTPExists.otp && isOTPExists.otpType === "forgot") {
      otp = isOTPExists.otp;
    }
    else {
      otp = otpGenerator.generate(6, {
        lowerCaseAlphabets: false,
        upperCaseAlphabets: false,
        specialChars: false,
      });
    }
    await saveOTP({
      email,
      otp,
      data: {
        companyEmail: email,
        companyName: user.username,
        otpType: "forgot",
        subject: "OTP for user forget password",
      },
    });
    await emailQueue.add("send-otp", {
          email,
          otp,
          subject: "OTP for user forget password",
          username: `${user.username}`.replace(" ", ""),
        });
    const cookieOptions: CookieOptions = {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
      maxAge: 10 * 60000, // 10 minutes
    };
    res
      .cookie(
        "otp_data",
        { companyEmail: email, type: "forgot" },
        cookieOptions,
      )
      .status(200)
      .json({ message: "OTP sent successfully" });
    return;
  } catch (err: any) {
    res
      .status(StatusCode.ServerError)
      .json({ message: "Something went wrong from ourside", err });
    return;
  }
};
export const forgetOTPVerification: Handler = async (
  req,
  res,
): Promise<void> => {
  try {
    const parsedInput = forgetInputSchema.safeParse(req.body);
    if (!parsedInput.success) {
      res.status(StatusCode.NotFound).json({
        message:
          parsedInput.error.issues[0].message || "OTP/Password is required",
      });
      return;
    }
    const { OTP: otp, companyPassword } = parsedInput.data;
    const { companyEmail } = req.cookies.otp_data;
    const IsOtpExists = await verifyOTP(companyEmail, otp.toString(), "forgot");
    if (!IsOtpExists) {
      res.status(StatusCode.NotFound).json({
        message: "Invalid OTP",
      });
      return;
    }
    
    await User.updateOne(
      { email: companyEmail },
      {
        $set: {
          password: bcrypt.hashSync(companyPassword, 10),
        },
      },
    );
    // const cookieOptions: CookieOptions = {
    //   httpOnly: true,
    //   secure: true,
    //   sameSite: "none",
    //   path: "/",
    //   maxAge: 24 * 60 * 60 * 1000, // 1 day
    // };
    res
      .status(StatusCode.Success)
      // .cookie("accessToken", accessToken, cookieOptions)
      // .cookie("refreshToken", refreshToken, cookieOptions)
      .json({
        message: "Password changed successfully",
        // user,
      });
    return;
  } catch (err: any) {
    res.status(StatusCode.ServerError).json({
      message: err.message || "Something went wrong from our side",
      err,
    });
    return;
  }
};
export const resenedOTP: Handler = async (req, res): Promise<void> => {
  try {
    const otpData = req.cookies.otp_data;
    if (!otpData || !otpData.companyEmail || !otpData.type) {
      res.status(StatusCode.InputError).json({
        message: "Invalid email address",
      });
      return;
    }
    const isUserExists = await User.findOne({ email: otpData.companyEmail });
    if (!isUserExists) {
      res
        .status(StatusCode.DocumentExists)
        .json({ message: "User does not exist with this email" });
      return;
    }
    const isOTPExists = await getOTPData(otpData.companyEmail);
    const canResend = await canResendOTP(otpData.companyEmail);
    if (
      !isOTPExists ||
      !canResend ||
      (isOTPExists && isOTPExists.otpType !== otpData.type)
    ) {
      res
        .status(StatusCode.DocumentExists)
        .json({ message: "Wait for 2 minutes before sending new OTP" });
      return;
    }
    const otp = otpGenerator.generate(6, {
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });
    const {companyEmail, companyName, companyPassword, companySize} = isOTPExists;
    const newOtp = await saveOTP({
      email: companyEmail!,
      otp,
      data: {
        companyEmail,
        companyName,
        companyPassword,
        companySize,
        otpType: otpData.type,
        subject: `OTP for user ${otpData.type == "signup" ? "signup" : "forget password"}`,
      },
    });
    await emailQueue.add("send-otp", {
          email: companyEmail,
          otp,
          subject: `OTP for user ${otpData.type == "signup" ? "signup" : "forget password"}`,
          username: `${companyName}`.replace(" ", ""),
        });
    const cookieOptions: CookieOptions = {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
      maxAge: 20 * 60000, // 20 minutes
    };
    res
      .cookie(
        "otp_data",
        { companyEmail: companyEmail, type: otpData.type },
        cookieOptions,
      )
      .status(StatusCode.Success)
      .json({ message: "OTP sent successfully" });
    return;
  } catch (err: any) {
    res
      .status(StatusCode.ServerError)
      .json({ message: "Something went wrong from ourside", err });
    return;
  }
};
