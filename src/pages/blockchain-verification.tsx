import { useState } from "react";
import { WalletConnect } from "@/components/blockchain/WalletConnect";
import { VerifyOnChain } from "@/components/blockchain/VerifyOnChain";
import { TokenBalance } from "@/components/blockchain/TokenBalance";
import { VerificationStatus } from "@/components/blockchain/VerificationStatus";
import { LiveConsensusVisualization } from "@/components/blockchain/LiveConsensusVisualization";
import { SmartContractCard } from "@/components/blockchain/SmartContractCard";
import { BlockchainTrustBadge } from "@/components/blockchain/BlockchainTrustBadge";
import { GasFeeWidget } from "@/components/blockchain/GasFeeWidget";
import { ApexCharts } from "@/components/blockchain/ApexCharts";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";

export default function BlockchainVerificationPage() {
  const [dataToVerify, setDataToVerify] = useState("");
  const [dataId, setDataId] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setDataId(dataToVerify);
    setIsProcessing(true);
    
    // Simulate verification process
    setTimeout(() => {
      setIsVerified(true);
      setIsProcessing(false);
    }, 6000);
  };

  // Contract functions for validator contract
  const validatorFunctions = [
    {
      name: "voteOnArticle(bytes32 hash, bool isValid)",
      description: "Vote on whether content is valid or contains misinformation"
    },
    {
      name: "stakeTokens(uint256 amount)",
      description: "Stake tokens to become a validator"
    },
    {
      name: "slashMaliciousActor(address actor, bytes32 proof)",
      description: "Slash a validator for dishonest behavior"
    }
  ];

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Blockchain Verification</h1>
        <WalletConnect />
      </div>
      
      <div className="grid md:grid-cols-3 gap-8">
        {/* Left column */}
        <div className="space-y-6 md:col-span-2">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Verify Data on Blockchain</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                value={dataToVerify}
                onChange={(e) => setDataToVerify(e.target.value)}
                placeholder="Enter claim or content to verify (e.g., 'COVID vaccines are safe and effective')"
              />
              <Button 
                type="submit" 
                disabled={!dataToVerify || isProcessing}
                className="w-full"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                    Processing...
                  </>
                ) : (
                  'Submit for Verification'
                )}
              </Button>
            </form>
            
            {dataId && (
              <div className="mt-6">
                <LiveConsensusVisualization dataId={dataId} />
                
                <div className="mt-6">
                  <BlockchainTrustBadge 
                    isVerified={isVerified}
                    txHash="0x8f71f32e0ed5fd6af868517de0fe5f2c42d2a9650f8aa8a1b8f58a7413344f2d"
                    blockNumber={18293}
                    timestamp={new Date().toISOString()}
                    gasFee="0.0023"
                    modelHashes={[
                      "0x3a2e5720eb027f51176b767e0e36b191a5b27f9b64b8a4a27ab0360bd13f0393",
                      "0x8b1cf30e512fec85c04d05e75bd955301c264ed7f0f9fb4189723bfae3724937",
                      "0xa7852e5e4bd30479fab9b29bbcbca180bbb3c952f272e4855ec29ce2c469fe82"
                    ]}
                  />
                </div>
              </div>
            )}
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <SmartContractCard 
              title="Validation Staking"
              address="0x1234567890123456789012345678901234567890"
              functions={validatorFunctions}
              currentStake="0.5"
            />
            
            <GasFeeWidget />
          </div>
        </div>
        
        {/* Right column */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <TokenBalance />
          </div>
          
          <Tabs defaultValue="data">
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="data">Oracle APEX Data</TabsTrigger>
              <TabsTrigger value="admin">Admin</TabsTrigger>
            </TabsList>
            
            <TabsContent value="data" className="space-y-4 mt-0">
              <ApexCharts />
            </TabsContent>
            
            <TabsContent value="admin" className="mt-0">
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="font-semibold mb-4">Admin Controls</h3>
                <div className="text-sm text-gray-500 mb-4">
                  Access to Oracle APEX admin dashboard and validator whitelist management.
                </div>
                <Button className="w-full">Open APEX Dashboard</Button>
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-100 text-sm">
            <p className="font-medium text-blue-800 mb-1">Hackathon Judge Mode</p>
            <p className="text-blue-700 mb-3">
              Special features for ETHSF hackathon judges to evaluate the project's capabilities.
            </p>
            <Button variant="outline" size="sm" className="w-full">
              Activate Judge Mode
            </Button>
          </div>
        </div>
      </div>
      
      <div className="mt-8 text-center text-xs text-gray-500">
        <p>Powered by Oracle APEX Integration | Built on Monad | Gas-optimized for ETHSF</p>
      </div>
    </div>
  );
}
