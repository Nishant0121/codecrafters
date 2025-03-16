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

// Multilingual translations for English, Hindi, and Marathi
const translations = {
  en: {
    dashboard: "Dashboard",
    welcome: "Welcome back! Here's an overview of your investments.",
    notifications: "Notifications",
    newInvestment: "New Investment",
    totalPortfolioValue: "Total Portfolio Value",
    fromLastMonth: "from last month",
    monthlyReturns: "Monthly Returns",
    availableCash: "Available Cash",
    readyToInvest: "Ready to invest",
    deposit: "Deposit",
    invest: "Invest",
    summary: "Summary",
    investments: "Investments",
    activity: "Activity",
    yourInvestments: "Your Investments",
    detailedView: "A detailed view of all your current investments",
    loading: "Loading...",
  },
  hi: {
    dashboard: "डैशबोर्ड",
    welcome: "वापस आने पर स्वागत है! यहां आपके निवेश का एक अवलोकन है।",
    notifications: "सूचनाएं",
    newInvestment: "नया निवेश",
    totalPortfolioValue: "कुल पोर्टफोलियो मूल्य",
    fromLastMonth: "पिछले महीने से",
    monthlyReturns: "मासिक रिटर्न",
    availableCash: "उपलब्ध नकदी",
    readyToInvest: "निवेश के लिए तैयार",
    deposit: "जमा करें",
    invest: "निवेश करें",
    summary: "सारांश",
    investments: "निवेश",
    activity: "गतिविधि",
    yourInvestments: "आपके निवेश",
    detailedView: "आपके सभी वर्तमान निवेशों का विस्तृत दृश्य",
    loading: "लोड हो रहा है...",
  },
  mr: {
    dashboard: "डॅशबोर्ड",
    welcome: "पुन्हा स्वागत आहे! येथे आपल्या गुंतवणुकीचा एक आढावा आहे.",
    notifications: "सूचना",
    newInvestment: "नवीन गुंतवणूक",
    totalPortfolioValue: "एकूण पोर्टफोलिओ मूल्य",
    fromLastMonth: "मागील महिन्यापासून",
    monthlyReturns: "मासिक परतावा",
    availableCash: "उपलब्ध रोख रक्कम",
    readyToInvest: "गुंतवणूक करण्यासाठी तयार",
    deposit: "जमा करा",
    invest: "गुंतवणूक करा",
    summary: "सारांश",
    investments: "गुंतवणूक",
    activity: "कार्यकलाप",
    yourInvestments: "तुमची गुंतवणूक",
    detailedView: "आपल्या सर्व चालू गुंतवणुकीचा तपशीलवार दृष्टिकोन",
    loading: "लोड करत आहे...",
  },
};

export default function DashboardPage() {
  const [investmentData, setInvestmentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [balance, setBalance] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const { loginUser, language, setLanguage } = useContext(AppContext);

  // Function to get text based on current language
  const getText = (key) => {
    return translations[language][key] || translations.en[key];
  };

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

  useEffect(() => {
    const fetchWalletData = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/stock/wallet/balance/${loginUser.uid}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch wallet data");
        }
        const data = await response.json();
        setBalance(data.balance);
        setTransactions(data.transactions);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWalletData();
  }, [loginUser.uid]);

  return (
    <div className="container mx-auto px-4 pt-20">
      {/* Language Selector */}

      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {getText("dashboard")}
          </h1>
          <p className="text-muted-foreground">{getText("welcome")}</p>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm">
            <Bell className="mr-2 h-4 w-4" />
            {getText("notifications")}
          </Button>
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" />
            {getText("newInvestment")}
          </Button>
        </div>
      </div>

      {loading ? (
        <p>{getText("loading")}</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <>
          <div className="mb-8 grid gap-4 md:grid-cols-3">
            <Card className="dashboard-card">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  {getText("totalPortfolioValue")}
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${investmentData.totalPortfolioValue.toFixed(2)}
                </div>
                <div className="flex items-center text-xs text-green-500">
                  <ArrowUpRight className="mr-1 h-3 w-3" />
                  +2.5% {getText("fromLastMonth")}
                </div>
                <Progress value={75} className="mt-3 h-2" />
              </CardContent>
            </Card>

            <Card className="dashboard-card">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  {getText("monthlyReturns")}
                </CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$1,245.32</div>
                <div className="flex items-center text-xs text-green-500">
                  <ArrowUpRight className="mr-1 h-3 w-3" />
                  +4.3% {getText("fromLastMonth")}
                </div>
                <Progress value={65} className="mt-3 h-2" />
              </CardContent>
            </Card>

            <Card className="dashboard-card">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  {getText("availableCash")}
                </CardTitle>
                <Wallet className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${balance?.toFixed(2)}</div>
                <div className="mt-1 text-xs text-muted-foreground">
                  {getText("readyToInvest")}
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <Link to="/pay">
                    <Button size="sm" variant="outline" className="h-8">
                      <CreditCard className="mr-2 h-3 w-3" />
                      {getText("deposit")}
                    </Button>
                  </Link>
                  <Link to="/watchlist">
                    <Button size="sm" className="h-8">
                      <LineChart className="mr-2 h-3 w-3" />
                      {getText("invest")}
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="summary" className="space-y-4">
            <TabsList>
              <TabsTrigger value="summary">{getText("summary")}</TabsTrigger>
              <TabsTrigger value="investments">
                {getText("investments")}
              </TabsTrigger>
              <TabsTrigger value="activity">{getText("activity")}</TabsTrigger>
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
                  <CardTitle>{getText("yourInvestments")}</CardTitle>
                  <CardDescription>{getText("detailedView")}</CardDescription>
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
