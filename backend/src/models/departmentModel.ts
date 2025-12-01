import { model, Schema, Types } from "mongoose";

const departmentSchema = new Schema({
  departmentName: { type: String },
  departmentCode: { type: String },
  departmentManager: { type: Types.ObjectId, ref: "User" },
});

export const Department = model("Department", departmentSchema);
