import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { ExternalLink, Plus, Star, LineChart, TrendingUp, TrendingDown } from "lucide-react";

export function StockRecommendations() {
  const [portfolio, setPortfolio] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredRecommendations, setFilteredRecommendations] = useState([]);
  const [watchlist, setWatchlist] = useState([]);
  const [sectorPerformance, setSectorPerformance] = useState([]);

  const allStocks = [
    { symbol: "AAPL", name: "Apple Inc.", description: "Apple Inc. is an American multinational technology company.", change: 1.23, sector: "Technology" },
    { symbol: "TSLA", name: "Tesla Inc.", description: "Tesla Inc. is an electric vehicle and clean energy company.", change: -0.56, sector: "Automotive" },
    { symbol: "AMZN", name: "Amazon.com Inc.", description: "Amazon is a multinational technology company focusing on e-commerce.", change: 0.78, sector: "Technology" },
    { symbol: "GOOG", name: "Alphabet Inc.", description: "Alphabet Inc. is the parent company of Google.", change: 0.45, sector: "Technology" },
    { symbol: "MSFT", name: "Microsoft Corporation", description: "Microsoft Corporation is a technology company producing software, consumer electronics, and personal computers.", change: 2.15, sector: "Technology" },
    { symbol: "NFLX", name: "Netflix Inc.", description: "Netflix is a subscription-based streaming service for films and television series.", change: -1.05, sector: "Entertainment" },
    { symbol: "META", name: "Meta Platforms Inc.", description: "Meta Platforms, formerly known as Facebook, is a technology conglomerate specializing in social media.", change: 0.56, sector: "Technology" },
    { symbol: "NVDA", name: "NVIDIA Corporation", description: "NVIDIA is an American multinational technology company known for its graphics processing units (GPUs).", change: 3.45, sector: "Technology" },
    { symbol: "DIS", name: "The Walt Disney Company", description: "The Walt Disney Company is a multinational entertainment and media conglomerate.", change: 0.12, sector: "Entertainment" },
    { symbol: "V", name: "Visa Inc.", description: "Visa Inc. is a global payments technology company that facilitates digital payments.", change: 1.87, sector: "Financial Services" },
    { symbol: "INTC", name: "Intel Corporation", description: "Intel Corporation is a multinational corporation that manufactures semiconductors and related technologies.", change: -2.23, sector: "Technology" },
    { symbol: "BABA", name: "Alibaba Group", description: "Alibaba Group is a Chinese multinational conglomerate specializing in e-commerce, retail, internet, and technology.", change: 0.98, sector: "E-commerce" },
    { symbol: "PYPL", name: "PayPal Holdings Inc.", description: "PayPal is a digital payments platform that allows individuals and businesses to make online payments.", change: 0.34, sector: "Financial Services" },
    { symbol: "PFE", name: "Pfizer Inc.", description: "Pfizer is a multinational pharmaceutical corporation.", change: -0.78, sector: "Healthcare" },
    { symbol: "CVX", name: "Chevron Corporation", description: "Chevron is a multinational corporation engaged in petroleum and natural gas.", change: 1.56, sector: "Energy" },
    { symbol: "WMT", name: "Walmart Inc.", description: "Walmart is a multinational retail corporation that operates a chain of hypermarkets, discount department stores, and grocery stores.", change: 0.87, sector: "Retail" },
    { symbol: "BA", name: "Boeing Company", description: "Boeing is an American multinational corporation that designs and manufactures airplanes, rotorcraft, rockets, satellites, and telecommunications equipment.", change: -1.42, sector: "Aerospace" },
    { symbol: "SPG", name: "Simon Property Group Inc.", description: "Simon Property Group is a publicly traded real estate investment trust that focuses on retail properties.", change: 0.89, sector: "Real Estate" },
    { symbol: "GS", name: "Goldman Sachs Group Inc.", description: "Goldman Sachs is a leading global investment banking, securities, and investment management firm.", change: 2.56, sector: "Financial Services" },
    { symbol: "JPM", name: "JPMorgan Chase & Co.", description: "JPMorgan Chase is an American multinational investment bank and financial services holding company.", change: 1.12, sector: "Financial Services" },
    { symbol: "MCD", name: "McDonald's Corporation", description: "McDonald's is an American multinational chain of fast-food restaurants.", change: 1.68, sector: "Retail" },
    { symbol: "KO", name: "The Coca-Cola Company", description: "Coca-Cola is an American multinational corporation that manufactures beverages, primarily carbonated soft drinks.", change: 0.24, sector: "Consumer Goods" },
  ];

  // Mock sector performance data
  const mockSectorPerformance = [
    { sector: "Technology", change: 2.5 },
    { sector: "Automotive", change: -1.2 },
    { sector: "Financial Services", change: 1.8 },
    { sector: "Healthcare", change: 0.5 },
    { sector: "Energy", change: 3.1 },
  ];

  // Fetch the user's portfolio from the API
  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/stock/getProfile/DYoC8zDjlHQVhHygSRMZsnQylzP2'); // Replace with actual userId
        if (!response.ok) {
          throw new Error('Failed to fetch portfolio');
        }
        const data = await response.json();
        console.log("API Response:", data);

        if (data.profile && Array.isArray(data.profile.stocks)) {
          setPortfolio(data.profile.stocks);
        } else {
          setPortfolio([]);
        }
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchPortfolio();
    setSectorPerformance(mockSectorPerformance); // Mock sector performance data
  }, []);

  // Get stock recommendations based on industries and trends
  const getRecommendations = () => {
    const recommended = [];
    const industriesInPortfolio = [];

    // Identify industries of stocks already in the user's portfolio
    allStocks.forEach((stock) => {
      if (portfolio.includes(stock.symbol)) {
        industriesInPortfolio.push(stock.sector);
      }
    });

    // Get outperforming stocks in the same industries
    const outperformingStocksInIndustries = allStocks.filter(
      (stock) =>
        industriesInPortfolio.includes(stock.sector) &&
        stock.change > 0 &&
        !portfolio.includes(stock.symbol)
    );

    // If no outperforming stocks are found, suggest random stocks from other industries
    if (outperformingStocksInIndustries.length === 0) {
      const randomStocks = getRandomStocks(5); // Get 5 random stocks
      recommended.push(...randomStocks);
    } else {
      recommended.push(...outperformingStocksInIndustries);
    }

    setRecommendations(recommended);
    setFilteredRecommendations(recommended);
  };

  // Get random stocks from the allStocks array
  const getRandomStocks = (count) => {
    const shuffled = allStocks.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  // Update recommendations when portfolio changes
  useEffect(() => {
    if (portfolio.length > 0) {
      getRecommendations();
    } else {
      const randomStocks = getRandomStocks(5);
      setRecommendations(randomStocks);
      setFilteredRecommendations(randomStocks);
    }
  }, [portfolio]);

  // Handle search and filter
  useEffect(() => {
    const filtered = recommendations.filter(
      (stock) =>
        stock.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        stock.symbol.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredRecommendations(filtered);
  }, [searchQuery, recommendations]);

  // Add stock to portfolio
  const addToPortfolio = async (symbol) => {
    try {
      const response = await fetch('http://localhost:3000/api/stock/addToPortfolio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: 'DYoC8zDjlHQVhHygSRMZsnQylzP2', symbol }),
      });
      if (!response.ok) {
        throw new Error('Failed to add stock to portfolio');
      }
      setPortfolio([...portfolio, symbol]);
    } catch (err) {
      setError(err.message);
    }
  };

  // Add stock to watchlist
  const addToWatchlist = (symbol) => {
    if (!watchlist.includes(symbol)) {
      setWatchlist([...watchlist, symbol]);
    }
  };

  return (
    <Card className="overflow-hidden border-0 bg-gradient-to-r from-gray-800 via-black to-gray-900 text-white shadow-lg backdrop-blur-lg">
      <div className="p-6 space-y-6">
        <div className="text-3xl font-semibold text-center">Stock Recommendations</div>

        {/* Sector Performance Section */}
        <div className="mt-4">
          <div className="text-lg font-semibold mb-4">Sector Performance</div>
          <div className="flex gap-6 overflow-x-auto">
            {sectorPerformance.map((sector, index) => (
              <div key={index} className="flex flex-col items-center gap-2 p-4 bg-gray-700 rounded-lg shadow-md">
                <div className="text-xl font-semibold">{sector.sector}</div>
                <div
                  className={cn(
                    "text-lg font-bold",
                    sector.change > 0 ? "text-green-400" : "text-red-400"
                  )}
                >
                  {sector.change > 0 ? `+${sector.change}` : sector.change}% 
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Search Bar */}
        <div className="mt-4">
          <input
            type="text"
            placeholder="Search stocks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-3 mb-4 rounded-md bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Recommendations List */}
        <div className="mt-4">
          {loading ? (
            <p>Loading portfolio...</p>
          ) : error ? (
            <p className="text-red-400">Error: {error}</p>
          ) : filteredRecommendations.length === 0 ? (
            <p>No recommendations at the moment.</p>
          ) : (
            filteredRecommendations.map((stock, index) => (
              <div key={`${stock.symbol}-${index}`} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg mb-4">
                <div className="flex items-center gap-3">
                  <div className="text-xl font-semibold">{stock.name}</div>
                  <Tooltip>
                    <TooltipTrigger>
                      <span className="text-sm text-gray-400">{stock.symbol}</span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{stock.description}</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <div className="flex items-center gap-4">
                  <div
                    className={cn(
                      "text-lg font-bold",
                      stock.change > 0 ? "text-green-400" : "text-red-400"
                    )}
                  >
                    {stock.change > 0 ? `+${stock.change}` : stock.change}%
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-gray-300 hover:text-white"
                    onClick={() => addToWatchlist(stock.symbol)}
                  >
                    <Star className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-gray-300 hover:text-white"
                    onClick={() => addToPortfolio(stock.symbol)}
                  >
                    <Plus className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-gray-300 hover:text-white"
                  >
                    <LineChart className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </Card>
  );
}

export default StockRecommendations;
