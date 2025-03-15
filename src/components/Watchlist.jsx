import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Briefcase } from "lucide-react";
import { gsap } from "gsap";

const Watchlist = ({ stocks = [] }) => {
  const watchlistRef = useRef(null);

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
              className="flex justify-between items-center p-5 rounded-xl bg-white/10 backdrop-blur-md shadow-lg transition-all duration-300 hover:shadow-2xl hover:scale-[1.02]"
            >
              {/* Symbol & Name */}
              <div className="flex items-center space-x-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/20 text-blue-300">
                  <Briefcase className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-lg font-medium text-white">{stock.symbol}</span>
                  {stock.name && <p className="text-xs text-gray-400">{stock.name}</p>}
                </div>
              </div>

              {/* Price & Change */}
              <div className="flex flex-col items-end">
                <span className="text-lg font-semibold text-white">${close.toFixed(2)}</span>
                <span className={`text-sm font-medium ${change >= 0 ? "text-green-400" : "text-red-400"}`}>
                  {change >= 0 ? "+" : ""}
                  {change.toFixed(2)}%
                </span>
              </div>

              {/* View Details Link */}
              <Link
                to={`/watchlist/${stock.symbol}`}
                className="text-blue-400 text-sm font-medium hover:underline transition-all"
              >
                View Details →
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Watchlist;
