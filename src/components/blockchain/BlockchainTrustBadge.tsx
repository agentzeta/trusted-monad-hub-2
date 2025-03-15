import { useState } from "react";
import { CheckCircle, Shield, AlertCircle, Info, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "../ui/button";

interface BlockchainTrustBadgeProps {
  isVerified: boolean;
  modelCount?: number;
  blockNumber?: number;
  txHash?: string;
  modelHashes?: string[];
  timestamp?: string;
  gasFee?: string;
}

export function BlockchainTrustBadge({
  isVerified = false,
  modelCount = 3,
  blockNumber = 18293,
  txHash = "0x1234...5678",
  modelHashes = ["0xabc...123", "0xdef...456", "0xghi...789"],
  timestamp = "2023-08-01T12:34:56Z",
  gasFee = "0.0023"
}: BlockchainTrustBadgeProps) {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Trigger badge animation
  const animateBadge = () => {
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 1000);
  };

  return (
    <>
      <div 
        className={`relative border ${isVerified ? 'border-green-200 bg-green-50' : 'border-amber-200 bg-amber-50'} 
          rounded-lg p-4 cursor-pointer transition-all duration-200 hover:shadow-md
          ${isAnimating ? 'scale-105' : ''}`}
        onClick={() => {
          animateBadge();
          setDetailsOpen(true);
        }}
      >
        <div className="absolute top-0 right-0 -mt-2 -mr-2">
          <div className={`rounded-full p-1 ${isVerified ? 'bg-green-500' : 'bg-amber-500'}`}>
            {isVerified ? (
              <CheckCircle className="h-4 w-4 text-white" />
            ) : (
              <AlertCircle className="h-4 w-4 text-white" />
            )}
          </div>
        </div>
        
        <div className="flex items-center">
          <div className={`mr-3 p-2 rounded-full ${isVerified ? 'bg-green-100' : 'bg-amber-100'}`}>
            <Shield className={`h-6 w-6 ${isVerified ? 'text-green-500' : 'text-amber-500'}`} />
          </div>
          
          <div>
            <h3 className={`font-medium ${isVerified ? 'text-green-700' : 'text-amber-700'}`}>
              {isVerified ? 'Blockchain Verified' : 'Pending Verification'}
            </h3>
            <p className="text-sm text-gray-600">
              {isVerified 
                ? `✓ Verified by ${modelCount} AI models | 🔗 Stored on Block #${blockNumber}`
                : 'Awaiting confirmation from consensus network'}
            </p>
          </div>
        </div>
        
        <div className="mt-2 text-xs text-gray-500 flex justify-between items-center">
          <span>{new Date(timestamp).toLocaleString()}</span>
          <span className="flex items-center">
            <Info className="h-3 w-3 mr-1" />
            Click for details
          </span>
        </div>
      </div>
      
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Blockchain Verification Details</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium">Transaction Hash</h4>
                <p className="text-xs font-mono bg-gray-50 p-2 rounded">{txHash}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium">Block Number</h4>
                <p className="text-sm font-mono">{blockNumber}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium">Timestamp</h4>
                <p className="text-sm">{new Date(timestamp).toLocaleString()}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium">Gas Fee</h4>
                <p className="text-sm">{gasFee} ETH</p>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium mb-2">AI Model Verification Hashes</h4>
              <div className="space-y-2">
                {modelHashes.map((hash, i) => (
                  <div key={i} className="flex items-center">
                    <div className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full w-8 text-center mr-2">
                      AI {i+1}
                    </div>
                    <code className="text-xs bg-gray-50 p-1 rounded flex-1 truncate">
                      {hash}
                    </code>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setDetailsOpen(false)}>Close</Button>
            <Button variant="outline" asChild>
              <a 
                href={`https://explorer.monad.xyz/tx/${txHash.replace('0x', '')}`} 
                target="_blank" 
                rel="noopener noreferrer"
              >
                View on Explorer
              </a>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
