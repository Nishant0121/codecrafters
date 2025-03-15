import { useContext, useEffect, useState } from "react";
import { ArrowRight, Copy, ExternalLink, Eye, PlusCircle, RefreshCcw, Send, Wallet, ChevronUp, ChevronDown, Clock, CheckCircle2, XCircle } from 'lucide-react';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { AppContext } from "@/context/appContext";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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
    return `${address.substring(0, 6)}...${address.substring(address.length - 6)}`;
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    }).format(date);
  };

  return (
    <Card className="overflow-hidden border-0 bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl text-white shadow-xl">
      {/* Wallet Header */}
      <CardHeader className="flex flex-row items-center justify-between p-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
            <Wallet className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-lg">Account 1</span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                      onClick={() => copyToClipboard("Account 1")}
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Copy account name</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="flex items-center gap-1 text-sm text-gray-400">
              <span>{formatAddress("0x3604...9100a")}</span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-5 w-5 text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                      onClick={() => copyToClipboard("0x3604...9100a")}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Copy address</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-5 w-5 text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                    >
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>View on explorer</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                onClick={() => window.location.reload()}
              >
                <RefreshCcw className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Refresh wallet data</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </CardHeader>

      {/* Wallet Balance & Actions */}
      <CardContent className="space-y-6 p-6">
        <div className="flex items-start justify-between">
          <div>
            {loading ? (
              <div className="space-y-2">
                <Skeleton className="h-8 w-32 bg-white/10" />
                <Skeleton className="h-4 w-24 bg-white/10" />
              </div>
            ) : error ? (
              <div className="flex items-center gap-2 text-red-400">
                <XCircle className="h-5 w-5" />
                <span>{error}</span>
              </div>
            ) : (
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-300">
                    {isBalanceVisible ? `$${balance}` : "••••••"}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                    onClick={toggleBalanceVisibility}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
                <div className="text-sm text-gray-400">
                  <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/20">
                    <CheckCircle2 className="h-3 w-3 mr-1" /> Active
                  </Badge>
                </div>
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              className="h-10 border-white/20 bg-white/5 text-white hover:bg-white/10 transition-all"
            >
              <Send className="mr-2 h-4 w-4" />
              Withdraw
            </Button>
            <Button 
              size="sm" 
              className="h-10 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Funds
            </Button>
          </div>
        </div>
      </CardContent>

      {/* Tabs Section - Only Activity Tab */}
      <Tabs defaultValue="activity" className="border-t border-white/10">
        <TabsList className="grid h-14 w-full grid-cols-1 bg-transparent p-0">
          <TabsTrigger
            value="activity"
            className={cn(
              "h-14 rounded-none border-b-2 border-transparent text-gray-400 data-[state=active]:border-blue-500 data-[state=active]:bg-transparent data-[state=active]:text-white transition-all"
            )}
          >
            Activity
          </TabsTrigger>
        </TabsList>
        <TabsContent value="activity" className="p-6 max-h-[400px] overflow-y-auto">
          <div className="space-y-5">
            {loading ? (
              Array(3).fill(0).map((_, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10 rounded-full bg-white/10" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-20 bg-white/10" />
                      <Skeleton className="h-3 w-32 bg-white/10" />
                    </div>
                  </div>
                  <Skeleton className="h-6 w-16 bg-white/10" />
                </div>
              ))
            ) : error ? (
              <div className="flex items-center justify-center py-6 text-red-400">
                <XCircle className="h-5 w-5 mr-2" />
                <p>{error}</p>
              </div>
            ) : transactions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-gray-400">
                <Clock className="h-12 w-12 mb-3 opacity-50" />
                <p className="text-center">No transactions found</p>
                <p className="text-sm text-center mt-1">Your transaction history will appear here</p>
              </div>
            ) : (
              transactions.map((tx) => (
                <div key={tx._id} className="flex items-center justify-between group hover:bg-white/5 p-3 rounded-lg transition-colors">
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-full",
                        tx.type === "credit"
                          ? "bg-green-500/20 text-green-400"
                          : "bg-red-500/20 text-red-400"
                      )}
                    >
                      {tx.type === "credit" ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                    </div>
                    <div>
                      <div className="font-medium capitalize">{tx.type}</div>
                      <div className="text-sm text-gray-400 flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {formatDate(tx.timestamp)}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={cn(
                      "font-medium",
                      tx.type === "credit" ? "text-green-400" : "text-red-400"
                    )}>
                      {tx.type === "credit" ? "+" : "-"}${tx.amount}
                    </div>
                    <div className="text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">
                      View details
                    </div>
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
