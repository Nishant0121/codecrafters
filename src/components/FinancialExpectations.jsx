import { useState, useEffect } from "react";
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

const FinancialExpectations = ({ symbol }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_KEY = "57XDMwSzyGM9UgKTi3oFYLtm1Uc9oQPB"; // Replace with your actual API key

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://financialmodelingprep.com/stable/analyst-estimates?symbol=${symbol}&apikey=${API_KEY}`
        );

        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const result = await response.json();

        if (Array.isArray(result)) {
          setData(result);
        } else {
          setError("Data format is incorrect or no data available.");
        }
        setLoading(false);
      } catch (err) {
        setError(`Failed to fetch data: ${err.message}`);
        setLoading(false);
      }
    };

    fetchData();
  }, [symbol]);

  if (loading) return <p className="text-center text-white">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  // ✅ Reverse data for "ulta" chart
  const reversedData = [...data].reverse();

  // Prepare chart data for comparison
  const chartData = {
    labels: reversedData.map((item) => item.date),
    datasets: [
      {
        label: "Revenue (Low)",
        data: reversedData.map((item) => item.revenueLow),
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        fill: true,
      },
      {
        label: "Revenue (High)",
        data: reversedData.map((item) => item.revenueHigh),
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        fill: true,
      },
      {
        label: "Revenue (Avg)",
        data: reversedData.map((item) => item.revenueAvg),
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.2)",
        fill: true,
      },
    ],
  };

  return (
    <div className="container mx-auto p-6 rounded-lg shadow-2xl mt-10">
      <h1 className="text-3xl font-bold text-center text-white mb-8">
        Financial Expectations for {symbol}
      </h1>

      {/* Flexbox container for table and chart */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Financial Data Table Section */}
        <div className="flex-1 overflow-x-auto bg-white/10 rounded-lg shadow-xl">
          <table className="min-w-full table-auto text-white">
            <thead className="bg-white/10 text-lg">
              <tr>
                <th className="px-6 py-4 text-left">Metric</th>
                <th className="px-6 py-4 text-left">Low</th>
                <th className="px-6 py-4 text-left">High</th>
                <th className="px-6 py-4 text-left">Avg</th>
              </tr>
            </thead>
            <tbody className="bg-white/10 text-sm">
              {reversedData.map((item, index) => (
                <tr
                  key={index}
                  className="border-t border-gray-700 hover:bg-gray-700 transition-all"
                >
                  <td className="px-6 py-4">{item.date}</td>
                  <td className="px-6 py-4">
                    {item.revenueLow.toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    {item.revenueHigh.toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    {item.revenueAvg.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Financial Data Line Chart Section */}
        <div className="flex-1 bg-white/10 rounded-lg shadow-xl p-6 border-white/20">
          <h2 className="text-xl font-semibold text-white mb-6 text-center">
            Revenue Comparisons (Low, High, Avg)
          </h2>
          <div style={{ position: "relative", height: "400px" }}>
            <Line
              data={chartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: "top",
                    labels: {
                      font: {
                        size: 14,
                      },
                    },
                  },
                  tooltip: {
                    callbacks: {
                      label: function (tooltipItem) {
                        return `$${tooltipItem.raw.toLocaleString()}`;
                      },
                    },
                  },
                },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialExpectations;
