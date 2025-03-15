import React from "react";
import { Link } from "react-router-dom"; // Alternative for Next.js Link
// Replace Next.js Image with a standard img tag below
import { ArrowRight, BarChart3, LineChart, PieChart, TrendingUp, Shield, Zap } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FeatureHighlight } from "@/components/feature-highlight";
import { StatsCounter } from "@/components/stats-counter";
import { HeroAnimation } from "@/components/hero-animation";

export default function LandingPage() {
  return (
    <main className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.15),transparent_40%)]" />
        <div className="container mx-auto flex min-h-screen flex-col items-center justify-center px-4 pb-20 pt-28 md:pb-32 md:pt-36">
          <div className="text-center">
            <span className="inline-block rounded-full bg-muted px-4 py-1.5 text-sm font-medium">
              Smart investing for everyone
            </span>
            <HeroAnimation>
              <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                Build your financial{" "}
                <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  future
                </span>{" "}
                today
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl">
                Access global markets with an intuitive platform designed for both beginners and seasoned investors.
                Track, analyze, and optimize your portfolio in real-time.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button size="lg" className="w-full sm:w-auto">
                  Get Started <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  View Demo
                </Button>
              </div>
            </HeroAnimation>
          </div>

          <div className="mt-16 w-full max-w-5xl overflow-hidden rounded-lg border bg-card/50 shadow backdrop-blur-sm">
            <img
              src="/placeholder.svg?height=600&width=1200"
              width="1200"
              height="600"
              alt="Dashboard Preview"
              className="w-full"
            />
          </div>
        </div>

        {/* Stats Section */}
        <div className="border-y bg-muted/30">
          <div className="container mx-auto grid grid-cols-2 gap-4 px-4 py-12 md:grid-cols-4 md:gap-8">
            <StatsCounter value={87} label="Markets Available" />
            <StatsCounter value={3.2} label="Million Users" suffix="M" decimals={1} />
            <StatsCounter value={240} label="Investment Options" />
            <StatsCounter value={99.9} label="Uptime Percentage" suffix="%" decimals={1} />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-24">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Powerful Features for Modern Investors
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Our platform offers comprehensive tools to help you make informed decisions and grow your investment portfolio.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <FeatureHighlight 
            icon={BarChart3} 
            title="User Dashboard" 
            description="Comprehensive overview of your investment portfolio with real-time updates and interactive charts."
          />
          <FeatureHighlight 
            icon={LineChart} 
            title="Investment Analytics" 
            description="Track performance with advanced charts and real-time market data to make informed decisions."
          />
          <FeatureHighlight 
            icon={TrendingUp} 
            title="Smart Recommendations" 
            description="Personalized investment suggestions based on your risk profile and financial goals."
          />
          <FeatureHighlight 
            icon={PieChart} 
            title="Portfolio Analysis" 
            description="Advanced tools for diversification strategy and risk management with visual breakdowns."
          />
          <FeatureHighlight 
            icon={Zap} 
            title="One-Click Trading" 
            description="Seamless buying and selling with comprehensive order history and instant execution."
          />
          <FeatureHighlight 
            icon={Shield} 
            title="Secure Virtual Wallet" 
            description="Manage deposits, withdrawals, and track all your transactions in one secure place."
          />
        </div>

        <div className="mt-16 text-center">
          <Button size="lg" asChild>
            <Link to="/dashboard">
              Explore All Features <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-muted/30 py-24">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Trusted by Investors Worldwide
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              See what our users are saying about their experience with our platform.
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="border-muted/40 bg-card/50 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, j) => (
                      <svg
                        key={j}
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="text-yellow-500"
                      >
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                    ))}
                  </div>
                  <p className="mt-4 text-muted-foreground">
                    "This platform has transformed how I manage my investments. The real-time analytics and intuitive interface make it easy to track performance and make informed decisions."
                  </p>
                  <div className="mt-6 flex items-center">
                    <div className="h-10 w-10 rounded-full bg-muted" />
                    <div className="ml-3">
                      <p className="text-sm font-medium">Alex Johnson</p>
                      <p className="text-xs text-muted-foreground">Retail Investor</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-24">
        <div className="rounded-xl bg-gradient-to-r from-primary/10 to-primary/5 p-8 md:p-12">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Ready to start your investment journey?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
              Join thousands of investors who are already growing their wealth with our platform.
              Get started today with a free account.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button size="lg" className="w-full sm:w-auto">
                Create Free Account <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
