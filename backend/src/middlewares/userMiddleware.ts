import { MHandler, StatusCode } from "../types";

export const userMiddelware: MHandler = async (req, res, next) => {
  try {
  } catch (error) {
    res
      .status(StatusCode.ServerError)
      .json({ message: "Something went wrong from our side", success: false });
    return;
  }
};
