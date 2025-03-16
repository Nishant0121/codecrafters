import {
  Investment,
  MutualFund,
  Profile,
  Wallet,
} from "../schema/userSchema.js";
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

export const addBond = async (req, res) => {
  try {
    const { uid, quantity, price, name } = req.body;
    console.log("Request body:", req.body);


    let profile = await Profile.findOne({ uid });

    if (!profile) {
      profile = new Profile({
        uid,
        bonds: [],
        topBonds: [],
      });
    }

    profile.bonds.push({
      quantity,
      name,
      price,
      purchaseDate: new Date(),
    });

    await profile.save();



    res.status(200).json({ message: "Bonds added successfully", profile });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
};

export const removeBond = async (req, res) => {
  try {
    const { uid, quantity, name } = req.body;

    let profile = await Profile.findOne({ uid });

    if (!profile) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find stock index in the profile's stock array
    const stockIndex = profile.bonds.findIndex(
      (bond) => bond.name === name
    );

    if (stockIndex === -1) {
      return res.status(404).json({ message: "Stock not found in profile" });
    }

    // Reduce quantity or remove stock completely
    if (profile.bonds[stockIndex].quantity > quantity) {
      profile.bonds[stockIndex].quantity -= quantity;
    } else {
      profile.bonds.splice(stockIndex, 1);
    }

    await profile.save();

    res.status(200).json({ message: "Stock removed successfully", profile });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
};


export const removeStock = async (req, res) => {
  try {
    const { uid, quantity, symbol } = req.body;

    let profile = await Profile.findOne({ uid });

    if (!profile) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find stock index in the profile's stock array
    const stockIndex = profile.stocks.findIndex(
      (stock) => stock.symbol === symbol
    );

    if (stockIndex === -1) {
      return res.status(404).json({ message: "Stock not found in profile" });
    }

    // Reduce quantity or remove stock completely
    if (profile.stocks[stockIndex].quantity > quantity) {
      profile.stocks[stockIndex].quantity -= quantity;
    } else {
      profile.stocks.splice(stockIndex, 1);
    }

    await profile.save();

    res.status(200).json({ message: "Stock removed successfully", profile });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
};

export const getProfile = async (req, res) => {
  try {
    const { uid } = req.params; // Get UID from request params

    const profile = await Profile.findOne({ uid });

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.status(200).json({ profile });
  } catch (error) {
    console.error("Error fetching profile:", error);
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
    const { uid } = req.params; // Extracting user ID from request parameters

    if (!uid) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const wallet = await Wallet.findOne({ uid });

    if (!wallet) {
      return res.status(404).json({ message: "Wallet not found" });
    }

    // Return both balance and transaction history
    res.status(200).json({
      balance: wallet.balance,
      transactions: wallet.transactions, // Full transaction history
    });
  } catch (error) {
    console.error("Error fetching wallet balance:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const addInvestment = async (req, res) => {
  try {
    const { uid, stocks } = req.body;

    if (!uid || !stocks || !Array.isArray(stocks)) {
      return res.status(400).json({ message: "Invalid data format" });
    }

    // Calculate Total Portfolio Value as the sum of profitLoss
    const totalPortfolioValue = stocks.reduce(
      (sum, stock) => sum + (stock.profitLoss || 0),
      0
    );

    let investment = await Investment.findOne({ uid });

    if (investment) {
      investment.stocks = stocks;
      investment.totalPortfolioValue = totalPortfolioValue;
      await investment.save();
      return res.status(200).json({
        message: "Investment data updated successfully",
        investment,
      });
    } else {
      investment = new Investment({
        uid,
        stocks,
        totalPortfolioValue,
      });

      await investment.save();
      return res.status(201).json({
        message: "Investment data saved successfully",
        investment,
      });
    }
  } catch (error) {
    console.error("Error saving/updating investment:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getInvestment = async (req, res) => {
  try {
    const { uid } = req.params;
    const investments = await Investment.findOne({ uid });

    if (!investments) {
      return res.status(404).json({ message: "No investment data found" });
    }

    res.json(investments);
  } catch (error) {
    console.error("Error fetching investments:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const createMutualFund = async (req, res) => {
  try {
    const { name, stocks } = req.body;
    const totalAllocation = stocks.reduce(
      (sum, stock) => sum + stock.allocation,
      0
    );

    if (totalAllocation !== 100) {
      return res.status(400).json({ error: "Total allocation must be 100%" });
    }

    const newFund = new MutualFund({ name, stocks, totalAllocation });
    await newFund.save();
    res
      .status(201)
      .json({ message: "Mutual Fund Created", mutualFund: newFund });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getMutualFunds = async (req, res) => {
  try {
    const funds = await MutualFund.find();
    res.json(funds);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
