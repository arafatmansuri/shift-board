import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import authRouter from "./routes/authRoutes";
import shiftRouter from "./routes/shiftRoutes";
import employeeRouter from "./routes/employee";
import departmentRouter from "./routes/departmentRoutes";
const app = express();

app.use(express.json());
app.use(cors());
app.use(cookieParser());

app.get("/api/health-check", (req, res) => {
  res.json({ message: "server health is fine!" });
});

app.use("/api/auth", authRouter);
app.use("/api/shift", shiftRouter);
app.use("/api/employee",employeeRouter);
app.use("/api/department",departmentRouter);

export default app;
