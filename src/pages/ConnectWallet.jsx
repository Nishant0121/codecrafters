import { useState, useEffect } from "react";
import { ethers } from "ethers";
import PortfolioABI from "./abi.json";

const CONTRACT_ADDRESS = "0xd596CC60Ee34b6a8448f668d9B8c36e0f49e842f";

function ConnectWallet() {
    const [account, setAccount] = useState(null);
    const [contract, setContract] = useState(null);
    const [balance, setBalance] = useState(0);
    const [loading, setLoading] = useState(false);

    const loadBalance = async (contract, userAddress) => {
        if (!contract || !userAddress) return;
        try {
            const balance = await contract.getInvestment(userAddress);
            setBalance(ethers.formatEther(balance));
        } catch (error) {
            console.error("Error fetching balance:", error);
        }
    };

    async function connectWallet() {
        if (!window.ethereum) {
            alert("MetaMask not detected! Please install MetaMask.");
            return;
        }

        try {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });

            setAccount(accounts[0]);

            const portfolioContract = new ethers.Contract(CONTRACT_ADDRESS, PortfolioABI, signer);
            setContract(portfolioContract);

            await loadBalance(portfolioContract, accounts[0]);
        } catch (err) {
            console.error("Wallet connection failed:", err);
        }
    }

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
    }, []);

    return (
        <div>
            <h1>Investment Portfolio</h1>
            {!account ? (
                <button onClick={connectWallet}>Connect Wallet</button>
            ) : (
                <>
                    <p>Connected Account: {account}</p>
                    <p>Your Investment Balance: {balance} ETH</p>

                    <button onClick={() => invest("0.1")} disabled={loading}>
                        {loading ? "Processing..." : "Invest 0.1 ETH"}
                    </button>
                    <button onClick={() => withdraw("0.1")} disabled={loading}>
                        {loading ? "Processing..." : "Withdraw 0.1 ETH"}
                    </button>
                </>
            )}
        </div>
    );
}

export default ConnectWallet;
