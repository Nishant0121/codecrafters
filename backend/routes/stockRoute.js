import {
  addStock,
  getWalletBalance,
  updateWallet,
} from "../controllers/stockController.js";
import express from "express";

const router = express.Router();

router.post("/addStock", addStock);
router.post("/updateWallet", updateWallet);
router.get("/wallet/balance/:uid", getWalletBalance);

export default router;
