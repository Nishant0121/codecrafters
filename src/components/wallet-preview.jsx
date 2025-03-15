import { ArrowRight, Copy, ExternalLink, Eye, PlusCircle, RefreshCcw, Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

export function WalletPreview() {
  const transactions = [
    {
      id: 1,
      type: "receive",
      amount: "0.5 ETH",
      from: "0x1234...5678",
      timestamp: "2 hours ago",
    },
    {
      id: 2,
      type: "send",
      amount: "0.1 ETH",
      to: "0x8765...4321",
      timestamp: "5 hours ago",
    },
    {
      id: 3,
      type: "swap",
      amount: "100 USDT",
      to: "0xABC...DEF",
      timestamp: "1 day ago",
    },
  ];

  return (
    <Card className="border-0 bg-white/10 backdrop-blur-md border border-white/20 text-white">
      {/* Wallet Header */}
      <div className="flex items-center justify-between border-b border-white/20 p-4">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-blue-500" />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-medium">Account 1</span>
              <Button variant="ghost" size="icon" className="h-6 w-6 text-gray-400 hover:text-white">
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center gap-1 text-sm text-gray-400">
              <span>0x3604...9100a</span>
              <Button variant="ghost" size="icon" className="h-5 w-5 text-gray-400 hover:text-white">
                <ExternalLink className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
          <RefreshCcw className="h-4 w-4" />
        </Button>
      </div>

      {/* Wallet Balance & Actions */}
      <div className="space-y-4 p-4">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold">$0.00</span>
              <Button variant="ghost" size="icon" className="h-6 w-6 text-gray-400 hover:text-white">
                <Eye className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center gap-1 text-sm text-green-500">
              <span>+$0.00</span>
              <span className="text-gray-400">(+0.00%)</span>
            </div>
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
            <Button size="sm" className="h-8">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add
            </Button>
          </div>
        </div>

        {/* Quick Action Buttons */}
        {/* (Optional quick action buttons can be removed or added as needed) */}
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
          <div className="space-y-4">
            {transactions.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-full",
                      tx.type === "receive"
                        ? "bg-green-500/20 text-green-500"
                        : tx.type === "send"
                        ? "bg-blue-500/20 text-blue-500"
                        : "bg-purple-500/20 text-purple-500"
                    )}
                  >
                    {tx.type === "receive" ? "+" : tx.type === "send" ? "-" : "↔"}
                  </div>
                  <div>
                    <div className="capitalize">{tx.type}</div>
                    <div className="text-sm text-gray-400">{tx.timestamp}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div>{tx.amount}</div>
                  <div className="text-sm text-gray-400">
                    {tx.to ? `To: ${tx.to}` : tx.from ? `From: ${tx.from}` : `${tx.amount} → ${tx.to}`}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
}

export default WalletPreview;
