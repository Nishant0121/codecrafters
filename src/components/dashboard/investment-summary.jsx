"use client";

import { useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export function InvestmentSummary() {
  console.log("Rendering InvestmentSummary component...");

  // Dummy Data
  const dummyData = [
    { month: "Jan 24", value: 500 },
    { month: "Feb 24", value: 700 },
    { month: "Mar 24", value: 1200 },
    { month: "Apr 24", value: 1500 },
    { month: "May 24", value: 1300 },
    { month: "Jun 24", value: 1800 },
    { month: "Jul 24", value: 2200 },
    { month: "Aug 24", value: 2100 },
    { month: "Sep 24", value: 2500 },
    { month: "Oct 24", value: 2700 },
    { month: "Nov 24", value: 3000 },
    { month: "Dec 24", value: 3200 },
  ];

  // Chart.js Data Configuration
  const data = {
    labels: dummyData.map((item) => item.month),
    datasets: [
      {
        label: "Investment Value ($)",
        data: dummyData.map((item) => item.value),
        borderColor: "rgba(75, 192, 192, 1)", // Line color
        backgroundColor: "rgba(75, 192, 192, 0.2)", // Fill under line
        borderWidth: 2,
        pointRadius: 4,
        pointBackgroundColor: "rgba(75, 192, 192, 1)",
      },
    ],
  };

  // Chart Options
  const options = {
    responsive: true,
    plugins: {
      legend: { display: true },
      tooltip: { enabled: true },
    },
    scales: {
      x: { grid: { display: false } },
      y: { ticks: { callback: (value) => `$${value / 1000}k` } },
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Portfolio Performance</CardTitle>
      </CardHeader>
      <CardContent>
        <Line data={data} options={options} />
      </CardContent>
    </Card>
  );
}
