// src/StockPage.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { sampleStocks } from '../Data/Stocks';

// Register the necessary chart components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const StockPage = () => {
  const { symbol } = useParams(); // Get the stock symbol from URL params
  const [stock, setStock] = useState(null);
  const [graphData, setGraphData] = useState([]);

  // Simulate fetching data for the specific stock
  useEffect(() => {
    // You can replace this with an API call
    const stockData = sampleStocks.find((s) => s.symbol === symbol);
    if (stockData) {
      setStock(stockData);

      // Simulate historical price data for the graph (example data)
      const historicalPrices = [145, 150, 148, 152, 160, 170, 175, 180, 185, 190];
      setGraphData(historicalPrices);
    }
  }, [symbol]);

  if (!stock) {
    return <div>Loading...</div>;
  }

  // Chart.js data configuration
  const chartData = {
    labels: Array.from({ length: graphData.length }, (_, index) => `Day ${index + 1}`),
    datasets: [
      {
        label: `${stock.symbol} Price History`,
        data: graphData,
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
      },
    ],
  };

  // Analysis section
  const renderAnalysis = () => {
    return (
      <div className="bg-gray-100 p-4 rounded-md shadow-md">
        <h3 className="text-lg font-semibold">Stock Analysis</h3>
        <p className="text-gray-700">
          {stock.name} has shown a steady growth over the past month. The trend indicates a strong upward
          movement, with the potential for further gains in the upcoming weeks. The market conditions appear
          favorable with a stable volume and positive momentum.
        </p>
        <div className="mt-4">
          <h4 className="font-medium">Prediction: Bullish</h4>
          <p className="text-green-600">The price is likely to increase based on current market trends.</p>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-semibold text-center mb-6">{stock.name}</h2>

      {/* Stock Price Graph */}
      <div className="mb-6">
        <Line data={chartData} options={{ responsive: true, plugins: { title: { display: true, text: 'Price History' } } }} />
      </div>

      {/* Stock Info */}
      <div className="space-y-4">
        <div className="flex justify-between">
          <span className="text-gray-600">Symbol</span>
          <span className="font-medium">{stock.symbol}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Current Price</span>
          <span className="font-medium">{stock.price}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Market Cap</span>
          <span className="font-medium">{stock.marketCap}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Volume</span>
          <span className="font-medium">{stock.volume}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Change (24h)</span>
          <span className={`font-medium ${stock.change > 0 ? 'text-green-500' : 'text-red-500'}`}>
            {stock.change > 0 ? `+${stock.change}%` : `${stock.change}%`}
          </span>
        </div>
      </div>

      {/* Stock Analysis */}
      {renderAnalysis()}
    </div>
  );
};

export default StockPage;
