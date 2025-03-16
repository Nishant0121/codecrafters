import React, { useContext, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Briefcase } from "lucide-react";
import { gsap } from "gsap";
import axios from "axios";
import { AppContext } from "@/context/appContext";
import WalletPreview from "./wallet-preview";

const Watchlist = ({ stocks = [], uid, bonds = [] }) => {
  const watchlistRef = useRef(null);
  const [expandedStock, setExpandedStock] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [expandedBond, setExpandedBond] = useState(null);
  const [bondQuantity, setBondQuantity] = useState(1);
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
  const handleBondDropdown = (id) => {
    setExpandedBond(expandedBond === id ? null : id);
    setBondQuantity(1); // Reset quantity on toggle
  };
  const handleBuyStock = async (quantity, stock) => {
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
      const response2 = await axios.post(
        "http://localhost:3000/api/stock/updateWallet",
        {
          uid: loginUser.uid,
          amount: Number(stock.close * quantity),
          type: "debit",
        }
      );
      console.log(response2.data.message);

      alert(response.data.message);
    } catch (error) {
      console.error("Error buying stock:", error);
      alert("Failed to buy stock.");
    }
  };
  const handleBuyBond = async (quantity, bond) => {
    if (quantity <= 0) return alert("Quantity must be greater than 0");
    try {
      const response = await axios.post(
        "http://localhost:3000/api/stock/addBond",
        {
          uid: loginUser.uid,
          quantity,
          name: bond.name,
          price: Number(bond.price),
          purchaseDate: new Date(),
        }
      );
      const response2 = await axios.post(
        "http://localhost:3000/api/stock/updateWallet",
        {
          uid: loginUser.uid,
          amount: Number(bond.price * quantity),
          type: "debit",
        }
      );
      console.log(response2.data.message);

      alert(response.data.message);
    } catch (error) {
      console.error("Error buying Bond:", error);
      alert("Failed to buy Bond.");
    }
  };
  const handleSellStock = async (quantity, stock) => {
    console.log("Hello");
    if (quantity <= 0) return alert("Quantity must be greater than 0");
    try {
      const response = await axios.post(
        "http://localhost:3000/api/stock/removeStock",
        {
          uid: loginUser.uid,
          quantity,
          symbol: stock.symbol,
        }
      );
      const response2 = await axios.post(
        "http://localhost:3000/api/stock/updateWallet",
        {
          uid: loginUser.uid,
          amount: Number(stock.close * quantity),
          type: "credit",
          }
        );
      console.log(response2.data.message);

      alert(response.data.message);
    } catch (error) {
      console.error("Error buying stock:", error);
      alert("Failed to buy stock.");
    }
  };

  const handleSellBond = async (quantity, bond) => {
    if (quantity <= 0) return alert("Quantity must be greater than 0");
    try {
      const response = await axios.post(
        "http://localhost:3000/api/stock/removeBond",
        {
          uid: loginUser.uid,
          quantity,
          price: bond.price,
          name: bond.name,
        }
      );
      const response2 = await axios.post(
        "http://localhost:3000/api/stock/updateWallet",
        {
          uid: loginUser.uid,
          amount: Number(bond.price * quantity),
          type: "credit",
        }
      );
      console.log(response2.data.message);

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
          const quantityOwned = stock.quantityOwned ?? 0;
          const portfolioValue = quantityOwned * close;

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
                    {quantityOwned > 0 && (
                      <div className="mt-1 flex items-center">
                        <span className="text-xs text-gray-300 font-medium">
                          You own:{" "}
                          <span className="text-blue-300">{quantityOwned}</span>{" "}
                          shares
                        </span>
                        <span className="mx-2 text-gray-500">•</span>
                        <span className="text-xs text-gray-300 font-medium">
                          Value:{" "}
                          <span className="text-blue-300">
                            ₹
                            {portfolioValue.toLocaleString(undefined, {
                              maximumFractionDigits: 2,
                            })}
                          </span>
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Price & Change */}
                <div className="flex flex-row gap-6 items-end">
                  <div className="flex flex-col items-end">
                    <span className="text-lg font-semibold text-white">
                      $
                      {close.toLocaleString(undefined, {
                        maximumFractionDigits: 2,
                      })}
                    </span>
                    <span
                      className={`text-sm font-medium flex items-center ${
                        change >= 0 ? "text-green-400" : "text-red-400"
                      }`}
                    >
                      {change >= 0 ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-3 w-3 mr-1"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-3 w-3 mr-1"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                      {Math.abs(change).toFixed(2)}%
                    </span>
                  </div>

                  {/* View Details Link */}
                  <Link
                    to={`/watchlist/${stock.symbol}`}
                    className="flex items-center text-blue-400 text-sm font-medium hover:underline transition-all bg-blue-500/10 px-3 py-1 rounded-full"
                    onClick={(e) => e.stopPropagation()} // Prevent dropdown toggle on link click
                  >
                    View Details
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 ml-1"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </Link>
                </div>
              </div>

              {/* Dropdown Content */}
              {expandedStock === stock.symbol && (
                <div className="mt-4 p-4 bg-gray-800/80 backdrop-blur-sm rounded-lg border border-gray-700">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <label className="text-white text-sm">Quantity:</label>
                      <div className="flex items-center">
                        <button
                          onClick={() =>
                            quantity > 1 && setQuantity(quantity - 1)
                          }
                          className="cursor-pointer bg-gray-700 text-white px-2 py-1 rounded-l-md hover:bg-gray-600"
                        >
                          -
                        </button>
                        <input
                          value={quantity}
                          min="1"
                          onChange={(e) => setQuantity(Number(e.target.value))}
                          className="w-16 p-1 text-white bg-gray-700 text-center border-x border-gray-600 focus:outline-none"
                        />
                        <button
                          onClick={() => setQuantity(quantity + 1)}
                          className="cursor-pointer bg-gray-700 text-white px-2 py-1 rounded-r-md hover:bg-gray-600"
                        >
                          +
                        </button>
                      </div>
                      <div className="text-sm text-gray-400">
                        Total: ₹
                        {(quantity * close).toLocaleString(undefined, {
                          maximumFractionDigits: 2,
                        })}
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleBuyStock(quantity, stock)}
                        className="cursor-pointer px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition flex items-center justify-center"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 mr-1"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 3a1 1 0 00-1 1v5H4a1 1 0 100 2h5v5a1 1 0 102 0v-5h5a1 1 0 100-2h-5V4a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Buy
                      </button>
                      <button
                        onClick={() => {
                          console.log("Hello");
                          handleSellStock(quantity, stock);
                        }}
                        className="cursor-pointer px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition flex items-center justify-center"
                        // disabled={quantityOwned < 1}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 mr-1"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Sell
                      </button>
                    </div>
                  </div>
                  {quantityOwned > 0 && (
                    <div className="mt-3 p-2 bg-blue-500/10 rounded-md">
                      <div className="text-sm text-gray-300">
                        Your position:{" "}
                        <span className="text-blue-300 font-medium">
                          {quantityOwned} shares
                        </span>{" "}
                        • Avg. cost:{" "}
                        <span className="text-blue-300 font-medium">
                          ₹{(stock.avgCost || close).toFixed(2)}
                        </span>{" "}
                        • P&L:{" "}
                        <span
                          className={`font-medium ${
                            close - (stock.avgCost || close) >= 0
                              ? "text-green-400"
                              : "text-red-400"
                          }`}
                        >
                          {close - (stock.avgCost || close) >= 0 ? "+" : ""}
                          {(
                            (close - (stock.avgCost || close)) *
                            quantityOwned
                          ).toFixed(2)}
                          (
                          {(
                            ((close - (stock.avgCost || close)) /
                              (stock.avgCost || close)) *
                            100
                          ).toFixed(2)}
                          %)
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
        {bonds.map((bond) => {
          const open = bond.open ?? 0;
          const close = bond.close ?? 0;
          const change = bond.yield;
          const quantityOwned = bond.quantityOwned ?? 0;
          const portfolioValue = quantityOwned * close;

          return (
            <div
              key={bond.id}
              className="p-5 rounded-xl bg-white/10 backdrop-blur-md shadow-lg transition-all duration-300 hover:shadow-2xl hover:scale-[1.02]"
            >
              {/* Stock Info Row */}
              <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() => handleBondDropdown(bond.id)}
              >
                {/* Symbol & Name */}
                <div className="flex items-center space-x-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/20 text-blue-300">
                    <Briefcase className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-lg font-medium text-white">
                      {bond.name}
                    </span>
                    {bond.name && (
                      <p className="text-xs text-gray-400">{bond.name}</p>
                    )}
                    {quantityOwned > 0 && (
                      <div className="mt-1 flex items-center">
                        <span className="text-xs text-gray-300 font-medium">
                          You own:{" "}
                          <span className="text-blue-300">{quantityOwned}</span>{" "}
                          shares
                        </span>
                        <span className="mx-2 text-gray-500">•</span>
                        <span className="text-xs text-gray-300 font-medium">
                          Value:{" "}
                          <span className="text-blue-300">
                            ₹
                            {portfolioValue.toLocaleString(undefined, {
                              maximumFractionDigits: 2,
                            })}
                          </span>
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Price & Change */}
                <div className="flex flex-row gap-6 items-end">
                  <div className="flex flex-col items-end">
                    <span className="text-lg font-semibold text-white">
                      $
                      {bond.price.toLocaleString(undefined, {
                        maximumFractionDigits: 2,
                      })}
                    </span>
                    <span
                      className={`text-sm font-medium flex items-center ${
                        change >= 0 ? "text-green-400" : "text-red-400"
                      }`}
                    >
                      {change >= 0 ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-3 w-3 mr-1"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-3 w-3 mr-1"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                      {Math.abs(change).toFixed(2)}%
                    </span>
                  </div>

                  {/* View Details Link */}
                  <Link
                    to={`/watchlist/${bond.symbol}`}
                    className="flex items-center text-blue-400 text-sm font-medium hover:underline transition-all bg-blue-500/10 px-3 py-1 rounded-full"
                    onClick={(e) => e.stopPropagation()} // Prevent dropdown toggle on link click
                  >
                    View Details
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 ml-1"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </Link>
                </div>
              </div>
              {/* Dropdown Content */}
              {expandedBond === bond.id && (
                <div className="mt-4 p-4 bg-gray-800/80 backdrop-blur-sm rounded-lg border border-gray-700">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <label className="text-white text-sm">Quantity:</label>
                      <div className="flex items-center">
                        <button
                          onClick={() =>
                            bondQuantity > 1 &&
                            setBondQuantity(bondQuantity - 1)
                          }
                          className="cursor-pointer bg-gray-700 text-white px-2 py-1 rounded-l-md hover:bg-gray-600"
                        >
                          -
                        </button>
                        <input
                          value={bondQuantity}
                          min="1"
                          onChange={(e) =>
                            setBondQuantity(Number(e.target.value))
                          }
                          className="w-16 p-1 text-white bg-gray-700 text-center border-x border-gray-600 focus:outline-none"
                        />
                        <button
                          onClick={() => setBondQuantity(bondQuantity + 1)}
                          className="cursor-pointer bg-gray-700 text-white px-2 py-1 rounded-r-md hover:bg-gray-600"
                        >
                          +
                        </button>
                      </div>
                      <div className="text-sm text-gray-400">
                        Total: $
                        {(bondQuantity * bond.price).toLocaleString(undefined, {
                          maximumFractionDigits: 2,
                        })}
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleBuyBond(bondQuantity, bond)}
                        className="cursor-pointer px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition flex items-center justify-center"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 mr-1"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 3a1 1 0 00-1 1v5H4a1 1 0 100 2h5v5a1 1 0 102 0v-5h5a1 1 0 100-2h-5V4a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Buy
                      </button>
                      <button
                        onClick={() => handleSellBond(bondQuantity, bond)}
                        className="cursor-pointer px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition flex items-center justify-center"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 mr-1"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Sell
                      </button>
                    </div>
                  </div>
                  {quantityOwned > 0 && (
                    <div className="mt-3 p-2 bg-blue-500/10 rounded-md">
                      <div className="text-sm text-gray-300">
                        Your position:{" "}
                        <span className="text-blue-300 font-medium">
                          {quantityOwned} bonds
                        </span>{" "}
                        • Avg. cost:{" "}
                        <span className="text-blue-300 font-medium">
                          ${(bond.avgCost || bond.price).toFixed(2)}
                        </span>{" "}
                        • P&L:{" "}
                        <span
                          className={`font-medium ${
                            bond.price - (bond.avgCost || bond.price) >= 0
                              ? "text-green-400"
                              : "text-red-400"
                          }`}
                        >
                          {bond.price - (bond.avgCost || bond.price) >= 0
                            ? "+"
                            : ""}
                          {(
                            (bond.price - (bond.avgCost || bond.price)) *
                            quantityOwned
                          ).toFixed(2)}
                          (
                          {(
                            ((bond.price - (bond.avgCost || bond.price)) /
                              (bond.avgCost || bond.price)) *
                            100
                          ).toFixed(2)}
                          %)
                        </span>
                      </div>
                    </div>
                  )}
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
