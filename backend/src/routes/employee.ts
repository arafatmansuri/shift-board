import { Router } from "express";
import { adminMiddelware } from "../middlewares/authMiddleware";

const employeeRouter = Router();

employeeRouter.use(adminMiddelware);
employeeRouter.route("/create").post();
employeeRouter.route("/delete/:id").delete();
employeeRouter.route("/view").get();
// employeeRouter.route("/update/:id").put(updateShift);

export default employeeRouter;
