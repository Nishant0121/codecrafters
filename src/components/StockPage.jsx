// src/StockPage.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Line, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { sampleStocks } from '../Data/Stocks';

// Register the necessary chart components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

const StockPage = () => {
  const { symbol } = useParams(); // Get the stock symbol from URL params
  const [stock, setStock] = useState(null);
  const [graphData, setGraphData] = useState([]);
  const [volumeData, setVolumeData] = useState([]);
  const [rsiData, setRsiData] = useState([]);

  // Fetch data for the specific stock
  useEffect(() => {
    const fetchData = async () => {
      try {
        const stockData = sampleStocks.find((s) => s.symbol === symbol);
        if (stockData) {
          setStock(stockData);

          // Simulate historical price data for the graph (example data)
          const historicalPrices = [145, 150, 148, 152, 160, 170, 175, 180, 185, 190];
          setGraphData(historicalPrices);

          // Simulate volume data
          const volumePrices = [70, 75, 80, 85, 90, 95, 100, 105, 110, 115];
          setVolumeData(volumePrices);

          // Simulate RSI data
          const rsiValues = [45, 50, 55, 60, 65, 70, 75, 80, 85, 90];
          setRsiData(rsiValues);
        }
      } catch (error) {
        console.error('Error fetching stock data:', error);
      }
    };

    fetchData(); // Call the fetchData function
  }, [symbol]); // Dependency array for useEffect

  if (!stock) {
    return <div className="text-white">Loading...</div>;
  }

  // Chart.js data configuration for price history
  const priceChartData = {
    labels: Array.from({ length: graphData.length }, (_, index) => `Day ${index + 1}`),
    datasets: [
      {
        label: `${stock.symbol} Price History`,
        data: graphData,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  // Chart.js data configuration for volume
  const volumeChartData = {
    labels: Array.from({ length: volumeData.length }, (_, index) => `Day ${index + 1}`),
    datasets: [
      {
        label: `${stock.symbol} Volume`,
        data: volumeData,
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Chart.js data configuration for RSI
  const rsiChartData = {
    labels: Array.from({ length: rsiData.length }, (_, index) => `Day ${index + 1}`),
    datasets: [
      {
        label: `${stock.symbol} RSI`,
        data: rsiData,
        borderColor: 'rgba(153, 102, 255, 1)',
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  // Render the news section
  const renderNews = () => {
    return (
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
        <h3 className="text-xl font-semibold mb-4 text-white">Recent News</h3>
        <div className="space-y-4">
          {stock.news.map((article, index) => (
            <div key={index} className="border-b border-gray-700 pb-4">
              <a href={article.link} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                <h4 className="font-medium">{article.headline}</h4>
              </a>
              <p className="text-sm text-gray-400">{article.date}</p>
              <p className="text-gray-300">{article.summary}</p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Render the key metrics section
  const renderKeyMetrics = () => {
    return (
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
        <h3 className="text-xl font-semibold mb-4 text-white">Key Metrics</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="text-gray-400">P/E Ratio</span>
            <span className="block font-medium text-white">{stock.peRatio}</span>
          </div>
          <div>
            <span className="text-gray-400">Earnings Per Share (EPS)</span>
            <span className="block font-medium text-white">{stock.earnings}</span>
          </div>
          <div>
            <span className="text-gray-400">Dividend Yield</span>
            <span className="block font-medium text-white">{stock.dividendYield}</span>
          </div>
          <div>
            <span className="text-gray-400">Market Cap</span>
            <span className="block font-medium text-white">{stock.marketCap}</span>
          </div>
        </div>
      </div>
    );
  };

  // Render the technical analysis section
  const renderTechnicalAnalysis = () => {
    return (
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
        <h3 className="text-xl font-semibold mb-4 text-white">Technical Analysis</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="text-gray-400">50-Day Moving Average</span>
            <span className="block font-medium text-white">{stock.technicalAnalysis.movingAverage50}</span>
          </div>
          <div>
            <span className="text-gray-400">200-Day Moving Average</span>
            <span className="block font-medium text-white">{stock.technicalAnalysis.movingAverage200}</span>
          </div>
          <div>
            <span className="text-gray-400">RSI (Relative Strength Index)</span>
            <span className={`block font-medium ${stock.technicalAnalysis.rsi > 70 ? 'text-red-400' : stock.technicalAnalysis.rsi < 30 ? 'text-green-400' : 'text-white'}`}>
              {stock.technicalAnalysis.rsi}
            </span>
          </div>
        </div>
      </div>
    );
  };

  // Render the recommendation section
  const renderRecommendation = () => {
    let recommendation = '';
    let color = '';
    if (stock.technicalAnalysis.rsi > 70) {
      recommendation = 'Overbought (Sell)';
      color = 'text-red-400';
    } else if (stock.technicalAnalysis.rsi < 30) {
      recommendation = 'Oversold (Buy)';
      color = 'text-green-400';
    } else {
      recommendation = 'Neutral (Hold)';
      color = 'text-white';
    }

    return (
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
        <h3 className="text-xl font-semibold mb-4 text-white">Recommendation</h3>
        <p className={`font-medium ${color}`}>{recommendation}</p>
      </div>
    );
  };

  return (
    <div className="w-screen p-6 bg-gray-900 min-h-screen">
      <h2 className="text-3xl font-bold text-center mb-8 text-white">{stock.name}</h2>

      {/* Grid Layout for Charts and Data */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column: Charts */}
        <div className="space-y-6">
          {/* Stock Price Graph */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-4 text-white">Price History</h3>
            <div className="h-64"> {/* Fixed height for the chart container */}
              <Line
                data={priceChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false, // Allow the chart to fill the container
                  plugins: { title: { display: true, text: 'Price History', color: '#fff' } },
                  scales: { x: { ticks: { color: '#fff' } }, y: { ticks: { color: '#fff' } } },
                }}
              />
            </div>
          </div>

          {/* Volume Graph */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-4 text-white">Trading Volume</h3>
            <div className="h-64"> {/* Fixed height for the chart container */}
              <Bar
                data={volumeChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false, // Allow the chart to fill the container
                  plugins: { title: { display: true, text: 'Trading Volume', color: '#fff' } },
                  scales: { x: { ticks: { color: '#fff' } }, y: { ticks: { color: '#fff' } } },
                }}
              />
            </div>
          </div>

          {/* RSI Graph */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-4 text-white">Relative Strength Index (RSI)</h3>
            <div className="h-64"> {/* Fixed height for the chart container */}
              <Line
                data={rsiChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false, // Allow the chart to fill the container
                  plugins: { title: { display: true, text: 'RSI', color: '#fff' } },
                  scales: { x: { ticks: { color: '#fff' } }, y: { ticks: { color: '#fff' } } },
                }}
              />
            </div>
          </div>
        </div>

        {/* Right Column: Data Sections */}
        <div className="space-y-6">
          {/* Stock Info */}
          <div className="space-y-4 bg-gray-800 p-6 rounded-lg shadow-lg">
            <div className="flex justify-between">
              <span className="text-gray-400">Symbol</span>
              <span className="font-medium text-white">{stock.symbol}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Current Price</span>
              <span className="font-medium text-white">{stock.price}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Market Cap</span>
              <span className="font-medium text-white">{stock.marketCap}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Volume</span>
              <span className="font-medium text-white">{stock.volume}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Change (24h)</span>
              <span className={`font-medium ${stock.change > 0 ? 'text-green-400' : 'text-red-400'}`}>
                {stock.change > 0 ? `+${stock.change}%` : `${stock.change}%`}
              </span>
            </div>
          </div>

          {/* Key Metrics */}
          {renderKeyMetrics()}

          {/* Technical Analysis */}
          {renderTechnicalAnalysis()}

          {/* Recommendation */}
          {renderRecommendation()}

          {/* News Section */}
          {renderNews()}
        </div>
      </div>
    </div>
  );
};

export default StockPage;