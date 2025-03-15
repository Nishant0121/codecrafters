"use client"

import { useState } from "react"
import { ArrowDown, ArrowUp, Clock, DollarSign, Wallet } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function OrderPanel({ className = "" }) {
  const [orderType, setOrderType] = useState("market")
  const [action, setAction] = useState("buy")
  const [shares, setShares] = useState("10")
  const [stockPrice, setStockPrice] = useState(178.35)
  const [totalCost, setTotalCost] = useState(1783.5)

  const handleSharesChange = (e) => {
    const value = e.target.value
    setShares(value)
    setTotalCost(Number.parseFloat(value || 0) * stockPrice)
  }

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
              <Select defaultValue="AMZN">
                <SelectTrigger id="symbol">
                  <SelectValue placeholder="Select stock" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="AAPL">AAPL - Apple Inc.</SelectItem>
                  <SelectItem value="MSFT">MSFT - Microsoft</SelectItem>
                  <SelectItem value="AMZN">AMZN - Amazon.com Inc.</SelectItem>
                  <SelectItem value="GOOGL">GOOGL - Alphabet Inc.</SelectItem>
                  <SelectItem value="TSLA">TSLA - Tesla Inc.</SelectItem>
                </SelectContent>
              </Select>

              <div className="mt-2 flex items-center justify-between text-sm">
                <div className="text-muted-foreground">Current Price</div>
                <div className="font-medium">${stockPrice.toFixed(2)}</div>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <Label htmlFor="order-type">Order Type</Label>
              <RadioGroup defaultValue="market" id="order-type" className="flex" onValueChange={setOrderType}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="market" id="market" />
                  <Label htmlFor="market" className="font-normal">
                    Market
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="limit" id="limit" />
                  <Label htmlFor="limit" className="font-normal">
                    Limit
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {orderType === "limit" && (
              <div className="space-y-2">
                <Label htmlFor="limit-price">Limit Price</Label>
                <div className="relative">
                  <DollarSign className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input id="limit-price" placeholder="0.00" className="pl-8" defaultValue={stockPrice.toFixed(2)} />
                </div>
              </div>
            )}

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
        <Button className="w-full" size="lg">
          {action === "buy" ? <ArrowDown className="mr-2 h-4 w-4" /> : <ArrowUp className="mr-2 h-4 w-4" />}
          {action === "buy" ? "Buy" : "Sell"} Shares
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
  )
}