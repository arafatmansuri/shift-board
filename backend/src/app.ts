import cors from "cors";
import express from "express";
import cookieParser from "cookie-parser";
const app = express();

app.use(express.json());
app.use(cors());
app.use(cookieParser());

app.get("/api/health-check", (req, res) => {
  res.json({ message: "server health is fine!" });
});

export default app;
