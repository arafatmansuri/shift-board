import { Router } from "express";
import { adminMiddelware, employeeMiddelware } from "../middlewares/authMiddleware";
import { createShift, deleteShift, updateShift } from "../controllers/shiftController";

const shiftRouter = Router();

shiftRouter.route("/employeeshift").get(employeeMiddelware)
shiftRouter.use(adminMiddelware);
shiftRouter.route("/create").post(createShift)
shiftRouter.route("/delete/:id").delete(deleteShift)
shiftRouter.route("/view").get()
shiftRouter.route("/update/:id").put(updateShift)