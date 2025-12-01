import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { model, Schema } from "mongoose";
const UserSchema = new Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String },
    email: { type: String, required: true, unique: true },
    role: { type: String, enum: ["employee", "admin"], default: "employee" },
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
          { expiresIn: "15m" }
        );
        const refreshToken = jwt.sign(
          { _id: this._id, username: this.username },
          <string>process.env.JWT_REFRESH_TOKEN_SECRET,
          { expiresIn: "1d" }
        );
        this.refreshToken = refreshToken;
        this.save();
        return { accessToken, refreshToken };
      },
    },
  }
);

UserSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }
  if (this.password) {
    this.password = await bcrypt.hash(this.password, 10);
    return;
  }
});
export const User = model("User", UserSchema);
