import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import cors from "cors";
import { GoogleGenerativeAI } from "@google/generative-ai";
import "dotenv/config";

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

const API_KEY = process.env.GOOGLE_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
  systemInstruction: "Give one line answers to Finance related questions",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

// Dictionary of common financial terms and their explanations
const financeTerms = {
  "stock": "A stock represents ownership in a company and a claim on part of its assets and earnings.",
  "bond": "A bond is a loan made by an investor to a borrower, typically a corporation or government.",
  "dividend": "A dividend is a payment made by a corporation to its shareholders from its profits.",
  "capital gain": "A capital gain is the profit from the sale of an asset.",
  "liquidity": "Liquidity is the ease of converting an asset to cash.",
  "mutual fund": "A mutual fund pools money from many investors to invest in stocks, bonds, or other assets.",
  "ETF": "An ETF (Exchange-Traded Fund) is a fund that trades on stock exchanges, much like a stock.",
  "interest rate": "An interest rate is the cost of borrowing money, expressed as a percentage of the principal.",
  "inflation": "Inflation is the rate at which the general level of prices for goods and services rises.",
  "recession": "A recession is a significant decline in economic activity across the economy lasting for months or years.",
};

// POST endpoint to handle user input and return appropriate responses
app.post("/chat", async (req, res) => {
  try {
    const { userInput } = req.body;
    if (!userInput) {
      return res.status(400).json({ error: "User input is required" });
    }

    // Check if the user input matches any predefined financial term
    const term = userInput.toLowerCase().trim();
    if (financeTerms[term]) {
      return res.json({ message: `${term.toUpperCase()}: ${financeTerms[term]}` });
    }

    // Use Google Generative AI (Gemini) if it's not a predefined term
    const chatSession = model.startChat({
      generationConfig,
      history: [
        {
          role: "user",
          parts: [{ text: userInput }],
        },
      ],
    });

    const result = await chatSession.sendMessage(userInput);
    const responseMessage = result.response.text();

    // Send the generated response back to the client
    res.json({ message: responseMessage });
    
  } catch (error) {
    console.error("❌ API Error:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to process the request." });
  }
});

// Start the server
app.listen(port, () =>
  console.log(`✅ Server running at http://localhost:${port}`)
);
