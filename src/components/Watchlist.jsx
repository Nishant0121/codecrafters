"use client"

import { useContext, useEffect, useRef, useState } from "react"
import { Link } from "react-router-dom"
import {
  Briefcase,
  ChevronDown,
  ChevronUp,
  Plus,
  Minus,
  Info,
  AlertCircle,
  Search,
  Filter,
  SlidersHorizontal,
  ArrowRight,
} from "lucide-react"
import { gsap } from "gsap"
import axios from "axios"
import { AppContext } from "@/context/appContext"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import { ScrollArea } from "@/components/ui/scroll-area"
// import { useMediaQuery } from "@/hooks/use-mobile"

const Watchlist = ({ stocks = [], uid }) => {
  const watchlistRef = useRef(null)
  const [expandedStock, setExpandedStock] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredStocks, setFilteredStocks] = useState(stocks)
  const [sortBy, setSortBy] = useState("default")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [selectedStock, setSelectedStock] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const { loginUser } = useContext(AppContext)
  // const isMobile = useMediaQuery("(max-width: 768px)")

  useEffect(() => {
    if (watchlistRef.current) {
      gsap.fromTo(
        watchlistRef.current.children,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.4, ease: "power3.out", stagger: 0.1 },
      )
    }

    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [])

  useEffect(() => {
    // Filter and sort stocks when stocks, searchQuery, or sortBy changes
    let result = [...stocks]

    // Apply search filter
    if (searchQuery) {
      result = result.filter(
        (stock) =>
          stock.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (stock.name && stock.name.toLowerCase().includes(searchQuery.toLowerCase())),
      )
    }

    // Apply sorting
    switch (sortBy) {
      case "priceAsc":
        result.sort((a, b) => (a.close || 0) - (b.close || 0))
        break
      case "priceDesc":
        result.sort((a, b) => (b.close || 0) - (a.close || 0))
        break
      case "changeAsc":
        result.sort((a, b) => {
          const changeA = a.open !== 0 ? ((a.close - a.open) / a.open) * 100 : 0
          const changeB = b.open !== 0 ? ((b.close - b.open) / b.open) * 100 : 0
          return changeA - changeB
        })
        break
      case "changeDesc":
        result.sort((a, b) => {
          const changeA = a.open !== 0 ? ((a.close - a.open) / a.open) * 100 : 0
          const changeB = b.open !== 0 ? ((b.close - b.open) / b.open) * 100 : 0
          return changeB - changeA
        })
        break
      case "owned":
        result.sort((a, b) => (b.quantityOwned || 0) - (a.quantityOwned || 0))
        break
      default:
        // Keep original order
        break
    }

    setFilteredStocks(result)
  }, [stocks, searchQuery, sortBy])

  const handleToggleDropdown = (symbol) => {
    setExpandedStock(expandedStock === symbol ? null : symbol)
    setQuantity(1) // Reset quantity on toggle
  }

  // const handleStockDetails = (stock) => {
  //   setSelectedStock(stock)
  //   if (isMobile) {
  //     setIsDrawerOpen(true)
  //   } else {
  //     setIsDialogOpen(true)
  //   }
  // }

  const handleBuyStock = async (quantity, stock) => {
    if (quantity <= 0) return alert("Quantity must be greater than 0")
    setIsLoading(true)
    try {
      const response = await axios.post("http://localhost:3000/api/stock/addStock", {
        uid: loginUser.uid,
        quantity,
        symbol: stock.symbol,
        buyPrice: stock.close,
        purchaseDate: new Date(),
      })
      const response2 = await axios.post("http://localhost:3000/api/stock/updateWallet", {
        uid: loginUser.uid,
        amount: Number(stock.close * quantity),
        type: "debit",
      })
      console.log(response2.data.message)

      alert(response.data.message)
      // Close any open dialogs/drawers
      setIsDialogOpen(false)
      setIsDrawerOpen(false)
      // Refresh the component or update state as needed
    } catch (error) {
      console.error("Error buying stock:", error)
      alert("Failed to buy stock.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSellStock = async (quantity, stock) => {
    if (quantity <= 0) return alert("Quantity must be greater than 0")
    if ((stock.quantityOwned || 0) < quantity) return alert("You don't own enough shares to sell this quantity")

    setIsLoading(true)
    try {
      const response = await axios.post("http://localhost:3000/api/stock/removeStock", {
        uid: loginUser.uid,
        quantity,
        symbol: stock.symbol,
      })
      const response2 = await axios.post("http://localhost:3000/api/stock/updateWallet", {
        uid: loginUser.uid,
        amount: Number(stock.close * quantity),
        type: "credit",
      })
      console.log(response2.data.message)

      alert(response.data.message)
      // Close any open dialogs/drawers
      setIsDialogOpen(false)
      setIsDrawerOpen(false)
      // Refresh the component or update state as needed
    } catch (error) {
      console.error("Error selling stock:", error)
      alert("Failed to sell stock.")
    } finally {
      setIsLoading(false)
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

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
  }

  const renderStockDetails = () => {
    if (!selectedStock) return null

    const open = selectedStock.open ?? 0
    const close = selectedStock.close ?? 0
    const change = open !== 0 ? ((close - open) / open) * 100 : 0
    const quantityOwned = selectedStock.quantityOwned ?? 0
    const portfolioValue = quantityOwned * close
    const avgCost = selectedStock.avgCost || close
    const pnl = (close - avgCost) * quantityOwned
    const pnlPercentage = avgCost !== 0 ? ((close - avgCost) / avgCost) * 100 : 0

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/20 text-blue-300">
              <Briefcase className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{selectedStock.symbol}</h2>
              {selectedStock.name && <p className="text-sm text-gray-400">{selectedStock.name}</p>}
            </div>
          </div>
          <Badge
            className={`${change >= 0 ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"} border-0`}
          >
            {change >= 0 ? <ChevronUp className="h-3 w-3 mr-1" /> : <ChevronDown className="h-3 w-3 mr-1" />}
            {Math.abs(change).toFixed(2)}%
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/5 rounded-lg p-4">
            <p className="text-gray-400 text-xs mb-1">Current Price</p>
            <p className="text-xl font-bold text-white">
              ₹{close.toLocaleString(undefined, { maximumFractionDigits: 2 })}
            </p>
          </div>
          <div className="bg-white/5 rounded-lg p-4">
            <p className="text-gray-400 text-xs mb-1">Open Price</p>
            <p className="text-xl font-bold text-white">
              ₹{open.toLocaleString(undefined, { maximumFractionDigits: 2 })}
            </p>
          </div>
        </div>

        {quantityOwned > 0 && (
          <div className="bg-blue-500/10 rounded-lg p-4 border border-blue-500/20">
            <h3 className="text-sm font-medium text-blue-400 mb-3">Your Position</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-400 text-xs mb-1">Shares Owned</p>
                <p className="text-lg font-medium text-white">{quantityOwned}</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs mb-1">Position Value</p>
                <p className="text-lg font-medium text-white">
                  ₹{portfolioValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                </p>
              </div>
              <div>
                <p className="text-gray-400 text-xs mb-1">Average Cost</p>
                <p className="text-lg font-medium text-white">
                  ₹{avgCost.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                </p>
              </div>
              <div>
                <p className="text-gray-400 text-xs mb-1">Profit/Loss</p>
                <p className={`text-lg font-medium ${pnl >= 0 ? "text-green-400" : "text-red-400"}`}>
                  {pnl >= 0 ? "+" : ""}₹{pnl.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                  <span className="text-xs ml-1">
                    ({pnl >= 0 ? "+" : ""}
                    {pnlPercentage.toFixed(2)}%)
                  </span>
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-4">
          <h3 className="text-sm font-medium text-gray-400">Trade</h3>
          <div className="flex items-center gap-3">
            <label className="text-white text-sm">Quantity:</label>
            <div className="flex items-center">
              <button
                onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                className="cursor-pointer bg-white/10 text-white px-2 py-1 rounded-l-md hover:bg-white/20 transition-colors"
                disabled={isLoading}
              >
                <Minus className="h-4 w-4" />
              </button>
              <input
                value={quantity}
                min="1"
                onChange={(e) => setQuantity(Number(e.target.value) || 1)}
                className="w-16 p-1 text-white bg-white/10 text-center border-x border-white/20 focus:outline-none"
                disabled={isLoading}
              />
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="cursor-pointer bg-white/10 text-white px-2 py-1 rounded-r-md hover:bg-white/20 transition-colors"
                disabled={isLoading}
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <div className="text-sm text-gray-400">
              Total: ₹{(quantity * close).toLocaleString(undefined, { maximumFractionDigits: 2 })}
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <Button
              onClick={() => handleBuyStock(quantity, selectedStock)}
              className="flex-1 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 border-0"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing...
                </div>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Buy
                </>
              )}
            </Button>
            <Button
              onClick={() => handleSellStock(quantity, selectedStock)}
              className="flex-1 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 border-0"
              disabled={isLoading || quantityOwned < 1}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing...
                </div>
              ) : (
                <>
                  <Minus className="h-4 w-4 mr-2" />
                  Sell
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-slate-900 text-white p-4 md:p-8">
      <motion.div className="max-w-5xl mx-auto" variants={containerVariants} initial="hidden" animate="visible">
        <motion.div variants={itemVariants} className="mb-8 pt-13">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                Your Stock Watchlist
              </h1>
              <p className="text-gray-400 mt-1">Track and manage your favorite stocks</p>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="relative flex-1 md:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search stocks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-400 w-full"
                />
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="bg-white/5 border-white/10 hover:bg-white/10">
                    <SlidersHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-slate-800 border-white/10 text-white">
                  <DropdownMenuItem
                    className={sortBy === "default" ? "bg-white/10" : ""}
                    onClick={() => setSortBy("default")}
                  >
                    Default Order
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className={sortBy === "priceAsc" ? "bg-white/10" : ""}
                    onClick={() => setSortBy("priceAsc")}
                  >
                    Price (Low to High)
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className={sortBy === "priceDesc" ? "bg-white/10" : ""}
                    onClick={() => setSortBy("priceDesc")}
                  >
                    Price (High to Low)
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className={sortBy === "changeDesc" ? "bg-white/10" : ""}
                    onClick={() => setSortBy("changeDesc")}
                  >
                    % Change (Highest)
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className={sortBy === "changeAsc" ? "bg-white/10" : ""}
                    onClick={() => setSortBy("changeAsc")}
                  >
                    % Change (Lowest)
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className={sortBy === "owned" ? "bg-white/10" : ""}
                    onClick={() => setSortBy("owned")}
                  >
                    Shares Owned
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <Tabs defaultValue="all" className="mb-6">
            <TabsList className="bg-white/5 border border-white/10">
              <TabsTrigger value="all" className="data-[state=active]:bg-white/10">
                All Stocks
              </TabsTrigger>
              <TabsTrigger value="owned" className="data-[state=active]:bg-white/10">
                My Portfolio
              </TabsTrigger>
              <TabsTrigger value="gainers" className="data-[state=active]:bg-white/10">
                Top Gainers
              </TabsTrigger>
              <TabsTrigger value="losers" className="data-[state=active]:bg-white/10">
                Top Losers
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </motion.div>

        <div className="space-y-5" ref={watchlistRef}>
          {filteredStocks.length === 0 ? (
            <Card className="bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-xl border-white/10 shadow-xl">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <AlertCircle className="h-12 w-12 text-gray-600 mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No stocks found</h3>
                <p className="text-gray-400 text-center mb-6">Try adjusting your search or filters</p>
                <Button
                  variant="outline"
                  className="border-white/10 hover:bg-white/5"
                  onClick={() => {
                    setSearchQuery("")
                    setSortBy("default")
                  }}
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Clear Filters
                </Button>
              </CardContent>
            </Card>
          ) : (
            filteredStocks.map((stock) => {
              const open = stock.open ?? 0
              const close = stock.close ?? 0
              const change = open !== 0 ? ((close - open) / open) * 100 : 0
              const quantityOwned = stock.quantityOwned ?? 0
              const portfolioValue = quantityOwned * close

              return (
                <motion.div variants={itemVariants} key={stock.symbol}>
                  <Card className="bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-xl border-white/10 shadow-xl overflow-hidden transition-all duration-300 hover:border-blue-500/30 group">
                    {/* Stock Info Row */}
                    <CardHeader className="p-5">
                      <div
                        className="flex justify-between items-center cursor-pointer"
                        onClick={() => handleToggleDropdown(stock.symbol)}
                      >
                        {/* Symbol & Name */}
                        <div className="flex items-center space-x-4">
                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 text-blue-300 group-hover:from-blue-500/30 group-hover:to-purple-500/30 transition-all">
                            <Briefcase className="w-6 h-6" />
                          </div>
                          <div>
                            <span className="text-lg font-medium text-white group-hover:text-blue-400 transition-colors">
                              {stock.symbol}
                            </span>
                            {stock.name && <p className="text-xs text-gray-400">{stock.name}</p>}
                            {quantityOwned > 0 && (
                              <div className="mt-1 flex items-center">
                                <span className="text-xs text-gray-300 font-medium">
                                  You own: <span className="text-blue-300">{quantityOwned}</span> shares
                                </span>
                                <span className="mx-2 text-gray-500">•</span>
                                <span className="text-xs text-gray-300 font-medium">
                                  Value:{" "}
                                  <span className="text-blue-300">
                                    ₹
                                    {portfolioValue.toLocaleString(undefined, {
                                      maximumFractionDigits: 2,
                                    })}
                                  </span>
                                </span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Price & Change */}
                        <div className="flex flex-row gap-6 items-end">
                          <div className="flex flex-col items-end">
                            <span className="text-lg font-semibold text-white">
                              ₹
                              {close.toLocaleString(undefined, {
                                maximumFractionDigits: 2,
                              })}
                            </span>
                            <Badge
                              className={`${change >= 0 ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"} border-0`}
                            >
                              {change >= 0 ? (
                                <ChevronUp className="h-3 w-3 mr-1" />
                              ) : (
                                <ChevronDown className="h-3 w-3 mr-1" />
                              )}
                              {Math.abs(change).toFixed(2)}%
                            </Badge>
                          </div>

                          {/* View Details Link */}
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 rounded-full h-8 w-8"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleStockDetails(stock)
                                  }}
                                >
                                  <Info className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>View stock details</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>

                          <Link
                            to={`/watchlist/${stock.symbol}`}
                            className="flex items-center text-blue-400 text-sm font-medium hover:underline transition-all bg-blue-500/10 px-3 py-1 rounded-full"
                            onClick={(e) => e.stopPropagation()} // Prevent dropdown toggle on link click
                          >
                            Charts
                            <ArrowRight className="h-3 w-3 ml-1" />
                          </Link>
                        </div>
                      </div>
                    </CardHeader>

                    {/* Dropdown Content */}
                    {expandedStock === stock.symbol && (
                      <CardContent className="px-5 pb-5 pt-0">
                        <div className="p-4 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div className="flex items-center gap-3">
                              <label className="text-white text-sm">Quantity:</label>
                              <div className="flex items-center">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    quantity > 1 && setQuantity(quantity - 1)
                                  }}
                                  className="cursor-pointer bg-white/10 text-white px-2 py-1 rounded-l-md hover:bg-white/20 transition-colors"
                                >
                                  <Minus className="h-4 w-4" />
                                </button>
                                <input
                                  value={quantity}
                                  min="1"
                                  onChange={(e) => setQuantity(Number(e.target.value) || 1)}
                                  className="w-16 p-1 text-white bg-white/10 text-center border-x border-white/20 focus:outline-none"
                                  onClick={(e) => e.stopPropagation()}
                                />
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    setQuantity(quantity + 1)
                                  }}
                                  className="cursor-pointer bg-white/10 text-white px-2 py-1 rounded-r-md hover:bg-white/20 transition-colors"
                                >
                                  <Plus className="h-4 w-4" />
                                </button>
                              </div>
                              <div className="text-sm text-gray-400">
                                Total: ₹
                                {(quantity * close).toLocaleString(undefined, {
                                  maximumFractionDigits: 2,
                                })}
                              </div>
                            </div>
                            <div className="flex gap-3">
                              <Button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleBuyStock(quantity, stock)
                                }}
                                className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 border-0"
                              >
                                <Plus className="h-4 w-4 mr-1" />
                                Buy
                              </Button>
                              <Button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleSellStock(quantity, stock)
                                }}
                                className="bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 border-0"
                                disabled={quantityOwned < 1}
                              >
                                <Minus className="h-4 w-4 mr-1" />
                                Sell
                              </Button>
                            </div>
                          </div>
                          {quantityOwned > 0 && (
                            <div className="mt-3 p-3 bg-blue-500/10 rounded-md border border-blue-500/20">
                              <div className="text-sm text-gray-300">
                                Your position: <span className="text-blue-300 font-medium">{quantityOwned} shares</span>{" "}
                                • Avg. cost:{" "}
                                <span className="text-blue-300 font-medium">
                                  ₹{(stock.avgCost || close).toFixed(2)}
                                </span>{" "}
                                • P&L:{" "}
                                <span
                                  className={`font-medium ${
                                    close - (stock.avgCost || close) >= 0 ? "text-green-400" : "text-red-400"
                                  }`}
                                >
                                  {close - (stock.avgCost || close) >= 0 ? "+" : ""}
                                  {((close - (stock.avgCost || close)) * quantityOwned).toFixed(2)}(
                                  {(((close - (stock.avgCost || close)) / (stock.avgCost || close)) * 100).toFixed(2)}
                                  %)
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    )}
                  </Card>
                </motion.div>
              )
            })
          )}
        </div>

        {/* Stock Details Dialog (Desktop) */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-xl border-white/10 text-white">
            <DialogHeader>
              <DialogTitle>Stock Details</DialogTitle>
              <DialogDescription>View detailed information and trade this stock</DialogDescription>
            </DialogHeader>
            <ScrollArea className="max-h-[70vh]">
              <div className="p-4">{renderStockDetails()}</div>
            </ScrollArea>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                className="border-white/10 hover:bg-white/5"
              >
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Stock Details Drawer (Mobile) */}
        <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
          <DrawerContent className="bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-xl border-t border-white/10 text-white">
            <DrawerHeader>
              <DrawerTitle>Stock Details</DrawerTitle>
              <DrawerDescription>View detailed information and trade this stock</DrawerDescription>
            </DrawerHeader>
            <ScrollArea className="p-4 h-[60vh]">{renderStockDetails()}</ScrollArea>
            <DrawerFooter>
              <Button
                variant="outline"
                onClick={() => setIsDrawerOpen(false)}
                className="border-white/10 hover:bg-white/5"
              >
                Close
              </Button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </motion.div>
    </div>
  )
}

export default Watchlist