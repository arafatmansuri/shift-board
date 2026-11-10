import { InferSchemaType, model, Schema, Types,Model,Connection } from "mongoose";

export const departmentSchema = new Schema({
  departmentName: { type: String },
  departmentCode: { type: String },
  departmentManager: { type: Types.ObjectId, ref: "User" },
  company: { type: Schema.Types.ObjectId, ref: "Company" },
});

export type DepartmentType = InferSchemaType<typeof departmentSchema>;

departmentSchema.index(
  { company: 1, departmentName: 1 },
  { unique: true, name: "uniq_company_depname" }
);
departmentSchema.index(
  { company: 1, departmentCode: 1 },
  { unique: true, name: "uniq_company_depcode" }
);


export const getDepartmentModel = (connection: Connection): Model<DepartmentType> => {
  // Return existing model if already registered, otherwise create new
  if (connection.models["Department"]) {
    return connection.models["Department"] as Model<DepartmentType>;
  }
  return connection.model<DepartmentType>("Department", departmentSchema);
};
export const Department = model("Department", departmentSchema);
