import { Connection, Model } from "mongoose";
import { InferSchemaType, model, Schema,Types } from "mongoose";

export const ShiftSchema = new Schema({
  date: { type: Date, required: true },
  startTime: { type: String },
  endTime: { type: String },
  employeeId: { type: Types.ObjectId, ref: "User" },
  company: { type: Schema.Types.ObjectId, ref: "Company" },
});

export type ShiftType = InferSchemaType<typeof ShiftSchema>;


export const getShiftModel = (connection: Connection): Model<ShiftType> => {
  // Return existing model if already registered, otherwise create new
  if (connection.models["Shift"]) {
    return connection.models["Shift"] as Model<ShiftType>;
  }
  return connection.model<ShiftType>("Shift", ShiftSchema);
};
export const Shift = model("Shift",ShiftSchema);