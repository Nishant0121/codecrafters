/* eslint-disable no-undef */
import express from "express";
import dotenv from "dotenv";
import apiRoutes from "./routes/apiRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import stockRoutes from "./routes/stockRoute.js";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";
dotenv.config();

const app = express();

app.use(cors());

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.use(bodyParser.json());

const PORT = process.env.PORT || 9000;

// MONGOURL= mongodb+srv://Nishant0121:nishant0121@ad.wmpdx.mongodb.net/?retryWrites=true&w=majority&appName=AD

mongoose
  .connect(
    process.env.MONGOURL ||
      "mongodb+srv://Nishant0121:nishant0121@ad.wmpdx.mongodb.net/?retryWrites=true&w=majority&appName=AD"
  )

  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

app.use(express.json());

const generateToken = (payload, expiresIn = "1h") => {
  try {
    return jwt.sign(payload, SECRET_KEY, { expiresIn });
  } catch (error) {
    console.error("Error generating token:", error);
    return null;
  }
};
const user = { id: "12345", email: "user@example.com", role: "admin" };
app.get("/jwt", generateToken(user));

app.use("/api", apiRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/stock", stockRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
