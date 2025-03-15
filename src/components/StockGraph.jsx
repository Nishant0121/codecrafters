import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const StocksPrice = ({ symbol }) => {
  const [stockData, setStockData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch stock price data for the last 1 month
  const fetchStockData = async () => {
    setLoading(true);
    try {
      // API endpoint for historical stock prices (last 30 days)
      const response = await axios.get(
        `https://financialmodelingprep.com/api/v3/historical-price-full/${symbol}?timeseries=30&apikey=57XDMwSzyGM9UgKTi3oFYLtm1Uc9oQPB`
      );

      // Check if the response has valid data and update state
      if (response.data.historical) {
        setStockData(response.data.historical);
      } else {
        console.error('No historical data available');
      }
    } catch (error) {
      console.error('Error fetching stock data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStockData();
  }, [symbol]);

  // Prepare chart data
  const chartData = {
    labels: stockData.map(item => item.date), // Dates for x-axis
    datasets: [
      {
        label: `${symbol} Stock Price`,
        data: stockData.map(item => item.close), // Closing prices for y-axis
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
      },
    ],
  };

  return (
    <div className="bg-white/10 backdrop-blur-md p-6 rounded-lg shadow-2xl border border-white/20">
      <h2 className="text-2xl font-semibold text-center mb-6">Stock Price for {symbol}</h2>

      {/* Loading State */}
      {loading ? (
        <div className="text-center text-xl">Loading...</div>
      ) : (
        <div className="bg-gray-800 p-4 rounded-lg">
          <div className="h-75"> {/* Set height for the graph */}
            <Line
              data={chartData}
              options={{
                responsive: true,
                plugins: {
                  title: {
                    display: true,
                    text: `${symbol} Stock Price Over Time`,
                    color: 'white',
                  },
                  tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    titleColor: 'white',
                    bodyColor: 'white',
                  },
                },
                scales: {
                  x: {
                    grid: {
                      color: 'rgba(255, 255, 255, 0.1)', // Light grid for x-axis
                    },
                    ticks: {
                      color: 'white', // X-axis labels in white for better visibility
                    },
                  },
                  y: {
                    grid: {
                      color: 'rgba(255, 255, 255, 0.1)', // Light grid for y-axis
                    },
                    ticks: {
                      color: 'white', // Y-axis labels in white for better visibility
                    },
                  },
                },
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default StocksPrice;
