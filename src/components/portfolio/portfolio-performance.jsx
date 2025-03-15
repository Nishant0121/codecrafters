"use client"

import { useEffect, useState } from "react"
import {
  AreaChart,
  CartesianGrid,
  ChartContainer,
  Line,
  ResponsiveContainer,
  TickLabels,
  XAxis,
  YAxis,
} from "@/components/ui/chart"
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

const monthlyData = [
  { month: "Jan", portfolio: 23500, benchmark: 23200 },
  { month: "Feb", portfolio: 24100, benchmark: 23800 },
  { month: "Mar", portfolio: 23900, benchmark: 23600 },
  { month: "Apr", portfolio: 24800, benchmark: 24200 },
  { month: "May", portfolio: 25600, benchmark: 24800 },
  { month: "Jun", portfolio: 26200, benchmark: 25300 },
  { month: "Jul", portfolio: 26800, benchmark: 25700 },
  { month: "Aug", portfolio: 27300, benchmark: 26100 },
  { month: "Sep", portfolio: 27000, benchmark: 25800 },
  { month: "Oct", portfolio: 27800, benchmark: 26300 },
  { month: "Nov", portfolio: 28200, benchmark: 26600 },
  { month: "Dec", portfolio: 28450, benchmark: 26900 },
]

const weeklyData = [
  { week: "W1", portfolio: 27800, benchmark: 26300 },
  { week: "W2", portfolio: 27900, benchmark: 26400 },
  { week: "W3", portfolio: 28050, benchmark: 26500 },
  { week: "W4", portfolio: 28200, benchmark: 26600 },
  { week: "W5", portfolio: 28450, benchmark: 26900 },
]

const yearlyData = [
  { year: "2019", portfolio: 18500, benchmark: 18200 },
  { year: "2020", portfolio: 20100, benchmark: 19800 },
  { year: "2021", portfolio: 23600, benchmark: 22900 },
  { year: "2022", portfolio: 25800, benchmark: 24900 },
  { year: "2023", portfolio: 28450, benchmark: 26900 },
]

export function PortfolioPerformance() {
  const [period, setPeriod] = useState("1Y")
  const [chartData, setChartData] = useState(monthlyData)
  const [xKey, setXKey] = useState("month")

  useEffect(() => {
    switch (period) {
      case "1M":
        setChartData(weeklyData)
        setXKey("week")
        break
      case "1Y":
        setChartData(monthlyData)
        setXKey("month")
        break
      case "5Y":
        setChartData(yearlyData)
        setXKey("year")
        break
      default:
        setChartData(monthlyData)
        setXKey("month")
    }
  }, [period])

  return (
    <>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Performance</CardTitle>
            <CardDescription>Portfolio vs. Benchmark (S&P 500)</CardDescription>
          </div>
          <Tabs value={period} onValueChange={setPeriod} className="w-[180px]">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="1M">1M</TabsTrigger>
              <TabsTrigger value="1Y">1Y</TabsTrigger>
              <TabsTrigger value="5Y">5Y</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <ChartContainer data={chartData}>
              <XAxis dataKey={xKey} axisLine={false}>
                <TickLabels formatter={(value) => value} />
              </XAxis>
              <YAxis tickFormatter={(value) => `$${Math.floor(value / 1000)}k`} axisLine={false} />
              <CartesianGrid strokeDasharray="3 3" />
              <AreaChart>
                <defs>
                  <linearGradient id="colorPortfolio" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.1} />
                  </linearGradient>
                  <linearGradient id="colorBenchmark" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--muted-foreground))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--muted-foreground))" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <Line
                  type="monotone"
                  dataKey="portfolio"
                  name="Your Portfolio"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="benchmark"
                  name="S&P 500"
                  stroke="hsl(var(--muted-foreground))"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                />
              </AreaChart>
            </ChartContainer>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-primary"></div>
              <span className="text-sm">Your Portfolio</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-muted-foreground"></div>
              <span className="text-sm">S&P 500</span>
            </div>
          </div>
          <div className="text-sm text-green-500">+5.8% vs Benchmark</div>
        </div>
      </CardContent>
    </>
  )
}

