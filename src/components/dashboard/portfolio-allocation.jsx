import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Newspaper } from "lucide-react"; // Make sure this icon exists in lucide-react

const StockNews = () => {
  const [searchSymbol, setSearchSymbol] = useState("");
  const navigate = useNavigate();

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
    <div className=" flex items-center justify-center p-4 bg-gradient-to-br from-black to-gray-900 text-white">
      <div className="w-full max-w-xl p-10 bg-white/10 backdrop-blur-md rounded-3xl shadow-2xl border border-white/20">
        <div className="flex flex-col items-center mb-8">
          <Newspaper className="w-16 h-16 mb-4 text-indigo-500" />
          <h1 className="text-3xl font-bold text-center mb-2">Stay Informed (News)</h1>
          <p className="text-center text-gray-400">
            Discover the latest stock market news and insights. Enter a stock symbol below to get started.
          </p>
        </div>
        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="mb-8 flex gap-4">
          <input
            type="text"
            value={searchSymbol}
            onChange={(e) => setSearchSymbol(e.target.value)}
            placeholder="e.g., AAPL, TSLA"
            className="flex-grow px-4 py-3 bg-transparent border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 transition duration-200"
          />
          <button
            type="submit"
            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg text-white font-semibold hover:from-indigo-700 hover:to-purple-700 transition duration-300"
          >
            Search
          </button>
        </form>
        <div className="flex justify-center">
          <p className="text-sm text-gray-400">
            Trending: <span className="font-medium text-white">AAPL, TSLA, AMZN</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default StockNews;
