/* eslint-disable no-undef */
import express from "express";
import dotenv from "dotenv";
import apiRoutes from "./routes/apiRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import stockRoutes from "./routes/stockRoute.js";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import jwt from "jsonwebtoken";
import cors from "cors";

dotenv.config();

const app = express();

// CORS Middleware
app.use(
  cors({
    origin: "https://codecrafters-gamma.vercel.app",
  })
);

// Middleware
app.use(bodyParser.json());
app.use(express.json());

const PORT = process.env.PORT || 9000;

// MongoDB Connection
mongoose
  .connect(process.env.MONGOURL)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// JWT Token Generator Function
const generateToken = (payload, expiresIn = "1h") => {
  try {
    return jwt.sign(payload, process.env.JWT_SECRET || "SECRET_KEY", {
      expiresIn,
    });
  } catch (error) {
    console.error("Error generating token:", error);
    return null;
  }
};

// Routes
app.use("/api", apiRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/stock", stockRoutes);

// JWT Route
app.get("/jwt", (req, res) => {
  const user = { id: "12345", email: "user@example.com", role: "admin" };
  const token = generateToken(user);

  if (!token) {
    return res.status(500).json({ error: "Failed to generate token" });
  }

  res.json({ token });
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
