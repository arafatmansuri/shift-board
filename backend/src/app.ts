import cors from "cors";
import express from "express";
const app = express();

app.use(express.json());
app.use(cors());

app.get("/api/health-check", (req, res) => {
  res.json({ message: "server health is fine!" });
});

export default app;
