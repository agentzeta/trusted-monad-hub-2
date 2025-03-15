import { useState, useEffect } from "react";
import { useAccount } from "@/hooks/useAccount";
import { ethers } from "ethers";
import { Button } from "../ui/button";
import { ExternalLink, Code, CopyIcon, CheckIcon } from "lucide-react";

interface ContractFunction {
  name: string;
  description: string;
  params?: string[];
}

interface SmartContractCardProps {
  title: string;
  address: string;
  functions: ContractFunction[];
  network?: string;
  currentStake?: string;
}

export function SmartContractCard({
  title,
  address,
  functions,
  network = "Monad",
  currentStake = "0"
}: SmartContractCardProps) {
  const [copied, setCopied] = useState(false);
  const [totalStaked, setTotalStaked] = useState("0");
  const [activeValidators, setActiveValidators] = useState(0);
  const [disputeRate, setDisputeRate] = useState("0%");
  const { account, provider } = useAccount();

  // Mock data - in a real app, this would fetch from the blockchain
  useEffect(() => {
    if (address) {
      setTotalStaked("152.34 ETH");
      setActiveValidators(24);
      setDisputeRate("1.2%");
    }
  }, [address]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="border rounded-lg p-4 bg-white shadow">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-lg">{title} Contract</h3>
        <div className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
          {network}
        </div>
      </div>

      <div className="flex items-center mb-4">
        <span className="text-sm font-medium text-gray-500 mr-2">Contract:</span>
        <code className="text-xs bg-gray-100 p-1 rounded flex-1 truncate">
          {address}
        </code>
        <button
          onClick={copyToClipboard}
          className="ml-2 p-1 hover:bg-gray-100 rounded"
        >
          {copied ? (
            <CheckIcon className="h-4 w-4 text-green-500" />
          ) : (
            <CopyIcon className="h-4 w-4 text-gray-500" />
          )}
        </button>
        <a
          href={`https://explorer.monad.xyz/address/${address}`}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-1 p-1 hover:bg-gray-100 rounded"
        >
          <ExternalLink className="h-4 w-4 text-gray-500" />
        </a>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-50 p-3 rounded text-center">
          <div className="text-xs text-gray-500">Total Staked</div>
          <div className="font-semibold">{totalStaked}</div>
        </div>
        <div className="bg-gray-50 p-3 rounded text-center">
          <div className="text-xs text-gray-500">Active Validators</div>
          <div className="font-semibold">{activeValidators}</div>
        </div>
        <div className="bg-gray-50 p-3 rounded text-center">
          <div className="text-xs text-gray-500">Dispute Rate</div>
          <div className="font-semibold">{disputeRate}</div>
        </div>
      </div>

      <div className="mb-4">
        <h4 className="font-medium text-sm mb-2 flex items-center">
          <Code className="h-4 w-4 mr-1" /> Contract Functions
        </h4>
        <div className="space-y-2">
          {functions.map((fn, index) => (
            <div key={index} className="bg-gray-50 p-2 rounded text-sm">
              <div className="font-mono text-blue-600">{fn.name}</div>
              <div className="text-xs text-gray-500">{fn.description}</div>
            </div>
          ))}
        </div>
      </div>

      {account && (
        <div className="border-t pt-3 mt-3">
          <div className="text-xs text-gray-500 mb-2">Your Current Stake</div>
          <div className="flex items-center justify-between">
            <span className="font-semibold">{currentStake} ETH</span>
            <Button size="sm">Stake More</Button>
          </div>
        </div>
      )}
    </div>
  );
}
