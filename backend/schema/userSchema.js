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

export const Profile = mongoose.model("Profile", ProfileSchema);

export const User = mongoose.model("User", UserSchema);
