import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Menu, Wallet, LineChart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { WalletPreview } from "@/components/wallet-preview";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { AppContext } from "../context/appContext";
import StockIndexPreview from "./StockIndices";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { loginUser, language, setLanguage } = useContext(AppContext);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navigate = useNavigate();

  const NavigateToDashboard = () => {
    navigate("/dashboard");
  };

  const navItems = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Investments", href: "/investments" },
    { name: "Portfolio", href: "/portfolio" },
    { name: "Watchlist", href: "/watchlist" },
    { name: "Wallet", href: "/pay" },
  ];

  return (
    <header
      className={cn(
        "fixed top-0 z-50 w-full transition-all duration-300",
        isScrolled
          ? "bg-background/80 backdrop-blur-md shadow-sm"
          : "bg-transparent"
      )}
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2">
            <span className="hidden bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-xl font-bold text-transparent sm:inline-block">
              Investify
            </span>
          </Link>

          <nav className="hidden md:flex md:gap-6">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <LineChart className="h-7c w-7 text-green-600" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-[380px] p-0"
              align="end"
              sideOffset={8}
            >
              <StockIndexPreview />
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Wallet className="h-7 w-7" />
                <span className="sr-only">Open wallet</span>
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                  3
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-[380px] p-0"
              align="end"
              sideOffset={8}
            >
              <WalletPreview />
            </DropdownMenuContent>
          </DropdownMenu>

          {loginUser ? (
            <Link to="/profile" className="hidden md:flex">
              Profile
            </Link>
          ) : (
            <Link to="/login" className="hidden md:flex">
              Sign In
            </Link>
          )}
          <div className="flex bg-black justify-end">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="px-2 py-1 border rounded bg-black"
            >
              <option value="en">English</option>
              <option value="hi">हिंदी</option>
              <option value="mr">मराठी</option>
            </select>
          </div>
          <Button
            size="sm"
            className="hidden md:flex"
            onClick={NavigateToDashboard}
          >
            Get Started
          </Button>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <nav className="grid gap-6 text-lg font-medium">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="hover:text-primary"
                  >
                    {item.name}
                  </Link>
                ))}
                {loginUser ? (
                  <Link to="/profile" className="mt-4">
                    Profile
                  </Link>
                ) : (
                  <Link to="/login" className="mt-4">
                    Sign In
                  </Link>
                )}
                <Button
                  size="sm"
                  variant="outline"
                  onClick={NavigateToDashboard}
                >
                  Get Started
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
