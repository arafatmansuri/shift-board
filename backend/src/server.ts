import dotenv from "dotenv";
import app from "./app";
import { connectDB } from "./db";
dotenv.config();
const PORT = process.env.PORT || 3001;
connectDB()
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.log("server error: ", error);
  });
