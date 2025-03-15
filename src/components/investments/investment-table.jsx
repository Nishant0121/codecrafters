"use client"

import { useState } from "react"
import { ArrowDown, ArrowUp, ChevronDown, MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const investmentData = {
  stocks: [
    {
      id: "1",
      symbol: "AAPL",
      name: "Apple Inc.",
      quantity: 14,
      price: 173.45,
      averageCost: 158.32,
      value: 2428.3,
      change: 1.23,
      changePercent: 0.71,
      profitLoss: 211.82,
      profitLossPercent: 9.56,
      allocation: 8.45,
    },
    {
      id: "2",
      symbol: "MSFT",
      name: "Microsoft",
      quantity: 9,
      price: 378.92,
      averageCost: 320.75,
      value: 3410.28,
      change: 3.78,
      changePercent: 1.01,
      profitLoss: 523.53,
      profitLossPercent: 18.13,
      allocation: 11.88,
    },
    {
      id: "3",
      symbol: "AMZN",
      name: "Amazon.com Inc.",
      quantity: 12,
      price: 178.35,
      averageCost: 147.5,
      value: 2140.2,
      change: -2.15,
      changePercent: -1.19,
      profitLoss: 370.2,
      profitLossPercent: 20.91,
      allocation: 7.45,
    },
    {
      id: "4",
      symbol: "GOOGL",
      name: "Alphabet Inc.",
      quantity: 18,
      price: 163.12,
      averageCost: 135.25,
      value: 2936.16,
      change: -0.56,
      changePercent: -0.34,
      profitLoss: 502.74,
      profitLossPercent: 20.61,
      allocation: 10.22,
    },
    {
      id: "5",
      symbol: "TSLA",
      name: "Tesla Inc.",
      quantity: 10,
      price: 237.49,
      averageCost: 195.32,
      value: 2374.9,
      change: 8.75,
      changePercent: 3.82,
      profitLoss: 421.7,
      profitLossPercent: 21.59,
      allocation: 8.27,
    },
  ],
  bonds: [
    {
      id: "6",
      symbol: "TLT",
      name: "iShares 20+ Year Treasury",
      quantity: 25,
      price: 94.85,
      averageCost: 90.2,
      value: 2371.25,
      change: 0.35,
      changePercent: 0.37,
      profitLoss: 116.25,
      profitLossPercent: 5.15,
      allocation: 8.26,
    },
    {
      id: "7",
      symbol: "LQD",
      name: "iShares iBoxx $ Inv Grade",
      quantity: 20,
      price: 108.37,
      averageCost: 105.45,
      value: 2167.4,
      change: 0.18,
      changePercent: 0.17,
      profitLoss: 58.4,
      profitLossPercent: 2.77,
      allocation: 7.55,
    },
  ],
  etfs: [
    {
      id: "8",
      symbol: "SPY",
      name: "SPDR S&P 500 ETF Trust",
      quantity: 15,
      price: 518.75,
      averageCost: 475.2,
      value: 7781.25,
      change: 1.85,
      changePercent: 0.36,
      profitLoss: 653.25,
      profitLossPercent: 9.16,
      allocation: 27.11,
    },
    {
      id: "9",
      symbol: "QQQ",
      name: "Invesco QQQ Trust",
      quantity: 8,
      price: 437.82,
      averageCost: 385.45,
      value: 3502.56,
      change: 2.56,
      changePercent: 0.59,
      profitLoss: 418.96,
      profitLossPercent: 13.58,
      allocation: 12.2,
    },
  ],
  crypto: [
    {
      id: "10",
      symbol: "BTC",
      name: "Bitcoin",
      quantity: 0.35,
      price: 67235.45,
      averageCost: 42500.0,
      value: 23532.41,
      change: 1230.2,
      changePercent: 1.86,
      profitLoss: 8657.41,
      profitLossPercent: 58.24,
      allocation: 8.2,
    },
  ],
}

export function InvestmentTable({ type = "all" }) {
  const [sortColumn, setSortColumn] = useState("value")
  const [sortDirection, setSortDirection] = useState("desc")

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(column)
      setSortDirection("desc")
    }
  }

  let displayData = []

  if (type === "all") {
    displayData = [...investmentData.stocks, ...investmentData.bonds, ...investmentData.etfs, ...investmentData.crypto]
  } else {
    displayData = investmentData[type] || []
  }

  // Sort the data
  displayData.sort((a, b) => {
    if (sortDirection === "asc") {
      return a[sortColumn] - b[sortColumn]
    } else {
      return b[sortColumn] - a[sortColumn]
    }
  })

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Symbol</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead className="cursor-pointer" onClick={() => handleSort("price")}>
              <div className="flex items-center">
                Price
                {sortColumn === "price" && (
                  <ChevronDown className={`ml-1 h-4 w-4 ${sortDirection === "asc" ? "rotate-180 transform" : ""}`} />
                )}
              </div>
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => handleSort("value")}>
              <div className="flex items-center">
                Value
                {sortColumn === "value" && (
                  <ChevronDown className={`ml-1 h-4 w-4 ${sortDirection === "asc" ? "rotate-180 transform" : ""}`} />
                )}
              </div>
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => handleSort("profitLoss")}>
              <div className="flex items-center">
                P/L
                {sortColumn === "profitLoss" && (
                  <ChevronDown className={`ml-1 h-4 w-4 ${sortDirection === "asc" ? "rotate-180 transform" : ""}`} />
                )}
              </div>
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => handleSort("allocation")}>
              <div className="flex items-center">
                Allocation
                {sortColumn === "allocation" && (
                  <ChevronDown className={`ml-1 h-4 w-4 ${sortDirection === "asc" ? "rotate-180 transform" : ""}`} />
                )}
              </div>
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => handleSort("changePercent")}>
              <div className="flex items-center">
                24h Change
                {sortColumn === "changePercent" && (
                  <ChevronDown className={`ml-1 h-4 w-4 ${sortDirection === "asc" ? "rotate-180 transform" : ""}`} />
                )}
              </div>
            </TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {displayData.map((investment) => (
            <TableRow key={investment.id}>
              <TableCell className="font-medium">{investment.symbol}</TableCell>
              <TableCell>{investment.name}</TableCell>
              <TableCell>{investment.quantity.toLocaleString()}</TableCell>
              <TableCell>
                ${investment.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </TableCell>
              <TableCell>
                ${investment.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </TableCell>
              <TableCell className={investment.profitLoss >= 0 ? "text-green-500" : "text-red-500"}>
                $
                {investment.profitLoss.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
                <span className="ml-1 text-xs">
                  (
                  {investment.profitLossPercent.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                  %)
                </span>
              </TableCell>
              <TableCell>
                {investment.allocation.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
                %
              </TableCell>
              <TableCell className={investment.changePercent >= 0 ? "text-green-500" : "text-red-500"}>
                <div className="flex items-center">
                  {investment.changePercent >= 0 ? (
                    <ArrowUp className="mr-1 h-4 w-4" />
                  ) : (
                    <ArrowDown className="mr-1 h-4 w-4" />
                  )}
                  {investment.changePercent.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                  %
                </div>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Open menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem>Buy more</DropdownMenuItem>
                    <DropdownMenuItem>Sell</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>View details</DropdownMenuItem>
                    <DropdownMenuItem>Set alert</DropdownMenuItem>
                    <DropdownMenuItem>Add to watchlist</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}