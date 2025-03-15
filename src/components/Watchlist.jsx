import React from "react";
import { Link } from "react-router-dom";
import { Briefcase } from "lucide-react";

const Watchlist = ({ stocks = [] }) => {
  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-semibold text-center mb-6">
        Stock Watchlist
      </h1>
      <div className="space-y-4">
        {stocks.map((stock) => {
          // Ensure values are defined, otherwise fallback to 0
          const open = stock.open ?? 0;
          const close = stock.close ?? 0;
          const change = open !== 0 ? ((close - open) / open) * 100 : 0;

          return (
            <div
              key={stock.symbol}
              className="flex justify-between items-center p-4 bg-gray-800 text-white rounded-md shadow-md hover:bg-gray-700 cursor-pointer"
            >
              {/* Symbol & Name */}
              <div className="flex items-center space-x-3">
                <Briefcase className="w-6 h-6 text-blue-400" />
                <div>
                  <span className="font-medium">{stock.symbol}</span>
                  {stock.name && (
                    <p className="text-xs text-gray-300">{stock.name}</p>
                  )}
                </div>
              </div>

              {/* Price & Change */}
              <div className="flex flex-col items-end">
                <span className="text-sm font-semibold">
                  ₹{close.toFixed(2)}
                </span>
                <span
                  className={`text-xs ${
                    change >= 0 ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {change >= 0 ? "+" : ""}
                  {change.toFixed(2)}%
                </span>
              </div>

              {/* View Details Link */}
              <Link
                to={`/stocks/${stock.symbol}`}
                className="text-blue-400 hover:underline"
              >
                View Details
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Watchlist;
