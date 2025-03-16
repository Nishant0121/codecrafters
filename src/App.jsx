import { useContext, useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { AppContext } from "./context/appContext";
import Login from "./components/login";
import Register from "./components/register";
import LandingPage from "./pages/LandingPage";
import DashboardPage from "./pages/Dashboard";
import InvestmentsPage from "./pages/Investments";
import PortfolioPage from "./pages/Portfolio";
import ErrorPage from "./components/errorpage";
import ChatBot from "./components/Chatbot";
import Pay from "./components/Pay";
import LiveObjectDetection from "./components/imageClass";
import Watchlist from "./components/Watchlist";
import StockPage from "./components/StockPage";
import SIPCalculator from "./components/SIPCalculator";
import CurrencyConverter from "./components/CurrencyConverter";
import StockNews from "./components/StockNews";
import StockNewsResults from "./components/StocksNewsResults";
import { sampleStocks } from "./Data/Stocks";
import FinancialExpectations from "./components/FinancialExpectations";
import MutualFundCreator from "./components/MFCreator";
import InsuranceComponent from "./components/Insurance";
import BondsAndSecuritiesComponent from "./components/Bonds";
import Profile from "./pages/profile";
import OverallReport from "./components/overReport";

function App() {
  const { loginUser, setloginUser } = useContext(AppContext);
  const location = useLocation();

  const hideNavbarFooter =
    location.pathname === "/login" || location.pathname === "/register";

  useEffect(() => {
    const fetchUser = () => {
      try {
        const storedUser = localStorage.getItem("ADuser");
        if (!storedUser) return; // Ensure there is a stored user

        const parsedUser = JSON.parse(storedUser);
        if (parsedUser && parsedUser.uid) {
          setloginUser(parsedUser);
        }
      } catch (error) {
        console.error("Error retrieving user:", error);
      }
    };

    fetchUser();
  }, [setloginUser]);

  // If loginUser is null, prevent accessing properties like loginUser.uid
  if (!loginUser) {
    return (
      <ThemeProvider attribute="class" defaultTheme="dark" forcedTheme="dark">
        <div className="relative flex min-h-screen flex-col">
          {!hideNavbarFooter && <Navbar />}
          <main className="flex-1">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Routes>
          </main>
          {!hideNavbarFooter && <Footer />}
        </div>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" forcedTheme="dark">
      <div className="relative flex min-h-screen flex-col">
        {!hideNavbarFooter && <Navbar />}
        <ChatBot />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<LandingPage />} />

            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/investments" element={<InvestmentsPage />} />
            <Route path="/portfolio" element={<PortfolioPage />} />
            <Route path="/about" element={<LiveObjectDetection />} />
            <Route path="*" element={<ErrorPage />} />
            <Route path="/chat" element={<ChatBot />} />
            <Route path="/pay" element={<Pay />} />
            <Route
              path="/watchlist"
              element={<Watchlist stocks={sampleStocks} />}
            />
            <Route path="/watchlist/:symbol" element={<StockPage />} />
            <Route path="/sip" element={<SIPCalculator />} />
            <Route path="/currency" element={<CurrencyConverter />} />
            <Route path="/news" element={<StockNews />} />
            <Route path="/advisor" element={<MutualFundCreator />} />
            <Route path="/overallreport" element={<OverallReport />} />
            <Route
              path="/news-results/:symbol"
              element={<StockNewsResults />}
            />
            <Route
              path="/financial-expectations"
              element={<FinancialExpectations />}
            />
            <Route path="/profile" element={<Profile />} />
            <Route path="/insurance" element={<InsuranceComponent />} />
            <Route path="/bonds" element={<BondsAndSecuritiesComponent />} />
          </Routes>
        </main>
        {!hideNavbarFooter && <Footer />}
      </div>
    </ThemeProvider>
  );
}

export default App;
