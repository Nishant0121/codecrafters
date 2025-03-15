import { AppContext } from "@/context/appContext";
import axios from "axios";
import { ethers } from "ethers";
import Web3 from "web3";
import React, { useContext, useEffect, useState } from "react";
import PortfolioABI from "./abi.json";

const CONTRACT_ADDRESS = "0xd596CC60Ee34b6a8448f668d9B8c36e0f49e842f";

function Pay() {
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("INR");
  const [receiptId, setReceiptId] = useState("order_receipt_123");
  const [isLoading, setIsLoading] = useState(false);
  const [userDetails, setUserDetails] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "1234567890",
  });
  const { loginUser } = useContext(AppContext);

  // Common payment amounts
  const quickAmounts = [100, 500, 1000, 5000];

  async function connectWallet() {
    if (!window.ethereum) {
      alert("MetaMask not detected! Please install MetaMask.");
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      setAccount(accounts[0]);

      const portfolioContract = new ethers.Contract(
        CONTRACT_ADDRESS,
        PortfolioABI,
        signer
      );
      setContract(portfolioContract);

      await loadBalance(portfolioContract, accounts[0]);
    } catch (err) {
      console.error("Wallet connection failed:", err);
    }
  }

  const loadBalance = async (contract, userAddress) => {
    if (!contract || !userAddress) return;
    try {
      const balance = await contract.getInvestment(userAddress);
      setBalance(ethers.formatEther(balance));
    } catch (error) {
      console.error("Error fetching balance:", error);
    }
  };

   const invest = async (amount) => {
          if (!contract || !account) {
              console.error("Contract or account not available");
              return;
          }
  
          setLoading(true);
          try {
              const tx = await contract.invest(ethers.parseEther(amount));
              await tx.wait();
  
              console.log("Investment successful:", tx);
              await loadBalance(contract, account);
          } catch (error) {
              console.error("Investment failed:", error);
          }
          setLoading(false);
      };
  
      const withdraw = async (amount) => {
          if (!contract || !account) {
              console.error("Contract or account not available");
              return;
          }
  
          setLoading(true);
          try {
              const tx = await contract.withdraw(ethers.parseEther(amount));
              await tx.wait();
  
              console.log("Withdrawal successful:", tx);
              await loadBalance(contract, account);
          } catch (error) {
              console.error("Withdrawal failed:", error);
          }
          setLoading(false);
      };

       useEffect(() => {
              const checkWallet = async () => {
                  if (window.ethereum) {
                      const provider = new ethers.BrowserProvider(window.ethereum);
                      const accounts = await window.ethereum.request({ method: "eth_accounts" });
      
                      if (accounts.length > 0) {
                          setAccount(accounts[0]);
      
                          const signer = await provider.getSigner();
                          const portfolioContract = new ethers.Contract(CONTRACT_ADDRESS, PortfolioABI, signer);
      
                          setContract(portfolioContract);
                          await loadBalance(portfolioContract, accounts[0]); 
                      }
                  }
              };
      
              checkWallet();
              connectWallet()
          }, []);

  const handlePayment = async (e) => {
    e.preventDefault();



    if (!amount || isNaN(amount) || amount <= 0) {
      toast("Please enter a valid amount");
      return;
    }

    setIsLoading(true);
    invest(amount);

    try {
      // Step 1: Create order on your server
      const response = await fetch("http://localhost:5001/order", {
        method: "POST",
        body: JSON.stringify({
          amount: amount * 100, // Convert to paisa
          currency,
          receipt: receiptId,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const order = await response.json();

      // Step 2: Configure Razorpay payment options
      const options = {
        key: "rzp_test_rZy8sy8h3lgvoA",
        amount: amount * 100,
        currency,
        name: "Acme Corp",
        description: "Wallet Recharge",
        image: "https://example.com/your_logo",
        order_id: order.id,
        handler: async function (response) {
          try {
            const validateRes = await fetch(
              "http://localhost:5001/order/validate",
              {
                method: "POST",
                body: JSON.stringify(response),
                headers: {
                  "Content-Type": "application/json",
                },
              }
            );
            const validate = await validateRes.json();

            if (validate.msg === "Payment Successful") {
              const response = await axios.post(
                "http://localhost:3000/api/stock/updateWallet",
                {
                  uid: loginUser.uid,
                  amount: Number(amount),
                  type: "credit",
                }
              );
              if (response.status === 200) {
                toast("Amount added to wallet successfully!", "success");
                setAmount("");
              } else {
                toast("Error updating wallet.", "error");
              }
            } else {
              toast("Payment verification failed.", "error");
            }
          } catch (error) {
            toast("An error occurred while processing payment.", "error");
          } finally {
            setIsLoading(false);
          }
        },
        prefill: {
          name: userDetails.name,
          email: userDetails.email,
          contact: userDetails.phone,
        },
        theme: {
          color: "#4F46E5",
        },
      };

      var rzp1 = new window.Razorpay(options);
      rzp1.on("payment.failed", function (response) {
        console.error("Payment failed:", response);
        toast("Payment failed. Please try again.", "error");
        setIsLoading(false);
      });
      rzp1.open();
    } catch (error) {
      console.error("Error initiating payment: ", error);
      toast("An error occurred while processing the payment.", "error");
      setIsLoading(false);
    }
  };

  // Toast notification function using template literals
  const toast = (message, type = "info") => {
    const toastElem = document.createElement("div");
    toastElem.className = `fixed bottom-4 right-4 px-6 py-3 rounded-lg text-white ${
      type === "error"
        ? "bg-red-500"
        : type === "success"
        ? "bg-green-500"
        : "bg-blue-500"
    } shadow-lg z-50 animate-fade-in-up`;
    toastElem.textContent = message;
    document.body.appendChild(toastElem);

    setTimeout(() => {
      toastElem.classList.add("animate-fade-out");
      setTimeout(() => document.body.removeChild(toastElem), 500);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-white/20">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-white mb-1">Add Funds</h2>
            <p className="text-gray-300 text-center">
              Secure payment powered by Razorpay
            </p>
          </div>

          <div className="mb-6">
            <label className="block text-gray-200 text-sm font-medium mb-2">
              Choose Amount
            </label>
            <div className="grid grid-cols-4 gap-2 mb-4">
              {quickAmounts.map((quickAmount) => (
                <button
                  key={quickAmount}
                  type="button"
                  onClick={() => setAmount(quickAmount.toString())}
                  className={`py-2 rounded-lg transition-all ${
                    amount === quickAmount.toString()
                      ? "bg-indigo-600 text-white"
                      : "bg-white/20 text-white hover:bg-white/30"
                  }`}
                >
                  ₹{quickAmount}
                </button>
              ))}
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-300 text-lg">₹</span>
              </div>
              <input
                type="number"
                placeholder="Enter custom amount"
                className="w-full pl-10 pr-4 py-4 bg-white/20 border border-white/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
          </div>

          <button
            className={`w-full py-4 px-6 rounded-xl text-lg font-medium transition-all ${
              isLoading
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl"
            }`}
            onClick={handlePayment}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Processing...
              </div>
            ) : (
              <>Pay ₹{amount || "0"}</>
            )}
          </button>

          <div className="mt-6 flex items-center justify-center text-sm text-gray-300">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
            Secured by 256-bit encryption
          </div>
        </div>
      </div>
    </div>
  );
}

export default Pay;
