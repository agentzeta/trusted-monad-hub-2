import { useState, useEffect } from "react";
import { Coins, TrendingDown, Activity } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface NetworkFee {
  network: string;
  fee: number;
  currency: string;
  savings?: number;
}

export function GasFeeWidget() {
  const [fees, setFees] = useState<NetworkFee[]>([
    { network: "Monad", fee: 0.02, currency: "USD" },
    { network: "METIS", fee: 0.12, currency: "USD" },
    { network: "Ethereum", fee: 1.85, currency: "USD" }
  ]);
  
  const [totalSaved, setTotalSaved] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Calculate savings compared to Ethereum
  useEffect(() => {
    const ethereumFee = fees.find(f => f.network === "Ethereum")?.fee || 0;
    
    setFees(prev => prev.map(network => ({
      ...network,
      savings: network.network !== "Ethereum" ? 
        parseFloat((((ethereumFee - network.fee) / ethereumFee) * 100).toFixed(1)) : 0
    })));
    
    // Simulate accumulated savings over time
    let savedSoFar = 0;
    const interval = setInterval(() => {
      savedSoFar += 0.05;
      setTotalSaved(parseFloat(savedSoFar.toFixed(2)));
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Animation effect
  useEffect(() => {
    if (totalSaved > 0 && totalSaved % 0.5 < 0.1) {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 1000);
    }
  }, [totalSaved]);

  const getHighestFee = () => {
    return Math.max(...fees.map(fee => fee.fee));
  };

  return (
    <div className="border rounded-lg p-4 bg-white shadow">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-lg flex items-center">
          <Coins className="h-5 w-5 mr-2" /> Gas Fee Comparison
        </h3>
        <div className="flex items-center text-sm text-green-600">
          <Activity className="h-4 w-4 mr-1" /> Live
        </div>
      </div>
      
      <div className="space-y-4">
        {fees.map((fee, index) => (
          <div key={index} className="space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">{fee.network}</span>
              <div className="flex items-center">
                <span 
                  className={`text-sm font-bold ${
                    fee.network === "Monad" ? "text-green-600" : 
                    fee.network === "METIS" ? "text-blue-600" : 
                    "text-gray-600"
                  }`}
                >
                  ${fee.fee.toFixed(2)}
                </span>
                
                {fee.savings && fee.savings > 0 && (
                  <span className="ml-2 text-xs text-green-600 flex items-center">
                    <TrendingDown className="h-3 w-3 mr-1" />
                    {fee.savings}%
                  </span>
                )}
              </div>
            </div>
            
            <Progress 
              value={(fee.fee / getHighestFee()) * 100} 
              className={
                fee.network === "Monad" ? "bg-green-100" : 
                fee.network === "METIS" ? "bg-blue-100" : 
                "bg-gray-100"
              }
            />
          </div>
        ))}
      </div>
      
      <div 
        className={`mt-6 p-3 bg-green-50 border border-green-100 rounded-lg transition-all duration-300 ${isAnimating ? 'scale-105 bg-green-100' : ''}`}
      >
        <div className="text-sm text-gray-600">Total Gas Savings</div>
        <div className="text-xl font-bold text-green-600">${totalSaved.toFixed(2)}</div>
        <div className="text-xs text-gray-500">Compared to Ethereum mainnet</div>
      </div>
    </div>
  );
}
