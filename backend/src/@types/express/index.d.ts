import mongoose from "mongoose";
import { z } from "zod";
import { ITags } from "../../types";
//Custom Request Objects:
declare global {
  namespace Express {
    interface Request {
      _id?: mongoose.Types.ObjectId;
      role?:string;
    }
  }
}
