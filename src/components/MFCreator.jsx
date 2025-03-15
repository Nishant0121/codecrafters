import React, { useState } from "react";
import axios from "axios";

// Expanded stock data with categories, more financial details, and performance
const stocks = [
  // Large Cap Stocks
  { 
    id: 1, 
    name: "Apple Inc.", 
    symbol: "AAPL", 
    price: 175.2, 
    marketCap: "2.8T", 
    peRatio: 28.7, 
    dividendYield: 0.006, 
    category: "Large Cap", 
    high52Week: 185.5, 
    low52Week: 125.3,
    volume: "74M"
  },
  { 
    id: 2, 
    name: "Microsoft Corp.", 
    symbol: "MSFT", 
    price: 320.5, 
    marketCap: "2.4T", 
    peRatio: 33.2, 
    dividendYield: 0.009, 
    category: "Large Cap", 
    high52Week: 340.0, 
    low52Week: 290.4,
    volume: "61M"
  },
  { 
    id: 3, 
    name: "Amazon.com Inc.", 
    symbol: "AMZN", 
    price: 138.3, 
    marketCap: "1.4T", 
    peRatio: 58.9, 
    dividendYield: 0, 
    category: "Large Cap", 
    high52Week: 150.0, 
    low52Week: 120.5,
    volume: "39M"
  },
  { 
    id: 4, 
    name: "Tesla Inc.", 
    symbol: "TSLA", 
    price: 252.7, 
    marketCap: "700B", 
    peRatio: 85.1, 
    dividendYield: 0, 
    category: "Large Cap", 
    high52Week: 300.0, 
    low52Week: 215.0,
    volume: "76M"
  },
  { 
    id: 5, 
    name: "Google (Alphabet) Inc.", 
    symbol: "GOOGL", 
    price: 143.9, 
    marketCap: "1.8T", 
    peRatio: 29.4, 
    dividendYield: 0, 
    category: "Large Cap", 
    high52Week: 160.0, 
    low52Week: 135.0,
    volume: "55M"
  },

  // Mid Cap Stocks
  { 
    id: 6, 
    name: "Zoom Video Communications", 
    symbol: "ZM", 
    price: 318.4, 
    marketCap: "101B", 
    peRatio: 36.9, 
    dividendYield: 0, 
    category: "Mid Cap", 
    high52Week: 389.0, 
    low52Week: 255.0,
    volume: "6M"
  },
  { 
    id: 7, 
    name: "Snap Inc.", 
    symbol: "SNAP", 
    price: 15.3, 
    marketCap: "24B", 
    peRatio: -25.1, 
    dividendYield: 0, 
    category: "Mid Cap", 
    high52Week: 25.0, 
    low52Week: 10.0,
    volume: "30M"
  },
  { 
    id: 8, 
    name: "Etsy Inc.", 
    symbol: "ETSY", 
    price: 133.5, 
    marketCap: "17B", 
    peRatio: 62.1, 
    dividendYield: 0, 
    category: "Mid Cap", 
    high52Week: 180.0, 
    low52Week: 120.0,
    volume: "5M"
  },

  // Small Cap Stocks
  { 
    id: 9, 
    name: "Nano Dimension", 
    symbol: "NNDM", 
    price: 5.6, 
    marketCap: "1.2B", 
    peRatio: -5.1, 
    dividendYield: 0, 
    category: "Small Cap", 
    high52Week: 8.9, 
    low52Week: 4.0,
    volume: "10M"
  },
  { 
    id: 10, 
    name: "Sundial Growers", 
    symbol: "SNDL", 
    price: 1.2, 
    marketCap: "2B", 
    peRatio: -2.3, 
    dividendYield: 0, 
    category: "Small Cap", 
    high52Week: 2.3, 
    low52Week: 0.8,
    volume: "35M"
  },
  { 
    id: 11, 
    name: "Clover Health Investments", 
    symbol: "CLOV", 
    price: 4.5, 
    marketCap: "4.5B", 
    peRatio: -3.2, 
    dividendYield: 0, 
    category: "Small Cap", 
    high52Week: 11.0, 
    low52Week: 3.2,
    volume: "25M"
  }
];

const MutualFundCreator = () => {
  const [selectedStocks, setSelectedStocks] = useState({});
  const [allocations, setAllocations] = useState({});
  const [fundName, setFundName] = useState("");
  const [message, setMessage] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Large Cap");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleStockSelect = (stock) => {
    setSelectedStocks((prev) => {
      const updated = { ...prev };
      if (updated[stock.id]) {
        delete updated[stock.id];
      } else {
        updated[stock.id] = stock;
      }
      return updated;
    });
  };

  const handleAllocationChange = (id, value) => {
    setAllocations((prev) => ({ ...prev, [id]: Number(value) }));
  };

  const totalAllocation = Object.values(allocations).reduce(
    (sum, val) => sum + val,
    0
  );
  const isAllocationValid = totalAllocation === 100;

  const handleSubmit = async () => {
    if (!isAllocationValid) {
      setMessage("Total allocation must be 100%");
      return;
    }

    const mutualFund = {
      name: fundName,
      stocks: Object.keys(selectedStocks).map((id) => ({
        ...selectedStocks[id],
        allocation: allocations[id] || 0,
      })),
    };

    setIsSubmitting(true);

    try {
      const response = await axios.post(
        "http://localhost:3000/api/stock/addMF",
        mutualFund
      );
      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response?.data?.error || "Error creating mutual fund");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredStocks = stocks.filter(
    (stock) => stock.category === selectedCategory
  );

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center py-10 px-6">
      <div className="mt-12 w-full max-w-3xl p-8 bg-black border border-gray-700 rounded-xl shadow-lg">
        <h2 className="text-3xl font-semibold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">
          Create Your Mutual Fund
        </h2>

        <input
          type="text"
          placeholder="Fund Name"
          value={fundName}
          onChange={(e) => setFundName(e.target.value)}
          className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-md mb-6 text-gray-300 placeholder-gray-500 focus:ring-2 focus:ring-blue-500"
        />

        {/* Category Selector */}
        <div className="mb-6">
          <label className="block text-lg font-semibold">Select Category:</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-md text-gray-300 focus:ring-2 focus:ring-blue-500"
          >
            <option value="Large Cap">Large Cap</option>
            <option value="Mid Cap">Mid Cap</option>
            <option value="Small Cap">Small Cap</option>
          </select>
        </div>

        {/* Stock Selection */}
        <div className="mb-6 space-y-4 max-h-[300px] overflow-y-auto">
          {filteredStocks.map((stock) => (
            <div
              key={stock.id}
              className="flex items-center space-x-3 hover:bg-gray-700 rounded-lg p-2"
            >
              <input
                type="checkbox"
                checked={!!selectedStocks[stock.id]}
                onChange={() => handleStockSelect(stock)}
                className="w-5 h-5"
              />
              <div className="text-sm text-gray-300">
                <span className="font-semibold">{stock.symbol}</span> - {stock.name} (${stock.price})<br />
                <span className="text-xs text-gray-400">Market Cap: {stock.marketCap} | P/E: {stock.peRatio} | Dividend Yield: {stock.dividendYield}%</span>
                <br />
                <span className="text-xs text-gray-400">52-Week High: ${stock.high52Week} | Low: ${stock.low52Week}</span>
                <br />
                <span className="text-xs text-gray-400">Volume: {stock.volume}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Stock Allocations */}
        <div className="mb-6">
          {Object.keys(selectedStocks).map((id) => (
            <div key={id} className="mb-4">
              <label className="block font-semibold text-gray-300">
                {selectedStocks[id].symbol} Allocation: {allocations[id] || 0}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={allocations[id] || 0}
                onChange={(e) => handleAllocationChange(id, e.target.value)}
                className="w-full bg-gray-700 rounded-md"
              />
            </div>
          ))}
        </div>

        {/* Total Allocation */}
        <p
          className={`mt-2 font-semibold ${
            isAllocationValid ? "text-green-500" : "text-red-500"
          }`}
        >
          Total Allocation: {totalAllocation}%
        </p>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          className={`w-full mt-6 px-4 py-2 text-white font-semibold rounded-md ${
            isAllocationValid
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-gray-500 cursor-not-allowed"
          }`}
          disabled={!isAllocationValid || isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Create Mutual Fund"}
        </button>

        {/* Message */}
        {message && <p className="mt-4 text-center text-blue-400">{message}</p>}
      </div>
    </div>
  );
};

export default MutualFundCreator;
