"use client"

import { ArrowDown, ArrowUp, ExternalLink, RefreshCw } from "lucide-react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function MarketUpdates() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center">
        <div className="flex-1">
          <CardTitle>Market Updates</CardTitle>
          <CardDescription>Real-time market data</CardDescription>
        </div>
        <Button variant="outline" size="icon" className="h-8 w-8">
          <RefreshCw className="h-4 w-4" />
          <span className="sr-only">Refresh</span>
        </Button>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="stocks">
          <TabsList className="mb-4 w-full">
            <TabsTrigger value="stocks" className="flex-1">
              Stocks
            </TabsTrigger>
            <TabsTrigger value="indices" className="flex-1">
              Indices
            </TabsTrigger>
            <TabsTrigger value="forex" className="flex-1">
              Forex
            </TabsTrigger>
          </TabsList>
          <TabsContent value="stocks" className="space-y-4">
            <div className="space-y-4">
              <StockItem
                name="Apple Inc."
                symbol="AAPL"
                price="$173.45"
                change="+1.23"
                percentage="+0.71%"
                trending={true}
              />
              <StockItem
                name="Microsoft"
                symbol="MSFT"
                price="$378.92"
                change="+3.78"
                percentage="+1.01%"
                trending={true}
              />
              <StockItem
                name="Amazon"
                symbol="AMZN"
                price="$178.35"
                change="-2.15"
                percentage="-1.19%"
                trending={false}
              />
              <StockItem
                name="Tesla Inc."
                symbol="TSLA"
                price="$237.49"
                change="+8.75"
                percentage="+3.82%"
                trending={true}
              />
              <StockItem
                name="Google"
                symbol="GOOGL"
                price="$163.12"
                change="-0.56"
                percentage="-0.34%"
                trending={false}
              />
            </div>
            <Link to= "/watchlist">
              <Button variant="outline" size="sm" className="w-full">
                <ExternalLink className="mr-2 h-4 w-4" />
                View All Markets
              </Button>
            </Link>
            
          </TabsContent>
          <TabsContent value="indices">
            <div className="space-y-4">
              <StockItem
                name="S&P 500"
                symbol="SPX"
                price="$5,203.58"
                change="+15.23"
                percentage="+0.29%"
                trending={true}
              />
              <StockItem
                name="Dow Jones"
                symbol="DJI"
                price="$39,105.37"
                change="-102.35"
                percentage="-0.26%"
                trending={false}
              />
              <StockItem
                name="Nasdaq"
                symbol="IXIC"
                price="$16,780.61"
                change="+45.78"
                percentage="+0.27%"
                trending={true}
              />
              <StockItem
                name="Russell 2000"
                symbol="RUT"
                price="$2,070.85"
                change="-8.47"
                percentage="-0.41%"
                trending={false}
              />
            </div>
          </TabsContent>
          <TabsContent value="forex">
            <div className="space-y-4">
              <StockItem
                name="EUR/USD"
                symbol="EURUSD"
                price="1.0875"
                change="+0.0023"
                percentage="+0.21%"
                trending={true}
              />
              <StockItem
                name="GBP/USD"
                symbol="GBPUSD"
                price="1.2650"
                change="+0.0035"
                percentage="+0.28%"
                trending={true}
              />
              <StockItem
                name="USD/JPY"
                symbol="USDJPY"
                price="153.45"
                change="-0.75"
                percentage="-0.49%"
                trending={false}
              />
              <StockItem
                name="USD/CHF"
                symbol="USDCHF"
                price="0.9045"
                change="+0.0015"
                percentage="+0.17%"
                trending={true}
              />
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

function StockItem({ name, symbol, price, change, percentage, trending }) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <div className="font-medium">{name}</div>
        <div className="text-xs text-muted-foreground">{symbol}</div>
      </div>
      <div className="text-right">
        <div className="font-medium">{price}</div>
        <div className={`flex items-center text-xs ${trending ? "text-green-500" : "text-red-500"}`}>
          {trending ? <ArrowUp className="mr-1 h-3 w-3" /> : <ArrowDown className="mr-1 h-3 w-3" />}
          {change} ({percentage})
        </div>
      </div>
    </div>
  )
}