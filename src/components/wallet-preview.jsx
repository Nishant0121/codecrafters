import { useContext, useEffect, useState } from "react";
import {
  ArrowRight,
  Copy,
  ExternalLink,
  Eye,
  PlusCircle,
  RefreshCcw,
  Send,
  Wallet,
  ChevronUp,
  ChevronDown,
  Clock,
  CheckCircle2,
  XCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { AppContext } from "@/context/appContext";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Link } from "react-router-dom";

export function WalletPreview() {
  const [balance, setBalance] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isBalanceVisible, setIsBalanceVisible] = useState(true);
  const { loginUser } = useContext(AppContext);

  useEffect(() => {
    const fetchWalletData = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/stock/wallet/balance/${loginUser.uid}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch wallet data");
        }
        const data = await response.json();
        setBalance(data.balance);
        setTransactions(data.transactions);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWalletData();
  }, [loginUser.uid]);

  const toggleBalanceVisibility = () => {
    setIsBalanceVisible(!isBalanceVisible);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  const formatAddress = (address) => {
    return `${address.substring(0, 6)}...${address.substring(
      address.length - 6
    )}`;
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    }).format(date);
  };

  return (
    <Card className="overflow-hidden border-0 bg-white/10 backdrop-blur-md text-white">
      {/* Wallet Header */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-blue-500" />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-medium">
                {loginUser?.displayName}_Account 1
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-gray-400 hover:text-white"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center gap-1 text-sm text-gray-400">
              <span>0x3604...9100a</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-5 w-5 text-gray-400 hover:text-white"
              >
                <ExternalLink className="h-3 w-3" />
              </Button>
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

      {/* Wallet Balance & Actions */}
      <div className="space-y-4 p-4">
        <div className="flex items-start justify-between">
          <div>
            {loading ? (
              <span className="text-lg text-gray-400">Loading...</span>
            ) : error ? (
              <span className="text-red-500">{error}</span>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold">
                  ${balance.toFixed(2)}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-gray-400 hover:text-white"
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              className="h-8 border-white/20 bg-transparent text-white hover:bg-gray-800"
            >
              <Send className="mr-2 h-4 w-4" />
              Withdraw
            </Button>
            <Link to="/pay" className="">
              <Button size="sm" className="h-8">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Tabs Section - Only Activity Tab */}
      <Tabs defaultValue="activity" className="border-t border-white/20">
        <TabsList className="grid h-12 w-full grid-cols-1 bg-transparent p-0">
          <TabsTrigger
            value="activity"
            className={cn(
              "h-12 rounded-none border-b-2 border-transparent text-gray-400 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-white"
            )}
          >
            Activity
          </TabsTrigger>
        </TabsList>
        <TabsContent value="activity" className="p-4">
          {/* Transactions Container - Scrollable */}
          <div className="max-h-[300px] overflow-auto space-y-4 scrollbar-hide">
            {loading ? (
              <p className="text-gray-400">Loading transactions...</p>
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : transactions.length === 0 ? (
              <p className="text-gray-400">No transactions found</p>
            ) : (
              transactions
                .slice()
                .reverse()
                .map((tx) => (
                  <div
                    key={tx._id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "flex h-8 w-8 items-center justify-center rounded-full",
                          tx.type === "credit"
                            ? "bg-green-500/20 text-green-500"
                            : "bg-red-500/20 text-red-500"
                        )}
                      >
                        {tx.type === "credit" ? "+" : "-"}
                      </div>
                      <div>
                        <div className="capitalize">{tx.type}</div>
                        <div className="text-sm text-gray-400">
                          {new Date(tx.timestamp).toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div>${tx.amount.toFixed(2)}</div>
                    </div>
                  </div>
                ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
}

export default WalletPreview;
