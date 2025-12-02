import z from "zod";
import { Department } from "../models/departmentModel";
import { User } from "../models/userModel";
import { Handler, StatusCode } from "../types";
const departmentSchema = z.object({
  departmentName:z.string().min(3,{error:"Department name is too short"}),
  departmentCode:z.string(),
  departmentManager:z.string()
})
export const createDepartment:Handler = async (req,res) => {
    try {
      const parsedDepartment = departmentSchema.safeParse(req.body);
      if (!parsedDepartment.success) {
        res.status(StatusCode.InputError).json({message:parsedDepartment.error.issues[0].message,success:false})
        return
      }
      const {departmentCode,departmentManager,departmentName} = parsedDepartment.data;
      const manager = await User.findById(departmentManager);
      if (!manager) {
        res
          .status(StatusCode.NotFound)
          .json({
            message: "department manager not found",
            success: false,
          });
        return;
      }
      const department = await Department.create({
        departmentCode,
        departmentName,
        departmentManager:manager._id
      })
      res
        .status(StatusCode.Created)
        .json({
          message: "Departments created sucessfully",
          success: true,
          department,
        });
      return
    } catch (error) {
      res.status(StatusCode.ServerError).json({
        message: "Something went wrong from our side",
        success: false,
      });
      return;
    }
}
export const getAllDepartment:Handler = async (req,res) => {
    try {
        const departments = await Department.find().populate(
          "departmentManager"
        );
        res.status(StatusCode.Success).json({message:"Departments fetched sucessfully",success:true,departments})
        return
    } catch (error) {
        res.status(StatusCode.ServerError).json({
          message: "Something went wrong from our side",
          success: false,
        });
        return;
    }
}
export const deleteDepartment:Handler = async (req,res) => {
    try {
      const id = req.params.id;
      const department = await Department.findByIdAndDelete(id);
      if(!department)
        res.status(StatusCode.NotFound).json({
          message: "Department not found",
          success: false,
        });
      res
        .status(StatusCode.Success)
        .json({
          message: "Departments fetched sucessfully",
          success: true,
        });
      return
    } catch (error) {
      res.status(StatusCode.ServerError).json({
        message: "Something went wrong from our side",
        success: false,
      });
      return;
    }
}