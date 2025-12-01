import { User } from "../models/userModel";
import { Handler, StatusCode } from "../types";

export const createEmployee:Handler = async (req,res) => {
    
}
export const getAllEmployee:Handler = async (req,res) => {
    try {
        const employees = await User.find({role:"employee"}).populate("department")
        res.status(StatusCode.Success).json({message:"Employee details fetched sucessfully",success:true,employees})
    } catch (error) {
        res.status(StatusCode.ServerError).json({
          message: "Something went wrong from our side",
          success: false,
        });
        return;
    }
}
export const deleteEmployee:Handler = async (req,res) => {
    
}