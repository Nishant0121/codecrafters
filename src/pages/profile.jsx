import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { AppContext } from "@/context/appContext";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableHeader,
  TableRow,
  TableCell,
  TableBody,
} from "@/components/ui/table";
import { ArrowUpRight, DollarSign, LogOutIcon } from "lucide-react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Legend,
  XAxis,
  YAxis,
} from "recharts";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [investmentData, setInvestmentData] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [walletData, setWalletData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { loginUser } = useContext(AppContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [investmentRes, profileRes, walletRes] = await Promise.all([
          fetch(
            `http://localhost:3000/api/stock/getInvestment/${loginUser?.uid}`
          ),
          fetch(`http://localhost:3000/api/stock/getProfile/${loginUser?.uid}`),
          fetch(
            `http://localhost:3000/api/stock/wallet/balance/${loginUser?.uid}`
          ),
        ]);

        if (!investmentRes.ok || !profileRes.ok || !walletRes.ok) {
          throw new Error("Failed to fetch data");
        }

        const investment = await investmentRes.json();
        const profile = await profileRes.json();
        const wallet = await walletRes.json();

        setInvestmentData(investment);
        setProfileData(profile.profile);
        setWalletData(wallet);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [loginUser]);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("ADuser"));
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  const handleLogout = () => {
    Cookies.remove("jwt_token");
    localStorage.removeItem("ADuser");
    setUser(null);
    navigate("/login");
    window.location.reload();
  };

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  // Sort transactions by date (latest first) & take top 10
  const topTransactions =
    walletData?.transactions
      ?.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, 10) || [];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 p-4 text-white">
      {/* Profile Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="w-full max-w-lg bg-gray-800 shadow-lg border border-gray-700">
          <CardHeader className="flex items-center flex-col">
            <Avatar className="w-24 h-24 border-4 border-gray-600">
              <AvatarImage
                src={
                  user?.photoURL || "https://avatar.iran.liara.run/public/boy"
                }
                alt="User"
              />
              <AvatarFallback>
                {user?.displayName?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            <h2 className="text-2xl font-bold mt-4">
              {user?.displayName || "User"}
            </h2>
            <p className="text-gray-400">{user?.email || "user@example.com"}</p>
          </CardHeader>

          <CardFooter className="flex justify-between p-4">
            <Button variant="outline">Edit Profile</Button>
            <Button variant="destructive" onClick={handleLogout}>
              <LogOutIcon className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </CardFooter>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Investment Summary */}
          <Card className="dashboard-card">
            <CardHeader className="flex justify-between">
              <CardTitle>Portfolio Value</CardTitle>
              <DollarSign className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${investmentData?.totalPortfolioValue?.toFixed(2) || "N/A"}
              </div>
              <Progress value={75} className="mt-3 h-2" />
            </CardContent>
          </Card>

          <Card className="dashboard-card">
            <CardHeader>
              <CardTitle>Wallet Balance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${walletData?.balance?.toFixed(2) || "N/A"}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Pie Chart - Stock Distribution */}
      <div className="w-full mt-6 flex justify-center">
        <ResponsiveContainer width="50%" height={300}>
          <PieChart>
            <Pie
              data={
                profileData?.stocks?.map((stock) => ({
                  name: stock.symbol,
                  value: stock.quantity * stock.buyPrice,
                })) || []
              }
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {profileData?.stocks?.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Bar Chart - Transactions */}
      <div className="w-full mt-6">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={
              walletData?.transactions?.map((tx) => ({
                date: new Date(tx.timestamp).toLocaleDateString(),
                amount: tx.amount,
                type: tx.type,
              })) || []
            }
          >
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="amount" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Transactions Table (Only Top 10) */}
      <Table className="mt-6">
        <TableHeader>
          <TableRow>
            <TableCell>Amount</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>Date</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {topTransactions.map((tx) => (
            <TableRow key={tx._id}>
              <TableCell>${tx.amount}</TableCell>
              <TableCell
                className={
                  tx.type === "credit" ? "text-green-500" : "text-red-500"
                }
              >
                {tx.type.toUpperCase()}
              </TableCell>
              <TableCell>{new Date(tx.timestamp).toLocaleString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
