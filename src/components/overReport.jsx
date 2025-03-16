"use client";

import { useContext, useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import "chart.js/auto";
import { Banknote, TrendingUp, Wallet, BarChart2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AppContext } from "@/context/appContext";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("AIzaSyDOky3a0Mpbe13I6Zo4t-RZ-pt4F8NbG5I");

export default function OverallReport() {
  const { loginUser } = useContext(AppContext);
  const [investmentData, setInvestmentData] = useState(null);
  const [mutualFundData, setMutualFundData] = useState(null);
  const [walletBalance, setWalletBalance] = useState(0);
  const [geminiReport, setGeminiReport] = useState(null);

  useEffect(() => {
    if (!loginUser) return;

    const fetchData = async () => {
      try {
        // 📌 Fetch Investment Data
        const investmentRes = await fetch(
          `http://localhost:3000/api/stock/getInvestment/${loginUser.uid}`
        );
        const investment = await investmentRes.json();

        // 📌 Fetch Mutual Fund Data
        const mutualFundRes = await fetch(
          `http://localhost:3000/api/stock/getMutualFund`
        );
        const mutualFunds = await mutualFundRes.json();

        // 📌 Fetch Wallet Balance
        const walletRes = await fetch(
          `http://localhost:3000/api/stock/wallet/balance/${loginUser.uid}`
        );
        const wallet = await walletRes.json();

        setInvestmentData(investment);
        setMutualFundData(mutualFunds);
        setWalletBalance(wallet.balance);

        // 📌 Generate AI Financial Summary with Example Response
        const prompt = `
          I have the following financial data:
          
          - **Investments:** ${JSON.stringify(investment)}
          - **Mutual Funds:** ${JSON.stringify(mutualFunds)}
          - **Wallet Balance:** $${wallet.balance}

          Generate a **structured JSON** report in the following format:
          
          \`\`\`json
          {
            "Overall Financial Summary": {
              "total_portfolio_value": 15000,
              "total_profit_loss": 1200,
              "liquidity_score": 7,
              "allocation": {
                "stocks": 50,
                "mutual_funds": 30,
                "cash": 20
              }
            },
            "Investment Breakdown": {
              "best_performer": {
                "symbol": "AAPL",
                "profit_loss_percentage": 12
              },
              "worst_performer": {
                "symbol": "TSLA",
                "profit_loss_percentage": -8
              },
              "risk_level": "Medium"
            },
            "Mutual Fund Analysis": {
              "total_value": 5000,
              "top_fund": {
                "name": "Vanguard Growth",
                "profit_loss_percentage": 5
              },
              "diversification_score": 8
            },
            "Wallet & Liquidity": {
              "cash_available": 3000,
              "savings_advice": "Keep at least 25% of your portfolio in liquid assets."
            },
            "Future Recommendations": {
              "investment_tips": [
                "Consider reallocating funds into lower-risk ETFs.",
                "Increase investment in high-dividend stocks for passive income."
              ]
            }
          }
          \`\`\`

          Ensure the output follows this exact structure with relevant values based on user data.
        `;

        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        const result = await model.generateContent(prompt);
        let response = result.response.text();

        // Extract JSON from response
        const jsonMatch = response.match(/```json\s*([\s\S]*?)\s*```/);
        if (jsonMatch && jsonMatch[1]) {
          response = jsonMatch[1];
        }

        const parsedResponse = JSON.parse(response);
        setGeminiReport(parsedResponse);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [loginUser]);

  return (
    <div className="container mx-auto px-4 pt-20">
      <h1 className="text-3xl font-bold">📊 Overall Financial Report</h1>

      {geminiReport && (
        <>
          {/* 📌 Overall Financial Summary */}
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>
                <TrendingUp className="inline-block mr-2 text-green-500" />
                Financial Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xl font-semibold">
                Total Portfolio Value: $
                {
                  geminiReport["Overall Financial Summary"]
                    .total_portfolio_value
                }
              </p>
              <p
                className={`text-lg font-medium ${
                  geminiReport["Overall Financial Summary"].total_profit_loss >
                  0
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                Profit/Loss: $
                {geminiReport["Overall Financial Summary"].total_profit_loss}
              </p>
              <p>
                Liquidity Score:{" "}
                {geminiReport["Overall Financial Summary"].liquidity_score}/10
              </p>
            </CardContent>
          </Card>

          {/* 📌 Portfolio Allocation Chart */}
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>📊 Portfolio Allocation</CardTitle>
            </CardHeader>
            <CardContent>
              <Pie
                data={{
                  labels: Object.keys(
                    geminiReport["Overall Financial Summary"].allocation
                  ),
                  datasets: [
                    {
                      data: Object.values(
                        geminiReport["Overall Financial Summary"].allocation
                      ),
                      backgroundColor: [
                        "#FF6384",
                        "#36A2EB",
                        "#FFCE56",
                        "#4BC0C0",
                        "#9966FF",
                      ],
                    },
                  ],
                }}
              />
            </CardContent>
          </Card>

          {/* 📌 Future Investment Recommendations */}
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>🔮 Future Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-6">
                {geminiReport["Future Recommendations"].investment_tips.map(
                  (tip, index) => (
                    <li key={index}>{tip}</li>
                  )
                )}
              </ul>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
