import { Router } from "express";
import { adminMiddelware } from "../middlewares/authMiddleware";
import { createDepartment, deleteDepartment, getAllDepartment } from "../controllers/departmentController";

const departmentRouter = Router();

departmentRouter.use(adminMiddelware);
departmentRouter.route("/create/:companyId").post(createDepartment);
departmentRouter.route("/delete/:id").delete(deleteDepartment);
departmentRouter.route("/view/:companyId").get(getAllDepartment);
// departmentRouter.route("/update/:id").put(updateShift);

export default departmentRouter;
