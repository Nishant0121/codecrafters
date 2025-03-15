import React, { useState } from "react";
import axios from "axios";

// Dummy stock data
const stocks = [
  { id: 1, name: "Apple Inc.", symbol: "AAPL", price: 175.2 },
  { id: 2, name: "Microsoft Corp.", symbol: "MSFT", price: 320.5 },
  { id: 3, name: "Amazon.com Inc.", symbol: "AMZN", price: 138.3 },
  { id: 4, name: "Tesla Inc.", symbol: "TSLA", price: 252.7 },
  { id: 5, name: "Google (Alphabet) Inc.", symbol: "GOOGL", price: 143.9 },
];

const MutualFundCreator = () => {
  const [selectedStocks, setSelectedStocks] = useState({});
  const [allocations, setAllocations] = useState({});
  const [fundName, setFundName] = useState("");
  const [message, setMessage] = useState("");

  // Toggle stock selection
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

  // Handle allocation change
  const handleAllocationChange = (id, value) => {
    setAllocations((prev) => ({ ...prev, [id]: Number(value) }));
  };

  // Calculate total allocation
  const totalAllocation = Object.values(allocations).reduce(
    (sum, val) => sum + val,
    0
  );
  const isAllocationValid = totalAllocation === 100;

  // Submit Mutual Fund
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

    try {
      const response = await axios.post(
        "http://localhost:3000/api/stock/addMF",
        mutualFund
      );
      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response?.data?.error || "Error creating mutual fund");
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 border border-gray-300 rounded-lg shadow-lg bg-white">
      <h2 className="text-2xl font-bold mb-4">Mutual Fund Creator</h2>

      <input
        type="text"
        placeholder="Fund Name"
        value={fundName}
        onChange={(e) => setFundName(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-md mb-4"
      />

      {/* Stock Selection */}
      <div className="mb-4">
        {stocks.map((stock) => (
          <div key={stock.id} className="flex items-center space-x-2 mb-2">
            <input
              type="checkbox"
              checked={!!selectedStocks[stock.id]}
              onChange={() => handleStockSelect(stock)}
              className="w-4 h-4"
            />
            <label className="text-gray-700">
              {stock.symbol} - {stock.name} (${stock.price})
            </label>
          </div>
        ))}
      </div>

      {/* Stock Allocations */}
      {Object.keys(selectedStocks).map((id) => (
        <div key={id} className="mb-4">
          <label className="block font-semibold text-gray-700">
            {selectedStocks[id].symbol} Allocation: {allocations[id] || 0}%
          </label>
          <input
            type="range"
            min="0"
            max="100"
            step="5"
            value={allocations[id] || 0}
            onChange={(e) => handleAllocationChange(id, e.target.value)}
            className="w-full"
          />
        </div>
      ))}

      {/* Total Allocation */}
      <p
        className={`mt-2 font-semibold ${
          isAllocationValid ? "text-green-600" : "text-red-600"
        }`}
      >
        Total Allocation: {totalAllocation}%
      </p>

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        className={`w-full mt-4 px-4 py-2 text-white font-semibold rounded-md ${
          isAllocationValid
            ? "bg-blue-600 hover:bg-blue-700"
            : "bg-gray-400 cursor-not-allowed"
        }`}
        disabled={!isAllocationValid}
      >
        Create Mutual Fund
      </button>

      {/* Message */}
      {message && <p className="mt-4 text-blue-600">{message}</p>}
    </div>
  );
};

export default MutualFundCreator;
