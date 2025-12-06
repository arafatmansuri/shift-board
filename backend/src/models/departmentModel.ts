import { model, Schema, Types } from "mongoose";

const departmentSchema = new Schema({
  departmentName: { type: String },
  departmentCode: { type: String },
  departmentManager: { type: Types.ObjectId, ref: "User" },
  company: { type: Schema.Types.ObjectId, ref: "Company" },
});

export const Department = model("Department", departmentSchema);
