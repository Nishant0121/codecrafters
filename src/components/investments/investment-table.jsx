"use client";

import { useState, useEffect, useContext } from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AppContext } from "@/context/appContext";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// Hardcoded stock details
const stockDetails = {
  AAPL: { name: "Apple Inc.", price: 145.0, allocation: 8.45 },
  GOOGL: { name: "Alphabet Inc. (Google)", price: 165.0, allocation: 10.22 },
  MSFT: { name: "Microsoft Corporation", price: 396.6, allocation: 7.89 },
  AMZN: { name: "Amazon.com Inc.", price: 196.15, allocation: 9.32 },
  TSLA: { name: "Tesla, Inc.", price: 251.15, allocation: 9.32 },
  NVDA: { name: "NVIDIA Corporation", price: 125.0, allocation: 9.32 },
};

export function InvestmentTable({ type = "all" }) {
  const [investmentData, setInvestmentData] = useState([]);
  const [sortColumn, setSortColumn] = useState("value");
  const [sortDirection, setSortDirection] = useState("desc");
  const { loginUser } = useContext(AppContext);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchInvestmentData = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/stock/getProfile/${loginUser?.uid}`
        );
        const data = await response.json();

        const transformedData = data.profile.stocks.map((stock) => {
          const hardcoded = stockDetails[stock.symbol] || {};

          return {
            id: stock._id,
            symbol: stock.symbol,
            name: hardcoded.name || "Unknown",
            quantity: stock.quantity,
            price: stock.buyPrice || 0,
            averageCost: stock.buyPrice,
            value: stock.quantity * (hardcoded.price || stock.buyPrice),
            profitLoss:
              stock.quantity * hardcoded.price -
              stock.quantity * stock.buyPrice,
            profitLossPercent:
              ((hardcoded.price - stock.buyPrice) / stock.buyPrice) * 100 || 0,
            allocation: hardcoded.allocation || 0,
          };
        });

        setInvestmentData(transformedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchInvestmentData();
  }, [loginUser]);

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("desc");
    }
  };

  const sortedData = [...investmentData].sort((a, b) => {
    if (sortDirection === "asc") {
      return a[sortColumn] - b[sortColumn];
    } else {
      return b[sortColumn] - a[sortColumn];
    }
  });

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = sortedData.slice(startIndex, endIndex);

  // 📥 Function to Generate and Download PDF
  const downloadPDF = () => {
    const doc = new jsPDF();
    autoTable(doc, {
      // Use autoTable function correctly
      head: [
        [
          "Symbol",
          "Name",
          "Quantity",
          "Price",
          "Value",
          "P/L",
          "Allocation (%)",
        ],
      ],
      body: investmentData.map((investment) => [
        investment.symbol,
        investment.name,
        investment.quantity.toLocaleString(),
        `$${investment.price.toFixed(2)}`,
        `$${investment.value.toFixed(2)}`,
        `$${investment.profitLoss.toFixed(
          2
        )} (${investment.profitLossPercent.toFixed(2)}%)`,
        `${investment.allocation.toFixed(2)}%`,
      ]),
      startY: 20,
    });

    doc.text("Investment Portfolio", 14, 10);
    doc.save("Investment_Portfolio.pdf");
  };

  return (
    <div className="rounded-md border p-4">
      {/* 📥 PDF Download Button */}
      <div className="flex justify-end mb-4">
        <Button onClick={downloadPDF} className="bg-blue-500 text-white">
          Download PDF
        </Button>
      </div>

      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b">
            <th className="p-2">Symbol</th>
            <th className="p-2">Name</th>
            <th className="p-2">Quantity</th>
            <th
              className="p-2 cursor-pointer"
              onClick={() => handleSort("price")}
            >
              Price{" "}
              {sortColumn === "price" && (
                <ChevronDown className="inline h-4 w-4" />
              )}
            </th>
            <th
              className="p-2 cursor-pointer"
              onClick={() => handleSort("value")}
            >
              Value{" "}
              {sortColumn === "value" && (
                <ChevronDown className="inline h-4 w-4" />
              )}
            </th>
            <th
              className="p-2 cursor-pointer"
              onClick={() => handleSort("profitLoss")}
            >
              P/L{" "}
              {sortColumn === "profitLoss" && (
                <ChevronDown className="inline h-4 w-4" />
              )}
            </th>
            <th className="p-2">Allocation</th>
          </tr>
        </thead>
        <tbody>
          {paginatedData.length > 0 ? (
            paginatedData.map((investment) => (
              <tr key={investment.id} className="border-b">
                <td className="p-2">{investment.symbol}</td>
                <td className="p-2">{investment.name}</td>
                <td className="p-2">{investment.quantity.toLocaleString()}</td>
                <td className="p-2">${investment.price.toFixed(2)}</td>
                <td className="p-2">${investment.value.toFixed(2)}</td>
                <td
                  className={`p-2 ${
                    investment.profitLoss >= 0
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  ${investment.profitLoss.toFixed(2)} (
                  {investment.profitLossPercent.toFixed(2)}%)
                </td>
                <td className="p-2">{investment.allocation.toFixed(2)}%</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="text-center py-4">
                Loading data...
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="flex justify-center items-center mt-4 space-x-4">
        <Button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          Previous
        </Button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <Button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
