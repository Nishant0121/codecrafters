import { addStock } from "../controllers/stockController.js";
import express from "express";

const router = express.Router();

router.post("/addStock", addStock);

export default router;
