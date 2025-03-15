import { useState } from "react";
import { useNavigate } from "react-router-dom";

const StockNews = () => {
  const [searchSymbol, setSearchSymbol] = useState("");  // Search state
  const navigate = useNavigate();  // To programmatically navigate to another page

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
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-purple-900 via-blue-900 to-indigo-900 text-white">
      <div className="p-8 bg-black bg-opacity-70 rounded-lg shadow-xl w-full max-w-md">
        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="mb-6 flex items-center justify-center">
          <input
            type="text"
            value={searchSymbol}
            onChange={(e) => setSearchSymbol(e.target.value)}
            placeholder="Enter stock symbol (e.g., AAPL)"
            className="text-black placeholder-gray-500 p-3 rounded-lg w-2/3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200"
          />
          <button
            type="submit"
            className="bg-gradient-to-r from-purple-500 via-blue-500 to-indigo-500 text-white p-3 rounded-lg ml-3 hover:bg-gradient-to-l transition duration-300"
          >
            Search
          </button>
        </form>

        <h2 className="text-2xl font-semibold text-center mb-4">Search for Stock News</h2>
        <p className="text-center text-gray-400">Enter a stock symbol above to view the latest news.</p>
      </div>
    </div>
  );
};

export default StockNews;
