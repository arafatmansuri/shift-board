import { Router } from "express";
import { createCompany, createCompanyOTPVerification, createCompanySendOTP } from "../controllers/companyController";

const companyRouter = Router();

companyRouter.route("/create").post(createCompany);
companyRouter.route("/register").post(createCompanySendOTP);
companyRouter.route("/register/verify").post(createCompanyOTPVerification);

export default companyRouter