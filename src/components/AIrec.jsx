// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { GoogleGenerativeAI } from "@google/generative-ai";

// const StockRecommendation = () => {
//   const [recommendations, setRecommendations] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const ALPHA_VANTAGE_API_KEY = "QN6TOG2EBXV5DGMU";
//   const GOOGLE_AI_API_KEY = "AIzaSyDOky3a0Mpbe13I6Zo4t-RZ-pt4F8NbG5I"; // Replace with your Gemini API key

//   useEffect(() => {
//     const fetchStockRecommendations = async () => {
//       try {
//         // Fetch top gainers and losers
//         const { data } = await axios.get(
//           `https://www.alphavantage.co/query?function=TOP_GAINERS_LOSERS&apikey=QN6TOG2EBXV5DGMU`
//         );
//         console.log(data);

//         const topGainers = data?.top_gainers || [];
//         const topLosers = data?.top_losers || [];
//         const relevantStocks = [...topGainers, ...topLosers];

//         if (relevantStocks.length === 0) {
//           throw new Error("No stock data available.");
//         }

//         // Initialize Google Generative AI
//         const genAI = new GoogleGenerativeAI(GOOGLE_AI_API_KEY);
//         const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

//         // Format stock data as a string for Gemini AI
//         const stockSymbols = relevantStocks
//           .map((stock) => stock.ticker)
//           .join(", ");
//         const prompt = `Here are some stock symbols: ${stockSymbols}. Based on market trends, which 5 stocks would you recommend for investment and why? Provide only the stock symbols in a comma-separated format.`;

//         // Send stock data to Gemini AI
//         const result = await model.generateContent(prompt);
//         const geminiResponse = await result.response.text();

//         // Extract recommended stock symbols
//         const recommendedStocks = geminiResponse
//           .split(",")
//           .map((s) => s.trim());

//         if (recommendedStocks.length === 0) {
//           throw new Error("No recommendations received from AI.");
//         }

//         // Fetch detailed stock data for recommended stocks
//         const stockDataPromises = recommendedStocks.map((symbol) =>
//           axios.get(`https://www.alphavantage.co/query`, {
//             params: {
//               function: "TIME_SERIES_DAILY",
//               symbol: symbol,
//               apikey: ALPHA_VANTAGE_API_KEY,
//             },
//           })
//         );

//         const stockDataResponses = await Promise.all(stockDataPromises);
//         const stockData = stockDataResponses.map((response) => response.data);

//         setRecommendations(stockData);
//       } catch (err) {
//         setError("Failed to fetch stock data.");
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchStockRecommendations();
//   }, []);

//   console.log(recommendations);

//   if (loading) return <div>Loading...</div>;
//   if (error) return <div>{error}</div>;

//   return (
//     <div>
//       <h1>Top 5 Stock Recommendations</h1>
//       {/* <ul>
//         {recommendations.map((stock, index) => (
//           <li key={index}>
//             <h2>{stock["Meta Data"]["2. Symbol"]}</h2>
//             <p>
//               Latest Close Price:{" "}
//               {Object.values(stock["Time Series (Daily)"])[0]["4. close"]}
//             </p>
//           </li>
//         ))}
//       </ul> */}
//     </div>
//   );
// };

// export default StockRecommendation;
