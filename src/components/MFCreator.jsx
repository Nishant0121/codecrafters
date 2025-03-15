import React, { useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Slider,
  TextField,
  Typography,
} from "@mui/material";

// Dummy stock data
const stocks = [
  { id: 1, name: "Apple Inc.", symbol: "AAPL", price: 175.2 },
  { id: 2, name: "Microsoft Corp.", symbol: "MSFT", price: 320.5 },
  { id: 3, name: "Amazon.com Inc.", symbol: "AMZN", price: 138.3 },
  { id: 4, name: "Tesla Inc.", symbol: "TSLA", price: 252.7 },
  { id: 5, name: "Google (Alphabet) Inc.", symbol: "GOOGL", price: 143.9 },
];

const MutualFundCreator = () => {
  const [selectedStocks, setSelectedStocks] = useState({});
  const [allocations, setAllocations] = useState({});
  const [fundName, setFundName] = useState("");
  const [message, setMessage] = useState("");

  // Toggle stock selection
  const handleStockSelect = (stock) => {
    setSelectedStocks((prev) => {
      const updated = { ...prev };
      if (updated[stock.id]) {
        delete updated[stock.id];
      } else {
        updated[stock.id] = stock;
      }
      return updated;
    });
  };

  // Handle allocation change
  const handleAllocationChange = (id, value) => {
    setAllocations((prev) => ({ ...prev, [id]: value }));
  };

  // Calculate total allocation
  const totalAllocation = Object.values(allocations).reduce(
    (sum, val) => sum + val,
    0
  );
  const isAllocationValid = totalAllocation === 100;

  // Submit Mutual Fund
  const handleSubmit = async () => {
    if (!isAllocationValid) {
      setMessage("Total allocation must be 100%");
      return;
    }

    const mutualFund = {
      name: fundName,
      stocks: Object.keys(selectedStocks).map((id) => ({
        ...selectedStocks[id],
        allocation: allocations[id] || 0,
      })),
    };

    try {
      const response = await axios.post(
        "http://localhost:3000/api/stock/addMF",
        mutualFund
      );
      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response?.data?.error || "Error creating mutual fund");
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 500,
        mx: "auto",
        mt: 4,
        p: 3,
        border: "1px solid #ddd",
        borderRadius: 2,
      }}
    >
      <Typography variant="h5">Mutual Fund Creator</Typography>

      <TextField
        fullWidth
        label="Fund Name"
        variant="outlined"
        margin="normal"
        value={fundName}
        onChange={(e) => setFundName(e.target.value)}
      />

      {stocks.map((stock) => (
        <Box key={stock.id} display="flex" alignItems="center">
          <FormControlLabel
            control={
              <Checkbox
                checked={!!selectedStocks[stock.id]}
                onChange={() => handleStockSelect(stock)}
              />
            }
            label={`${stock.symbol} - ${stock.name} ($${stock.price})`}
          />
        </Box>
      ))}

      {Object.keys(selectedStocks).map((id) => (
        <Box key={id} mt={2}>
          <Typography>
            {selectedStocks[id].symbol} Allocation: {allocations[id] || 0}%
          </Typography>
          <Slider
            value={allocations[id] || 0}
            onChange={(_, value) => handleAllocationChange(id, value)}
            min={0}
            max={100}
            step={5}
          />
        </Box>
      ))}

      <Typography mt={2} color={isAllocationValid ? "green" : "red"}>
        Total Allocation: {totalAllocation}%
      </Typography>

      <Button
        variant="contained"
        color="primary"
        sx={{ mt: 2 }}
        onClick={handleSubmit}
        disabled={!isAllocationValid}
      >
        Create Mutual Fund
      </Button>

      {message && (
        <Typography mt={2} color="blue">
          {message}
        </Typography>
      )}
    </Box>
  );
};

export default MutualFundCreator;
