import { Router } from "express";
import { login, logout, me, refreshAccessToken } from "../controllers/authController";
import {
  adminMiddelware,
  employeeMiddelware,
} from "../middlewares/authMiddleware";

const authRouter = Router();

authRouter.route("/login").post(login);

authRouter.route("/admin").get(adminMiddelware, me);
authRouter.route("/employee").get(employeeMiddelware, me);
authRouter.route("/refreshaccesstoken").post(refreshAccessToken);
authRouter.route("/logout").post(logout);
export default authRouter;