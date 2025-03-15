"use client"

import { useState } from "react"
import { ArrowDown, ArrowUp, ExternalLink, Star } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function WatchlistStocks() {
  const [favorites, setFavorites] = useState({
    AAPL: true,
    AMZN: true,
    MSFT: false,
    GOOGL: false,
    TSLA: true,
    META: false,
  })

  const toggleFavorite = (symbol) => {
    setFavorites({
      ...favorites,
      [symbol]: !favorites[symbol],
    })
  }

  return (
    <Tabs defaultValue="stocks">
      <TabsList className="mb-4 w-full">
        <TabsTrigger value="stocks" className="flex-1">
          Stocks
        </TabsTrigger>
        <TabsTrigger value="etfs" className="flex-1">
          ETFs
        </TabsTrigger>
        <TabsTrigger value="crypto" className="flex-1">
          Crypto
        </TabsTrigger>
      </TabsList>
      <TabsContent value="stocks" className="space-y-6">
        <div className="overflow-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b text-left text-xs font-medium text-muted-foreground">
                <th className="whitespace-nowrap pb-3"></th>
                <th className="whitespace-nowrap pb-3">Symbol</th>
                <th className="whitespace-nowrap pb-3">Name</th>
                <th className="whitespace-nowrap pb-3 text-right">Price</th>
                <th className="whitespace-nowrap pb-3 text-right">24h Change</th>
                <th className="whitespace-nowrap pb-3 text-right">Market Cap</th>
                <th className="whitespace-nowrap pb-3"></th>
              </tr>
            </thead>
            <tbody>
              <StockRow
                symbol="AAPL"
                name="Apple Inc."
                price="173.45"
                change="1.23"
                changePercent="0.71"
                marketCap="2.7T"
                trending={true}
                isFavorite={favorites["AAPL"]}
                onToggleFavorite={() => toggleFavorite("AAPL")}
              />
              <StockRow
                symbol="MSFT"
                name="Microsoft"
                price="378.92"
                change="3.78"
                changePercent="1.01"
                marketCap="2.8T"
                trending={true}
                isFavorite={favorites["MSFT"]}
                onToggleFavorite={() => toggleFavorite("MSFT")}
              />
              <StockRow
                symbol="AMZN"
                name="Amazon.com Inc."
                price="178.35"
                change="-2.15"
                changePercent="-1.19"
                marketCap="1.8T"
                trending={false}
                isFavorite={favorites["AMZN"]}
                onToggleFavorite={() => toggleFavorite("AMZN")}
              />
              <StockRow
                symbol="GOOGL"
                name="Alphabet Inc."
                price="163.12"
                change="-0.56"
                changePercent="-0.34"
                marketCap="2.0T"
                trending={false}
                isFavorite={favorites["GOOGL"]}
                onToggleFavorite={() => toggleFavorite("GOOGL")}
              />
              <StockRow
                symbol="TSLA"
                name="Tesla Inc."
                price="237.49"
                change="8.75"
                changePercent="3.82"
                marketCap="750B"
                trending={true}
                isFavorite={favorites["TSLA"]}
                onToggleFavorite={() => toggleFavorite("TSLA")}
              />
              <StockRow
                symbol="META"
                name="Meta Platforms Inc."
                price="487.95"
                change="2.45"
                changePercent="0.50"
                marketCap="1.2T"
                trending={true}
                isFavorite={favorites["META"]}
                onToggleFavorite={() => toggleFavorite("META")}
              />
            </tbody>
          </table>
        </div>
        <Button variant="outline" size="sm" className="w-full">
          <ExternalLink className="mr-2 h-4 w-4" />
          View All Stocks
        </Button>
      </TabsContent>
      <TabsContent value="etfs">
        <div className="overflow-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b text-left text-xs font-medium text-muted-foreground">
                <th className="whitespace-nowrap pb-3"></th>
                <th className="whitespace-nowrap pb-3">Symbol</th>
                <th className="whitespace-nowrap pb-3">Name</th>
                <th className="whitespace-nowrap pb-3 text-right">Price</th>
                <th className="whitespace-nowrap pb-3 text-right">24h Change</th>
                <th className="whitespace-nowrap pb-3 text-right">AUM</th>
                <th className="whitespace-nowrap pb-3"></th>
              </tr>
            </thead>
            <tbody>
              <StockRow
                symbol="SPY"
                name="SPDR S&P 500 ETF"
                price="518.75"
                change="1.85"
                changePercent="0.36"
                marketCap="420B"
                trending={true}
                isFavorite={false}
                onToggleFavorite={() => {}}
              />
              <StockRow
                symbol="QQQ"
                name="Invesco QQQ Trust"
                price="437.82"
                change="2.56"
                changePercent="0.59"
                marketCap="210B"
                trending={true}
                isFavorite={false}
                onToggleFavorite={() => {}}
              />
              <StockRow
                symbol="VTI"
                name="Vanguard Total Stock Market ETF"
                price="252.35"
                change="0.78"
                changePercent="0.31"
                marketCap="380B"
                trending={true}
                isFavorite={false}
                onToggleFavorite={() => {}}
              />
            </tbody>
          </table>
        </div>
      </TabsContent>
      <TabsContent value="crypto">
        <div className="overflow-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b text-left text-xs font-medium text-muted-foreground">
                <th className="whitespace-nowrap pb-3"></th>
                <th className="whitespace-nowrap pb-3">Symbol</th>
                <th className="whitespace-nowrap pb-3">Name</th>
                <th className="whitespace-nowrap pb-3 text-right">Price</th>
                <th className="whitespace-nowrap pb-3 text-right">24h Change</th>
                <th className="whitespace-nowrap pb-3 text-right">Market Cap</th>
                <th className="whitespace-nowrap pb-3"></th>
              </tr>
            </thead>
            <tbody>
              <StockRow
                symbol="BTC"
                name="Bitcoin"
                price="67,235.45"
                change="1,230.20"
                changePercent="1.86"
                marketCap="1.3T"
                trending={true}
                isFavorite={false}
                onToggleFavorite={() => {}}
              />
              <StockRow
                symbol="ETH"
                name="Ethereum"
                price="3,480.92"
                change="-65.38"
                changePercent="-1.84"
                marketCap="420B"
                trending={false}
                isFavorite={false}
                onToggleFavorite={() => {}}
              />
              <StockRow
                symbol="SOL"
                name="Solana"
                price="148.35"
                change="7.25"
                changePercent="5.14"
                marketCap="65B"
                trending={true}
                isFavorite={false}
                onToggleFavorite={() => {}}
              />
            </tbody>
          </table>
        </div>
      </TabsContent>
    </Tabs>
  )
}

function StockRow({ symbol, name, price, change, changePercent, marketCap, trending, isFavorite, onToggleFavorite }) {
  return (
    <tr className="border-b">
      <td className="py-3">
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onToggleFavorite}>
          <Star className={`h-4 w-4 ${isFavorite ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`} />
          <span className="sr-only">{isFavorite ? "Remove from favorites" : "Add to favorites"}</span>
        </Button>
      </td>
      <td className="py-3 font-medium">{symbol}</td>
      <td className="py-3 text-muted-foreground">{name}</td>
      <td className="py-3 text-right font-medium">${price}</td>
      <td className={`py-3 text-right ${trending ? "text-green-500" : "text-red-500"}`}>
        <div className="flex items-center justify-end gap-1">
          {trending ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
          {change} ({changePercent}%)
        </div>
      </td>
      <td className="py-3 text-right text-muted-foreground">{marketCap}</td>
      <td className="py-3 text-right">
        <Button variant="outline" size="sm" className="h-8">
          Trade
        </Button>
      </td>
    </tr>
  )
}