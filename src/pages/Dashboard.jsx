import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  Bell,
  CreditCard,
  DollarSign,
  LineChart,
  Plus,
  Wallet,
} from "lucide-react";
import gsap from "gsap";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InvestmentSummary } from "@/components/dashboard/investment-summary";
import { MarketUpdates } from "@/components/dashboard/market-updates";
import StockNews from "@/components/dashboard/portfolio-allocation";
import { RecentTransactions } from "@/components/dashboard/recent-transactions";
import { WatchlistStocks } from "@/components/dashboard/watchlist-stocks";
import { AppContext } from "@/context/appContext";

export default function DashboardPage() {
  const [investmentData, setInvestmentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { loginUser } = useContext(AppContext);

  useEffect(() => {
    // Fetch investment data from API
    const fetchInvestmentData = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/stock/getInvestment/${loginUser.uid}`
        );
        console.log(response);
        if (!response.ok) {
          throw new Error("Failed to fetch investment data");
        }
        const data = await response.json();
        setInvestmentData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInvestmentData();

    // Animation for dashboard elements
    gsap.fromTo(
      ".dashboard-card",
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.1,
        ease: "power1.out",
      }
    );
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [loginUser]);

  return (
    <div className="container mx-auto px-4 pt-20">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's an overview of your investments.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm">
            <Bell className="mr-2 h-4 w-4" />
            Notifications
          </Button>
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" />
            New Investment
          </Button>
        </div>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <>
          <div className="mb-8 grid gap-4 md:grid-cols-3">
            <Card className="dashboard-card">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Portfolio Value
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${investmentData.totalPortfolioValue.toFixed(2)}
                </div>
                <div className="flex items-center text-xs text-green-500">
                  <ArrowUpRight className="mr-1 h-3 w-3" />
                  +2.5% from last month
                </div>
                <Progress value={75} className="mt-3 h-2" />
              </CardContent>
            </Card>

            <Card className="dashboard-card">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Monthly Returns
                </CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$1,245.32</div>
                <div className="flex items-center text-xs text-green-500">
                  <ArrowUpRight className="mr-1 h-3 w-3" />
                  +4.3% from last month
                </div>
                <Progress value={65} className="mt-3 h-2" />
              </CardContent>
            </Card>

            <Card className="dashboard-card">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Available Cash
                </CardTitle>
                <Wallet className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$4,780.00</div>
                <div className="mt-1 text-xs text-muted-foreground">
                  Ready to invest
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <Button size="sm" variant="outline" className="h-8">
                    <CreditCard className="mr-2 h-3 w-3" />
                    Deposit
                  </Button>
                  <Button size="sm" className="h-8">
                    <LineChart className="mr-2 h-3 w-3" />
                    Invest
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="summary" className="space-y-4">
            <TabsList>
              <TabsTrigger value="summary">Summary</TabsTrigger>
              <TabsTrigger value="investments">Investments</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
            </TabsList>

            <TabsContent value="summary" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-7">
                <div className="dashboard-card col-span-7 md:col-span-4">
                  <InvestmentSummary data={investmentData} />
                </div>
                <div className="dashboard-card col-span-7 md:col-span-3">
                  <StockNews />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="dashboard-card">
                  <MarketUpdates />
                </div>
                <div className="dashboard-card">
                  <RecentTransactions />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="investments" className="space-y-4">
              <Card className="dashboard-card">
                <CardHeader>
                  <CardTitle>Your Investments</CardTitle>
                  <CardDescription>
                    A detailed view of all your current investments
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <WatchlistStocks data={investmentData.stocks} />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
}
