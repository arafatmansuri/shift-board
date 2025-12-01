import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import authRouter from "./routes/authRoutes";
const app = express();

app.use(express.json());
app.use(cors());
app.use(cookieParser());

app.get("/api/health-check", (req, res) => {
  res.json({ message: "server health is fine!" });
});

app.use("/api/auth", authRouter);

export default app;
