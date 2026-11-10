import { httpServerHandler } from "cloudflare:node";
import { env } from "cloudflare:workers";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import { createConnection } from "./db/cf/connection";
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
  "https://shiftboard.mohammedarafat.me",
];
// Middleware to parse JSON bodies
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
  }),
);
app.use(cookieParser());

app.use(async (req, res, next) => {
  if (!env.MONGODB_URI) {
    return res.status(500).json({
      error: "Configuration error",
      message:
        "MONGODB_URI is not configured. Create a .dev.vars file with your MongoDB connection string.",
    });
  }

  let connectionResult;
  try {
    connectionResult = await createConnection(env.MONGODB_URI);
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    return res.status(500).json({
      error: "Database connection failed",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }

  res.locals.connection = connectionResult.connection;

  let connectionClosed = false;
  const closeConnection = () => {
    if (connectionClosed) {
      return;
    }

    connectionClosed = true;
    void connectionResult.close().catch((error) => {
      console.error("Failed to close MongoDB connection:", error);
    });
  };

  // Express does not await the promise returned by next(). Close the
  // per-request connection only after the response has completed.
  res.once("finish", closeConnection);
  res.once("close", closeConnection);
  next();
});

app.get("/api/health-check", (req, res) => {
  res.json({
    message: "server health is fine!",
    id: process.pid,
  });
});

app.use("/api/auth", authRouter);
app.use("/api/shift", shiftRouter);
app.use("/api/employee", employeeRouter);
app.use("/api/department", departmentRouter);
app.use("/api/company", companyRouter);

app.listen(3000);
export default httpServerHandler({ port: 3000 });
