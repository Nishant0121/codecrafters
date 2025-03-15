import { Profile } from "../model/userSchema.js";
import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

export const addStock = async (req, res) => {
  try {
    const { uid, quantity, symbol, buyPrice, purchaseDate } = req.body;

    // Find the user profile or create a new one if it doesn't exist
    let profile = await Profile.findOne({ uid });

    if (!profile) {
      profile = new Profile({
        uid,
        stocks: [],
        topStocks: [], // Assuming topStocks is also part of the schema
      });
    }

    // Add the new stock to the stocks array
    profile.stocks.push({
      quantity,
      symbol,
      buyPrice,
      purchaseDate: purchaseDate || new Date(), // Default to current date if not provided
    });

    // Save the profile (new or updated)
    await profile.save();

    res.status(200).json({ message: "Stock added successfully", profile });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
};

// export const recommendStocks = async (req, res) => {
