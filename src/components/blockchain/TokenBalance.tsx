import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { useAccount } from "@/hooks/useAccount";
import { Button } from "../ui/button";
import { Loader, RefreshCw } from "lucide-react";
import TOKEN_ABI from "@/constants/abi/truth-token.json";

const TOKEN_ADDRESS = "0x0987654321098765432109876543210987654321"; // Replace with your token contract address

export function TokenBalance() {
  const [balance, setBalance] = useState<string>("0");
  const [isLoading, setIsLoading] = useState(false);
  const { account, provider } = useAccount();

  const fetchBalance = async () => {
    if (!account || !provider) return;
    
    try {
      setIsLoading(true);
      const tokenContract = new ethers.Contract(TOKEN_ADDRESS, TOKEN_ABI, provider);
      const rawBalance = await tokenContract.balanceOf(account);
      setBalance(ethers.utils.formatUnits(rawBalance, 18));
    } catch (error) {
      console.error("Failed to fetch token balance:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (account && provider) {
      fetchBalance();
    } else {
      setBalance("0");
    }
  }, [account, provider]);

  if (!account) {
    return <div className="text-sm text-gray-500">Connect wallet to see TRUTH balance</div>;
  }

  return (
    <div className="p-4 border rounded-lg">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">TRUTH Balance</h3>
          <p className="text-2xl font-bold">
            {isLoading ? <Loader className="animate-spin h-6 w-6" /> : balance}
          </p>
        </div>
        <Button size="sm" variant="outline" onClick={fetchBalance} disabled={isLoading}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>
    </div>
  );
}
