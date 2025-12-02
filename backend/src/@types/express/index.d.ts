import { Types } from "mongoose";

//Custom Request Objects:
declare global {
  namespace Express {
    interface Request {
      _id?: Types.ObjectId;
      role?: string;
    }
  }
}
