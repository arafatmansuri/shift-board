import { model, Schema, Types } from "mongoose";

const departmentSchema = new Schema({
  departmentName: { type: String },
  departmentCode: { type: String },
  departmentManager: { type: Types.ObjectId, ref: "User" },
  company: { type: Schema.Types.ObjectId, ref: "Company" },
});

departmentSchema.index(
  { company: 1, departmentName: 1 },
  { unique: true, name: "uniq_company_depname" }
);
departmentSchema.index(
  { company: 1, departmentCode: 1 },
  { unique: true, name: "uniq_company_depcode" }
);

export const Department = model("Department", departmentSchema);
