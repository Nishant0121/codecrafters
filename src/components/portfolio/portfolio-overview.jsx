"use client"

import { BarChart } from "lucide-react"

import { Button } from "@/components/ui/button"
import { CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export function PortfolioOverview() {
  const assetClasses = [
    { name: "US Stocks", percentage: 45, value: "$12,805.52", growth: 24.5 },
    { name: "International Stocks", percentage: 20, value: "$5,691.34", growth: 18.2 },
    { name: "Bonds", percentage: 15, value: "$4,268.51", growth: 8.7 },
    { name: "Real Estate", percentage: 10, value: "$2,845.67", growth: 15.3 },
    { name: "Alternative", percentage: 5, value: "$1,422.84", growth: 12.1 },
    { name: "Cash", percentage: 5, value: "$1,422.84", growth: 1.2 },
  ]

  return (
    <>
      <CardHeader>
        <CardTitle>Portfolio Overview</CardTitle>
        <CardDescription>Asset allocation and performance by class</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {assetClasses.map((asset) => (
            <div key={asset.name}>
              <div className="mb-1 flex items-center justify-between">
                <div className="text-sm font-medium">{asset.name}</div>
                <div className="flex items-center gap-2">
                  <span className="text-sm">{asset.percentage}%</span>
                  <span className="text-sm font-medium">{asset.value}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Progress value={asset.percentage} className="h-2" />
                <span className={`text-xs ${asset.growth > 0 ? "text-green-500" : "text-red-500"}`}>
                  {asset.growth > 0 ? "+" : ""}
                  {asset.growth}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full">
          <BarChart className="mr-2 h-4 w-4" />
          View Detailed Breakdown
        </Button>
      </CardFooter>
    </>
  )
}