 origin jeeimport { useState, useEffect } from "react";
import { ArrowRight, CheckCircle, AlertCircle, Server } from "lucide-react";

// SVG logos - replace with actual logos in production
const MonadLogo = () => (
  <div className="h-6 w-6 bg-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold">M</div>
);

const MetisLogo = () => (
  <div className="h-6 w-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">MT</div>
);

const AIModelLogo = ({index}: {index: number}) => (
  <div className={`h-6 w-6 rounded-full flex items-center justify-center text-white text-xs font-bold 
    ${index === 0 ? 'bg-green-500' : index === 1 ? 'bg-blue-500' : 'bg-orange-500'}`}>
    {index === 0 ? 'G' : index === 1 ? 'A' : 'C'}
  </div>
);

type ConsensusStep = 'query' | 'models' | 'consensus' | 'blockchain';
type ConsensusState = {
  activeStep: ConsensusStep;
  modelResults: Array<{done: boolean, agree: boolean}>;
  consensusReached: boolean;
  blockchainConfirmed: boolean;
};

export function LiveConsensusVisualization({ dataId }: { dataId: string }) {
  const [state, setState] = useState<ConsensusState>({
    activeStep: 'query',
    modelResults: [{done: false, agree: false}, {done: false, agree: false}, {done: false, agree: false}],
    consensusReached: false,
    blockchainConfirmed: false
  });
  
  // Simulate the consensus process when a dataId is provided
  useEffect(() => {
    if (!dataId) {
      setState({
        activeStep: 'query',
        modelResults: [{done: false, agree: false}, {done: false, agree: false}, {done: false, agree: false}],
        consensusReached: false,
        blockchainConfirmed: false
      });
      return;
    }
    
    // Reset state
    setState({
      activeStep: 'query',
      modelResults: [{done: false, agree: false}, {done: false, agree: false}, {done: false, agree: false}],
      consensusReached: false,
      blockchainConfirmed: false
    });
    
    // Simulate AI models processing
    setState(prev => ({...prev, activeStep: 'models'}));
    
    // Model 1 completes
    setTimeout(() => {
      setState(prev => ({
        ...prev,
        modelResults: [{done: true, agree: true}, prev.modelResults[1], prev.modelResults[2]]
      }));
    }, 800);
    
    // Model 2 completes
    setTimeout(() => {
      setState(prev => ({
        ...prev,
        modelResults: [prev.modelResults[0], {done: true, agree: true}, prev.modelResults[2]]
      }));
    }, 1600);
    
    // Model 3 completes
    setTimeout(() => {
      setState(prev => ({
        ...prev, 
        modelResults: [prev.modelResults[0], prev.modelResults[1], {done: true, agree: true}]
      }));
    }, 2400);
    
    // Consensus engine processes results
    setTimeout(() => {
      setState(prev => ({...prev, activeStep: 'consensus'}));
    }, 3000);
    
    // Consensus reached
    setTimeout(() => {
      setState(prev => ({...prev, consensusReached: true}));
    }, 3800);
    
    // Blockchain confirmation
    setTimeout(() => {
      setState(prev => ({...prev, activeStep: 'blockchain'}));
    }, 4500);
    
    // Blockchain confirmed
    setTimeout(() => {
      setState(prev => ({...prev, blockchainConfirmed: true}));
    }, 5300);
    
  }, [dataId]);
  
  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">Live Consensus Visualization</h3>
      
      <div className="flex items-center justify-between mb-8">
        {/* Query Node */}
        <div className="flex flex-col items-center">
          <div className={`h-12 w-12 rounded-full flex items-center justify-center mb-2 border-2
            ${state.activeStep === 'query' ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50'}`}>
            <Server className={`h-6 w-6 ${state.activeStep === 'query' ? 'text-blue-500' : 'text-gray-400'}`} />
          </div>
          <span className="text-xs text-center">User Query</span>
        </div>
        
        {/* Arrow */}
        <ArrowRight className="h-4 w-4 text-gray-400" />
        
        {/* AI Models */}
        <div className="flex flex-col items-center">
          <div className={`h-12 w-24 rounded-lg flex items-center justify-center space-x-1 mb-2 border-2
            ${state.activeStep === 'models' ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50'}`}>
            {state.modelResults.map((model, i) => (
              <div key={i} className="relative">
                <AIModelLogo index={i} />
                {model.done && (
                  <div className="absolute -bottom-1 -right-1 bg-white rounded-full">
                    {model.agree ? 
                      <CheckCircle className="h-3 w-3 text-green-500" /> : 
                      <AlertCircle className="h-3 w-3 text-red-500" />
                    }
                  </div>
                )}
              </div>
            ))}
          </div>
          <span className="text-xs text-center">AI Models</span>
        </div>
        
        {/* Arrow */}
        <ArrowRight className="h-4 w-4 text-gray-400" />
        
        {/* Consensus Engine */}
        <div className="flex flex-col items-center">
          <div className={`h-12 w-12 rounded-full flex items-center justify-center mb-2 border-2
            ${state.activeStep === 'consensus' ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50'}`}>
            {state.consensusReached ? (
              <CheckCircle className="h-6 w-6 text-green-500" />
            ) : (
              <div className="h-6 w-6 rounded-full border-2 border-gray-400 border-t-transparent animate-spin" />
            )}
          </div>
          <span className="text-xs text-center">Consensus Engine</span>
        </div>
        
        {/* Arrow */}
        <ArrowRight className="h-4 w-4 text-gray-400" />
        
        {/* Blockchain */}
        <div className="flex flex-col items-center">
          <div className={`h-12 w-12 rounded-full flex items-center justify-center mb-2 border-2
            ${state.activeStep === 'blockchain' ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50'}`}>
            {state.blockchainConfirmed ? (
              <div className="flex space-x-1">
                <MonadLogo />
                <MetisLogo />
              </div>
            ) : (
              <div className="h-6 w-6 rounded-full border-2 border-gray-400 border-t-transparent animate-spin" />
            )}
          </div>
          <span className="text-xs text-center">Blockchain TX</span>
        </div>
      </div>
      
      {/* Status message */}
      <div className="text-sm text-center text-gray-600">
        {!dataId && "Enter data to start the verification process"}
        {dataId && state.activeStep === 'query' && "Processing query..."}
        {dataId && state.activeStep === 'models' && "AI models analyzing data..."}
        {dataId && state.activeStep === 'consensus' && !state.consensusReached && "Forming consensus..."}
        {dataId && state.activeStep === 'consensus' && state.consensusReached && "Consensus reached!"}
        {dataId && state.activeStep === 'blockchain' && !state.blockchainConfirmed && "Writing to blockchain..."}
        {dataId && state.blockchainConfirmed && "Verification complete and stored on blockchain!"}
      </div>
    </div>
  );
}
