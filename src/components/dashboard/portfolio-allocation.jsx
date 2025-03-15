"use client"

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  ChartContainer,
  Tooltip,
  TooltipContent,
  Legend,
} from "@/components/ui/chart"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const data = [
  { name: "Stocks", value: 65, color: "hsl(var(--primary))" },
  { name: "Bonds", value: 20, color: "hsl(var(--primary) / 0.7)" },
  { name: "Cash", value: 10, color: "hsl(var(--primary) / 0.5)" },
  { name: "Real Estate", value: 5, color: "hsl(var(--primary) / 0.3)" },
]

export function PortfolioAllocation() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Asset Allocation</CardTitle>
        <CardDescription>Your current portfolio distribution</CardDescription>
      </CardHeader>
      <CardContent>
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
        <div className="mt-4 grid grid-cols-2 gap-4">
          {data.map((item) => (
            <div key={item.name} className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }}></div>
              <div className="flex-1 text-sm">
                <span className="font-medium">{item.name}</span>
                <span className="ml-2 text-muted-foreground">{item.value}%</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
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