"use client";

import { useState, useContext, useEffect } from "react";
import axios from "axios";
import { Clock, Wallet } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "react-hot-toast";
import { AppContext } from "@/context/appContext";
import { sampleStocks } from "@/Data/Stocks"; // Hardcoded stock data (if needed)

export function OrderPanel({ className = "" }) {
  const { loginUser } = useContext(AppContext);

  // -----------------------
  // 1) Track the user's holdings from the backend
  // -----------------------
  const [investmentData, setInvestmentData] = useState([]);

  // -----------------------
  // 2) UI State
  // -----------------------
  const [action, setAction] = useState("buy");
  const [shares, setShares] = useState("10");
  const [stockPrice, setStockPrice] = useState(0);
  const [totalCost, setTotalCost] = useState(0);
  const [selectedStock, setSelectedStock] = useState("AMZN");
  const [loading, setLoading] = useState(false);

  // -----------------------
  // 3) Fetch the user's stock holdings
  // -----------------------
  useEffect(() => {
    const fetchInvestmentData = async () => {
      try {
        if (!loginUser?.uid) return; // If not logged in, skip fetching

        const response = await fetch(
          `http://localhost:3000/api/stock/getProfile/${loginUser.uid}`
        );

        if (!response.ok) {
          // e.g. 404 or 500
          throw new Error(
            `Failed to fetch user data. Status: ${response.status}`
          );
        }

        const data = await response.json();

        // Check if data.profile or data.profile.stocks exists
        if (!data?.profile?.stocks) {
          toast.error("No stock data found for user.");
          return;
        }

        // Transform the backend data into a local format
        const transformedData = data.profile.stocks.map((stock) => {
          // Optional: match with any hardcoded sample data (if you have it)
          const matchedSample = sampleStocks.find(
            (s) => s.symbol === stock.symbol
          );

          return {
            id: stock._id,
            symbol: stock.symbol,
            name: matchedSample?.name || "Unknown",
            quantity: stock.quantity,
            buyPrice: stock.buyPrice,
            // For current price, we fall back to sample data if available
            currentPrice: matchedSample?.close || stock.buyPrice,
          };
        });

        setInvestmentData(transformedData);
      } catch (error) {
        console.error("Error fetching user profile data:", error);
        toast.error("Error fetching user profile data. Please try again.");
      }
    };

    fetchInvestmentData();
  }, [loginUser]);

  // -----------------------
  // 4) Sync up the stock price & total cost whenever the symbol/shares change
  // -----------------------
  useEffect(() => {
    const found = sampleStocks.find((s) => s.symbol === selectedStock);
    if (found) {
      setStockPrice(parseFloat(found.close));
      setTotalCost(parseFloat(found.close) * parseInt(shares, 10));
    }
  }, [selectedStock, shares]);

  // -----------------------
  // 5) Input Handlers
  // -----------------------
  const handleSharesChange = (e) => {
    const value = e.target.value;
    setShares(value);
    setTotalCost(Number.parseFloat(value || 0) * stockPrice);
  };

  const handleStockChange = (symbol) => {
    setSelectedStock(symbol);
    const found = sampleStocks.find((s) => s.symbol === symbol);
    if (found) {
      setStockPrice(parseFloat(found.close));
      setTotalCost(parseFloat(found.close) * parseInt(shares, 10));
    }
  };

  // -----------------------
  // 6) SELL Logic
  // -----------------------
  async function handleSellStock(quantity, stock) {
    if (quantity <= 0) {
      toast.error("Quantity must be greater than 0");
      return;
    }

    try {
      // 1) Remove shares from user portfolio
      const response = await axios.post(
        "http://localhost:3000/api/stock/removeStock",
        {
          uid: loginUser.uid,
          quantity,
          symbol: stock.symbol,
        }
      );

      // 2) Credit the wallet (because user sold shares)
      const response2 = await axios.post(
        "http://localhost:3000/api/stock/updateWallet",
        {
          uid: loginUser.uid,
          amount: Number(stock.close * quantity),
          type: "credit",
        }
      );

      console.log(response2.data.message);
      toast.success(response.data.message);
    } catch (error) {
      console.error("Error selling stock:", error);
      toast.error("Failed to sell stock. Please try again.");
    }
  }

  // -----------------------
  // 7) Main Submit Handler
  // -----------------------
  const handleOrderSubmit = async () => {
    if (!loginUser?.uid) {
      toast.error("User not logged in");
      return;
    }

    try {
      setLoading(true);

      if (action === "buy") {
        // Example limit: buy up to 25 shares
        if (Number(shares) > 25) {
          toast.error("You can only buy a maximum of 25 shares at a time.");
          setLoading(false);
          return;
        }

        // BUY LOGIC
        const stockData = {
          uid: loginUser.uid,
          quantity: Number(shares),
          symbol: selectedStock,
          buyPrice: stockPrice.toFixed(2),
          purchaseDate: new Date().toISOString(),
        };

        const walletUpdateData = {
          uid: loginUser.uid,
          amount: Number(totalCost.toFixed(2)),
          type: "debit",
        };

        // Add shares to user portfolio

        try {
          // Update user wallet
          await axios.post(
            "http://localhost:3000/api/stock/updateWallet",
            walletUpdateData
          );
          await axios.post(
            "http://localhost:3000/api/stock/addStock",
            stockData
          );
        } catch (error) {
          alert("Transaction failed! Please try again.");
          toast.error("Transaction failed! Please try again.");
          console.error("Error in transaction:", error);
        }

        toast.success(
          `Bought ${shares} shares of ${selectedStock} & updated wallet!`
        );
        window.location.reload();
      } else {
        // SELL LOGIC
        // 1) Check if user has enough shares
        const userStock = investmentData.find(
          (st) => st.symbol === selectedStock
        );
        const userHas = userStock ? userStock.quantity : 0;

        if (Number(shares) > userHas) {
          toast.error(
            `You don't have enough shares to sell. You only have ${userHas} of ${selectedStock}.`
          );
          setLoading(false);
          return;
        }

        // 2) Proceed with the selling
        await handleSellStock(Number(shares), {
          symbol: selectedStock,
          close: stockPrice,
        });

        window.location.reload();
      }
    } catch (error) {
      console.error("Error in transaction:", error);
      toast.error("Transaction failed! Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // -----------------------
  // 8) Render
  // -----------------------
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Place Order</CardTitle>
        <CardDescription>Buy or sell investments quickly</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="buy" className="w-full" onValueChange={setAction}>
          <TabsList className="mb-4 grid w-full grid-cols-2">
            <TabsTrigger value="buy">Buy</TabsTrigger>
            <TabsTrigger value="sell">Sell</TabsTrigger>
          </TabsList>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="symbol">Symbol</Label>
              <Select value={selectedStock} onValueChange={handleStockChange}>
                <SelectTrigger id="symbol">
                  <SelectValue placeholder="Select stock" />
                </SelectTrigger>
                <SelectContent>
                  {sampleStocks.map((stock) => (
                    <SelectItem key={stock.symbol} value={stock.symbol}>
                      {stock.symbol} - {stock.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="mt-2 flex items-center justify-between text-sm">
                <div className="text-muted-foreground">Current Price</div>
                <div className="font-medium">${stockPrice.toFixed(2)}</div>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <Label htmlFor="shares">Shares</Label>
              <Input
                id="shares"
                type="number"
                value={shares}
                onChange={handleSharesChange}
                min="1"
                placeholder="Enter number of shares"
              />
            </div>

            <Separator />

            <div className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <div className="text-muted-foreground">Estimated Cost</div>
                <div className="font-medium">${totalCost.toFixed(2)}</div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="text-muted-foreground">Commission</div>
                <div className="font-medium">$0.00</div>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <div>Total</div>
                <div className="text-lg font-bold">${totalCost.toFixed(2)}</div>
              </div>
            </div>
          </div>
        </Tabs>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        <Button
          className="w-full"
          size="lg"
          onClick={handleOrderSubmit}
          disabled={loading}
        >
          {loading ? "Processing..." : action === "buy" ? "Buy" : "Sell"} Shares
        </Button>

        <div className="text-center text-xs text-muted-foreground">
          <div className="flex items-center justify-center gap-1">
            <Wallet className="h-3 w-3" />
            <span>Available Cash: $4,780.00</span>
          </div>
          <div className="mt-1 flex items-center justify-center gap-1">
            <Clock className="h-3 w-3" />
            <span>Market Hours: 9:30 AM - 4:00 PM ET</span>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
