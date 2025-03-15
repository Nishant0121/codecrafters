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
    type: [String], // Array of stock symbols or names
    default: [],
  },
  stocks: [
    {
      quantity: { type: Number, required: true },
      symbol: { type: String, required: true }, // Stock symbol or name
      buyPrice: { type: Number, required: true }, // Price at which the stock was bought
      purchaseDate: { type: Date, required: true, default: Date.now }, // Date of purchase
    },
  ],
});

const WalletSchema = new mongoose.Schema(
  {
    uid: {
      type: String,
      required: true,
      unique: true, // Each user can have only one wallet
    },
    balance: {
      type: Number,
      default: 0, // Default balance is 0
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

export const Wallet = mongoose.model("Wallet", WalletSchema);

export const Profile = mongoose.model("Profile", ProfileSchema);

export const User = mongoose.model("User", UserSchema);
