import { Router } from "express";
import { login, me } from "../controllers/authController";
import {
  adminMiddelware,
  employeeMiddelware,
} from "../middlewares/authMiddleware";

const authRouter = Router();

authRouter.route("/login").post(login);

authRouter.route("/admin").get(adminMiddelware, me);
authRouter.route("/employee").get(employeeMiddelware, me);

export default authRouter;