"use client"

import {
  BarChart,
  Cell,
  ChartContainer,
  ResponsiveContainer,
  Tooltip,
  TooltipContent,
  XAxis,
  YAxis,
} from "@/components/ui/chart"
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export function DiversificationAnalysis() {
  const correlationData = [
    {
      name: "Stock-Bond",
      score: 82,
      description: "Low correlation between stocks and bonds",
    },
    {
      name: "Sector",
      score: 65,
      description: "Good sector diversification",
    },
    {
      name: "Geographic",
      score: 70,
      description: "Good geographic diversification",
    },
    {
      name: "Style",
      score: 75,
      description: "Good mix of growth and value",
    },
  ]

  const sectorExposure = [
    { name: "Tech", value: 35 },
    { name: "Health", value: 18 },
    { name: "Fin", value: 15 },
    { name: "Cons", value: 12 },
    { name: "Ind", value: 8 },
    { name: "Energy", value: 7 },
    { name: "Other", value: 5 },
  ]

  return (
    <>
      <CardHeader>
        <CardTitle>Diversification Analysis</CardTitle>
        <CardDescription>How well diversified your portfolio is</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6 rounded-lg border bg-muted/50 p-4 text-center">
          <p className="text-sm text-muted-foreground">Diversification Score</p>
          <h3 className="text-xl font-bold">72/100</h3>
          <div className="mt-2">
            <Progress value={72} className="h-2" />
          </div>
          <p className="mt-2 text-xs text-muted-foreground">Well diversified across asset classes</p>
        </div>

        <div className="space-y-4">
          {correlationData.map((item) => (
            <div key={item.name}>
              <div className="mb-1 flex items-center justify-between">
                <span className="text-sm font-medium">{item.name}</span>
                <span className="text-sm">{item.score}/100</span>
              </div>
              <Progress value={item.score} className="h-2" />
              <p className="mt-1 text-xs text-muted-foreground">{item.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-6">
          <h4 className="mb-2 text-sm font-medium">Sector Exposure</h4>
          <div className="h-[125px]">
            <ResponsiveContainer width="100%" height="100%">
              <ChartContainer data={sectorExposure}>
                <Tooltip content={<CustomTooltip />} />
                <XAxis dataKey="name" axisLine={false} />
                <YAxis axisLine={false} tickFormatter={(value) => `${value}%`} />
                <BarChart>
                  {sectorExposure.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={index === 0 ? "hsl(var(--primary))" : `hsl(var(--primary) / ${0.8 - index * 0.1})`}
                    />
                  ))}
                </BarChart>
              </ChartContainer>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </>
  )
}

function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <TooltipContent>
        <div className="flex flex-col gap-2">
          <p className="text-muted-foreground">{label}</p>
          <p className="font-medium">{payload[0].value}%</p>
        </div>
      </TooltipContent>
    )
  }
  return null
}

