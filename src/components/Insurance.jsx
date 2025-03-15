import { useState } from "react";
import { Shield, Search, X, Star, ChevronRight, Heart, HeartOff, Filter, Check, Info, ArrowRight, DollarSign, Users, Clock, Award } from 'lucide-react';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { useMediaQuery } from "@/hooks/use-mobile";

const InsuranceComponent = () => {
  const insuranceCategories = [
    {
      category: "Health Insurance",
      icon: <Shield className="h-5 w-5" />,
      insurances: [
        {
          id: "hi1",
          name: "Individual Health Insurance",
          description:
            "Covers medical expenses for an individual. Provides protection against hospitalization and other medical costs.",
          price: "$100/month",
          priceValue: 100,
          eligibility: "18 - 65 years",
          duration: "1 Year",
          benefits:
            "Covers hospitalization, surgery, consultation, and other medical treatments.",
          rating: 4.5,
          popular: true,
        },
        {
          id: "hi2",
          name: "Family Floater Health Insurance",
          description:
            "Covers a whole family under a single policy. It is a cost-effective option for families.",
          price: "$250/month",
          priceValue: 250,
          eligibility: "Spouses and children",
          duration: "1 Year",
          benefits:
            "Covers hospitalization, outpatient treatments, and preventive care for the entire family.",
          rating: 4.2,
          popular: false,
        },
        {
          id: "hi3",
          name: "Critical Illness Insurance",
          description:
            "Provides a lump sum payment if diagnosed with any critical illness such as cancer, heart attack, etc.",
          price: "$200/month",
          priceValue: 200,
          eligibility: "18 - 65 years",
          duration: "5 Years",
          benefits:
            "Pays a lump sum amount for a variety of critical illnesses such as heart attack, cancer, and strokes.",
          rating: 4.0,
          popular: false,
        },
        {
          id: "hi4",
          name: "Maternity Health Insurance",
          description:
            "Covers maternity expenses including delivery costs, hospitalization, and newborn care.",
          price: "$150/month",
          priceValue: 150,
          eligibility: "Women aged 18 - 45 years",
          duration: "1 Year",
          benefits:
            "Covers medical expenses related to pregnancy, childbirth, and postnatal care.",
          rating: 4.7,
          popular: true,
        },
      ],
    },
    {
      category: "Life Insurance",
      icon: <Users className="h-5 w-5" />,
      insurances: [
        {
          id: "li1",
          name: "Term Life Insurance",
          description:
            "A policy that provides a death benefit to the family if the policyholder dies within the term of the policy.",
          price: "$50/month",
          priceValue: 50,
          eligibility: "18 - 60 years",
          duration: "10, 20, or 30 Years",
          benefits:
            "Pays out a death benefit to your loved ones if you pass away during the term of the policy.",
          rating: 4.8,
          popular: true,
        },
        {
          id: "li2",
          name: "Whole Life Insurance",
          description:
            "Provides coverage for the entire lifetime of the policyholder with a death benefit and cash value accumulation.",
          price: "$150/month",
          priceValue: 150,
          eligibility: "18 - 75 years",
          duration: "Lifetime",
          benefits:
            "Lifetime coverage with a savings component that grows over time, providing cash value accumulation.",
          rating: 4.3,
          popular: false,
        },
        {
          id: "li3",
          name: "Endowment Plans",
          description:
            "Combines both life insurance and savings, providing a lump sum payment on policy maturity or death.",
          price: "$100/month",
          priceValue: 100,
          eligibility: "18 - 60 years",
          duration: "10, 15, or 20 Years",
          benefits:
            "A combination of insurance and savings that pays out a lump sum either upon death or policy maturity.",
          rating: 4.1,
          popular: false,
        },
        {
          id: "li4",
          name: "Unit Linked Insurance Plans (ULIPs)",
          description:
            "Combines life insurance with investment, allowing the policyholder to invest in different funds.",
          price: "$200/month",
          priceValue: 200,
          eligibility: "18 - 60 years",
          duration: "10, 15, or 20 Years",
          benefits:
            "A hybrid product that offers both life coverage and an opportunity to invest in various financial instruments.",
          rating: 3.9,
          popular: false,
        },
      ],
    },
  ];

  const [selectedInsurance, setSelectedInsurance] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [wishlist, setWishlist] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState([0, 300]);
  const [filteredInsurances, setFilteredInsurances] = useState([]);
  // const isMobile = useMediaQuery("(max-width: 768px)");

  // Initialize filtered insurances with all insurances
  useState(() => {
    const allInsurances = insuranceCategories.flatMap(category => 
      category.insurances.map(insurance => ({
        ...insurance,
        category: category.category
      }))
    );
    setFilteredInsurances(allInsurances);
  }, []);

  // const handleLearnMore = (insurance) => {
  //   setSelectedInsurance(insurance);
  //   if (isMobile) {
  //     setIsDrawerOpen(true);
  //   } else {
  //     setIsDialogOpen(true);
  //   }
  // };

  const handleCloseModal = () => {
    setIsDialogOpen(false);
    setIsDrawerOpen(false);
  };

  const handleBuyNow = (insurance) => {
    alert(`You have successfully purchased ${insurance.name} for ${insurance.price}!`);
  };

  const toggleWishlist = (id) => {
    if (wishlist.includes(id)) {
      setWishlist(wishlist.filter(item => item !== id));
    } else {
      setWishlist([...wishlist, id]);
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    applyFilters(e.target.value, priceRange, activeTab);
  };

  const handlePriceRangeChange = (value) => {
    setPriceRange(value);
    applyFilters(searchQuery, value, activeTab);
  };

  const handleTabChange = (value) => {
    setActiveTab(value);
    applyFilters(searchQuery, priceRange, value);
  };

  const applyFilters = (query, price, tab) => {
    let filtered = insuranceCategories.flatMap(category => 
      category.insurances.map(insurance => ({
        ...insurance,
        category: category.category
      }))
    );

    // Apply search query filter
    if (query) {
      filtered = filtered.filter(insurance => 
        insurance.name.toLowerCase().includes(query.toLowerCase()) ||
        insurance.description.toLowerCase().includes(query.toLowerCase())
      );
    }

    // Apply price range filter
    filtered = filtered.filter(insurance => 
      insurance.priceValue >= price[0] && insurance.priceValue <= price[1]
    );

    // Apply tab filter
    if (tab === "wishlist") {
      filtered = filtered.filter(insurance => wishlist.includes(insurance.id));
    } else if (tab === "popular") {
      filtered = filtered.filter(insurance => insurance.popular);
    } else if (tab !== "all") {
      filtered = filtered.filter(insurance => insurance.category === tab);
    }

    setFilteredInsurances(filtered);
  };

  const renderStarRating = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    return (
      <div className="flex items-center">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
        ))}
        {hasHalfStar && (
          <div className="relative">
            <Star className="w-4 h-4 text-yellow-400" />
            <div className="absolute top-0 left-0 overflow-hidden w-1/2">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            </div>
          </div>
        )}
        {[...Array(5 - fullStars - (hasHalfStar ? 1 : 0))].map((_, i) => (
          <Star key={i + fullStars + (hasHalfStar ? 1 : 0)} className="w-4 h-4 text-gray-300" />
        ))}
        <span className="ml-1 text-sm text-gray-400">{rating.toFixed(1)}</span>
      </div>
    );
  };

  const renderInsuranceDetails = () => {
    if (!selectedInsurance) return null;
    
    return (
      <>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Badge variant={selectedInsurance.popular ? "default" : "outline"} className="mb-2">
              {selectedInsurance.popular ? "Popular Choice" : "Standard Plan"}
            </Badge>
            <div className="flex items-center">
              {renderStarRating(selectedInsurance.rating)}
            </div>
          </div>
          
          <h2 className="text-2xl font-bold">{selectedInsurance.name}</h2>
          <p className="text-gray-500 dark:text-gray-400">{selectedInsurance.description}</p>
          
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="flex flex-col gap-2 p-4 rounded-lg bg-muted/50">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <DollarSign className="h-4 w-4" />
                <span>Price</span>
              </div>
              <div className="font-semibold">{selectedInsurance.price}</div>
            </div>
            
            <div className="flex flex-col gap-2 p-4 rounded-lg bg-muted/50">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="h-4 w-4" />
                <span>Eligibility</span>
              </div>
              <div className="font-semibold">{selectedInsurance.eligibility}</div>
            </div>
            
            <div className="flex flex-col gap-2 p-4 rounded-lg bg-muted/50">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>Duration</span>
              </div>
              <div className="font-semibold">{selectedInsurance.duration}</div>
            </div>
            
            <div className="flex flex-col gap-2 p-4 rounded-lg bg-muted/50">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Award className="h-4 w-4" />
                <span>Rating</span>
              </div>
              <div className="font-semibold">{selectedInsurance.rating.toFixed(1)}/5.0</div>
            </div>
          </div>
          
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Benefits</h3>
            <p className="text-gray-500 dark:text-gray-400">{selectedInsurance.benefits}</p>
          </div>
        </div>
        
        <div className="flex gap-3 mt-6">
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={() => toggleWishlist(selectedInsurance.id)}
          >
            {wishlist.includes(selectedInsurance.id) ? (
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
          <Button 
            className="flex-1"
            onClick={() => handleBuyNow(selectedInsurance)}
          >
            <Check className="mr-2 h-4 w-4" />
            Buy Now
          </Button>
        </div>
      </>
    );
  };

  return (
    <div className="container mx-auto p-4 md:p-8 bg-card/50 backdrop-blur-md rounded-xl shadow-2xl">
      <div className="flex items-center justify-between mb-8 pt-14">
        <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-2">
          <Shield className="h-6 w-6 text-blue-400" />
          Insurance Plans
        </h1>
        
        <div className="flex items-center gap-2">
          <div className="relative hidden md:block w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search plans..."
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
                  setSearchQuery("");
                  applyFilters("", priceRange, activeTab);
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          
          <Drawer open={isFilterDrawerOpen} onOpenChange={setIsFilterDrawerOpen}>
            <DrawerTrigger asChild>
              <Button variant="outline" size="icon" className="bg-slate-800/50 border-slate-700 text-white hover:bg-slate-700">
                <Filter className="h-4 w-4" />
              </Button>
            </DrawerTrigger>
            <DrawerContent className="bg-card/50 text-white border-slate-700">
              <DrawerHeader>
                <DrawerTitle>Filter Insurance Plans</DrawerTitle>
                <DrawerDescription>Adjust filters to find the perfect plan for you</DrawerDescription>
              </DrawerHeader>
              <div className="px-4 py-2">
                <div className="space-y-6">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Search</label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        type="text"
                        placeholder="Search plans..."
                        value={searchQuery}
                        onChange={handleSearch}
                        className="pl-10 bg-slate-800/50 border-slate-700 text-white placeholder:text-gray-400"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Price Range ($/month)</label>
                    <div className="pt-6 px-2">
                      <Slider
                        defaultValue={priceRange}
                        max={300}
                        step={10}
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
                    <label className="text-sm font-medium mb-2 block">Categories</label>
                    <div className="space-y-2">
                      {insuranceCategories.map((category, index) => (
                        <Button
                          key={index}
                          variant={activeTab === category.category ? "default" : "outline"}
                          className="mr-2 mb-2"
                          onClick={() => handleTabChange(category.category)}
                        >
                          {category.icon}
                          <span className="ml-2">{category.category}</span>
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <DrawerFooter>
                <Button onClick={() => {
                  setActiveTab("all");
                  setPriceRange([0, 300]);
                  setSearchQuery("");
                  applyFilters("", [0, 300], "all");
                }}>
                  Reset Filters
                </Button>
                <DrawerClose asChild>
                  <Button variant="outline">Apply</Button>
                </DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        </div>
      </div>
      
      <div className="md:hidden relative mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          type="text"
          placeholder="Search plans..."
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
              setSearchQuery("");
              applyFilters("", priceRange, activeTab);
            }}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      
      <Tabs defaultValue="all" value={activeTab} onValueChange={handleTabChange} className="mb-6">
        <TabsList className="bg-slate-800/50 p-1 rounded-lg">
          <TabsTrigger value="all" className="data-[state=active]:bg-blue-600">
            All Plans
          </TabsTrigger>
          <TabsTrigger value="popular" className="data-[state=active]:bg-blue-600">
            Popular
          </TabsTrigger>
          <TabsTrigger value="wishlist" className="data-[state=active]:bg-blue-600">
            Wishlist ({wishlist.length})
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {filteredInsurances.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredInsurances.map((insurance, index) => (
            <Card key={index} className="overflow-hidden bg-slate-800/50 border-slate-700 hover:border-blue-500/50 transition-all duration-300 group">
              <CardHeader className="p-4 pb-0 flex justify-between items-start">
                <div>
                  <Badge variant={insurance.popular ? "default" : "outline"} className="mb-2">
                    {insurance.popular ? "Popular Choice" : "Standard Plan"}
                  </Badge>
                  <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors">{insurance.name}</h3>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className={`h-8 w-8 ${wishlist.includes(insurance.id) ? 'text-red-400' : 'text-gray-400'} hover:text-red-400 hover:bg-slate-700/50`}
                  onClick={() => toggleWishlist(insurance.id)}
                >
                  {wishlist.includes(insurance.id) ? (
                    <Heart className="h-5 w-5 fill-current" />
                  ) : (
                    <Heart className="h-5 w-5" />
                  )}
                </Button>
              </CardHeader>
              <CardContent className="p-4">
                <p className="text-gray-400 text-sm mb-4 line-clamp-2">{insurance.description}</p>
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center">
                    <DollarSign className="h-4 w-4 text-green-400 mr-1" />
                    <span className="text-white font-semibold">{insurance.price}</span>
                  </div>
                  <div>
                    {renderStarRating(insurance.rating)}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs text-gray-400">
                  <div className="flex items-center">
                    <Users className="h-3 w-3 mr-1" />
                    <span>{insurance.eligibility}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    <span>{insurance.duration}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0 flex justify-between">
                <Button variant="ghost" size="sm" onClick={() => handleLearnMore(insurance)}>
                  Learn More
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
                <Button size="sm" onClick={() => handleBuyNow(insurance)}>Buy Now</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-gray-400">
          <Info className="h-12 w-12 mb-4 opacity-50" />
          <h3 className="text-xl font-semibold mb-2">No insurance plans found</h3>
          <p className="text-center max-w-md mb-6">Try adjusting your filters or search criteria to find insurance plans that match your needs.</p>
          <Button onClick={() => {
            setActiveTab("all");
            setPriceRange([0, 300]);
            setSearchQuery("");
            applyFilters("", [0, 300], "all");
          }}>
            Reset Filters
          </Button>
        </div>
      )}

      {/* Modal for desktop */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px] bg-card/50 text-white border-slate-700">
          <DialogHeader>
            <DialogTitle>Insurance Details</DialogTitle>
            <DialogDescription>
              Comprehensive information about the selected insurance plan
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh]">
            <div className="p-4">
              {renderInsuranceDetails()}
            </div>
          </ScrollArea>
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseModal}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Drawer for mobile */}
      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DrawerContent className="bg-card/50 text-white border-slate-700">
          <DrawerHeader>
            <DrawerTitle>Insurance Details</DrawerTitle>
            <DrawerDescription>
              Comprehensive information about the selected insurance plan
            </DrawerDescription>
          </DrawerHeader>
          <ScrollArea className="p-4 h-[60vh]">
            {renderInsuranceDetails()}
          </ScrollArea>
          <DrawerFooter>
            <Button variant="outline" onClick={handleCloseModal}>Close</Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default InsuranceComponent;
