import { useState } from "react";
import { Button } from "../ui/button";
import { ethers } from "ethers";
import { useAccount } from "@/hooks/useAccount";

export const WalletConnect = () => {
  const [isConnecting, setIsConnecting] = useState(false);
  const { account, connect, disconnect } = useAccount();

  const handleConnection = async () => {
    try {
      setIsConnecting(true);
      if (account) {
        await disconnect();
      } else {
        await connect();
      }
    } catch (error) {
      console.error("Wallet connection error:", error);
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      {account && (
        <span className="text-sm truncate max-w-[150px]">
          {account.slice(0, 6)}...{account.slice(-4)}
        </span>
      )}
      <Button 
        onClick={handleConnection}
        disabled={isConnecting}
        variant={account ? "outline" : "default"}
      >
        {isConnecting ? "Connecting..." : account ? "Disconnect" : "Connect Wallet"}
      </Button>
    </div>
  );
};
