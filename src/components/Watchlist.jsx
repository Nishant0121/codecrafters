// src/Watchlist.js
import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase } from 'lucide-react';

const Watchlist = ({ stocks = [] }) => {
  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-semibold text-center mb-6">Stock Watchlist</h1>
      <div className="space-y-4">
        {stocks.map((stock) => (
          <div
            key={stock.id}
            className="flex justify-between items-center p-4 bg-gray-800 text-white rounded-md shadow-md hover:bg-gray-700 cursor-pointer"
          >
            <div className="flex items-center space-x-3">
              <Briefcase className="w-6 h-6 text-blue-400" />
              <span className="font-medium">{stock.symbol}</span>
            </div>
            <div className="flex items-center">
              <span className="text-sm">{stock.price}</span>
              <span className={`ml-2 text-xs ${stock.change > 0 ? 'text-green-400' : 'text-red-400'}`}>
                {stock.change > 0 ? `+${stock.change}%` : `${stock.change}%`}
              </span>
            </div>
            <Link to={`/watchlist/${stock.symbol}`} className="text-blue-400 hover:underline">View Details</Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Watchlist;
