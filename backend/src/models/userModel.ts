import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Connection, Model } from "mongoose";
import { InferRawDocType, InferSchemaType, model, Schema } from "mongoose";
export const UserSchema = new Schema(
  {
    username: { type: String, required: true },
    password: { type: String },
    email: { type: String, required: true, unique: true },
    role: { type: String, enum: ["employee", "admin"], default: "employee" },
    employeeCode: { type: String },
    department: { type: Schema.Types.ObjectId, ref: "Department" },
    company: { type: Schema.Types.ObjectId, ref: "Company" },
    refreshToken: { type: String },
  },
  {
    timestamps: true,
    methods: {
      comparePassword(inputPassword: string) {
        if (!this.password) {
          return;
        }
        return bcrypt.compareSync(inputPassword, this.password);
      },
      generateAccessAndRefreshToken() {
        const accessToken = jwt.sign(
          { _id: this._id, username: this.username },
          <string>process.env.JWT_ACCESS_TOKEN_SECRET,
          { expiresIn: "1d" },
        );
        const refreshToken = jwt.sign(
          { _id: this._id, username: this.username },
          <string>process.env.JWT_REFRESH_TOKEN_SECRET,
          { expiresIn: "1d" },
        );
        this.refreshToken = refreshToken;
        this.save();
        return { accessToken, refreshToken };
      },
    },
  },
);

export type UserType = InferSchemaType<typeof UserSchema>;
export type RawUserType = InferRawDocType<typeof UserSchema>;   
// UserSchema.index(
//   { company: 1, employeeCode: 1 },
//   { unique: true, name: "uniq_company_employeeCode" },
// );
// UserSchema.index(
//   { company: 1, username: 1 },
//   { unique: true, name: "uniq_company_username" },
// );

/*UserSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }
  if (this.password) {
    this.password = await bcrypt.hash(this.password, 10);
    return;
  }
}); */

export const getUserModel = (connection: Connection): Model<UserType> => {
  // Return existing model if already registered, otherwise create new
  if (connection.models["User"]) {
    return connection.models["User"] as Model<UserType>;
  }
  return connection.model<UserType>("User", UserSchema);
};

export const User = model("User", UserSchema);
