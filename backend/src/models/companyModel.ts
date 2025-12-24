import {model, Schema} from 'mongoose';
import bcrypt from 'bcrypt';
const CompanySchema = new Schema({
  companyName: { type: String, required: true, unique: true },
  companyEmail: { type: String, required: true, unique: true },
  companyPassword: { type: String, required: true},
  companySize: { type: Number},
});

/*CompanySchema.pre("save", async function () {
  if (!this.isModified("companyPassword")) {
    return;
  }
  if (this.companyPassword) {
    this.companyPassword = await bcrypt.hash(this.companyPassword, 10);
    return;
  }
});*/

export const Company = model("Company",CompanySchema);