// src/components/CurrencyConverter.jsx
import React, { useState, useEffect } from 'react';

const CurrencyConverter = () => {
  const [amount, setAmount] = useState(1);
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('INR');
  const [convertedAmount, setConvertedAmount] = useState(null);
  const [exchangeRates, setExchangeRates] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch exchange rates from API
  useEffect(() => {
    const fetchExchangeRates = async () => {
      setLoading(true);
      setError(null);
      try {
        const apiKey = '9b5652535b00936e6f3f4976'; // Replace with your API key
        const response = await fetch(`https://v6.exchangerate-api.com/v6/${apiKey}/latest/${fromCurrency}`);
        const data = await response.json();
        if (data.result === 'success') {
          setExchangeRates(data.conversion_rates);
        } else {
          throw new Error('Failed to fetch exchange rates');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchExchangeRates();
  }, [fromCurrency]);

  // Handle currency conversion
  const handleConvert = () => {
    if (exchangeRates[toCurrency]) {
      const result = amount * exchangeRates[toCurrency];
      setConvertedAmount(result.toFixed(2));
    }
  };

  // Swap "from" and "to" currencies
  const handleSwap = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  // Reset converter
  const handleReset = () => {
    setAmount(1);
    setFromCurrency('USD');
    setToCurrency('INR');
    setConvertedAmount(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-900 to-black p-8 flex flex-col items-center justify-center text-white">
      <div className="w-full max-w-lg bg-gray-800 p-8 rounded-lg shadow-2xl">
        <h2 className="text-3xl font-bold text-center mb-6">Currency Converter</h2>
        <div className="space-y-6">
          {/* Amount Input */}
          <div>
            <label className="block text-sm font-medium">Amount</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-600 rounded-md shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-500 bg-gray-700 text-white"
            />
          </div>

          {/* From Currency */}
          <div>
            <label className="block text-sm font-medium">From Currency</label>
            <select
              value={fromCurrency}
              onChange={(e) => setFromCurrency(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-600 rounded-md shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-500 bg-gray-700 text-white"
            >
              {Object.keys(exchangeRates).map((currency) => (
                <option key={currency} value={currency}>
                  {currency}
                </option>
              ))}
            </select>
          </div>

          {/* Swap Button */}
          <div className="flex justify-center">
            <button
              onClick={handleSwap}
              className="p-2 bg-indigo-700 text-white rounded-full hover:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              🔄
            </button>
          </div>

          {/* To Currency */}
          <div>
            <label className="block text-sm font-medium">To Currency</label>
            <select
              value={toCurrency}
              onChange={(e) => setToCurrency(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-600 rounded-md shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-500 bg-gray-700 text-white"
            >
              {Object.keys(exchangeRates).map((currency) => (
                <option key={currency} value={currency}>
                  {currency}
                </option>
              ))}
            </select>
          </div>

          {/* Convert Button */}
          <button
            onClick={handleConvert}
            className="w-full py-2 px-4 bg-indigo-700 text-white font-semibold rounded-md shadow-xl hover:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Convert
          </button>

          {/* Reset Button */}
          <button
            onClick={handleReset}
            className="w-full py-2 px-4 bg-gray-500 text-white font-semibold rounded-md shadow-xl hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Reset
          </button>

          {/* Result */}
          {convertedAmount !== null && (
            <div className="mt-6 text-center">
              <p className="text-xl font-medium">
                {amount} {fromCurrency} = {convertedAmount} {toCurrency}
              </p>
            </div>
          )}

          {/* Loading State */}
          {loading && <p className="text-center text-gray-400">Loading exchange rates...</p>}

          {/* Error State */}
          {error && <p className="text-center text-red-500">{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default CurrencyConverter;