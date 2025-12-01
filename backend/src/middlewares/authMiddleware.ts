import jwt from "jsonwebtoken";
import { User } from "../models/userModel";
import { MHandler, StatusCode } from "../types";
export const employeeMiddelware: MHandler = async (req, res, next) => {
  try {
    const accessToken = req.cookies?.accessToken;
    if (!accessToken) {
      res
        .status(StatusCode.Unauthorized)
        .json({ message: "Unauthorized", success: false });
      return;
    }
    const decodedToken = jwt.verify(
      accessToken,
      <string>process.env.JWT_ACCESS_TOKEN_SECRET
    );
    if (!decodedToken) {
      res
        .status(StatusCode.Unauthorized)
        .json({ message: "Unauthorized", success: false });
      return;
    }
    //@ts-ignore
    const user = await User.findById(decodedToken._id);
    if (!user || user.role == "admin") {
      res
        .status(StatusCode.Unauthorized)
        .json({ message: "Unauthorized", success: false });
      return;
    }
    req._id = user._id;
    req.role = user.role;
    next();
  } catch (error) {
    res
      .status(StatusCode.ServerError)
      .json({ message: "Something went wrong from our side", success: false });
    return;
  }
};
export const adminMiddelware: MHandler = async (req, res, next) => {
  try {
    const accessToken = req.cookies?.accessToken;
    if (!accessToken) {
      res
        .status(StatusCode.Unauthorized)
        .json({ message: "Unauthorized", success: false });
      return;
    }
    const decodedToken = jwt.verify(
      accessToken,
      <string>process.env.JWT_ACCESS_TOKEN_SECRET
    );
    if (!decodedToken) {
      res
        .status(StatusCode.Unauthorized)
        .json({ message: "Unauthorized", success: false });
      return;
    }
    //@ts-ignore
    const user = await User.findById(decodedToken._id);
    if (!user || user.role == "employee") {
      res
        .status(StatusCode.Unauthorized)
        .json({ message: "Unauthorized", success: false });
      return;
    }
    req._id = user._id;
    req.role = user.role;
    next();
  } catch (error) {
    res
      .status(StatusCode.ServerError)
      .json({ message: "Something went wrong from our side", success: false });
    return;
  }
};
