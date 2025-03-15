"use client"

import { useState, useEffect } from "react"
import {
  Banknote,
  Search,
  X,
  Star,
  ChevronRight,
  Heart,
  HeartOff,
  Filter,
  Check,
  Info,
  DollarSign,
  TrendingUp,
  Clock,
  AlertTriangle,
  BarChart3,
  LineChart,
  PieChart,
  Briefcase,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

const BondsAndSecuritiesComponent = () => {
  const financialProducts = [
    {
      category: "Bonds",
      icon: <Briefcase className="h-5 w-5" />,
      products: [
        {
          id: "b1",
          name: "Government Bond (10 Year)",
          description:
            "A long-term bond issued by the government, generally considered to be low-risk. Pays interest semi-annually.",
          price: "$1,000 (minimum investment)",
          priceValue: 1000,
          interestRate: "2.5% annually",
          maturity: "10 Years",
          riskLevel: "Low",
          benefits:
            "Guaranteed returns from the government with a fixed interest rate, suitable for conservative investors.",
          rating: 4.2,
          popular: true,
          chartType: "line",
        },
        {
          id: "b2",
          name: "Corporate Bond (5 Year)",
          description:
            "A bond issued by a corporation. Pays fixed interest and can be riskier than government bonds depending on the company.",
          price: "$500 (minimum investment)",
          priceValue: 500,
          interestRate: "5% annually",
          maturity: "5 Years",
          riskLevel: "Medium",
          benefits:
            "Higher return potential than government bonds but comes with higher risk based on the issuing company's credit rating.",
          rating: 4.0,
          popular: false,
          chartType: "bar",
        },
        {
          id: "b3",
          name: "Municipal Bond",
          description:
            "Issued by a local government, often tax-exempt. Suitable for investors looking for long-term stable income.",
          price: "$1,000 (minimum investment)",
          priceValue: 1000,
          interestRate: "3.2% annually",
          maturity: "10 Years",
          riskLevel: "Low",
          benefits: "Provides tax-exempt income for residents and offers low risk compared to other bonds.",
          rating: 4.3,
          popular: false,
          chartType: "line",
        },
        {
          id: "b4",
          name: "Junk Bond",
          description:
            "High-yield bonds issued by companies with lower credit ratings. Offers higher returns but comes with higher risk.",
          price: "$500 (minimum investment)",
          priceValue: 500,
          interestRate: "8% annually",
          maturity: "5 Years",
          riskLevel: "High",
          benefits:
            "Higher returns but also higher risk. Suitable for aggressive investors looking for returns in exchange for potential risk.",
          rating: 3.7,
          popular: false,
          chartType: "bar",
        },
        {
          id: "b5",
          name: "Government Bond (10 Year)",
          description:
            "A long-term bond issued by the government, generally considered to be low-risk. Pays interest semi-annually.",
          price: "$1,000 (minimum investment)",
          priceValue: 1000,
          interestRate: "2.5% annually",
          maturity: "10 Years",
          riskLevel: "Low",
          benefits:
            "Guaranteed returns from the government with a fixed interest rate, suitable for conservative investors.",
          rating: 4.2,
          popular: true,
          chartType: "line",
        },
        {
          id: "b6",
          name: "Corporate Bond (5 Year)",
          description:
            "A bond issued by a corporation. Pays fixed interest and can be riskier than government bonds depending on the company.",
          price: "$500 (minimum investment)",
          priceValue: 500,
          interestRate: "5% annually",
          maturity: "5 Years",
          riskLevel: "Medium",
          benefits:
            "Higher return potential than government bonds but comes with higher risk based on the issuing company's credit rating.",
          rating: 4.0,
          popular: false,
          chartType: "bar",
        },
      ],
    },
    {
      category: "Securities",
      icon: <BarChart3 className="h-5 w-5" />,
      products: [
        {
          id: "s1",
          name: "Stock - Tech Company",
          description:
            "Invest in shares of a major tech company. Stocks are volatile but offer the potential for high returns over time.",
          price: "Variable (depends on market price)",
          priceValue: 2000,
          returns: "Annualized return of 10%",
          riskLevel: "High",
          benefits:
            "Opportunity for capital appreciation, high liquidity, and the potential for long-term growth in the tech sector.",
          rating: 4.1,
          popular: true,
          chartType: "line",
        },
        {
          id: "s2",
          name: "Exchange Traded Fund (ETF)",
          description:
            "A type of security that tracks an index, commodity, or a basket of assets. It's a low-cost way to diversify your investment.",
          price: "Variable (depends on the ETF)",
          priceValue: 1500,
          returns: "Annualized return of 7%",
          riskLevel: "Medium",
          benefits:
            "Diversification, lower risk than individual stocks, and lower fees compared to mutual funds.",
          rating: 4.5,
          popular: true,
          chartType: "pie",
        },
        {
          id: "s3",
          name: "Mutual Fund",
          description:
            "A managed investment fund where money from many investors is pooled together and managed by a fund manager.",
          price: "$1,000 (minimum investment)",
          priceValue: 1000,
          returns: "Annualized return of 8%",
          riskLevel: "Medium",
          benefits:
            "Diversification, professionally managed, and the ability to invest in a wide range of assets.",
          rating: 4.2,
          popular: false,
          chartType: "pie",
        },
        {
          id: "s4",
          name: "Real Estate Investment Trust (REIT)",
          description:
            "An investment vehicle that owns, operates, or finances real estate that produces income. REITs are traded like stocks.",
          price: "$500 (minimum investment)",
          priceValue: 500,
          returns: "Annualized return of 5%",
          riskLevel: "Medium",
          benefits:
            "Gives exposure to real estate markets with relatively low investment compared to buying properties directly.",
          rating: 4.0,
          popular: false,
          chartType: "bar",
        },
      ],
    },
  ]

  const [activeTab, setActiveTab] = useState("Bonds")
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false)
  const [wishlist, setWishlist] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [priceRange, setPriceRange] = useState([0, 2000])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [viewMode, setViewMode] = useState("grid")

  useEffect(() => {
    const category = financialProducts.find((cat) => cat.category === activeTab)
    if (category) {
      setFilteredProducts(
        category.products.map((product) => ({
          ...product,
          category: category.category,
        })),
      )
    }
  }, [activeTab])

  const handleTabChange = (tab) => {
    setActiveTab(tab)
    const category = financialProducts.find((cat) => cat.category === tab)
    if (category) {
      setFilteredProducts(
        category.products.map((product) => ({
          ...product,
          category: category.category,
        })),
      )
    }
  }

  const handleCloseModal = () => {
    setIsDialogOpen(false)
    setIsDrawerOpen(false)
  }

  const handleBuyNow = (product) => {
    alert(`You have successfully purchased ${product.name} for ${product.price}!`)
  }

  const toggleWishlist = (id) => {
    if (wishlist.includes(id)) {
      setWishlist(wishlist.filter((item) => item !== id))
    } else {
      setWishlist([...wishlist, id])
    }
  }

  const handleSearch = (e) => {
    setSearchQuery(e.target.value)
    applyFilters(e.target.value, priceRange)
  }

  const handlePriceRangeChange = (value) => {
    setPriceRange(value)
    applyFilters(searchQuery, value)
  }

  const applyFilters = (query, price) => {
    const category = financialProducts.find((cat) => cat.category === activeTab)
    if (!category) return

    let filtered = category.products.map((product) => ({
      ...product,
      category: category.category,
    }))

    if (query) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(query.toLowerCase()) ||
          product.description.toLowerCase().includes(query.toLowerCase()),
      )
    }

    filtered = filtered.filter((product) => product.priceValue >= price[0] && product.priceValue <= price[1])

    setFilteredProducts(filtered)
  }

  const renderRiskLevel = (level) => {
    const colors = {
      Low: "bg-green-500/20 text-green-400 border-green-500/20",
      Medium: "bg-yellow-500/20 text-yellow-400 border-yellow-500/20",
      High: "bg-red-500/20 text-red-400 border-red-500/20",
    }

    return (
      <Badge variant="outline" className={colors[level]}>
        {level === "Low" && <Check className="h-3 w-3 mr-1" />}
        {level === "Medium" && <AlertTriangle className="h-3 w-3 mr-1" />}
        {level === "High" && <AlertTriangle className="h-3 w-3 mr-1" />}
        {level} Risk
      </Badge>
    )
  }

  const renderChartIcon = (chartType) => {
    switch (chartType) {
      case "line":
        return <LineChart className="h-16 w-16 text-blue-400 opacity-20" />
      case "bar":
        return <BarChart3 className="h-16 w-16 text-purple-400 opacity-20" />
      case "pie":
        return <PieChart className="h-16 w-16 text-green-400 opacity-20" />
      default:
        return <LineChart className="h-16 w-16 text-blue-400 opacity-20" />
    }
  }

  const renderProductDetails = () => {
    if (!selectedProduct) return null

    return (
      <>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            {renderRiskLevel(selectedProduct.riskLevel)}
          </div>

          <h2 className="text-2xl font-bold">{selectedProduct.name}</h2>
          <p className="text-gray-500 dark:text-gray-400">{selectedProduct.description}</p>

          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="flex flex-col gap-2 p-4 rounded-lg bg-muted/50">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <DollarSign className="h-4 w-4" />
                <span>Price</span>
              </div>
              <div className="font-semibold">{selectedProduct.price}</div>
            </div>

            <div className="flex flex-col gap-2 p-4 rounded-lg bg-muted/50">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <TrendingUp className="h-4 w-4" />
                <span>{selectedProduct.interestRate ? "Interest Rate" : "Returns"}</span>
              </div>
              <div className="font-semibold">{selectedProduct.interestRate || selectedProduct.returns}</div>
            </div>

            {selectedProduct.maturity && (
              <div className="flex flex-col gap-2 p-4 rounded-lg bg-muted/50">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>Maturity</span>
                </div>
                <div className="font-semibold">{selectedProduct.maturity}</div>
              </div>
            )}

            <div className="flex flex-col gap-2 p-4 rounded-lg bg-muted/50">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <AlertTriangle className="h-4 w-4" />
                <span>Risk Level</span>
              </div>
              <div className="font-semibold">{selectedProduct.riskLevel}</div>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Benefits</h3>
            <p className="text-gray-500 dark:text-gray-400">{selectedProduct.benefits}</p>
          </div>

          <div className="mt-6 flex justify-center">{renderChartIcon(selectedProduct.chartType)}</div>
        </div>

        <div className="flex gap-3 mt-6">
          <Button variant="outline" className="flex-1" onClick={() => toggleWishlist(selectedProduct.id)}>
            {wishlist.includes(selectedProduct.id) ? (
              <>
                <HeartOff className="mr-2 h-4 w-4" />
                Remove from Wishlist
              </>
            ) : (
              <>
                <Heart className="mr-2 h-4 w-4" />
                Add to Wishlist
              </>
            )}
          </Button>
          <Button className="flex-1" onClick={() => handleBuyNow(selectedProduct)}>
            <Check className="mr-2 h-4 w-4" />
            Buy Now
          </Button>
        </div>
      </>
    )
  }

  return (
    <div className="container mx-auto p-4 md:p-8 bg-card/50 backdrop-blur-md rounded-xl shadow-2xl">
      <div className="flex items-center justify-between mb-8 pt-14">
        <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-2">
          <Banknote className="h-6 w-6 text-green-400" />
          Bonds & Securities
        </h1>

        <div className="flex items-center gap-2">
          <div className="relative hidden md:block w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={handleSearch}
              className="pl-10 bg-slate-800/50 border-slate-700 text-white placeholder:text-gray-400"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 text-gray-400 hover:text-white"
                onClick={() => {
                  setSearchQuery("")
                  applyFilters("", priceRange)
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          <Drawer open={isFilterDrawerOpen} onOpenChange={setIsFilterDrawerOpen}>
            <DrawerTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="bg-slate-800/50 border-slate-700 text-white hover:bg-slate-700"
              >
                <Filter className="h-4 w-4" />
              </Button>
            </DrawerTrigger>
            <DrawerContent className="bg-slate-900 text-white border-slate-700">
              <DrawerHeader>
                <DrawerTitle>Filter Financial Products</DrawerTitle>
                <DrawerDescription>Adjust filters to find the perfect investment for you</DrawerDescription>
              </DrawerHeader>
              <div className="px-4 py-2">
                <div className="space-y-6">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Search</label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        type="text"
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={handleSearch}
                        className="pl-10 bg-slate-800/50 border-slate-700 text-white placeholder:text-gray-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Price Range ($)</label>
                    <div className="pt-6 px-2">
                      <Slider
                        defaultValue={priceRange}
                        max={2000}
                        step={100}
                        onValueChange={handlePriceRangeChange}
                        className="mb-6"
                      />
                      <div className="flex justify-between text-sm text-gray-400">
                        <span>${priceRange[0]}</span>
                        <span>${priceRange[1]}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">View Mode</label>
                    <div className="flex gap-2">
                      <Button
                        variant={viewMode === "grid" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setViewMode("grid")}
                      >
                        Grid View
                      </Button>
                      <Button
                        variant={viewMode === "list" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setViewMode("list")}
                      >
                        List View
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              <DrawerFooter>
                <Button
                  onClick={() => {
                    setPriceRange([0, 2000])
                    setSearchQuery("")
                    applyFilters("", [0, 2000])
                  }}
                >
                  Reset Filters
                </Button>
                <DrawerClose asChild>
                  <Button variant="outline">Apply</Button>
                </DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>

          <div className="hidden md:flex gap-2">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="icon"
              className="bg-slate-800/50 border-slate-700 text-white hover:bg-slate-700"
              onClick={() => setViewMode("grid")}
            >
              <BarChart3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="icon"
              className="bg-slate-800/50 border-slate-700 text-white hover:bg-slate-700"
              onClick={() => setViewMode("list")}
            >
              <LineChart className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="md:hidden relative mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={handleSearch}
          className="pl-10 bg-slate-800/50 border-slate-700 text-white placeholder:text-gray-400"
        />
        {searchQuery && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 text-gray-400 hover:text-white"
            onClick={() => {
              setSearchQuery("")
              applyFilters("", priceRange)
            }}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      <Tabs defaultValue="Bonds" value={activeTab} onValueChange={handleTabChange} className="mb-6">
        <TabsList className="bg-slate-800/50 p-1 rounded-lg">
          {financialProducts.map((category, index) => (
            <TabsTrigger
              key={index}
              value={category.category}
              className="data-[state=active]:bg-green-600 flex items-center gap-2"
            >
              {category.icon}
              {category.category}
            </TabsTrigger>
          ))}
          <TabsTrigger
            value="wishlist"
            className="data-[state=active]:bg-green-600 flex items-center gap-2"
            onClick={() => {
              setActiveTab("wishlist")
              const allProducts = financialProducts.flatMap((category) =>
                category.products.map((product) => ({
                  ...product,
                  category: category.category,
                })),
              )
              setFilteredProducts(allProducts.filter((product) => wishlist.includes(product.id)))
            }}
          >
            <Heart className="h-4 w-4" />
            Wishlist ({wishlist.length})
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {filteredProducts.length > 0 ? (
        <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
          {filteredProducts.map((product, index) =>
            viewMode === "grid" ? (
              <Card
                key={index}
                className="overflow-hidden bg-slate-800/50 border-slate-700 hover:border-green-500/50 transition-all duration-300 group relative"
              >
                <div className="absolute top-2 right-2 z-10">
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`h-8 w-8 ${wishlist.includes(product.id) ? "text-red-400" : "text-gray-400"} hover:text-red-400 hover:bg-slate-700/50`}
                    onClick={() => toggleWishlist(product.id)}
                  >
                    {wishlist.includes(product.id) ? (
                      <Heart className="h-5 w-5 fill-current" />
                    ) : (
                      <Heart className="h-5 w-5" />
                    )}
                  </Button>
                </div>
                <div className="absolute top-0 right-0 w-24 h-24 overflow-hidden opacity-10 pointer-events-none">
                  {renderChartIcon(product.chartType)}
                </div>
                <CardHeader className="p-4 pb-0">
                  <div className="flex justify-between items-start">
                    {renderRiskLevel(product.riskLevel)}
                    {product.popular && <Badge className="bg-green-600">Popular</Badge>}
                  </div>
                  <h3 className="text-lg font-semibold text-white mt-2 group-hover:text-green-400 transition-colors">
                    {product.name}
                  </h3>
                </CardHeader>
                <CardContent className="p-4">
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">{product.description}</p>
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center">
                      <DollarSign className="h-4 w-4 text-green-400 mr-1" />
                      <span className="text-white font-semibold">{product.price}</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs text-gray-400">
                    <div className="flex items-center">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      <span>{product.interestRate || product.returns}</span>
                    </div>
                    {product.maturity && (
                      <div className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        <span>{product.maturity}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="p-4 pt-0 flex justify-between">
                  <Button variant="ghost" size="sm" onClick={() => handleLearnMore(product)}>
                    Learn More
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                  <Button size="sm" onClick={() => handleBuyNow(product)}>
                    Buy Now
                  </Button>
                </CardFooter>
              </Card>
            ) : (
              <Card
                key={index}
                className="bg-slate-800/50 border-slate-700 hover:border-green-500/50 transition-all duration-300 group"
              >
                <div className="flex flex-col md:flex-row">
                  <div className="p-4 flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          {renderRiskLevel(product.riskLevel)}
                          {product.popular && <Badge className="bg-green-600 ml-2">Popular</Badge>}
                        </div>
                        <h3 className="text-lg font-semibold text-white group-hover:text-green-400 transition-colors">
                          {product.name}
                        </h3>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className={`h-8 w-8 ${wishlist.includes(product.id) ? "text-red-400" : "text-gray-400"} hover:text-red-400 hover:bg-slate-700/50`}
                        onClick={() => toggleWishlist(product.id)}
                      >
                        {wishlist.includes(product.id) ? (
                          <Heart className="h-5 w-5 fill-current" />
                        ) : (
                          <Heart className="h-5 w-5" />
                        )}
                      </Button>
                    </div>
                    <p className="text-gray-400 text-sm my-2">{product.description}</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3">
                      <div>
                        <div className="text-xs text-gray-400">Price</div>
                        <div className="font-medium text-white">{product.price}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-400">
                          {product.interestRate ? "Interest Rate" : "Returns"}
                        </div>
                        <div className="font-medium text-white">{product.interestRate || product.returns}</div>
                      </div>
                      {product.maturity && (
                        <div>
                          <div className="text-xs text-gray-400">Maturity</div>
                          <div className="font-medium text-white">{product.maturity}</div>
                        </div>
                      )}
                      <div>
                        <div className="text-xs text-gray-400">Rating</div>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 md:w-48 flex flex-row md:flex-col justify-between items-center md:items-stretch md:border-l border-slate-700 bg-slate-800/30">
                    <div className="hidden md:block mb-4">{renderChartIcon(product.chartType)}</div>
                    <div className="flex flex-col gap-2 w-full">
                      <Button variant="outline" size="sm" onClick={() => handleLearnMore(product)}>
                        Learn More
                      </Button>
                      <Button size="sm" onClick={() => handleBuyNow(product)}>
                        Buy Now
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ),
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-gray-400">
          <Info className="h-12 w-12 mb-4 opacity-50" />
          <h3 className="text-xl font-semibold mb-2">No financial products found</h3>
          <p className="text-center max-w-md mb-6">
            Try adjusting your filters or search criteria to find financial products that match your investment goals.
          </p>
          <Button
            onClick={() => {
              setPriceRange([0, 2000])
              setSearchQuery("")
              applyFilters("", [0, 2000])
            }}
          >
            Reset Filters
          </Button>
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px] bg-slate-900 text-white border-slate-700">
          <DialogHeader>
            <DialogTitle>Investment Details</DialogTitle>
            <DialogDescription>Comprehensive information about the selected financial product</DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh]">
            <div className="p-4">{renderProductDetails()}</div>
          </ScrollArea>
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseModal}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DrawerContent className="bg-slate-900 text-white border-slate-700">
          <DrawerHeader>
            <DrawerTitle>Investment Details</DrawerTitle>
            <DrawerDescription>Comprehensive information about the selected financial product</DrawerDescription>
          </DrawerHeader>
          <ScrollArea className="p-4 h-[60vh]">{renderProductDetails()}</ScrollArea>
          <DrawerFooter>
            <Button variant="outline" onClick={handleCloseModal}>
              Close
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  )
}

export default BondsAndSecuritiesComponent
