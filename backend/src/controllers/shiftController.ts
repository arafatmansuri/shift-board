import z from "zod";
import { Shift } from "../models/shiftModel";
import { User } from "../models/userModel";
import {
  calculateDuration,
  timeToMinutes,
} from "../services/calculateShiftDuration";
import { Handler, StatusCode } from "../types";
const shiftSchema = z.object({
  employeeId: z.string({ error: "Invalid employeeId" }),
  date: z
    .date({ error: "Invalid shift date" })
    .min(Date.now(), { error: "Invalid Date" }),
  startTime: z.string("Invalid start time"),
  endTime: z.string("Invalid end time"),
});

export const createShift: Handler = async (req, res) => {
  try {
    const shiftParse = shiftSchema.safeParse(req.body);
    if (!shiftParse.success) {
      res.status(StatusCode.InputError).json({
        message: shiftParse.error.issues[0].message || "Invalid shift data",
        success: false,
      });
      return;
    }
    const { date, employeeId, endTime, startTime } = shiftParse.data;
    const employee = await User.findById(employeeId);
    if (!employee) {
      res
        .status(StatusCode.NotFound)
        .json({ message: "employee not found", success: false });
      return;
    }
    const shiftDuration = calculateDuration(startTime, endTime);
    if (shiftDuration < 240) {
      res.status(StatusCode.InputError).json({
        message: "Shift must be greater than 4 hours",
        success: false,
      });
      return;
    }
    const hasShiftOnSameDate = await Shift.find({
      date,
      employeeId: employee._id,
    });
    if (hasShiftOnSameDate) {
      const currentStartTime = timeToMinutes(startTime);
      const currentEndTime = timeToMinutes(endTime);
      for (const shift of hasShiftOnSameDate) {
        const shiftStartTime = timeToMinutes(shift.startTime || "");
        const shiftEndTime = timeToMinutes(shift.endTime || "");
        if (
          !(
            currentStartTime >= shiftEndTime || currentEndTime <= shiftStartTime
          )
        ) {
          res.status(StatusCode.InputError).json({
            message: "Employee has overlapping shift on this date",
            success: false,
          });
          return;
        }
      }
    }
    const shift = await Shift.create({
      date,
      startTime,
      endTime,
      employeeId: employee._id,
    })
    res
      .status(StatusCode.Created)
      .json({
        message: "Shift created successfully",
        success: true,
        shift: await shift.populate("employeeId"),
      });

  } catch (error) {
    res.status(StatusCode.ServerError).json({
      message: "Something went wrong from our side",
      success: false,
    });
    return;
  }
};
