import React, { useState, useEffect } from "react";

const FinancialExpectations = ({ symbol }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  //const API_KEY = "57XDMwSzyGM9UgKTi3oFYLtm1Uc9oQPB"; // Replace with your actual API key
  const API_KEY = "";
  // https://financialmodelingprep.com/stable/analyst-estimates?symbol=AAPL&apikey=57XDMwSzyGM9UgKTi3oFYLtm1Uc9oQPB

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
        console.log(result); // Check the structure of the result

        // Check if the data returned is an array
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

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-center mb-6">Financial Expectations</h1>
      {data.map((item, index) => (
        <div key={index} className="mb-8 p-6 bg-white shadow-md rounded-md">
          <h2 className="text-xl font-semibold">{item.date}</h2>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="p-4 bg-gray-50 rounded-md">
              <h3 className="text-lg font-medium">Revenue</h3>
              <p>Low: ${item.revenueLow.toLocaleString()}</p>
              <p>High: ${item.revenueHigh.toLocaleString()}</p>
              <p>Avg: ${item.revenueAvg.toLocaleString()}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-md">
              <h3 className="text-lg font-medium">EBITDA</h3>
              <p>Low: ${item.ebitdaLow.toLocaleString()}</p>
              <p>High: ${item.ebitdaHigh.toLocaleString()}</p>
              <p>Avg: ${item.ebitdaAvg.toLocaleString()}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-md">
              <h3 className="text-lg font-medium">EBIT</h3>
              <p>Low: ${item.ebitLow.toLocaleString()}</p>
              <p>High: ${item.ebitHigh.toLocaleString()}</p>
              <p>Avg: ${item.ebitAvg.toLocaleString()}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-md">
              <h3 className="text-lg font-medium">Net Income</h3>
              <p>Low: ${item.netIncomeLow.toLocaleString()}</p>
              <p>High: ${item.netIncomeHigh.toLocaleString()}</p>
              <p>Avg: ${item.netIncomeAvg.toLocaleString()}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-md">
              <h3 className="text-lg font-medium">EPS</h3>
              <p>Low: {item.epsLow}</p>
              <p>High: {item.epsHigh}</p>
              <p>Avg: {item.epsAvg}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FinancialExpectations;
