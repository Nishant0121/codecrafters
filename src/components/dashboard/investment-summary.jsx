"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  AreaChart,
  Bar,
  CartesianGrid,
  ChartContainer,
  Line,
  ResponsiveContainer,
  TickLabels,
  Tooltip,
  TooltipContent,
  XAxis,
  YAxis,
} from "@/components/ui/chart"

const data = [
  { month: "Jan", value: 21340 },
  { month: "Feb", value: 22150 },
  { month: "Mar", value: 21980 },
  { month: "Apr", value: 22780 },
  { month: "May", value: 23900 },
  { month: "Jun", value: 24800 },
  { month: "Jul", value: 25100 },
  { month: "Aug", value: 26200 },
  { month: "Sep", value: 27500 },
  { month: "Oct", value: 28100 },
  { month: "Nov", value: 28700 },
  { month: "Dec", value: 28450 },
]

export function InvestmentSummary() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Portfolio Performance</CardTitle>
        <CardDescription>Your investment growth over the past year</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <ChartContainer data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <XAxis axisLine={false}>
                <TickLabels formatter={(value) => value} />
              </XAxis>
              <YAxis tickFormatter={(value) => `$${Math.floor(value / 1000)}k`} axisLine={false} />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip content={<CustomTooltip />} />
              <AreaChart>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  activeDot={{ r: 6 }}
                />
                <Bar type="monotone" dataKey="value" fill="url(#colorValue)" fillOpacity={1} />
              </AreaChart>
            </ChartContainer>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <TooltipContent>
        <div className="flex flex-col gap-2">
          <p className="text-muted-foreground">{label}</p>
          <p className="font-medium">${payload[0].value.toLocaleString()}</p>
        </div>
      </TooltipContent>
    )
  }
  return null
}

