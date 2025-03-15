import { Profile, Wallet } from "../schema/userSchema.js";
import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";

export const addStock = async (req, res) => {
  try {
    const { uid, quantity, symbol, buyPrice, purchaseDate } = req.body;

    let profile = await Profile.findOne({ uid });

    if (!profile) {
      profile = new Profile({
        uid,
        stocks: [],
        topStocks: [],
      });
    }

    profile.stocks.push({
      quantity,
      symbol,
      buyPrice,
      purchaseDate: purchaseDate || new Date(),
    });

    await profile.save();

    res.status(200).json({ message: "Stock added successfully", profile });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
};

export const updateWallet = async (req, res) => {
  try {
    const { uid, amount, type } = req.body;

    if (
      !uid ||
      typeof amount !== "number" ||
      !["credit", "debit"].includes(type)
    ) {
      return res.status(400).json({ message: "Invalid request data" });
    }

    let wallet = await Wallet.findOne({ uid });

    if (!wallet) {
      wallet = new Wallet({
        uid,
        balance: type === "credit" ? amount : 0,
        transactions: [{ amount, type }],
      });
    } else {
      wallet.balance = Number(wallet.balance);

      if (type === "credit") {
        wallet.balance += amount;
      } else if (type === "debit") {
        if (wallet.balance < amount) {
          return res.status(400).json({ message: "Insufficient balance" });
        }
        wallet.balance -= amount;
      }

      wallet.transactions.push({ amount, type });
    }

    await wallet.save();
    res.status(200).json({ message: "Wallet updated successfully", wallet });
  } catch (error) {
    console.error("Error updating wallet:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getWalletBalance = async (req, res) => {
  try {
    const { uid } = req.params;

    if (!uid) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const wallet = await Wallet.findOne({ uid });

    if (!wallet) {
      return res.status(404).json({ message: "Wallet not found" });
    }

    res.status(200).json({ balance: wallet.balance });
  } catch (error) {
    console.error("Error fetching wallet balance:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
