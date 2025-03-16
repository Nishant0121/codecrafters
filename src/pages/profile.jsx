import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { AppContext } from "@/context/appContext";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableHeader,
  TableRow,
  TableCell,
  TableBody,
} from "@/components/ui/table";
import { ArrowUpRight, DollarSign, LogOut, TrendingUp, Wallet, Clock, Edit, ChevronUp, ChevronDown, BarChart3, PieChartIcon, RefreshCw, User, Calendar, ArrowRight } from 'lucide-react';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Tooltip as RechartTooltip,
  ResponsiveContainer,
  Cell,
  Legend,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [investmentData, setInvestmentData] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [walletData, setWalletData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const { loginUser } = useContext(AppContext);
  const navigate = useNavigate();
  
  const navigateToPay = () => {
    navigate('/pay');
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [investmentRes, profileRes, walletRes] = await Promise.all([
          fetch(`http://localhost:3000/api/stock/getInvestment/${loginUser?.uid}`),
          fetch(`http://localhost:3000/api/stock/getProfile/${loginUser?.uid}`),
          fetch(`http://localhost:3000/api/stock/wallet/balance/${loginUser?.uid}`),
        ]);

        if (!investmentRes.ok || !profileRes.ok || !walletRes.ok) {
          throw new Error("Failed to fetch data");
        }

        const investment = await investmentRes.json();
        const profile = await profileRes.json();
        const wallet = await walletRes.json();

        setInvestmentData(investment);
        setProfileData(profile.profile);
        setWalletData(wallet);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [loginUser]);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("ADuser"));
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  const handleLogout = () => {
    Cookies.remove("jwt_token");
    localStorage.removeItem("ADuser");
    setUser(null);
    navigate("/login");
    window.location.reload();
  };

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d"];

  // Sort transactions by date (latest first) & take top 10
  const topTransactions =
    walletData?.transactions
      ?.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, 10) || [];

  // Pie Chart Data for Stock Distribution
  const pieChartData =
    profileData?.stocks?.map((stock) => ({
      name: stock.symbol,
      value: stock.quantity * stock.buyPrice,
    })) || [];

  // Format date for charts
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };

  // Prepare transaction data for bar chart
  const transactionChartData = walletData?.transactions
    ?.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
    .slice(-7)
    .map((tx) => ({
      date: formatDate(tx.timestamp),
      amount: tx.amount,
      type: tx.type,
    })) || [];

  // Calculate portfolio growth
  const portfolioGrowth = investmentData?.totalPortfolioValue
    ? ((investmentData.totalPortfolioValue - 10000) / 10000) * 100
    : 0;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  };

  return (
    <div className="min-h-screen text-white p-4 md:p-8">
      {loading ? (
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Skeleton className="h-64 bg-white/5 rounded-xl" />
            <Skeleton className="h-64 bg-white/5 rounded-xl md:col-span-2" />
          </div>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <Skeleton className="h-80 bg-white/5 rounded-xl" />
            <Skeleton className="h-80 bg-white/5 rounded-xl" />
          </div>
          <Skeleton className="h-96 bg-white/5 rounded-xl mt-6" />
        </div>
      ) : error ? (
        <div className="text-center p-12 bg-red-500/10 rounded-xl border border-red-500/20 max-w-md mx-auto">
          <div className="text-red-400 text-4xl mb-4">⚠️</div>
          <h3 className="text-xl font-bold text-red-400 mb-2">Error Loading Profile</h3>
          <p className="text-gray-400">{error}</p>
          <Button 
            variant="outline" 
            className="mt-4 border-red-500/20 text-red-400 hover:bg-red-500/10"
            onClick={() => window.location.reload()}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        </div>
      ) : (
        <motion.div 
          className="max-w-7xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="mb-8 pt-13">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                Financial Dashboard
              </h1>
              <TabsList className="bg-white/5 border border-white/0">
                <TabsTrigger value="overview" className="data-[state=active]:bg-white/10">
                  Overview
                </TabsTrigger>
                <TabsTrigger value="portfolio" className="data-[state=active]:bg-white/10">
                  Portfolio
                </TabsTrigger>
                <TabsTrigger value="transactions" className="data-[state=active]:bg-white/10">
                  Transactions
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="overview">
              {/* Profile Overview Section */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Profile Card */}
                <motion.div variants={itemVariants}>
                  <Card className="bg-grey-700 backdrop-blur-xl border-white/10 shadow-xl overflow-hidden h-full">
                    <CardHeader className="pb-2">
                      <div className="absolute top-0 right-0 left-0 h-20 blur-xl opacity-50"></div>
                      <div className="flex flex-col items-center relative">
                        <Avatar className="w-24 h-24 border-4 border-white/10 shadow-xl">
                          <AvatarImage
                            src={user?.photoURL || "https://avatar.iran.liara.run/public/boy"}
                            alt="User"
                          />
                          <AvatarFallback className="bg-gradient-to-br from-blue-600 to-purple-600">
                            {user?.displayName?.charAt(0) || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <Badge className="absolute -bottom-2 right-1/2 transform translate-x-1/2 bg-gradient-to-r from-blue-500 to-purple-500 border-0 px-3">
                          Premium
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="text-center pt-4">
                      <h2 className="text-2xl font-bold mt-2">
                        {user?.displayName || "User"}
                      </h2>
                      <p className="text-gray-400 text-sm">{user?.email || "user@example.com"}</p>
                      
                      <div className="mt-6 grid grid-cols-2 gap-4 text-center">
                        <div className="bg-white/5 rounded-lg p-3">
                          <p className="text-gray-400 text-xs mb-1">Member Since</p>
                          <p className="font-medium">Jan 2023</p>
                        </div>
                        <div className="bg-white/5 rounded-lg p-3">
                          <p className="text-gray-400 text-xs mb-1">Status</p>
                          <p className="font-medium text-green-400">Active</p>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between p-4 border-t border-white/5 mt-4">
                      <Button variant="outline" className="border-white/10 hover:bg-white/5">
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                      <Button 
                        variant="destructive" 
                        onClick={handleLogout}
                        className="bg-red-500/20 text-red-400 hover:bg-red-500/30 border-0"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Logout
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>

                {/* Investment & Wallet Summary */}
                <motion.div variants={itemVariants} className="md:col-span-2">
                  <Card className="bg-black backdrop-blur-xl border-white/10 shadow-xl h-full">
                    <CardHeader>
                      <CardTitle className="text-xl font-semibold flex items-center">
                        <User className="h-5 w-5 mr-2 text-blue-400" />
                        Financial Summary
                      </CardTitle>
                      <CardDescription>
                        Overview of your portfolio and wallet
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white/5 rounded-xl p-5 border border-white/10">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <p className="text-gray-400 text-sm">Portfolio Value</p>
                              <h3 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                                ${investmentData?.totalPortfolioValue?.toFixed(2) || "0.00"}
                              </h3>
                            </div>
                            <div className="bg-blue-500/20 p-2 rounded-lg">
                              <BarChart3 className="h-6 w-6 text-blue-400" />
                            </div>
                          </div>
                          <div className="flex items-center gap-2 mb-2">
                            <div className="flex-1">
                              <Progress value={75} className="h-2 bg-white/10" />
                            </div>
                            <span className="text-xs text-gray-400">75%</span>
                          </div>
                          <div className="flex items-center mt-4">
                            <Badge className={`${portfolioGrowth >= 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'} border-0`}>
                              {portfolioGrowth >= 0 ? <ChevronUp className="h-3 w-3 mr-1" /> : <ChevronDown className="h-3 w-3 mr-1" />}
                              {Math.abs(portfolioGrowth).toFixed(2)}%
                            </Badge>
                            <span className="text-xs text-gray-400 ml-2">vs. initial investment</span>
                          </div>
                        </div>
                        
                        <div className="bg-white/5 rounded-xl p-5 border border-white/10">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <p className="text-gray-400 text-sm">Wallet Balance</p>
                              <h3 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-teal-400">
                                ${walletData?.balance?.toFixed(2) || "0.00"}
                              </h3>
                            </div>
                            <div className="bg-green-500/20 p-2 rounded-lg">
                              <Wallet className="h-6 w-6 text-green-400" />
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4 mt-6">
                            <Button variant="outline" className="border-white/10 hover:bg-white/5 h-10" onClick={navigateToPay}>
                              <ArrowUpRight className="h-4 w-4 mr-2" />
                              Deposit
                            </Button>
                            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 h-10 border-0" onClick={navigateToPay}>x
                              <ArrowRight className="h-4 w-4 mr-2" />
                              Transfer
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>

              {/* Charts Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                {/* Pie Chart - Stock Distribution */}
                <motion.div variants={itemVariants}>
                  <Card className="bg-black backdrop-blur-xl border-white/10 shadow-xl h-full">
                    <CardHeader>
                      <CardTitle className="text-xl font-semibold flex items-center">
                        <PieChartIcon className="h-5 w-5 mr-2 text-purple-400" />
                        Portfolio Allocation
                      </CardTitle>
                      <CardDescription>
                        Distribution of your investments
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {pieChartData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                          <PieChart>
                            <Pie
                              data={pieChartData}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={100}
                              fill="#8884d8"
                              dataKey="value"
                              paddingAngle={2}
                              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                              labelLine={false}
                            >
                              {pieChartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <RechartTooltip formatter={(value) => [`$${value.toFixed(2)}`, 'Value']} />
                          </PieChart>
                        </ResponsiveContainer>
                      ) : (
                        <div className="flex flex-col items-center justify-center h-[300px] bg-white/5 rounded-xl">
                          <PieChartIcon className="h-12 w-12 text-gray-600 mb-4" />
                          <p className="text-gray-400">No portfolio data available</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Bar Chart - Transactions */}
                <motion.div variants={itemVariants}>
                  <Card className="bg-black backdrop-blur-xl border-white/10 shadow-xl h-full">
                    <CardHeader>
                      <CardTitle className="text-xl font-semibold flex items-center">
                        <TrendingUp className="h-5 w-5 mr-2 text-blue-400" />
                        Recent Transactions
                      </CardTitle>
                      <CardDescription>
                        Your transaction history for the past 7 days
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {transactionChartData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                          <BarChart data={transactionChartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#444" vertical={false} />
                            <XAxis dataKey="date" tick={{ fill: "#aaa" }} />
                            <YAxis tick={{ fill: "#aaa" }} />
                            <RechartTooltip 
                              formatter={(value, name) => [`$${value}`, name === 'amount' ? 'Amount' : name]}
                              labelFormatter={(label) => `Date: ${label}`}
                              contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }}
                            />
                            <Bar 
                              dataKey="amount" 
                              fill="url(#colorGradient)" 
                              radius={[4, 4, 0, 0]}
                            />
                            <defs>
                              <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.8}/>
                                <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                              </linearGradient>
                            </defs>
                          </BarChart>
                        </ResponsiveContainer>
                      ) : (
                        <div className="flex flex-col items-center justify-center h-[300px] bg-white/5 rounded-xl">
                          <BarChart3 className="h-12 w-12 text-gray-600 mb-4" />
                          <p className="text-gray-400">No transaction data available</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </TabsContent>

            <TabsContent value="portfolio">
              <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 gap-6"
              >
                <motion.div variants={itemVariants}>
                  <Card className="bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-xl border-white/10 shadow-xl">
                    <CardHeader>
                      <CardTitle className="text-xl font-semibold flex items-center">
                        <BarChart3 className="h-5 w-5 mr-2 text-blue-400" />
                        Your Stock Portfolio
                      </CardTitle>
                      <CardDescription>
                        Detailed breakdown of your investments
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {profileData?.stocks?.length > 0 ? (
                        <div className="overflow-x-auto">
                          <Table>
                            <TableHeader className="bg-white/5">
                              <TableRow className="hover:bg-white/5 border-white/10">
                                <TableCell className="font-medium">Symbol</TableCell>
                                <TableCell className="font-medium">Quantity</TableCell>
                                <TableCell className="font-medium">Buy Price</TableCell>
                                <TableCell className="font-medium">Current Value</TableCell>
                                <TableCell className="font-medium">P/L</TableCell>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {profileData.stocks.map((stock, index) => {
                                const currentValue = stock.quantity * stock.buyPrice;
                                const profit = currentValue - (stock.quantity * stock.buyPrice);
                                const profitPercentage = (profit / (stock.quantity * stock.buyPrice)) * 100;
                                
                                return (
                                  <TableRow key={index} className="hover:bg-white/5 border-white/10">
                                    <TableCell className="font-medium">{stock.symbol}</TableCell>
                                    <TableCell>{stock.quantity}</TableCell>
                                    <TableCell>${stock.buyPrice.toFixed(2)}</TableCell>
                                    <TableCell>${currentValue.toFixed(2)}</TableCell>
                                    <TableCell className={profit >= 0 ? "text-green-400" : "text-red-400"}>
                                      <div className="flex items-center">
                                        {profit >= 0 ? <ChevronUp className="h-4 w-4 mr-1" /> : <ChevronDown className="h-4 w-4 mr-1" />}
                                        ${Math.abs(profit).toFixed(2)} ({Math.abs(profitPercentage).toFixed(2)}%)
                                      </div>
                                    </TableCell>
                                  </TableRow>
                                );
                              })}
                            </TableBody>
                          </Table>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-12 bg-white/5 rounded-xl">
                          <BarChart3 className="h-12 w-12 text-gray-600 mb-4" />
                          <p className="text-gray-400 mb-2">No stocks in your portfolio</p>
                          <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 mt-2 border-0">
                            Start Investing
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            </TabsContent>

            <TabsContent value="transactions">
              <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 gap-6"
              >
                <motion.div variants={itemVariants}>
                  <Card className="bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-xl border-white/10 shadow-xl">
                    <CardHeader>
                      <CardTitle className="text-xl font-semibold flex items-center">
                        <Clock className="h-5 w-5 mr-2 text-blue-400" />
                        Recent Transactions
                      </CardTitle>
                      <CardDescription>
                        Your latest financial activities
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {topTransactions.length > 0 ? (
                        <div className="overflow-x-auto">
                          <Table>
                            <TableHeader className="bg-white/5">
                              <TableRow className="hover:bg-white/5 border-white/10">
                                <TableCell className="font-medium">Date</TableCell>
                                <TableCell className="font-medium">Type</TableCell>
                                <TableCell className="font-medium">Amount</TableCell>
                                <TableCell className="font-medium">Status</TableCell>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {topTransactions.map((tx) => (
                                <TableRow key={tx._id} className="hover:bg-white/5 border-white/10">
                                  <TableCell>
                                    <div className="flex items-center">
                                      <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                                      {new Date(tx.timestamp).toLocaleDateString()}
                                    </div>
                                    <div className="text-xs text-gray-400">
                                      {new Date(tx.timestamp).toLocaleTimeString()}
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    <Badge className={tx.type === "credit" ? "bg-green-500/20 text-green-400 border-0" : "bg-red-500/20 text-red-400 border-0"}>
                                      {tx.type === "credit" ? "CREDIT" : "DEBIT"}
                                    </Badge>
                                  </TableCell>
                                  <TableCell className="font-medium">
                                    <div className={tx.type === "credit" ? "text-green-400" : "text-red-400"}>
                                      {tx.type === "credit" ? "+" : "-"}${tx.amount}
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/20">
                                      Completed
                                    </Badge>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-12 bg-white/5 rounded-xl">
                          <Clock className="h-12 w-12 text-gray-600 mb-4" />
                          <p className="text-gray-400">No transaction history available</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            </TabsContent>
          </Tabs>
        </motion.div>
      )}
    </div>
  );
}
