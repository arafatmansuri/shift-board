import { model, Schema } from "mongoose";
import { sendMail } from "../services/mailer";

const OTPSchema = new Schema({
  companyName: { type: String, required: true, trim: true },
  companyPassword: { type: String },
  companyEmail: { type: String, required: true },
  companySize: { type: Number },
  subject: { type: String, required: true },
  otp: { type: Number, required: true },
  type: { type: String, enum: ["forget", "signup"] },
  createdAt: { type: Date, default: Date.now() },
});

OTPSchema.pre("save", async function () {
  if (this.isNew) {
    await sendMail(this.companyEmail, this.subject, this.companyName, this.otp);
  }
});

export const OTP = model("OTP", OTPSchema);
