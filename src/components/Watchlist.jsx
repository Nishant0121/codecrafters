import React, { useContext, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Briefcase } from "lucide-react";
import { gsap } from "gsap";
import axios from "axios";
import { AppContext } from "@/context/appContext";

const Watchlist = ({ stocks = [], uid }) => {
  const watchlistRef = useRef(null);
  const [expandedStock, setExpandedStock] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const { loginUser } = useContext(AppContext);

  useEffect(() => {
    if (watchlistRef.current) {
      gsap.fromTo(
        watchlistRef.current.children,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.4, ease: "power3.out", stagger: 0.1 }
      );
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleToggleDropdown = (symbol) => {
    setExpandedStock(expandedStock === symbol ? null : symbol);
    setQuantity(1); // Reset quantity on toggle
  };

  const handleBuyStock = async (stock) => {
    if (quantity <= 0) return alert("Quantity must be greater than 0");

    try {
      const response = await axios.post(
        "http://localhost:3000/api/stock/addStock",
        {
          uid: loginUser.uid,
          quantity,
          symbol: stock.symbol,
          buyPrice: stock.close,
          purchaseDate: new Date(),
        }
      );

      alert(response.data.message);
    } catch (error) {
      console.error("Error buying stock:", error);
      alert("Failed to buy stock.");
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 mt-12">
      <h1 className="text-3xl font-bold text-center text-white mb-8 tracking-wide">
        Your Stock Watchlist
      </h1>
      <div className="space-y-5" ref={watchlistRef}>
        {stocks.map((stock) => {
          const open = stock.open ?? 0;
          const close = stock.close ?? 0;
          const change = open !== 0 ? ((close - open) / open) * 100 : 0;

          return (
            <div
              key={stock.symbol}
              className="p-5 rounded-xl bg-white/10 backdrop-blur-md shadow-lg transition-all duration-300 hover:shadow-2xl hover:scale-[1.02]"
            >
              {/* Stock Info Row */}
              <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() => handleToggleDropdown(stock.symbol)}
              >
                {/* Symbol & Name */}
                <div className="flex items-center space-x-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/20 text-blue-300">
                    <Briefcase className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-lg font-medium text-white">
                      {stock.symbol}
                    </span>
                    {stock.name && (
                      <p className="text-xs text-gray-400">{stock.name}</p>
                    )}
                  </div>
                </div>

                {/* Price & Change */}
                <div className="flex flex-row gap-9 items-end">
                  <div className="flex flex-col items-end">
                    <span className="text-lg font-semibold text-white">
                      ₹{close}
                    </span>
                    <span
                      className={`text-sm font-medium ${
                        change >= 0 ? "text-green-400" : "text-red-400"
                      }`}
                    >
                      {change >= 0 ? "+" : ""}
                      {change.toFixed(2)}%
                    </span>
                  </div>

                  {/* View Details Link */}
                  <Link
                    to={`/watchlist/${stock.symbol}`}
                    className="text-blue-400 text-sm font-medium hover:underline transition-all"
                    onClick={(e) => e.stopPropagation()} // Prevent dropdown toggle on link click
                  >
                    View Details →
                  </Link>
                </div>
              </div>

              {/* Dropdown Content */}
              {expandedStock === stock.symbol && (
                <div className="mt-4 p-4 bg-gray-800 rounded-lg">
                  <div className="flex items-center gap-3">
                    <label className="text-white text-sm">Quantity:</label>
                    <input
                      type="number"
                      value={quantity}
                      min="1"
                      onChange={(e) => setQuantity(Number(e.target.value))}
                      className="w-16 p-1 text-black rounded-md"
                    />
                  </div>
                  <div className="flex justify-between mt-4">
                    <button
                      onClick={() => handleBuyStock(stock)}
                      className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                    >
                      Buy
                    </button>
                    <button className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition">
                      Sell
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Watchlist;
