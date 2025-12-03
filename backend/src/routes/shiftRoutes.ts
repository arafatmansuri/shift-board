import { Router } from "express";
import {
  createShift,
  deleteShift,
  getAllShifts,
  getEmployeeShifts,
  updateShift,
} from "../controllers/shiftController";
import {
  adminMiddelware,
  employeeMiddelware,
} from "../middlewares/authMiddleware";

const shiftRouter = Router();

shiftRouter.route("/employeeshift").get(employeeMiddelware, getEmployeeShifts);
shiftRouter.use(adminMiddelware);
shiftRouter.route("/shifts").post(createShift);
shiftRouter.route("/delete/:id").delete(deleteShift);
shiftRouter.route("/shifts").get(getAllShifts);
shiftRouter.route("/update/:id").put(updateShift);

export default shiftRouter