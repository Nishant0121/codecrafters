import { useState } from "react";
import { useNavigate } from "react-router-dom";

const StockNews = () => {
  const [searchSymbol, setSearchSymbol] = useState(""); // Search state
  const navigate = useNavigate(); // To programmatically navigate to another page

  // Handle search form submit
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchSymbol.trim()) {
      // Navigate to the stock news route with the entered symbol
      navigate(`/news-results/${searchSymbol.toUpperCase()}`);
      setSearchSymbol(""); // Clear search input after submitting
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-black to-gray-900 text-white">
      <div className="w-full max-w-lg p-8 bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20">
        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="mb-6 flex gap-3">
          <input
            type="text"
            value={searchSymbol}
            onChange={(e) => setSearchSymbol(e.target.value)}
            placeholder="Enter stock symbol (e.g., AAPL)"
            className="flex-grow px-4 py-3 bg-transparent border border-white/20 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 transition duration-200"
          />
          <button
            type="submit"
            className="px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-md text-white font-semibold hover:from-indigo-700 hover:to-purple-700 transition duration-300"
          >
            Search
          </button>
        </form>

        <h2 className="text-2xl font-semibold text-center mb-4">Search for Stock News</h2>
        <p className="text-center text-gray-400">
          Enter a stock symbol above to view the latest news.
        </p>
      </div>
    </div>
  );
};

export default StockNews;