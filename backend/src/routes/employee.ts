import { Router } from "express";
import { adminMiddelware } from "../middlewares/authMiddleware";
import { createEmployee, deleteEmployee, getAllEmployee } from "../controllers/employeeController";

const employeeRouter = Router();

employeeRouter.use(adminMiddelware);
employeeRouter.route("/create/:companyId").post(createEmployee);
employeeRouter.route("/delete/:id").delete(deleteEmployee);
employeeRouter.route("/view/:companyId").get(getAllEmployee);
// employeeRouter.route("/update/:id").put(updateShift);

export default employeeRouter;
