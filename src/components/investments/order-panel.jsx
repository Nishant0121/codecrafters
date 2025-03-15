"use client";

import { useState, useContext, useEffect } from "react";
import axios from "axios";
import { ArrowDown, ArrowUp, Clock, DollarSign, Wallet } from "lucide-react";

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
import { sampleStocks } from "@/Data/Stocks"; // Import stock data

export function OrderPanel({ className = "" }) {
  const { loginUser } = useContext(AppContext);
  const [orderType, setOrderType] = useState("market");
  const [action, setAction] = useState("buy");
  const [shares, setShares] = useState("10");
  const [stockPrice, setStockPrice] = useState(0);
  const [totalCost, setTotalCost] = useState(0);
  const [selectedStock, setSelectedStock] = useState("AMZN");
  const [loading, setLoading] = useState(false);

  // **Set initial stock price based on default selected stock**
  useEffect(() => {
    const defaultStock = sampleStocks.find(
      (stock) => stock.symbol === selectedStock
    );
    if (defaultStock) {
      setStockPrice(parseFloat(defaultStock.close));
      setTotalCost(parseFloat(defaultStock.close) * parseInt(shares));
    }
  }, [selectedStock, shares]); // Runs when stock or shares change

  const handleSharesChange = (e) => {
    const value = e.target.value;
    setShares(value);
    setTotalCost(Number.parseFloat(value || 0) * stockPrice);
  };

  const handleStockChange = (symbol) => {
    setSelectedStock(symbol);
    const stock = sampleStocks.find((s) => s.symbol === symbol);
    if (stock) {
      setStockPrice(parseFloat(stock.close));
      setTotalCost(parseFloat(stock.close) * parseInt(shares));
    }
  };

  const handleOrderSubmit = async () => {
    if (!loginUser?.uid) {
      toast.error("User not logged in");
      return;
    }

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

    try {
      setLoading(true);

      // Buy the Stock
      const stockResponse = await axios.post(
        "http://localhost:3000/api/stock/addStock",
        stockData
      );
      console.log("Stock Purchase Response:", stockResponse.data);

      // Update wallet
      const walletResponse = await axios.post(
        "http://localhost:3000/api/stock/updateWallet",
        walletUpdateData
      );
      console.log("Wallet Update Response:", walletResponse.data);

      toast.success(
        `Bought ${shares} shares of ${selectedStock} & updated wallet!`
      );
    } catch (error) {
      console.error("Error in transaction:", error);
      toast.error("Transaction failed! Please try again.");
    } finally {
      setLoading(false);
    }
  };

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
                    <SelectItem key={stock.id} value={stock.symbol}>
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
