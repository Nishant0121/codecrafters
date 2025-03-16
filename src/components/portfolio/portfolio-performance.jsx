"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { sampleStocks } from "@/Data/Stocks"; // Import stock data

const API_URL = "http://127.0.0.1:5000/predict";

export function StockRecommendations() {
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPredictions = async () => {
      try {
        const symbols = sampleStocks.map((stock) => stock.symbol); // Get all stock symbols

        const response = await axios.post(API_URL, { symbols });

        setPredictions(response.data);
      } catch (error) {
        console.error("Error fetching stock predictions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPredictions();
  }, []);

  return (
    <Card className="rounded-none border-0">
      <CardHeader>
        <CardTitle>📈 Stock Predictions for Next Business Day</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p>Loading stock predictions...</p>
        ) : (
          <ul className="space-y-3">
            {predictions.map((stock) => (
              <li
                key={stock.stock}
                className="p-3 border rounded-lg flex justify-between items-center"
              >
                <div>
                  <h3 className="font-semibold">
                    {stock.stock} (
                    {sampleStocks.find((s) => s.symbol === stock.stock)?.name ||
                      "Unknown"}
                    )
                  </h3>
                  <p className="text-sm text-gray-500">
                    Predicted on:{" "}
                    {stock.prediction_date
                      ? new Date(stock.prediction_date).toDateString()
                      : "N/A"}
                  </p>
                </div>
                <span
                  className={`text-lg font-bold ${
                    stock.error ? "text-red-500" : "text-green-500"
                  }`}
                >
                  {stock.error ? stock.error : `$${stock.next_predicted_price}`}
                </span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
