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
    const employeeShifts = await Shift.find({
      employeeId: employee._id,
    });
    const hasShiftOnSameDate = employeeShifts.filter((s) => {
      const existingshiftDate = new Date(s.date);
      if (existingshiftDate.getDate() == date.getDate()) {
        return true;
      }
      return false;
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
    });
    res.status(StatusCode.Created).json({
      message: "Shift created successfully",
      success: true,
      shift: await shift.populate("employeeId"),
    });
    return;
  } catch (error) {
    res.status(StatusCode.ServerError).json({
      message: "Something went wrong from our side",
      success: false,
    });
    return;
  }
};
export const deleteShift: Handler = async (req, res) => {
  try {
    const id = req.params.id;
    const shift = await Shift.findByIdAndDelete(id);
    if (!shift) {
      res
        .status(StatusCode.NotFound)
        .json({ message: "shift not found", success: false });
      return;
    }
    res.status(StatusCode.Success).json({
      message: "Shift deleted successfully",
      success: true,
    });
    return;
  } catch (error) {
    res.status(StatusCode.ServerError).json({
      message: "Something went wrong from our side",
      success: false,
    });
    return;
  }
};
export const updateShift: Handler = async (req, res) => {
  try {
    const id = req.params.id;
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
    const employeeShifts = await Shift.find({
      employeeId: employee._id,
    });
    const hasShiftOnSameDate = employeeShifts.filter((s) => {
      const existingshiftDate = new Date(s.date);
      if (existingshiftDate.getDate() == date.getDate()) {
        return true;
      }
      return false;
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
    const shift = await Shift.findByIdAndUpdate(
      id,
      {
        $set: {
          date,
          startTime,
          endTime,
          employeeId: employee._id,
        },
      },
      { new: true }
    ).populate("employeeId");
    res.status(StatusCode.Created).json({
      message: "Shift created successfully",
      success: true,
      shift,
    });
    return;
  } catch (error) {
    res.status(StatusCode.ServerError).json({
      message: "Something went wrong from our side",
      success: false,
    });
    return;
  }
};

export const getAllShifts: Handler = async (req, res) => {
  try {
    const { employee, date } = req.query;
    let shifts = await Shift.find();
    if (employee && !date) {
      shifts = await Shift.find({ employeeId: employee });
    } else if (!employee && date) {
      shifts = (await Shift.find()).filter((s) => {
        const existingshiftDate = new Date(s.date);
        const currentDate = new Date(date as string);
        if (existingshiftDate.getDate() == currentDate.getDate()) {
          return true;
        }
        return false;
      });
    } else if (employee && date) {
      shifts = (await Shift.find({ employeeId: employee })).filter((s) => {
        const existingshiftDate = new Date(s.date);
        const currentDate = new Date(date as string);
        if (existingshiftDate.getDate() == currentDate.getDate()) {
          return true;
        }
        return false;
      });
    }
    res
      .status(StatusCode.Success)
      .json({ message: "shifts fetched successfully", success: true, shifts });
    return;
  } catch (error) {
    res.status(StatusCode.ServerError).json({
      message: "Something went wrong from our side",
      success: false,
    });
    return;
  }
};
export const getEmployeeShifts: Handler = async (req, res) => {
  try {
    const id = req._id;
    let shifts = await Shift.find({employeeId:id});
    res
      .status(StatusCode.Success)
      .json({ message: "shifts fetched successfully", success: true, shifts });
    return;
  } catch (error) {
    res.status(StatusCode.ServerError).json({
      message: "Something went wrong from our side",
      success: false,
    });
    return;
  }
};

