"use client"

import { ArrowRight, InfoIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export function RiskAssessment() {
  const riskMetrics = [
    {
      name: "Volatility",
      value: 72,
      description: "How much your portfolio fluctuates in value",
    },
    {
      name: "Beta",
      value: 85,
      description: "Your portfolio's sensitivity to market movements",
    },
    {
      name: "Drawdown",
      value: 65,
      description: "Maximum observed loss from a peak to a trough",
    },
    {
      name: "Sharpe Ratio",
      value: 80,
      description: "Return earned above risk-free rate per unit of volatility",
    },
  ]

  return (
    <>
      <CardHeader>
        <CardTitle>Risk Assessment</CardTitle>
        <CardDescription>Key risk metrics for your portfolio</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6 rounded-lg border bg-muted/50 p-4 text-center">
          <p className="text-sm text-muted-foreground">Risk Profile</p>
          <h3 className="text-xl font-bold">Moderately Aggressive</h3>
          <div className="mt-2">
            <Progress value={68} className="h-2" />
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
            <span>Conservative</span>
            <span>Aggressive</span>
          </div>
        </div>

        <TooltipProvider>
          <div className="space-y-4">
            {riskMetrics.map((metric) => (
              <div key={metric.name}>
                <div className="mb-1 flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-medium">{metric.name}</span>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <InfoIcon className="h-3 w-3 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="w-[200px] text-xs">{metric.description}</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <span className="text-sm">{metric.value}/100</span>
                </div>
                <Progress value={metric.value} className="h-2" />
              </div>
            ))}
          </div>
        </TooltipProvider>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full">
          View Risk Details
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </>
  )
}

