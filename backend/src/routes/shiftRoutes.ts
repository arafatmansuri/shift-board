import { Router } from "express";
import { adminMiddelware, employeeMiddelware } from "../middlewares/authMiddleware";

const shiftRouter = Router();

shiftRouter.route("employeeshift").get(employeeMiddelware)
shiftRouter.use(adminMiddelware);
shiftRouter.route("/create").post()
shiftRouter.route("/delete").delete()
shiftRouter.route("/view").get()
shiftRouter.route("/update").put()