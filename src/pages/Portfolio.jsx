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
import { saveAs } from "file-saver";
import jsPDF from "jspdf";

const genAI = new GoogleGenerativeAI("AIzaSyDOky3a0Mpbe13I6Zo4t-RZ-pt4F8NbG5I");

export default function PortfolioPage() {
  const { loginUser } = useContext(AppContext);
  const [gendata, setGenData] = useState({ rating: null, tipToImprove: "" });
  const [isExporting, setIsExporting] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);

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

  // Function to export portfolio data as CSV
  const exportData = async () => {
    setIsExporting(true);
    try {
      // Get profile data if needed (we'll use static data for now)

      // Create CSV content
      let csvContent = "data:text/csv;charset=utf-8,";

      // Add header row
      csvContent += "Category,Value,Performance\n";

      // Add portfolio summary data
      csvContent += "Total Value,$28,456.72,+22.5%\n";
      csvContent += "Annual Return,18.32%,+3.5%\n";
      csvContent += "Risk Score,68/100,Moderately Aggressive\n";
      csvContent += `Diversification,${gendata.rating || "N/A"}/100,${
        gendata.tipToImprove || "N/A"
      }\n\n`;

      // Add asset allocation data
      csvContent += "Asset Class,Percentage,Value,Growth\n";
      const assetClasses = [
        {
          name: "US Stocks",
          percentage: 45,
          value: "$12,805.52",
          growth: 24.5,
        },
        {
          name: "International Stocks",
          percentage: 20,
          value: "$5,691.34",
          growth: 18.2,
        },
        { name: "Bonds", percentage: 15, value: "$4,268.51", growth: 8.7 },
        {
          name: "Real Estate",
          percentage: 10,
          value: "$2,845.67",
          growth: 15.3,
        },
        {
          name: "Alternative",
          percentage: 5,
          value: "$1,422.84",
          growth: 12.1,
        },
        { name: "Cash", percentage: 5, value: "$1,422.84", growth: 1.2 },
      ];

      assetClasses.forEach((asset) => {
        csvContent += `${asset.name},${asset.percentage}%,${asset.value},${asset.growth}%\n`;
      });

      // Create the export
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute(
        "download",
        `portfolio_report_${new Date().toISOString().split("T")[0]}.csv`
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error exporting data:", error);
      alert("Failed to export portfolio data. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  // Function to generate and print PDF report (alternative version)
  const generatePDF = async () => {
    setIsPrinting(true);
    try {
      // Create PDF directly with table data
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pageWidth = pdf.internal.pageSize.getWidth();

      // Add header
      pdf.setFontSize(18);
      pdf.setTextColor(0, 0, 0);
      pdf.text("Portfolio Analysis Report", pageWidth / 2, 15, {
        align: "center",
      });

      pdf.setFontSize(12);
      pdf.text(
        `Generated on: ${new Date().toLocaleDateString()}`,
        pageWidth / 2,
        25,
        { align: "center" }
      );
      pdf.text(`User: ${loginUser?.email || "Anonymous"}`, pageWidth / 2, 32, {
        align: "center",
      });

      // Portfolio Summary
      pdf.setFontSize(14);
      pdf.text("Portfolio Summary", 20, 45);

      // Create summary table
      pdf.setFontSize(10);
      pdf.text("Metric", 20, 55);
      pdf.text("Value", 70, 55);
      pdf.text("Performance", 120, 55);

      // Add line
      pdf.setDrawColor(200, 200, 200);
      pdf.line(20, 58, 190, 58);

      // Summary Data
      pdf.text("Total Value", 20, 65);
      pdf.text("$28,456.72", 70, 65);
      pdf.text("+$5,238.12 (22.5%) YTD", 120, 65);

      pdf.text("Annual Return", 20, 72);
      pdf.text("18.32%", 70, 72);
      pdf.text("+3.5% vs S&P 500", 120, 72);

      pdf.text("Risk Score", 20, 79);
      pdf.text("68/100", 70, 79);
      pdf.text("Moderately Aggressive", 120, 79);

      pdf.text("Diversification", 20, 86);
      pdf.text(`${gendata.rating || "N/A"}/100`, 70, 86);
      pdf.text(gendata.tipToImprove || "N/A", 120, 86);

      // Asset Allocation
      pdf.setFontSize(14);
      pdf.text("Asset Allocation", 20, 100);

      // Asset Allocation table headers
      pdf.setFontSize(10);
      pdf.text("Asset Class", 20, 110);
      pdf.text("Percentage", 70, 110);
      pdf.text("Value", 110, 110);
      pdf.text("Growth", 150, 110);

      // Add line
      pdf.line(20, 113, 190, 113);

      // Asset Allocation data
      const assetClasses = [
        {
          name: "US Stocks",
          percentage: 45,
          value: "$12,805.52",
          growth: 24.5,
        },
        {
          name: "International Stocks",
          percentage: 20,
          value: "$5,691.34",
          growth: 18.2,
        },
        { name: "Bonds", percentage: 15, value: "$4,268.51", growth: 8.7 },
        {
          name: "Real Estate",
          percentage: 10,
          value: "$2,845.67",
          growth: 15.3,
        },
        {
          name: "Alternative",
          percentage: 5,
          value: "$1,422.84",
          growth: 12.1,
        },
        { name: "Cash", percentage: 5, value: "$1,422.84", growth: 1.2 },
      ];

      let yPos = 120;
      assetClasses.forEach((asset) => {
        pdf.text(asset.name, 20, yPos);
        pdf.text(`${asset.percentage}%`, 70, yPos);
        pdf.text(asset.value, 110, yPos);
        pdf.text(`${asset.growth > 0 ? "+" : ""}${asset.growth}%`, 150, yPos);
        yPos += 7;
      });

      // Risk Assessment
      if (yPos > 250) {
        pdf.addPage();
        yPos = 20;
      }

      pdf.setFontSize(14);
      pdf.text("Risk Assessment", 20, yPos + 15);

      pdf.setFontSize(10);
      pdf.text("Risk Profile: Moderately Aggressive (68/100)", 20, yPos + 25);

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
          description:
            "Return earned above risk-free rate per unit of volatility",
        },
      ];

      yPos += 35;
      pdf.text("Metric", 20, yPos);
      pdf.text("Score", 70, yPos);
      pdf.text("Description", 100, yPos);

      // Add line
      pdf.line(20, yPos + 3, 190, yPos + 3);

      yPos += 10;
      riskMetrics.forEach((metric) => {
        pdf.text(metric.name, 20, yPos);
        pdf.text(`${metric.value}/100`, 70, yPos);
        pdf.text(metric.description, 100, yPos);
        yPos += 7;
      });

      // Footer
      pdf.setFontSize(8);
      pdf.text(
        "This report is for informational purposes only and does not constitute investment advice.",
        pageWidth / 2,
        285,
        { align: "center" }
      );

      // Save PDF
      pdf.save(
        `portfolio_report_${new Date().toISOString().split("T")[0]}.pdf`
      );
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF report. Please try again.");
    } finally {
      setIsPrinting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 pt-20" id="portfolio-report">
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
          <Button
            variant="outline"
            size="sm"
            onClick={exportData}
            disabled={isExporting}
          >
            <Download className="mr-2 h-4 w-4" />
            {isExporting ? "Exporting..." : "Export"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={generatePDF}
            disabled={isPrinting}
          >
            <Printer className="mr-2 h-4 w-4" />
            {isPrinting ? "Generating..." : "Print"}
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
