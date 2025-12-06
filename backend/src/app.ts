import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import authRouter from "./routes/authRoutes";
import companyRouter from "./routes/companyRoutes";
import departmentRouter from "./routes/departmentRoutes";
import employeeRouter from "./routes/employee";
import shiftRouter from "./routes/shiftRoutes";
const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "https://shift-board-sigma.vercel.app",
];
app.use(express.json());
app.use(
  cors({
    origin: function (origin, callback) {
      if (allowedOrigins.indexOf(<string>origin) !== -1 || !origin) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // Allow cookies
  })
);
app.use(cookieParser());

app.get("/api/health-check", (req, res) => {
  res.json({ message: "server health is fine!" });
});

app.use("/api/auth", authRouter);
app.use("/api/shift", shiftRouter);
app.use("/api/employee", employeeRouter);
app.use("/api/department", departmentRouter);
app.use("/api/company", companyRouter);

export default app;
