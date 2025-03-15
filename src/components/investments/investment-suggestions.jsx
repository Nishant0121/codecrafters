"use client"

import { ExternalLink } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function InvestmentSuggestions({ className = "" }) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Investment Suggestions</CardTitle>
        <CardDescription>Personalized recommendations based on your portfolio</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="recommended">
          <TabsList className="mb-4 w-full">
            <TabsTrigger value="recommended" className="flex-1">
              Recommended
            </TabsTrigger>
            <TabsTrigger value="trending" className="flex-1">
              Trending
            </TabsTrigger>
            <TabsTrigger value="predictions" className="flex-1">
              Predictions
            </TabsTrigger>
          </TabsList>

          <TabsContent value="recommended" className="space-y-4">
            <div className="space-y-4">
              <SuggestionCard
                title="Technology Sector ETF"
                symbol="XLK"
                description="Based on your current portfolio allocation, adding a technology sector ETF could enhance diversification and growth potential."
                metrics={[
                  { label: "Expected Return", value: "12.5%" },
                  { label: "Risk Level", value: "Medium" },
                  { label: "Expense Ratio", value: "0.10%" },
                ]}
                tags={["Growth", "Technology", "ETF"]}
              />

              <SuggestionCard
                title="Treasury Bond ETF"
                symbol="GOVT"
                description="To balance your equity exposure, this treasury bond ETF offers stability and income with minimal correlation to stocks."
                metrics={[
                  { label: "Yield", value: "3.8%" },
                  { label: "Risk Level", value: "Low" },
                  { label: "Expense Ratio", value: "0.05%" },
                ]}
                tags={["Income", "Bonds", "Stability"]}
              />

              <SuggestionCard
                title="Green Energy Fund"
                symbol="ICLN"
                description="Diversify into clean energy with this fund that focuses on companies in the renewable energy sector."
                metrics={[
                  { label: "Expected Return", value: "15.2%" },
                  { label: "Risk Level", value: "High" },
                  { label: "Expense Ratio", value: "0.42%" },
                ]}
                tags={["ESG", "Growth", "Sector"]}
              />
            </div>
          </TabsContent>

          <TabsContent value="trending" className="space-y-4">
            <div className="space-y-4">
              <SuggestionCard
                title="Artificial Intelligence ETF"
                symbol="BOTZ"
                description="This ETF focuses on companies developing or implementing artificial intelligence and robotics technologies."
                metrics={[
                  { label: "1-Month Return", value: "8.7%" },
                  { label: "Trading Volume", value: "↑ 65%" },
                  { label: "Analyst Rating", value: "Buy" },
                ]}
                tags={["Trending", "Technology", "Growth"]}
              />

              <SuggestionCard
                title="Semiconductor Company"
                symbol="NVDA"
                description="Leading semiconductor company with strong growth in AI, data centers, and gaming markets."
                metrics={[
                  { label: "1-Month Return", value: "12.3%" },
                  { label: "Trading Volume", value: "↑ 89%" },
                  { label: "Analyst Rating", value: "Strong Buy" },
                ]}
                tags={["Hot Stock", "Technology", "AI"]}
              />

              <SuggestionCard
                title="Cybersecurity Fund"
                symbol="HACK"
                description="ETF focused on companies providing cybersecurity solutions with increasing demand due to rising cyber threats."
                metrics={[
                  { label: "1-Month Return", value: "7.2%" },
                  { label: "Trading Volume", value: "↑ 45%" },
                  { label: "Analyst Rating", value: "Buy" },
                ]}
                tags={["Trending", "Security", "Technology"]}
              />
            </div>
          </TabsContent>

          <TabsContent value="predictions" className="space-y-4">
            <div className="space-y-4">
              <SuggestionCard
                title="E-Commerce Leader"
                symbol="AMZN"
                description="Our predictive models show strong potential for this e-commerce and cloud computing leader in the next 12 months."
                metrics={[
                  { label: "12-Month Target", value: "$215" },
                  { label: "Upside Potential", value: "20.5%" },
                  { label: "Confidence Score", value: "85%" },
                ]}
                tags={["AI Prediction", "Growth", "E-Commerce"]}
              />

              <SuggestionCard
                title="Emerging Markets ETF"
                symbol="VWO"
                description="Our prediction models indicate strong recovery potential for emerging markets in the next 18 months."
                metrics={[
                  { label: "18-Month Target", value: "$52" },
                  { label: "Upside Potential", value: "24.7%" },
                  { label: "Confidence Score", value: "78%" },
                ]}
                tags={["AI Prediction", "International", "Recovery"]}
              />

              <SuggestionCard
                title="Biotech Innovation"
                symbol="XBI"
                description="Predicted breakthrough announcements in the biotech sector could drive significant gains in this ETF."
                metrics={[
                  { label: "12-Month Target", value: "$110" },
                  { label: "Upside Potential", value: "31.2%" },
                  { label: "Confidence Score", value: "72%" },
                ]}
                tags={["AI Prediction", "Biotech", "Speculative"]}
              />
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full">
          <ExternalLink className="mr-2 h-4 w-4" />
          View All Recommendations
        </Button>
      </CardFooter>
    </Card>
  )
}

function SuggestionCard({ title, symbol, description, metrics, tags }) {
  return (
    <div className="rounded-lg border p-4">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-medium">{title}</h3>
          <p className="text-sm font-medium text-muted-foreground">{symbol}</p>
        </div>
        <Button variant="outline" size="sm">
          View
        </Button>
      </div>

      <p className="mt-2 text-sm text-muted-foreground">{description}</p>

      <div className="mt-4 grid grid-cols-3 gap-2">
        {metrics.map((metric, index) => (
          <div key={index} className="rounded-md bg-muted p-2 text-center">
            <p className="text-xs text-muted-foreground">{metric.label}</p>
            <p className="text-sm font-medium">{metric.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {tags.map((tag, index) => (
          <div key={index} className="rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
            {tag}
          </div>
        ))}
      </div>
    </div>
  )
}