import { ArrowDownLeft, ArrowUpRight } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function RecentTransactions({ detailed = false }) {
  const transactions = [
    {
      id: "1",
      type: "buy",
      asset: "AAPL",
      amount: "$2,420.00",
      shares: "14",
      company: "Apple Inc.",
      date: "Mar 14, 2023",
      status: "completed",
    },
    {
      id: "2",
      type: "sell",
      asset: "TSLA",
      amount: "$1,870.50",
      shares: "8",
      company: "Tesla Inc.",
      date: "Mar 12, 2023",
      status: "completed",
    },
    {
      id: "3",
      type: "buy",
      asset: "MSFT",
      amount: "$3,204.75",
      shares: "9",
      company: "Microsoft",
      date: "Mar 8, 2023",
      status: "completed",
    },
    {
      id: "4",
      type: "deposit",
      asset: "",
      amount: "$5,000.00",
      shares: "",
      company: "Bank Transfer",
      date: "Mar 5, 2023",
      status: "completed",
    },
    {
      id: "5",
      type: "buy",
      asset: "AMZN",
      amount: "$1,768.25",
      shares: "12",
      company: "Amazon",
      date: "Mar 1, 2023",
      status: "completed",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
        <CardDescription>Your latest investment activities</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {transactions.slice(0, detailed ? 5 : 4).map((transaction) => (
            <div key={transaction.id} className="flex items-center gap-4">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full ${transaction.type === "buy" || transaction.type === "deposit" ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"}`}
              >
                {transaction.type === "buy" || transaction.type === "deposit" ? (
                  <ArrowDownLeft className="h-5 w-5" />
                ) : (
                  <ArrowUpRight className="h-5 w-5" />
                )}
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">
                  {transaction.type === "buy"
                    ? `Bought ${transaction.asset}`
                    : transaction.type === "sell"
                      ? `Sold ${transaction.asset}`
                      : "Deposit"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {transaction.type !== "deposit"
                    ? `${transaction.shares} shares of ${transaction.company}`
                    : transaction.company}
                </p>
                {detailed && <p className="text-xs text-muted-foreground">{transaction.date}</p>}
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">
                  {transaction.type === "sell" ? "-" : "+"}
                  {transaction.amount}
                </p>
                {!detailed && <p className="text-xs text-muted-foreground">{transaction.date}</p>}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

