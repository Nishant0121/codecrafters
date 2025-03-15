// "use client"  // Removed since it's not needed in plain React

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom"; // Alternative for Next.js Link in React
import { Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Dashboard", href: "/dashboard" },
    { name: "Investments", href: "/investments" },
    { name: "Portfolio", href: "/portfolio" },
    { name: "Market", href: "/market" },
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
          <Link
            to="/login"
            variant="outline"
            size="sm"
            className="hidden md:flex"
          >
            Sign In
          </Link>
          <Button size="sm" className="hidden md:flex">
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
                <Link to="/login" size="sm" className="mt-4">
                  Sign In
                </Link>
                <Button size="sm" variant="outline">
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
