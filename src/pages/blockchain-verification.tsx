import { useState } from "react";
import { WalletConnect } from "@/components/blockchain/WalletConnect";
import { VerifyOnChain } from "@/components/blockchain/VerifyOnChain";
import { TokenBalance } from "@/components/blockchain/TokenBalance";
import { VerificationStatus } from "@/components/blockchain/VerificationStatus";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function BlockchainVerificationPage() {
  const [dataToVerify, setDataToVerify] = useState("");
  const [dataId, setDataId] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setDataId(dataToVerify);
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Blockchain Verification</h1>
        <WalletConnect />
      </div>
      
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Verify Data on Blockchain</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                value={dataToVerify}
                onChange={(e) => setDataToVerify(e.target.value)}
                placeholder="Enter data to verify on blockchain"
              />
              <Button type="submit" disabled={!dataToVerify}>Submit</Button>
            </form>
            
            {dataId && (
              <div className="mt-6">
                <VerifyOnChain data={dataId} />
                <div className="mt-3">
                  <VerificationStatus dataId={dataId} />
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <TokenBalance />
          </div>
        </div>
      </div>
    </div>
  );
}
