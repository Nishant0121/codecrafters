import { AppContext } from "@/context/appContext";
import axios from "axios";
import React, { useContext, useState } from "react";

function Pay() {
  const [amount, setAmount] = useState(""); // User-defined amount
  const [currency, setCurrency] = useState("INR");
  const [receiptId, setReceiptId] = useState("order_receipt_123"); // Simulated receipt ID
  const [userDetails, setUserDetails] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "1234567890",
  });
  const { loginUser } = useContext(AppContext);

  const handlePayment = async (e) => {
    e.preventDefault(); // Prevent page reload

    if (!amount || isNaN(amount) || amount <= 0) {
      alert("Please enter a valid amount.");
      return;
    }

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
        key: "rzp_test_rZy8sy8h3lgvoA", // Replace with your actual Key ID
        amount: amount * 100, // Convert to paisa
        currency,
        name: "Acme Corp",
        description: "Test Transaction",
        image: "https://example.com/your_logo",
        order_id: order.id, // Order ID from server
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
                  type: "credit", // 'credit' or 'debit'
                }
              );
              if (response.status === 200) {
                console.log("Wallet updated successfully.");
              } else {
                console.error("Error updating wallet.");
              }
              alert("Payment successful! Booking confirmed.");
            } else {
              alert("Payment failed. Please try again.");
            }
          } catch (error) {
            alert("An error occurred while processing the payment.");
          }
        },
        prefill: {
          name: userDetails.name,
          email: userDetails.email,
          contact: userDetails.phone,
        },
        theme: {
          color: "#3399cc",
        },
      };

      var rzp1 = new window.Razorpay(options);
      rzp1.on("payment.failed", function (response) {
        console.error("Payment failed:", response);
        alert("Payment failed. Please try again.");
      });
      rzp1.open();
    } catch (error) {
      console.error("Error initiating payment: ", error);
      alert("An error occurred while processing the payment.");
    }
  };

  return (
    <div className="container mt-20 text-center">
      <h2 className="text-2xl font-semibold mb-4">Enter Payment Details</h2>

      <input
        type="number"
        placeholder="Enter amount (₹)"
        className="p-3 border rounded-lg w-60 mb-4 text-black"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      <br />

      <button
        className="bg-blue-500 text-white px-6 py-3 rounded-xl mt-2 hover:bg-blue-700"
        onClick={handlePayment}
      >
        Pay ₹{amount || "0"}
      </button>
    </div>
  );
}

export default Pay;
