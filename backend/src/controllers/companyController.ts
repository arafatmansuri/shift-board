import bcrypt from "bcrypt";
import { CookieOptions } from "express";
import otpGenerator from "otp-generator";
import z from "zod";
import { Company } from "../models/companyModel";
import { OTP } from "../models/otpModel";
import { User } from "../models/userModel";
import { Handler, StatusCode } from "../types";
const companySchema = z.object({
  companyName: z.string().min(2, { error: "Company name is too short" }),
  companyEmail: z.email({ error: "Invalid email address" }),
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
  companySize: z.number({ error: "Size should be a number" }).optional(),
});
export const createCompany: Handler = async (req, res) => {
  try {
    const parsedCompany = companySchema.safeParse(req.body);
    if (!parsedCompany.success) {
      res.status(StatusCode.InputError).json({
        message: parsedCompany.error.issues[0].message,
        success: false,
      });
      return;
    }
    const { companyEmail, companyName, companyPassword, companySize } =
      parsedCompany.data;
    const isCompanyExists = await Company.findOne({
      $or: [{ companyEmail }, { companyName }],
    });
    if (isCompanyExists) {
      res.status(StatusCode.DocumentExists).json({
        message: "Company with name or email already exists",
        success: false,
      });
      return;
    }
    const newCompany = await Company.create({
      companyEmail,
      companyName,
      companyPassword,
      companySize,
    });
    const newUser = await User.create({
      email: companyEmail,
      password: companyPassword,
      role: "admin",
      username: `Admin@${companyName}`.replace(" ", ""),
      company: newCompany._id,
    });
    const { accessToken, refreshToken } =
      newUser.generateAccessAndRefreshToken();
    const user = await User.findByIdAndUpdate(newUser._id, {
      $set: { refreshToken },
    })
      .select("-password -refreshToken")
      .populate("company", "-companyPassword");
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
      .status(StatusCode.Created)
      .json({
        message: "Company created successfully",
        company: newCompany,
        user,
        success: true,
      });
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
export const createCompanySendOTP: Handler = async (req, res) => {
  try {
    const parsedCompany = companySchema.safeParse(req.body);
    if (!parsedCompany.success) {
      res.status(StatusCode.InputError).json({
        message: parsedCompany.error.issues[0].message,
        success: false,
      });
      return;
    }
    const { companyEmail, companyName, companyPassword, companySize } =
      parsedCompany.data;
    const isCompanyExists = await Company.findOne({
      $or: [{ companyEmail }, { companyName }],
    });
    if (isCompanyExists) {
      res.status(StatusCode.DocumentExists).json({
        message: "Company with name or email already exists",
        success: false,
      });
      return;
    }
    const isOTPExists = await OTP.findOne({ companyEmail, type: "signup" })
      .sort({ createdAt: -1 })
      .limit(1);
    const cookieOptions: CookieOptions = {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
      maxAge: 20 * 60000, // 20 minutes
    };
    if (isOTPExists) {
      const otpCreatedTime = new Date(isOTPExists.createdAt);
      if (new Date().getTime() - otpCreatedTime.getTime() <= 120000) {
        await OTP.deleteMany({ companyEmail, type: "signup" });
        const newOtp = await OTP.create({
          companyEmail,
          otp: isOTPExists.otp,
          subject: "OTP for user signup",
          companyPassword: bcrypt.hashSync(companyPassword, 10),
          companyName,
          type: "signup",
        });
        res
          .cookie(
            "otp_data",
            { companyEmail: newOtp.companyEmail, type: "signup" },
            cookieOptions
          )
          .status(200)
          .json({ message: "OTP sent successfully" });
        return;
      }
    }
    const otp = otpGenerator.generate(6, {
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });
    const newOtp = await OTP.create({
      companyEmail,
      otp:Number(otp),
      subject: "OTP for user signup",
      companyPassword: bcrypt.hashSync(companyPassword, 10),
      companyName,
      type: "signup",
    });
    if (!newOtp) {
      res.status(500).json({ message: "OTP not generated" });
      return;
    }
    res
      .cookie(
        "otp_data",
        { companyEmail: newOtp.companyEmail, type: "signup" },
        cookieOptions
      )
      .status(200)
      .json({ message: "OTP sent successfully" });
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
