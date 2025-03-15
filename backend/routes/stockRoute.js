import {
  addInvestment,
  addStock,
  getInvestment,
  getProfile,
  getWalletBalance,
  updateWallet,
} from "../controllers/stockController.js";
import express from "express";

const router = express.Router();

router.post("/addStock", addStock);
router.post("/updateWallet", updateWallet);
router.post("/updateinvestment", addInvestment);
router.get("/getProfile/:uid", getProfile);
router.get("/getInvestment/:uid", getInvestment);
router.get("/wallet/balance/:uid", getWalletBalance);

export default router;
