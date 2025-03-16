import { useEffect } from "react"
import { Plus, Search, SlidersHorizontal, Wallet } from "lucide-react"
import gsap from "gsap"
import { Link } from "react-router-dom"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { InvestmentSuggestions } from "@/components/investments/investment-suggestions"
import { OrderPanel } from "@/components/investments/order-panel"
import { InvestmentTable } from "@/components/investments/investment-table"

export default function InvestmentsPage() {
  useEffect(() => {
    // Animation for page elements
    gsap.fromTo(
      ".investment-card",
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.1,
        ease: "power2.out",
      },
    )

    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [])

  return (
    <div className="container mx-auto px-4 pt-20">
      <div className="mb-8 flex flex-col gap-4 pt-8 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Investments</h1>
          <p className="text-muted-foreground">Manage your stocks, bonds, and other investments</p>
        </div>
        <div className="flex items-center gap-4">
          <Link to='/portfolio'>
          <Button variant="outline" size="sm">
            <Wallet className="mr-2 h-4 w-4" />
            Portfolio
          </Button>
          </Link>
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" />
            New Investment
          </Button>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-8">
        <div className="md:col-span-6">
          <Card className="investment-card mb-8">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Your Investments</CardTitle>
                  <CardDescription>Current positions and performance</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <SlidersHorizontal className="mr-2 h-4 w-4" />
                    Filters
                  </Button>
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input type="search" placeholder="Search..." className="pl-8 md:w-[200px] lg:w-[250px]" />
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="all" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="stocks">Stocks</TabsTrigger>
                  <TabsTrigger value="bonds">Bonds</TabsTrigger>
                  <TabsTrigger value="etfs">ETFs</TabsTrigger>
                  <TabsTrigger value="crypto">Crypto</TabsTrigger>
                </TabsList>

                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="rounded-sm px-2 py-1 text-xs">
                    Asset Type: All <button className="ml-1 text-xs">×</button>
                  </Badge>
                  <Badge variant="outline" className="rounded-sm px-2 py-1 text-xs">
                    Performance: Positive <button className="ml-1 text-xs">×</button>
                  </Badge>
                </div>

                <TabsContent value="all">
                  <InvestmentTable />
                </TabsContent>
                <TabsContent value="stocks">
                  <InvestmentTable type="stocks" />
                </TabsContent>
                <TabsContent value="bonds">
                  <InvestmentTable type="bonds" />
                </TabsContent>
                <TabsContent value="etfs">
                  <InvestmentTable type="etfs" />
                </TabsContent>
                <TabsContent value="crypto">
                  <InvestmentTable type="crypto" />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <InvestmentSuggestions className="investment-card" />
        </div>

        <div className="md:col-span-2">
          <OrderPanel className="investment-card sticky top-20" />
        </div>
      </div>
    </div>
  )
}

