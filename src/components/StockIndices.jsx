import { useState } from "react";
import { RefreshCcw, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

// StockIndexItem component for individual index item rendering
function StockIndexItem({ index }) {
  return (
    <div key={index.symbol} className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="text-lg font-semibold">{index.name}</div>
        <Tooltip>
          <TooltipTrigger>
            <span className="text-sm text-gray-400">{index.symbol}</span>
          </TooltipTrigger>
          <TooltipContent>
            <p>{index.description}</p>
          </TooltipContent>
        </Tooltip>
      </div>
      <div className="flex items-center gap-4">
        <div
          className={cn(
            "text-lg font-bold",
            index.change > 0 ? "text-green-500" : "text-red-500"
          )}
        >
          {index.change > 0 ? `+${index.change}` : index.change}%
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 text-gray-400 hover:text-white"
        >
          <ExternalLink className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

// Main StockIndexPreview component
export function StockIndexPreview() {
  const [indices] = useState([
    {
      name: "S&P 500",
      symbol: "SPX",
      description: "Standard & Poor's 500 index of U.S. stocks",
      change: 1.23,
    },
    {
      name: "Dow Jones Industrial Average",
      symbol: "DJIA",
      description: "Dow Jones Industrial Average index",
      change: -0.56,
    },
    {
      name: "NASDAQ Composite",
      symbol: "NASDAQ",
      description: "NASDAQ stock market index",
      change: 0.78,
    },
    {
      name: "FTSE 100",
      symbol: "FTSE",
      description: "FTSE 100 Index of the London Stock Exchange",
      change: -0.12,
    },
  ]);

  const [loading] = useState(false);
  const [error] = useState(null);

  return (
    <Card className="overflow-hidden border-0 bg-white/10 backdrop-blur-md text-white">
      {/* Header Section */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-medium">Stock Indices</span>
            </div>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="text-gray-400 hover:text-white"
          onClick={() => window.location.reload()}
        >
          <RefreshCcw className="h-4 w-4" />
        </Button>
      </div>

      {/* Indices Data */}
      <div className="space-y-4 p-4">
        <div className="flex items-start justify-between">
          {loading ? (
            <Skeleton className="w-24 h-8" />
          ) : error ? (
            <span className="text-red-500">{error}</span>
          ) : (
            <div className="space-y-2">
              {indices.map((index) => (
                <StockIndexItem key={index.symbol} index={index} />
              ))}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}

export default StockIndexPreview;
