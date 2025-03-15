import { useEffect, useState } from "react";
import { Shield, CheckCircle, Clock, AlertTriangle } from "lucide-react";
import { ethers } from "ethers";
import { useAccount } from "@/hooks/useAccount";
import VERIFICATION_ABI from "@/constants/abi/verification.json";

const CONTRACT_ADDRESS = "0x1234567890123456789012345678901234567890"; // Replace with your contract address

export function VerificationStatus({ dataId }: { dataId: string }) {
  const [status, setStatus] = useState<'unverified' | 'pending' | 'verified' | 'rejected'>('unverified');
  const [isLoading, setIsLoading] = useState(false);
  const { provider } = useAccount();

  useEffect(() => {
    if (!provider || !dataId) return;
    
    const checkStatus = async () => {
      try {
        setIsLoading(true);
        const contract = new ethers.Contract(CONTRACT_ADDRESS, VERIFICATION_ABI, provider);
        
        // Convert dataId to hash if needed
        const dataHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(dataId));
        
        // Assuming your contract has a method to check verification status
        const verificationStatus = await contract.checkVerificationStatus(dataHash);
        
        // Adjust based on your contract's return value
        if (verificationStatus === 1) {
          setStatus('verified');
        } else if (verificationStatus === 2) {
          setStatus('rejected');
        } else if (verificationStatus === 3) {
          setStatus('pending');
        } else {
          setStatus('unverified');
        }
      } catch (error) {
        console.error("Failed to check verification status:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkStatus();
  }, [provider, dataId]);

  if (isLoading) {
    return (
      <div className="flex items-center text-gray-500">
        <Loader className="animate-spin mr-2 h-4 w-4" />
        Checking status...
      </div>
    );
  }

  switch (status) {
    case 'verified':
      return (
        <div className="flex items-center text-green-600">
          <CheckCircle className="mr-2 h-4 w-4" />
          Blockchain verified
        </div>
      );
    case 'pending':
      return (
        <div className="flex items-center text-amber-500">
          <Clock className="mr-2 h-4 w-4" />
          Verification in progress
        </div>
      );
    case 'rejected':
      return (
        <div className="flex items-center text-red-600">
          <AlertTriangle className="mr-2 h-4 w-4" />
          Verification rejected
        </div>
      );
    default:
      return (
        <div className="flex items-center text-gray-400">
          <Shield className="mr-2 h-4 w-4" />
          Not verified
        </div>
      );
  }
}
