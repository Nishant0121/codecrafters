"use client"

import { useState, useEffect } from "react"
import {
  RefreshCcw,
  ExternalLink,
  TrendingUp,
  TrendingDown,
  Info,
  Globe,
  Search,
  ArrowUpRight,
  BarChart3,
  LineChart,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardContent, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

function StockIndexItem({ index, isExpanded, onToggleExpand }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={cn(
        "p-3 sm:p-4 rounded-lg transition-all duration-300",
        isExpanded ? "bg-white/5 border border-white/10" : "hover:bg-white/5",
      )}
    >
      <div className="flex items-center justify-between cursor-pointer" onClick={() => onToggleExpand(index.symbol)}>
        <div className="flex items-center gap-2 sm:gap-3">
          <div
            className={cn(
              "flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full",
              index.change >= 0 ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400",
            )}
          >
            {index.change >= 0 ? (
              <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5" />
            ) : (
              <TrendingDown className="h-4 w-4 sm:h-5 sm:w-5" />
            )}
          </div>
          <div className="space-y-0.5">
            <div className="text-sm sm:text-base font-semibold">{index.name}</div>
            <div className="flex items-center gap-1">
              <span className="text-xs sm:text-sm text-gray-400">{index.symbol}</span>
              {index.region && (
                <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/20 text-xs">
                  {index.region}
                </Badge>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="text-right">
            <div className="text-sm sm:text-base font-bold">{index.value}</div>
            <div
              className={cn(
                "flex items-center justify-end text-xs sm:text-sm font-medium",
                index.change > 0 ? "text-green-500" : "text-red-500",
              )}
            >
              {index.change > 0 ? (
                <TrendingUp className="h-3 w-3 mr-1" />
              ) : (
                <TrendingDown className="h-3 w-3 mr-1" />
              )}
              {index.change > 0 ? `+${index.change}` : index.change}%
            </div>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 sm:h-8 sm:w-8 text-gray-400 hover:text-white hover:bg-white/10"
                  onClick={(e) => {
                    e.stopPropagation()
                    window.open(`https://www.google.com/finance/quote/${index.symbol}`, "_blank")
                  }}
                >
                  <ExternalLink className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>View on Google Finance</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {isExpanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-white/10"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            <div className="bg-white/5 rounded-lg p-2 sm:p-3">
              <div className="text-xs text-gray-400 mb-1">Description</div>
              <div className="text-xs sm:text-sm">{index.description}</div>
            </div>
            <div className="bg-white/5 rounded-lg p-2 sm:p-3">
              <div className="text-xs text-gray-400 mb-1">Trading Hours</div>
              <div className="text-xs sm:text-sm">{index.tradingHours || "9:30 AM - 4:00 PM (Local Time)"}</div>
            </div>
          </div>

          <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row items-center justify-center h-24 sm:h-32 bg-white/5 rounded-lg p-3">
            <LineChart className="h-8 w-8 sm:h-12 sm:w-12 text-gray-600" />
            <span className="mt-2 sm:mt-0 sm:ml-2 text-xs sm:text-sm text-gray-400 text-center">
              Chart visualization coming soon
            </span>
          </div>

          <div className="mt-3 sm:mt-4 flex justify-end">
            <Button
              variant="outline"
              size="sm"
              className="border-white/10 hover:bg-white/5 text-xs sm:text-sm"
              onClick={(e) => {
                e.stopPropagation()
                window.open(`https://www.google.com/finance/quote/${index.symbol}`, "_blank")
              }}
            >
              <ArrowUpRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5" />
              View Details
            </Button>
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}

export function StockIndexPreview() {
  const [indices, setIndices] = useState([
    {
      name: "S&P 500",
      symbol: "SPX",
      description: "Standard & Poor's 500 index of U.S. stocks, a widely regarded benchmark for the U.S. stock market.",
      change: 1.23,
      value: "4,893.75",
      region: "US",
      tradingHours: "9:30 AM - 4:00 PM (EST)",
    },
    {
      name: "Dow Jones Industrial Average",
      symbol: "DJIA",
      description:
        "Price-weighted average of 30 significant stocks traded on the New York Stock Exchange and the NASDAQ.",
      change: -0.56,
      value: "38,150.30",
      region: "US",
      tradingHours: "9:30 AM - 4:00 PM (EST)",
    },
    {
      name: "NASDAQ Composite",
      symbol: "NASDAQ",
      description: "Stock market index of the common stocks and similar securities listed on the NASDAQ stock market.",
      change: 0.78,
      value: "15,609.00",
      region: "US",
      tradingHours: "9:30 AM - 4:00 PM (EST)",
    },
    {
      name: "FTSE 100",
      symbol: "FTSE",
      description:
        "Share index of the 100 companies listed on the London Stock Exchange with the highest market capitalization.",
      change: -0.12,
      value: "7,652.50",
      region: "UK",
      tradingHours: "8:00 AM - 4:30 PM (GMT)",
    },
    {
      name: "Nikkei 225",
      symbol: "N225",
      description: "Stock market index for the Tokyo Stock Exchange, representing the top 225 companies in Japan.",
      change: 1.46,
      value: "36,158.02",
      region: "Japan",
      tradingHours: "9:00 AM - 3:00 PM (JST)",
    },
    {
      name: "DAX",
      symbol: "DAX",
      description:
        "Blue chip stock market index consisting of the 40 major German companies trading on the Frankfurt Stock Exchange.",
      change: 0.34,
      value: "16,972.40",
      region: "Germany",
      tradingHours: "9:00 AM - 5:30 PM (CET)",
    },
  ])

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [expandedIndex, setExpandedIndex] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredIndices, setFilteredIndices] = useState(indices)
  const [activeRegion, setActiveRegion] = useState("all")

  useEffect(() => {
    let filtered = [...indices]

    if (searchQuery) {
      filtered = filtered.filter(
        (index) =>
          index.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          index.symbol.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    if (activeRegion !== "all") {
      filtered = filtered.filter((index) => index.region === activeRegion)
    }

    setFilteredIndices(filtered)
  }, [indices, searchQuery, activeRegion])

  const handleRefresh = () => {
    setLoading(true)
    setTimeout(() => {
      const updatedIndices = indices.map((index) => ({
        ...index,
        change: Number.parseFloat((Math.random() * 4 - 2).toFixed(2)),
        value: Number.parseFloat(
          Number.parseFloat(index.value.replace(",", "")) * (1 + (Math.random() * 0.02 - 0.01)),
        ).toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }),
      }))
      setIndices(updatedIndices)
      setLoading(false)
    }, 1000)
  }

  const handleToggleExpand = (symbol) => {
    setExpandedIndex(expandedIndex === symbol ? null : symbol)
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

  return (
    <motion.div
      className="h-[80vh] bg-gradient-to-br from-black via-gray-900 to-slate-900 text-white p-4 md:p-6 lg:p-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="max-w-5xl mx-auto">
        <motion.div variants={itemVariants} className="mb-6 md:mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-4 md:mb-6">
            <div className="space-y-1">
              <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                Global Market Indices
              </h1>
              <div className="items-center gap-2 w-full md:w-auto">
              <div className="relative flex-1 md:w-64 mt-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search indices..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-400 h-10 md:h-11"
                />
              </div>
            </div>
            </div>
          </div>

          <Tabs defaultValue="all" value={activeRegion} onValueChange={setActiveRegion} className="mb-4 md:mb-6">
            <div className="overflow-x-auto pb-2">
              <TabsList className="bg-white/5 border border-white/10 w-max">
                <TabsTrigger value="all" className="data-[state=active]:bg-white/10 text-xs md:text-sm">
                  <Globe className="h-4 w-4 mr-1 md:mr-2" />
                  All Regions
                </TabsTrigger>
                {/* <TabsTrigger value="US" className="data-[state=active]:bg-white/10 text-xs md:text-sm">
                  United States
                </TabsTrigger> */}
                <TabsTrigger value="Europe" className="data-[state=active]:bg-white/10 text-xs md:text-sm">
                  Europe
                </TabsTrigger>
                <TabsTrigger value="Asia" className="data-[state=active]:bg-white/10 text-xs md:text-sm">
                  Asia
                </TabsTrigger>
              </TabsList>
            </div>
          </Tabs>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-xl border-white/10 shadow-xl">
            <CardHeader className="border-b border-white/10 p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div className="space-y-1">
                  <CardTitle className="text-lg md:text-xl font-semibold flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2 text-blue-400" />
                    Stock Indices
                  </CardTitle>
                  <CardDescription className="text-xs md:text-sm">Real-time market performance indicators</CardDescription>
                </div>
                <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/20 text-xs md:text-sm">
                  {loading ? "Updating..." : "Live Data"}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="p-2 sm:p-4">
              {loading ? (
                <div className="space-y-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex items-center justify-between p-3">
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-white/5" />
                        <div className="space-y-1.5">
                          <Skeleton className="h-4 w-32 sm:w-40 bg-white/5" />
                          <Skeleton className="h-3 w-24 bg-white/5" />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <Skeleton className="h-4 w-20 sm:w-24 bg-white/5" />
                        <Skeleton className="h-3 w-16 bg-white/5" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : error ? (
                <div className="flex items-center justify-center py-8 text-red-400">
                  <Info className="h-5 w-5 mr-2" />
                  <span className="text-sm">{error}</span>
                </div>
              ) : filteredIndices.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8">
                  <Info className="h-10 w-10 text-gray-600 mb-3" />
                  <h3 className="text-lg font-semibold text-white mb-1">No indices found</h3>
                  <p className="text-gray-400 text-center text-sm mb-4">Try adjusting your search criteria</p>
                  <Button
                    variant="outline"
                    className="border-white/10 hover:bg-white/5 text-sm"
                    onClick={() => {
                      setSearchQuery("")
                      setActiveRegion("all")
                    }}
                  >
                    Clear Filters
                  </Button>
                </div>
              ) : (
                <div className="space-y-1.5">
                  {filteredIndices.map((index) => (
                    <StockIndexItem
                      key={index.symbol}
                      index={index}
                      isExpanded={expandedIndex === index.symbol}
                      onToggleExpand={handleToggleExpand}
                    />
                  ))}
                </div>
              )}
            </CardContent>

            <CardFooter className="border-t border-white/10 p-4 flex flex-col sm:flex-row justify-between items-center gap-3">
              <div className="text-xs sm:text-sm text-gray-400">Last updated: {new Date().toLocaleTimeString()}</div>
              <Button
                variant="outline"
                size="sm"
                className="border-white/10 hover:bg-white/5 text-xs sm:text-sm"
                onClick={() => window.open("https://www.google.com/finance/markets/indices", "_blank")}
              >
                <ExternalLink className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5" />
                View All Markets
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default StockIndexPreview