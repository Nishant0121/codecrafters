import { useEffect, useContext } from "react";
import { Plus, Search, SlidersHorizontal, Wallet } from "lucide-react";
import gsap from "gsap";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InvestmentSuggestions } from "@/components/investments/investment-suggestions";
import { OrderPanel } from "@/components/investments/order-panel";
import { InvestmentTable } from "@/components/investments/investment-table";
import { AppContext } from "@/context/appContext";

// Multilingual translations for English, Hindi, and Marathi
const translations = {
  en: {
    investments: "Investments",
    manageInvestments: "Manage your stocks, bonds, and other investments",
    portfolio: "Portfolio",
    newInvestment: "New Investment",
    yourInvestments: "Your Investments",
    currentPositions: "Current positions and performance",
    filters: "Filters",
    search: "Search...",
    all: "All",
    stocks: "Stocks",
    bonds: "Bonds",
    etfs: "ETFs",
    crypto: "Crypto",
    assetType: "Asset Type",
    performance: "Performance",
    positive: "Positive",
  },
  hi: {
    investments: "निवेश",
    manageInvestments: "अपने स्टॉक, बॉन्ड और अन्य निवेश प्रबंधित करें",
    portfolio: "पोर्टफोलियो",
    newInvestment: "नया निवेश",
    yourInvestments: "आपके निवेश",
    currentPositions: "वर्तमान पोजीशन और प्रदर्शन",
    filters: "फिल्टर्स",
    search: "खोजें...",
    all: "सभी",
    stocks: "स्टॉक्स",
    bonds: "बॉन्ड्स",
    etfs: "ईटीएफ",
    crypto: "क्रिप्टो",
    assetType: "संपत्ति प्रकार",
    performance: "प्रदर्शन",
    positive: "सकारात्मक",
  },
  mr: {
    investments: "गुंतवणुकी",
    manageInvestments:
      "तुमचे स्टॉक्स, बॉन्ड्स आणि इतर गुंतवणुकी व्यवस्थापित करा",
    portfolio: "पोर्टफोलिओ",
    newInvestment: "नवीन गुंतवणूक",
    yourInvestments: "तुमच्या गुंतवणुकी",
    currentPositions: "सध्याच्या स्थिती आणि कामगिरी",
    filters: "फिल्टर्स",
    search: "शोधा...",
    all: "सर्व",
    stocks: "स्टॉक्स",
    bonds: "बॉन्ड्स",
    etfs: "ईटीएफ",
    crypto: "क्रिप्टो",
    assetType: "मालमत्ता प्रकार",
    performance: "कामगिरी",
    positive: "सकारात्मक",
  },
};

export default function InvestmentsPage() {
  // Get language from context
  const { loginUser, language } = useContext(AppContext);

  // Function to get text based on current language
  const getText = (key) => {
    return translations[language][key] || translations.en[key];
  };

  useEffect(() => {
    // Animation for page elements
    gsap.fromTo(
      ".investment-card",
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.1,
        ease: "power2.out",
      }
    );

    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div className="container mx-auto px-4 pt-20">
      <div className="mb-8 flex flex-col gap-4 pt-8 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {getText("investments")}
          </h1>
          <p className="text-muted-foreground">
            {getText("manageInvestments")}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/portfolio">
            <Button variant="outline" size="sm">
              <Wallet className="mr-2 h-4 w-4" />
              {getText("portfolio")}
            </Button>
          </Link>
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" />
            {getText("newInvestment")}
          </Button>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-8">
        <div className="md:col-span-6">
          <Card className="investment-card mb-8">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{getText("yourInvestments")}</CardTitle>
                  <CardDescription>
                    {getText("currentPositions")}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <SlidersHorizontal className="mr-2 h-4 w-4" />
                    {getText("filters")}
                  </Button>
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder={getText("search")}
                      className="pl-8 md:w-[200px] lg:w-[250px]"
                    />
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="all" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="all">{getText("all")}</TabsTrigger>
                  <TabsTrigger value="stocks">{getText("stocks")}</TabsTrigger>
                  <TabsTrigger value="bonds">{getText("bonds")}</TabsTrigger>
                  <TabsTrigger value="etfs">{getText("etfs")}</TabsTrigger>
                  <TabsTrigger value="crypto">{getText("crypto")}</TabsTrigger>
                </TabsList>

                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className="rounded-sm px-2 py-1 text-xs"
                  >
                    {getText("assetType")}: {getText("all")}{" "}
                    <button className="ml-1 text-xs">×</button>
                  </Badge>
                  <Badge
                    variant="outline"
                    className="rounded-sm px-2 py-1 text-xs"
                  >
                    {getText("performance")}: {getText("positive")}{" "}
                    <button className="ml-1 text-xs">×</button>
                  </Badge>
                </div>

                <TabsContent value="all">
                  <InvestmentTable />
                </TabsContent>
                <TabsContent value="stocks">
                  <InvestmentTable type="stocks" />
                </TabsContent>
                <TabsContent value="bonds">
                  <InvestmentTable type="bonds" />
                </TabsContent>
                <TabsContent value="etfs">
                  <InvestmentTable type="etfs" />
                </TabsContent>
                <TabsContent value="crypto">
                  <InvestmentTable type="crypto" />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <InvestmentSuggestions className="investment-card" />
        </div>

        <div className="md:col-span-2">
          <OrderPanel className="investment-card sticky top-20" />
        </div>
      </div>
    </div>
  );
}
