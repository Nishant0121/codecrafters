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
import StockNews from "./components/StockNews"; // Import StockNews component
import StockNewsResults from "./components/StocksNewsResults"; // Import StockNewsResults component
import { sampleStocks } from "./Data/Stocks";
import ConnectWallet from "./pages/ConnectWallet";

function App() {
  const { data } = useContext(AppContext);
  const location = useLocation();

  const hideNavbarFooter =
    location.pathname === "/login" || location.pathname === "/register";

  const { setloginUser } = useContext(AppContext);

  useEffect(() => {
    const user = localStorage.getItem("ADuser");
    if (user) {
      setloginUser(JSON.parse(user));
    }
  }, [setloginUser]);

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" forcedTheme="dark">
      <div className="relative flex min-h-screen flex-col">
        {!hideNavbarFooter && <Navbar />}
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/investments" element={<InvestmentsPage />} />
            <Route path="/portfolio" element={<PortfolioPage />} />
            <Route path="/about" element={<LiveObjectDetection />} />
            <Route path="*" element={<ErrorPage />} />
            <Route path="/chat" element={<ChatBot />} />
            <Route path="/pay" element={<Pay />} />
            <Route path="/watchlist" element={<Watchlist stocks={sampleStocks} />} />
            <Route path="/watchlist/:symbol" element={<StockPage />} />
            <Route path="/sip" element={<SIPCalculator />} />
            <Route path="/currency" element={<CurrencyConverter />} />
            <Route path="/news" element={<StockNews />} /> {/* Search Bar Route */}
            <Route path="/news-results/:symbol" element={<StockNewsResults />} /> {/* News Results Route */}
            <Route path="/connect" element={<ConnectWallet />} />
          </Routes>
        </main>
        {!hideNavbarFooter && <Footer />}
      </div>
    </ThemeProvider>
  );
}

export default App;
