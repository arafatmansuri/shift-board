import { Router } from "express";
import { createCompany } from "../controllers/companyController";

const companyRouter = Router();

companyRouter.route("/create").post(createCompany);

export default companyRouter