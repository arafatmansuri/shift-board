import { Types } from "mongoose";
import z from "zod";
import { Company } from "../models/companyModel";
import { Department } from "../models/departmentModel";
import { User } from "../models/userModel";
import { Handler, StatusCode } from "../types";
const employeeSchema = z.object({
  username: z.string().min(3, { error: "Username is too short" }),
  password: z
    .string()
    .regex(/[A-Z]/, {
      message: "Pasword should include atlist 1 uppercasecharacter",
    })
    .regex(/[a-z]/, {
      message: "Pasword should include atlist 1 lowercasecharacter",
    })
    .regex(/[0-9]/, {
      message: "Pasword should include atlist 1 number character",
    })
    .regex(/[^A-Za-z0-9]/, {
      message: "Pasword should include atlist 1 special character",
    })
    .min(8, { message: "Password length shouldn't be less than 8" }),
  email: z.email({ error: "Email address is invalid" }),
  employeeCode: z.string(),
  department: z.string(),
});
export const createEmployee: Handler = async (req, res) => {
  try {
    const parsedEmployee = employeeSchema.safeParse(req.body);
    const userEmail = req.email;
    if (!parsedEmployee.success) {
      res.status(StatusCode.InputError).json({
        message: parsedEmployee.error.issues[0].message,
        success: false,
      });
      return;
    }
    const { email, employeeCode, password, username } = parsedEmployee.data;
    const company = await Company.findOne({ companyEmail: userEmail });
    if (!company) {
      res
        .status(StatusCode.NotFound)
        .json({ message: "Company not found", success: false });
      return;
    }
    const IsEmailExists = await User.findOne({ email });
    if (IsEmailExists) {
      res.status(StatusCode.InputError).json({
        message: "Employee already exists with this email",
        success: false,
      });
      return;
    }
    const department = await Department.findById(
      parsedEmployee.data.department
    );
    if (!department) {
      res
        .status(StatusCode.NotFound)
        .json({ message: "Department not found", success: false });
      return;
    }
    let employee;
    try {
      employee = await User.create({
        department: department._id,
        email,
        employeeCode,
        password,
        role: "employee",
        username,
        company: company._id,
      });
    } catch (err: any) {
      if (err?.code === 11000) {
        res.status(StatusCode.InputError).json({
          message: "Employee already exists",
          success: false,
          error: err,
        });
        return;
      }
    }
    res.status(StatusCode.Created).json({
      message: "Employee created sucessfully",
      success: true,
      employee,
    });
    return;
  } catch (error) {
    res.status(StatusCode.ServerError).json({
      message: "Something went wrong from our side",
      success: false,
      error,
    });
    return;
  }
};
export const getAllEmployee: Handler = async (req, res) => {
  try {
    const companyId = new Types.ObjectId(req.params.companyId);
    const company = await Company.findById(companyId);
    if (!company) {
      res
        .status(StatusCode.NotFound)
        .json({ message: "Company not found", success: false });
      return;
    }
    const employees = await User.find({
      role: "employee",
      company: companyId,
    }).populate("department");
    res.status(StatusCode.Success).json({
      message: "Employee details fetched sucessfully",
      success: true,
      employees,
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
export const deleteEmployee: Handler = async (req, res) => {
  try {
    const id = req.params.id;
    const employee = await User.findByIdAndDelete(id);
    if (!employee) {
      res.status(StatusCode.NotFound).json({
        message: "Employee not found",
        success: false,
      });
      return;
    }
    res.status(StatusCode.Success).json({
      message: "Employee details fetched sucessfully",
      success: true,
      employee,
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
