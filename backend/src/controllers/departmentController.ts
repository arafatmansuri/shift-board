import { Types } from "mongoose";
import z from "zod";
import { Company } from "../models/companyModel";
import { Department } from "../models/departmentModel";
import { User } from "../models/userModel";
import { Handler, StatusCode } from "../types";

const departmentSchema = z.object({
  departmentName: z.string().min(2, { error: "Department name is too short" }),
  departmentCode: z.string(),
  departmentManager: z.string().optional(),
});
export const createDepartment: Handler = async (req, res) => {
  try {
    const parsedDepartment = departmentSchema.safeParse(req.body);
    const userEmail = req.email;
    if (!parsedDepartment.success) {
      res.status(StatusCode.InputError).json({
        message: parsedDepartment.error.issues[0].message,
        success: false,
      });
      return;
    }
    const { departmentCode, departmentManager, departmentName } =
      parsedDepartment.data;
    const company = await Company.findOne({ companyEmail: userEmail });
    if (!company) {
      res
        .status(StatusCode.NotFound)
        .json({ message: "Company not found", success: false });
      return;
    }
    let manager;
    if (departmentManager) {
      manager = await User.findById(departmentManager);
      if (!manager) {
        res.status(StatusCode.NotFound).json({
          message: "department manager not found",
          success: false,
        });
        return;
      }
    }
    let department;
    try {
      department = await Department.create({
        departmentCode,
        departmentName,
        departmentManager: manager && manager._id,
        company: company._id,
      });
    } catch (err: any) {
      if (err?.code === 11000) {
        res.status(StatusCode.InputError).json({
          message: "Department already exists",
          success: false,
          error: err,
        });
        return;
      }
    }
    res.status(StatusCode.Created).json({
      message: "Department created sucessfully",
      success: true,
      department,
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
export const getAllDepartment: Handler = async (req, res) => {
  try {
    const companyId = new Types.ObjectId(req.params.companyId);
    const company = await Company.findById(companyId);
    if (!company) {
      res
        .status(StatusCode.NotFound)
        .json({ message: "Company not found", success: false });
      return;
    }
    const departments = await Department.find({ company: companyId }).populate(
      "departmentManager",
      "-password -refreshToken"
    );
    res.status(StatusCode.Success).json({
      message: "Departments fetched sucessfully",
      success: true,
      departments,
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
export const deleteDepartment: Handler = async (req, res) => {
  try {
    const id = req.params.id;
    const department = await Department.findByIdAndDelete(id);
    if (!department) {
      res.status(StatusCode.NotFound).json({
        message: "Department not found",
        success: false,
      });
      return;
    }
    res.status(StatusCode.Success).json({
      message: "Departments deleted sucessfully",
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

export const assignManager: Handler = async (req, res) => {
  try {
    const departmentId = new Types.ObjectId(req.params.id);
    const employeeId = req.body.departmentManager;
    if (!departmentId || !employeeId) {
      res
        .status(StatusCode.InputError)
        .json({ message: "departmentId or employeeId required" });
      return;
    }
    const employee = await User.findById(employeeId);
    if (!employee) {
      res.status(StatusCode.NotFound).json({ message: "Invalid employeeId" });
      return;
    }
    if (employee.department?.toString() !== departmentId.toString()) {
      res
        .status(StatusCode.InputError)
        .json({ message: "Can't assign manager from deferent department" });
      return;
    }
    const department = await Department.findByIdAndUpdate(
      departmentId,
      {
        $set: {
          departmentManager: employee._id,
        },
      },
      { new: true }
    );
    if (!department) {
      res.status(StatusCode.NotFound).json({ message: "Invalid department" });
      return;
    }
    res.status(200).json({ message: "manager assigned successfully" });
  } catch (error) {
    res.status(StatusCode.ServerError).json({
      message: "Something went wrong from our side",
      success: false,
      error,
    });
    return;
  }
};
