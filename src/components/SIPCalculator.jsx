// src/components/SIPCalculator.jsx
import React, { useState } from 'react';
import { Pie, Line } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement } from 'chart.js';
import { useSpring, animated } from 'react-spring';

// Register chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement);

const SIPCalculator = () => {
  const [monthlyInvestment, setMonthlyInvestment] = useState('');
  const [annualInterestRate, setAnnualInterestRate] = useState('');
  const [investmentDuration, setInvestmentDuration] = useState('');
  const [totalAmount, setTotalAmount] = useState(null);
  const [totalInterest, setTotalInterest] = useState(null);
  const [isYearlyView, setIsYearlyView] = useState(false);
  const [riskLevel, setRiskLevel] = useState('all');
  const [fundType, setFundType] = useState('all');
  const [minSIPAmount, setMinSIPAmount] = useState('all');

  // Dark mode is permanently enabled
  const theme = 'dark';

  const handleCalculate = () => {
    const p = parseFloat(monthlyInvestment);
    const r = parseFloat(annualInterestRate) / 12 / 100;
    const n = parseInt(investmentDuration) * 12;

    if (!isNaN(p) && !isNaN(r) && !isNaN(n) && p > 0 && r > 0 && n > 0) {
      const futureValue = p * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
      const interest = futureValue - p * n;
      setTotalAmount(futureValue.toFixed(2));
      setTotalInterest(interest.toFixed(2));
    } else {
      alert('Please enter valid positive numbers.');
    }
  };

  const handleReset = () => {
    setMonthlyInvestment('');
    setAnnualInterestRate('');
    setInvestmentDuration('');
    setTotalAmount(null);
    setTotalInterest(null);
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(value);
  };

  // Pie Chart Data
  const chartData = {
    labels: ['Principal', 'Interest Earned'],
    datasets: [
      {
        data: [
          parseFloat(monthlyInvestment) * parseInt(investmentDuration) * 12,
          totalInterest ? parseFloat(totalInterest) : 0,
        ],
        backgroundColor: ['#4caf50', '#ff9800'],
        borderWidth: 1,
      },
    ],
  };

  // Line Chart Data (Investment Growth Over Time)
  const lineChartData = {
    labels: Array.from({ length: parseInt(investmentDuration) + 1 }, (_, i) => i),
    datasets: [
      {
        label: 'Investment Growth',
        data: Array.from({ length: parseInt(investmentDuration) + 1 }, (_, i) => {
          const p = parseFloat(monthlyInvestment);
          const r = parseFloat(annualInterestRate) / 12 / 100;
          const n = i * 12;
          return p * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
        }),
        borderColor: '#4caf50',
        fill: false,
      },
    ],
  };

  // Animation for the results
  const fadeIn = useSpring({
    opacity: totalAmount !== null ? 1 : 0,
    transform: totalAmount !== null ? 'translateY(0)' : 'translateY(-20px)',
    config: { tension: 200, friction: 15 },
  });

  // Suggested SIP Plans (Filtered)
  const suggestedPlans = [
    { name: 'Axis Bluechip Fund', type: 'Equity', risk: 'High', minSIP: 500 },
    { name: 'Mirae Asset Emerging Bluechip Fund', type: 'Equity', risk: 'Medium', minSIP: 1000 },
    { name: 'SBI Small Cap Fund', type: 'Equity', risk: 'High', minSIP: 500 },
    { name: 'HDFC Balanced Advantage Fund', type: 'Hybrid', risk: 'Low', minSIP: 500 },
    { name: 'ICICI Prudential Bluechip Fund', type: 'Equity', risk: 'Medium', minSIP: 1000 },
  ];

  const filteredPlans = suggestedPlans.filter(
    (plan) =>
      (riskLevel === 'all' || plan.risk.toLowerCase() === riskLevel) &&
      (fundType === 'all' || plan.type.toLowerCase() === fundType) &&
      (minSIPAmount === 'all' || plan.minSIP <= parseInt(minSIPAmount))
  );

  return (
    <div className="min-h-screen p-8 pt-18 flex flex-col lg:flex-row gap-8 bg-gradient-to-br from-black to-gray-900 text-white">
      {/* SIP Calculator Section */}
      <div className="w-full lg:w-1/2 p-8 rounded-2xl shadow-2xl bg-white/10 backdrop-blur-md border border-white/20">
        <h2 className="text-3xl font-bold text-center mb-6">SIP Calculator</h2>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium">Monthly Investment (₹)</label>
            <input
              type="number"
              value={monthlyInvestment}
              onChange={(e) => setMonthlyInvestment(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border rounded-md shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-500 bg-transparent text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Annual Interest Rate (%)</label>
            <input
              type="number"
              value={annualInterestRate}
              onChange={(e) => setAnnualInterestRate(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border rounded-md shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-500 bg-transparent text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Investment Duration (years)</label>
            <input
              type="number"
              value={investmentDuration}
              onChange={(e) => setInvestmentDuration(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border rounded-md shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-500 bg-transparent text-white"
            />
          </div>
          <div className="flex gap-4">
            <button
              onClick={handleCalculate}
              className="w-full py-2 px-4 bg-indigo-700 text-white font-semibold rounded-md shadow-xl hover:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Calculate
            </button>
            <button
              onClick={handleReset}
              className="w-full py-2 px-4 bg-gray-500 text-white font-semibold rounded-md shadow-xl hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Reset
            </button>
          </div>
        </div>

        <animated.div style={fadeIn}>
          {totalAmount !== null && (
            <div className="mt-8">
              <p className="text-lg font-medium">
                Total Investment Value: {formatCurrency(totalAmount)}
              </p>
              <p className="text-lg font-medium mt-2">
                Total Interest Earned: {formatCurrency(totalInterest)}
              </p>

              {/* Pie Chart */}
              <div className="mt-6">
                <h3 className="text-xl font-medium mb-4">Investment Breakdown</h3>
                <Pie data={chartData} />
              </div>

              {/* Line Chart */}
              <div className="mt-6">
                <h3 className="text-xl font-medium mb-4">Investment Growth Over Time</h3>
                <Line data={lineChartData} />
              </div>
            </div>
          )}
        </animated.div>
      </div>

      {/* Suggested SIP Plans Section */}
      <div className="w-full lg:w-1/2 p-8 rounded-2xl shadow-2xl bg-white/10 backdrop-blur-md border border-white/20">
        <h2 className="text-3xl font-bold text-center mb-6">Suggested SIP Plans</h2>
        <div className="space-y-6">
          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <select
              value={riskLevel}
              onChange={(e) => setRiskLevel(e.target.value)}
              className="p-2 border rounded-md bg-transparent text-white"
            >
              <option value="all" className='text-black'>All Risk Levels</option>
              <option value="low" className='text-black'>Low Risk</option>
              <option value="medium" className='text-black'>Medium Risk</option>
              <option value="high" className='text-black'>High Risk</option>
            </select>
            <select
              value={fundType}
              onChange={(e) => setFundType(e.target.value)}
              className="p-2 border rounded-md bg-transparent text-white"
            >
              <option value="all" className='text-black'>All Fund Types</option>
              <option value="equity" className='text-black'>Equity</option>
              <option value="hybrid" className='text-black'>Hybrid</option>
            </select>
            <select
              value={minSIPAmount}
              onChange={(e) => setMinSIPAmount(e.target.value)}
              className="p-2 border rounded-md bg-transparent text-white"
            >
              <option value="all" className='text-black'>All Min SIP</option>
              <option value="500" className='text-black'>₹500</option>
              <option value="1000" className='text-black'>₹1000</option>
            </select>
          </div>

          {/* Plan Cards */}
          {filteredPlans.map((plan, index) => (
            <div
              key={index}
              className="p-6 rounded-lg hover:shadow-lg transition-all duration-300 bg-gray-700 hover:bg-gray-600"
            >
              <h3 className="text-xl font-semibold">{plan.name}</h3>
              <p className="text-gray-300 mt-2">Type: {plan.type}</p>
              <p className="text-gray-300">Risk: {plan.risk}</p>
              <p className="text-gray-300">Minimum SIP: ₹{plan.minSIP}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SIPCalculator;
