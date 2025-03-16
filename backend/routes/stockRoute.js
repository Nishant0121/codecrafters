import {
  addInvestment,
  addStock,
  createMutualFund,
  getInvestment,
  getMutualFunds,
  getProfile,
  getWalletBalance,
  updateWallet,
  removeStock,
  addBond,
  removeBond,
} from "../controllers/stockController.js";
import express from "express";

const router = express.Router();

router.post("/addStock", addStock);
router.post("/removeStock", removeStock);
router.post("/addBond", addBond);
router.post("/removeBond", removeBond);
router.post("/updateWallet", updateWallet);
router.post("/updateinvestment", addInvestment);
router.post("/addMF", createMutualFund);
router.get("/getProfile/:uid", getProfile);
router.get("/getMutualFund", getMutualFunds);
router.get("/getInvestment/:uid", getInvestment);
router.get("/wallet/balance/:uid", getWalletBalance);

export default router;
