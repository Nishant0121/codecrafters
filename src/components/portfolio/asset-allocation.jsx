"use client"

import {
  Cell,
  ChartContainer,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  TooltipContent,
} from "@/components/ui/chart"
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function AssetAllocation() {
  const assetTypes = [
    { name: "US Stocks", value: 45, color: "hsl(var(--primary))" },
    { name: "Int'l Stocks", value: 20, color: "hsl(var(--primary) / 0.7)" },
    { name: "Bonds", value: 15, color: "hsl(var(--primary) / 0.5)" },
    { name: "Real Estate", value: 10, color: "hsl(var(--primary) / 0.3)" },
    { name: "Alternative", value: 5, color: "hsl(var(--secondary) / 0.7)" },
    { name: "Cash", value: 5, color: "hsl(var(--secondary) / 0.4)" },
  ]

  const sectorData = [
    { name: "Technology", value: 35, color: "hsl(var(--primary))" },
    { name: "Healthcare", value: 18, color: "hsl(var(--primary) / 0.8)" },
    { name: "Financials", value: 15, color: "hsl(var(--primary) / 0.6)" },
    { name: "Consumer", value: 12, color: "hsl(var(--primary) / 0.4)" },
    { name: "Industrials", value: 8, color: "hsl(var(--secondary) / 0.8)" },
    { name: "Energy", value: 7, color: "hsl(var(--secondary) / 0.6)" },
    { name: "Other", value: 5, color: "hsl(var(--secondary) / 0.4)" },
  ]

  const geographyData = [
    { name: "United States", value: 65, color: "hsl(var(--primary))" },
    { name: "Europe", value: 15, color: "hsl(var(--primary) / 0.7)" },
    { name: "Asia Pacific", value: 12, color: "hsl(var(--primary) / 0.5)" },
    { name: "Emerging Markets", value: 8, color: "hsl(var(--secondary) / 0.7)" },
  ]

  return (
    <>
      <CardHeader>
        <CardTitle>Asset Allocation</CardTitle>
        <CardDescription>Portfolio breakdown by asset class</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="asset-class">
          <TabsList className="mb-4 w-full grid grid-cols-3">
            <TabsTrigger value="asset-class">Asset Class</TabsTrigger>
            <TabsTrigger value="sector">Sector</TabsTrigger>
            <TabsTrigger value="geography">Geography</TabsTrigger>
          </TabsList>

          <TabsContent value="asset-class">
            <AllocationChart data={assetTypes} />
          </TabsContent>

          <TabsContent value="sector">
            <AllocationChart data={sectorData} />
          </TabsContent>

          <TabsContent value="geography">
            <AllocationChart data={geographyData} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </>
  )
}

function AllocationChart({ data }) {
  return (
    <div className="h-[250px]">
      <ResponsiveContainer width="100%" height="100%">
        <ChartContainer data={data}>
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <PieChart>
            <Pie data={data} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={2} dataKey="value">
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>
      </ResponsiveContainer>
    </div>
  )
}

function CustomTooltip({ active, payload }) {
  if (active && payload && payload.length) {
    return (
      <TooltipContent>
        <div className="flex flex-col gap-2">
          <p className="text-muted-foreground">{payload[0].name}</p>
          <p className="font-medium">{payload[0].value}%</p>
        </div>
      </TooltipContent>
    )
  }
  return null
}

