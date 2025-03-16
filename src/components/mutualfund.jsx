import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button"; // Import Button component

const MutualFunds = () => {
  const [funds, setFunds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMutualFunds = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/stock/getMutualFund"
        );
        if (!response.ok) throw new Error("Failed to fetch data");
        const data = await response.json();
        setFunds(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMutualFunds();
  }, []);

  if (loading) return <Skeleton className="h-40 w-full my-4" />;
  if (error)
    return (
      <Alert className="my-4">
        <AlertTitle>Error: {error}</AlertTitle>
      </Alert>
    );

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Mutual Funds</h2>
      {funds.map((fund, index) => (
        <Card key={fund._id} className="mb-6 shadow-lg">
          <CardHeader>
            <CardTitle>{fund.name || `Mutual Fund ${index + 1}`}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              <strong>Total Allocation:</strong> {fund.totalAllocation}%
            </p>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Stock Symbol</TableHead>
                  <TableHead>Company Name</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Allocation (%)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fund.stocks.map((stock) => (
                  <TableRow key={stock._id}>
                    <TableCell>{stock.symbol}</TableCell>
                    <TableCell>{stock.name}</TableCell>
                    <TableCell>${stock.price}</TableCell>
                    <TableCell>{stock.allocation}%</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Button
              className="mt-4"
              onClick={() => alert(`Buying ${fund.name}`)}
            >
              Buy
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default MutualFunds;
