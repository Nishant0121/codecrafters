"use client";

import { useState, useEffect, useContext } from "react";
import { ArrowDown, ArrowUp, ChevronDown, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AppContext } from "@/context/appContext";

// Hardcoded stock details
const stockDetails = {
  AAPL: { name: "Apple Inc.", price: 145.0, allocation: 8.45 },
  GOOGL: { name: "Alphabet Inc. (Google)", price: 165.0, allocation: 10.22 },
  MSFT: { name: "Microsoft Corporation", price: 300.0, allocation: 7.89 },
};

export function InvestmentTable({ type = "all" }) {
  const [investmentData, setInvestmentData] = useState([]);
  const [sortColumn, setSortColumn] = useState("value");
  const [sortDirection, setSortDirection] = useState("desc");
  const { loginUser } = useContext(AppContext);
  const user = localStorage.getItem("ADuser");

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Display 10 items per page

  useEffect(() => {
    const fetchInvestmentData = async () => {
      console.log(loginUser)

      try {
        const response = await fetch(
          `http://localhost:3000/api/stock/getProfile/${loginUser?.uid}`
        );
        const data = await response.json();

        // Transform API data to match UI requirements
        const transformedData = data.profile.stocks.map((stock) => {
          const hardcoded = stockDetails[stock.symbol] || {};

          return {
            id: stock._id,
            symbol: stock.symbol,
            name: hardcoded.name || "Unknown",
            quantity: stock.quantity,
            price: hardcoded.price || 0, // Use API price if available
            averageCost: stock.buyPrice,
            value: stock.quantity * (hardcoded.price || stock.buyPrice),
            profitLoss:
              stock.quantity * (hardcoded.price || stock.buyPrice) -
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

  // Sort data
  const sortedData = [...investmentData].sort((a, b) => {
    if (sortDirection === "asc") {
      return a[sortColumn] - b[sortColumn];
    } else {
      return b[sortColumn] - a[sortColumn];
    }
  });

  // Pagination Logic
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = sortedData.slice(startIndex, endIndex);

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Symbol</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead
              className="cursor-pointer"
              onClick={() => handleSort("price")}
            >
              <div className="flex items-center">
                Price
                {sortColumn === "price" && (
                  <ChevronDown className="ml-1 h-4 w-4" />
                )}
              </div>
            </TableHead>
            <TableHead
              className="cursor-pointer"
              onClick={() => handleSort("value")}
            >
              <div className="flex items-center">
                Value
                {sortColumn === "value" && (
                  <ChevronDown className="ml-1 h-4 w-4" />
                )}
              </div>
            </TableHead>
            <TableHead
              className="cursor-pointer"
              onClick={() => handleSort("profitLoss")}
            >
              <div className="flex items-center">
                P/L
                {sortColumn === "profitLoss" && (
                  <ChevronDown className="ml-1 h-4 w-4" />
                )}
              </div>
            </TableHead>
            <TableHead
              className="cursor-pointer"
              onClick={() => handleSort("allocation")}
            >
              <div className="flex items-center">
                Allocation
                {sortColumn === "allocation" && (
                  <ChevronDown className="ml-1 h-4 w-4" />
                )}
              </div>
            </TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedData.length > 0 ? (
            paginatedData.map((investment) => (
              <TableRow key={investment.id}>
                <TableCell className="font-medium">
                  {investment.symbol}
                </TableCell>
                <TableCell>{investment.name}</TableCell>
                <TableCell>{investment.quantity.toLocaleString()}</TableCell>
                <TableCell>${investment.price.toFixed(2)}</TableCell>
                <TableCell>${investment.value.toFixed(2)}</TableCell>
                <TableCell
                  className={
                    investment.profitLoss >= 0
                      ? "text-green-500"
                      : "text-red-500"
                  }
                >
                  ${investment.profitLoss.toFixed(2)} (
                  {investment.profitLossPercent.toFixed(2)}%)
                </TableCell>
                <TableCell>{investment.allocation.toFixed(2)}%</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem>Buy more</DropdownMenuItem>
                      <DropdownMenuItem>Sell</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>View details</DropdownMenuItem>
                      <DropdownMenuItem>Set alert</DropdownMenuItem>
                      <DropdownMenuItem>Add to watchlist</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan="8" className="text-center py-4">
                Loading data...
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

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
