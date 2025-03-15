import { useState } from "react";
import { Button } from "../ui/button";
import { Shield, Loader } from "lucide-react";
import { useAccount } from "@/hooks/useAccount";
import { ethers } from "ethers";
import VERIFICATION_ABI from "@/constants/abi/verification.json";

const CONTRACT_ADDRESS = "0x1234567890123456789012345678901234567890"; // Replace with your contract address

export function VerifyOnChain({ data }: { data: string }) {
  const [isVerifying, setIsVerifying] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const { account, provider } = useAccount();

  const verifyData = async () => {
    if (!account || !provider || !data) return;
    
    try {
      setIsVerifying(true);
      
      const signer = provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, VERIFICATION_ABI, signer);
      
      // Convert data to bytes32 hash for verification
      const dataHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(data));
      
      // Call the verification function on your contract
      const tx = await contract.verify(dataHash);
      setTxHash(tx.hash);
      
      // Wait for transaction confirmation
      await tx.wait();
    } catch (error) {
      console.error("Verification error:", error);
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="space-y-3">
      <Button
        onClick={verifyData}
        disabled={isVerifying || !account || !data}
        className="flex items-center gap-2"
      >
        {isVerifying ? (
          <Loader className="h-4 w-4 animate-spin" />
        ) : (
          <Shield className="h-4 w-4" />
        )}
        {isVerifying ? "Verifying..." : "Verify on Blockchain"}
      </Button>
      
      {txHash && (
        <div className="text-sm">
          <p className="font-medium">Transaction Hash:</p>
          <a 
            href={`https://explorer.monad.xyz/tx/${txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline truncate block"
          >
            {txHash}
          </a>
        </div>
      )}
    </div>
  );
}
