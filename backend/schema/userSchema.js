import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
});

const ProfileSchema = new mongoose.Schema({
  uid: {
    type: String,
    required: true,
    unique: true,
  },
  topStocks: {
    type: [String],
    default: [],
  },
  stocks: [
    {
      quantity: { type: Number, required: true },
      symbol: { type: String, required: true },
      buyPrice: { type: Number, required: true },
      purchaseDate: { type: Date, required: true, default: Date.now },
    },
  ],
  bonds: [
    {
      quantity: { type: Number, required: true },
      name: { type: String, required: true },
      price: { type: Number, required: true },
      purchaseDate: { type: Date, required: true, default: Date.now },
    },
  ],
});

const WalletSchema = new mongoose.Schema(
  {
    uid: {
      type: String,
      required: true,
      unique: true,
    },
    balance: {
      type: Number,
      default: 0,
    },
    transactions: [
      {
        amount: Number,
        type: { type: String, enum: ["credit", "debit"], required: true },
        timestamp: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

const InvestmentSchema = new mongoose.Schema({
  uid: { type: String, required: true },
  stocks: [
    {
      id: String,
      symbol: String,
      name: String,
      quantity: Number,
      price: Number,
      averageCost: Number,
      value: Number,
      profitLoss: Number,
      profitLossPercent: Number,
      allocation: Number,
    },
  ],
  totalPortfolioValue: { type: Number, required: true },
});

const mutualFundSchema = new mongoose.Schema({
  name: String,
  stocks: [
    {
      symbol: String,
      name: String,
      price: Number,
      allocation: Number,
    },
  ],
  totalAllocation: Number,
});

export const MutualFund = mongoose.model("MutualFund", mutualFundSchema);

export const Investment = mongoose.model("Investment", InvestmentSchema);

export const Wallet = mongoose.model("Wallet", WalletSchema);

export const Profile = mongoose.model("Profile", ProfileSchema);

export const User = mongoose.model("User", UserSchema);
