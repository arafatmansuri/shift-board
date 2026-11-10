import { DurableObject } from "cloudflare:workers";
import mongoose, { Model, QueryFilter, Schema } from "mongoose";
import { RawUserType, UserSchema, UserType } from "../models/userModel";
import { departmentSchema, DepartmentType } from "../models/departmentModel";
import { ShiftSchema, ShiftType } from "../models/shiftModel";
import { CompanySchema, CompanyType } from "../models/companyModel";

export class MongoDBConnection extends DurableObject<Env> {
  private User: Model<UserType>;
  private Department: Model<DepartmentType>;
  private Shift: Model<ShiftType>;
  private Company: Model<CompanyType>;


  constructor(state: DurableObjectState, env: Env) {
    super(state, env);
    this.User = mongoose.model("User", UserSchema);
    this.Department = mongoose.model("Department", departmentSchema) ;
    this.Shift = mongoose.model("Shift", ShiftSchema) ;
    this.Company = mongoose.model("Company", CompanySchema) ;
  }

  async getUser(filter: QueryFilter<RawUserType>) {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(this.env.MONGODB_URI, { dbName: "emshift2" });
    }

    return this.User.findOne(filter).lean();
  }
}
