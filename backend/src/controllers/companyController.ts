import bcrypt from "bcrypt";
import { CookieOptions } from "express";
import otpGenerator from "otp-generator";
import z from "zod";
import { Company } from "../models/companyModel";
import { OTP } from "../models/otpModel";
import { User } from "../models/userModel";
import { canResendOTP, getOTPData, saveOTP } from "../services/otpService";
import { Handler, StatusCode } from "../types";
import { emailQueue } from "../queues/emailQueue";
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
    const isOTPExists = await getOTPData(companyEmail);
    const canResend = await canResendOTP(companyEmail);
    let otp:string;
    if (isOTPExists && canResend && isOTPExists.otp) {
      otp = isOTPExists.otp;
    }
    else
     otp = otpGenerator.generate(6, {
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });
    await saveOTP({
      email: companyEmail,
      otp,
      data: {
        companyEmail,
        companyName,
        companyPassword: await bcrypt.hash(companyPassword, 10),
        companySize,
        otpType: "signup",
        subject: "OTP for user signup",
      },
    });

    await emailQueue.add("send-otp", {
      email: companyEmail,
      otp,
      subject: "OTP for user signup",
      username: `Admin@${companyName}`.replace(" ", ""),
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
        {type: "signup", companyEmail},
        cookieOptions
      )
      .status(StatusCode.Success)
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
export const createCompanyOTPVerification: Handler = async (
  req,
  res
): Promise<void> => {
  try {
    const parsedOTP = req.body.OTP;
    if (!parsedOTP) {
      res.status(StatusCode.NotFound).json({ message: "OTP not found" });
      return;
    }
    const { companyEmail } = req.cookies.otp_data;
    const IsOtpExists = await getOTPData(companyEmail);
    if (!IsOtpExists || parsedOTP !== IsOtpExists.otp) {
      res.status(StatusCode.NotFound).json({
        message: "Invalid OTP",
      });
      return;
    }
    const newCompany = await Company.create({
      companyEmail,
      companyName: IsOtpExists.companyName,
      companyPassword: IsOtpExists.companyPassword,
      companySize: IsOtpExists.companySize,
    });
    const newUser = await User.create({
      username: `Admin@${IsOtpExists.companyName}`.replace(" ", ""),
      company: newCompany._id,
      email: companyEmail,
      password: IsOtpExists.companyPassword,
      role: "admin",
    });
    await OTP.deleteMany({ companyEmail, type: "signup" });
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
  } catch (err: any) {
    res.status(StatusCode.ServerError).json({
      message: err.message || "Something went wrong from our side",
      err,
    });
    return;
  }
};
