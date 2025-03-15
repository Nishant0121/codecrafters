/* eslint-disable no-undef */
import express from "express";
import dotenv from "dotenv";
import apiRoutes from "./routes/apiRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import stockRoutes from "./routes/stockRoute.js";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";
// Load environment variables
dotenv.config();

const app = express();

app.use(cors());

// OR set specific origins (recommended for security)
app.use(
  cors({
    origin: "http://localhost:5173", // Allow requests only from this origin
  })
);

app.use(bodyParser.json());

const PORT = process.env.PORT || 9000;

// MONGOURL= mongodb+srv://Nishant0121:nishant0121@ad.wmpdx.mongodb.net/?retryWrites=true&w=majority&appName=AD

mongoose
  .connect(process.env.MONGOURL)

  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// Middleware
app.use(express.json());

// Import routes
app.use("/api", apiRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/stock", stockRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
