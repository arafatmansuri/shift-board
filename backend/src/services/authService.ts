import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { OTPData } from "./kvService";

export function comparePassword(inputPassword: string, password: string) {
  return bcrypt.compareSync(inputPassword, password);
}
export function generateAccessAndRefreshToken(_id: string, username: string) {
  const accessToken = jwt.sign(
    { _id: _id, username: username },
    <string>process.env.JWT_ACCESS_TOKEN_SECRET,
    { expiresIn: "1d" },
  );
  const refreshToken = jwt.sign(
    { _id: _id, username: username },
    <string>process.env.JWT_REFRESH_TOKEN_SECRET,
    { expiresIn: "1d" },
  );
  return { accessToken, refreshToken };
}
export function signOTPData(data:OTPData) {
  const signedOtp = jwt.sign(
    data,
    <string>process.env.JWT_OTP_SECRET,
    { expiresIn: "1d" },
  );
  return signedOtp;
}
export const unsignOTPData = (signedOTPData: string): OTPData => {
    const decoded = jwt.verify(signedOTPData, <string>process.env.JWT_OTP_SECRET);
    if (typeof decoded === 'object' && decoded !== null) {
        return decoded as OTPData;
    }
    throw new Error('Failed to decode OTP');
}
