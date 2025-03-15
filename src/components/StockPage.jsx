// src/StockPage.js
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Line } from "react-chartjs-2";
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
import { sampleStockData, historicalPrices } from "../Data/Stocks";

// Register the necessary chart components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const StockPage = () => {
  const { symbol } = useParams(); // Get the stock symbol from URL params
  const [stock, setStock] = useState(null);
  const [graphData, setGraphData] = useState([]);

  // Fetch data for the specific stock
  useEffect(() => {
    const fetchData = async () => {
      try {
        const stockData = sampleStockData.find((s) => s.symbol === symbol);
        if (stockData) {
          setStock(stockData);

          // Get historical data for the stock
          const priceHistory = historicalPrices[symbol] || [];
          setGraphData(priceHistory);
        }
      } catch (error) {
        console.error("Error fetching stock data:", error);
      }
    };

    fetchData();
  }, [symbol]);

  if (!stock) {
    return <div>Loading...</div>;
  }

  // Chart.js data configuration
  const chartData = {
    labels: graphData.map((_, index) => `Day ${index + 1}`),
    datasets: [
      {
        label: `${stock.symbol} Price History`,
        data: graphData,
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        fill: true,
      },
    ],
  };

  // Analysis section
  const renderAnalysis = () => {
    return (
      <div className="bg-gray-100 p-4 rounded-md shadow-md mt-6">
        <h3 className="text-lg font-semibold">Stock Analysis</h3>
        <p className="text-gray-700">
          {stock.symbol} has shown{" "}
          {stock.close >= stock.open ? "an upward" : "a downward"} trend today.
          The market conditions appear{" "}
          {stock.close >= stock.open ? "bullish" : "bearish"}, with a stable
          volume and momentum.
        </p>
        <div className="mt-4">
          <h4 className="font-medium">
            Prediction:{" "}
            {stock.close >= stock.open ? "Bullish 📈" : "Bearish 📉"}
          </h4>
          <p
            className={
              stock.close >= stock.open ? "text-green-600" : "text-red-600"
            }
          >
            The price is likely to{" "}
            {stock.close >= stock.open ? "increase" : "decrease"} based on
            current trends.
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-semibold text-center mb-6">
        {stock.symbol} - {stock.timestamp}
      </h2>

      {/* Stock Price Graph */}
      <div className="mb-6">
        <Line
          data={chartData}
          options={{
            responsive: true,
            plugins: {
              title: { display: true, text: `${stock.symbol} Price History` },
            },
          }}
        />
      </div>

      {/* Stock Info */}
      <div className="space-y-4">
        <div className="flex justify-between">
          <span className="text-gray-600">Symbol</span>
          <span className="font-medium">{stock.symbol}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Open</span>
          <span className="font-medium">{stock.open}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">High</span>
          <span className="font-medium">{stock.high}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Low</span>
          <span className="font-medium">{stock.low}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Close</span>
          <span className="font-medium">{stock.close}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Volume</span>
          <span className="font-medium">{stock.volume.toLocaleString()}</span>
        </div>
      </div>

      {/* Stock Analysis */}
      {renderAnalysis()}
    </div>
  );
};

export default StockPage;
