"use client";

import { useContext, useEffect, useState } from "react";
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
import { GoogleGenerativeAI } from "@google/generative-ai";
import axios from "axios";

const genAI = new GoogleGenerativeAI("AIzaSyDOky3a0Mpbe13I6Zo4t-RZ-pt4F8NbG5I");

export default function PortfolioPage() {
  const { loginUser } = useContext(AppContext);
  const [gendata, setGenData] = useState({ rating: null, tipToImprove: "" });

  const generateGeminiResponse = async (prompt) => {
    try {
      const model = genAI.getGenerativeModel({
        model: "gemini-2.0-flash",
        systemInstruction:
          "Provide a JSON output with two fields:\n" +
          '- "rating": a number between 0 and 100 representing diversification score.\n' +
          '- "tipToImprove": a short text providing suggestions to improve diversification.\n' +
          "Ensure the output is a valid JSON object without markdown formatting.",
      });

      const result = await model.generateContent(prompt);

      // Extract text response
      let response = await result.response.text();

      // Clean JSON output
      response = response.replace(/```json\n([\s\S]*?)\n```/, "$1").trim();

      try {
        return JSON.parse(response);
      } catch (jsonError) {
        console.error("Error parsing JSON:", jsonError, "Response:", response);
        return { rating: null, tipToImprove: "Unable to fetch data" };
      }
    } catch (error) {
      console.error("Error generating response:", error);
      return {
        rating: null,
        tipToImprove: "Error fetching diversification analysis",
      };
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/stock/getProfile/${loginUser?.uid}`
        );

        if (!response.data) {
          console.error("API response is empty");
          return;
        }

        const geminiRes = await generateGeminiResponse(
          JSON.stringify(response.data)
        );
        setGenData(geminiRes);
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };

    fetchData();

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

        {/* Dynamic Diversification Score */}
        <Card className="portfolio-card">
          <CardHeader className="pb-2">
            <CardDescription>Diversification</CardDescription>
            <CardTitle className="text-2xl">
              {gendata.rating !== null ? `${gendata.rating}/100` : "Loading..."}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              {gendata.tipToImprove || "Fetching diversification tips..."}
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
