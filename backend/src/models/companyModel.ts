import { Connection, InferSchemaType, Model, model, Schema } from "mongoose";
export const CompanySchema = new Schema({
  companyName: { type: String, required: true, unique: true },
  companyEmail: { type: String, required: true, unique: true },
  companyPassword: { type: String, required: true },
  companySize: { type: Number },
});

export type CompanyType = InferSchemaType<typeof CompanySchema>;
/*CompanySchema.pre("save", async function () {
  if (!this.isModified("companyPassword")) {
    return;
  }
  if (this.companyPassword) {
    this.companyPassword = await bcrypt.hash(this.companyPassword, 10);
    return;
  }
});*/

export const getCompanyModel = (connection: Connection): Model<CompanyType> => {
  if (connection.models["Company"]) {
    return connection.models["Company"] as Model<CompanyType>;
  }
  return connection.model<CompanyType>("Company", CompanySchema);
};

export const Company = model("Company", CompanySchema);
