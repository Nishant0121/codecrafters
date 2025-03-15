"use client";

import { useEffect, useState, useContext } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AreaChart,
  Bar,
  CartesianGrid,
  ChartContainer,
  Line,
  ResponsiveContainer,
  TickLabels,
  Tooltip,
  TooltipContent,
  XAxis,
  YAxis,
} from "@/components/ui/chart";
import { AppContext } from "@/context/appContext";

export function InvestmentSummary() {
  const { loginUser } = useContext(AppContext);
  const [investmentData, setInvestmentData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!loginUser?.uid) return; // Prevent API call if no user

    const fetchInvestmentData = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/stock/getProfile/${loginUser.uid}`
        );
        if (!response.ok) throw new Error("Failed to fetch investment data");

        const data = await response.json();
        console.log("Fetched Investment Data:", data); // Debugging Output

        if (!data.profile.stocks || data.profile.stocks.length === 0) {
          console.warn("No stocks data available");
          setInvestmentData([]);
          setLoading(false);
          return;
        }

        // Group stocks by purchase month
        const groupedData = {};
        data.profile.stocks.forEach((stock) => {
          const monthKey = new Date(stock.purchaseDate).toLocaleString(
            "default",
            { month: "short", year: "2-digit" }
          );
          const stockValue = stock.quantity * stock.buyPrice;

          if (!groupedData[monthKey]) {
            groupedData[monthKey] = 0;
          }
          groupedData[monthKey] += stockValue;
        });

        // Convert grouped data to an array
        const formattedData = Object.keys(groupedData).map((month) => ({
          month,
          value: groupedData[month],
        }));

        console.log("Formatted Data for Chart:", formattedData); // Debugging Output

        setInvestmentData(formattedData);
      } catch (error) {
        console.error("Error fetching investment data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInvestmentData();
  }, [loginUser]);

  if (loading)
    return <p className="text-white text-center">Loading investment data...</p>;
  if (investmentData.length === 0)
    return (
      <p className="text-white text-center">No investment data available.</p>
    );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Portfolio Performance</CardTitle>
        <CardDescription>Your investment growth over time</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ChartContainer
              data={investmentData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <XAxis dataKey="month" axisLine={false}>
                <TickLabels />
              </XAxis>
              <YAxis
                tickFormatter={(value) => `$${Math.floor(value / 1000)}k`}
                axisLine={false}
              />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip content={<CustomTooltip />} />
              <AreaChart>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="hsl(var(--primary))"
                      stopOpacity={0.3}
                    />
                    <stop
                      offset="95%"
                      stopColor="hsl(var(--primary))"
                      stopOpacity={0.1}
                    />
                  </linearGradient>
                </defs>
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  activeDot={{ r: 6 }}
                />
                <Bar
                  type="monotone"
                  dataKey="value"
                  fill="url(#colorValue)"
                  fillOpacity={1}
                />
              </AreaChart>
            </ChartContainer>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <TooltipContent>
        <div className="flex flex-col gap-2">
          <p className="text-muted-foreground">{label}</p>
          <p className="font-medium">${payload[0].value.toLocaleString()}</p>
        </div>
      </TooltipContent>
    );
  }
  return null;
}
