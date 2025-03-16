"use client";

import { useContext, useEffect } from "react";
import { Calendar, Download, Printer } from "lucide-react";
import gsap from "gsap";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PortfolioOverview } from "@/components/portfolio/portfolio-overview";
import { StockRecommendations } from "@/components/portfolio/portfolio-performance";
import { AssetAllocation } from "@/components/portfolio/asset-allocation";
import { RiskAssessment } from "@/components/portfolio/risk-assessment";
import { DiversificationAnalysis } from "@/components/portfolio/diversification-analysis";
import { AppContext } from "@/context/appContext";

export default function PortfolioPage() {
  const { loginUser } = useContext(AppContext);

  useEffect(() => {
    // Animation for portfolio cards
    gsap.fromTo(
      ".portfolio-card",
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.1,
        ease: "power2.out",
      }
    );

    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div className="container mx-auto px-4 pt-20">
      <div className="mb-8 flex flex-col gap-4 pt-8 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Portfolio Analysis
          </h1>
          <p className="text-muted-foreground">
            Comprehensive view of your investment portfolio
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm">
            <Calendar className="mr-2 h-4 w-4" />
            Date Range
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="portfolio-card">
          <CardHeader className="pb-2">
            <CardDescription>Total Value</CardDescription>
            <CardTitle className="text-2xl">$28,456.72</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-green-500">
              +$5,238.12 (22.5%){" "}
              <span className="text-muted-foreground">YTD</span>
            </div>
          </CardContent>
        </Card>

        <Card className="portfolio-card">
          <CardHeader className="pb-2">
            <CardDescription>Annual Return</CardDescription>
            <CardTitle className="text-2xl">18.32%</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-green-500">
              +3.5% <span className="text-muted-foreground">vs S&P 500</span>
            </div>
          </CardContent>
        </Card>

        <Card className="portfolio-card">
          <CardHeader className="pb-2">
            <CardDescription>Risk Score</CardDescription>
            <CardTitle className="text-2xl">68/100</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              Moderately Aggressive
            </div>
          </CardContent>
        </Card>

        <Card className="portfolio-card">
          <CardHeader className="pb-2">
            <CardDescription>Diversification</CardDescription>
            <CardTitle className="text-2xl">72/100</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              Well Diversified
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Card className="portfolio-card">
          <PortfolioOverview />
        </Card>

        <Card className="portfolio-card">
          <StockRecommendations />
        </Card>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card className="portfolio-card">
          <AssetAllocation />
        </Card>

        <Card className="portfolio-card">
          <RiskAssessment />
        </Card>

        <Card className="portfolio-card">
          <DiversificationAnalysis />
        </Card>
      </div>
    </div>
  );
}
