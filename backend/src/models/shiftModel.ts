import { model, Schema,Types } from "mongoose";

const ShiftSchema = new Schema({
  date: { type: Date, required: true },
  startTime: { type: String },
  endTime: { type: String },
  employeeId: { type: Types.ObjectId, ref: "User" },
  company: { type: Schema.Types.ObjectId, ref: "Company" },
});

export const Shift = model("Shift",ShiftSchema);