
import React from 'react';
import { ExternalLink, Check, Shield, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useQueryContext } from '@/hooks/useQueryContext';
import { format } from 'date-fns';

interface BlockchainVerificationDetailsProps {
  blockchainReference: string | null;
  attestationId: string | null;
  teeVerificationId?: string | null;
  timestamp: number | null;
}

const BlockchainVerificationDetails: React.FC<BlockchainVerificationDetailsProps> = ({
  blockchainReference,
  attestationId,
  teeVerificationId,
  timestamp
}) => {
  // Check if this is a mock/error reference (starts with "mock-", "error-", or "fallback-")
  const isMockReference = blockchainReference && 
    (blockchainReference.startsWith('mock-') || 
     blockchainReference.startsWith('error-') || 
     blockchainReference.startsWith('fallback-'));

  const isMockTeeId = teeVerificationId && 
    (teeVerificationId.startsWith('mock-') || 
     teeVerificationId.startsWith('error-') || 
     teeVerificationId.startsWith('fallback-'));
     
  const isMockAttestation = attestationId && 
    (attestationId.startsWith('mock-') || 
     attestationId.startsWith('error-') || 
     attestationId.startsWith('fallback-'));

  const formattedDate = timestamp 
    ? format(new Date(timestamp), 'MMM d, yyyy h:mm a') 
    : format(new Date(), 'MMM d, yyyy h:mm a'); // Fallback to current time

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-[1fr,auto] items-center gap-2">
        <div>
          <h4 className="text-sm font-medium flex items-center">
            <Check className="h-4 w-4 mr-1.5 text-green-500" />
            Blockchain Timestamp
          </h4>
          <p className="text-xs text-gray-500">{formattedDate}</p>
        </div>
        <div></div>
      </div>

      {teeVerificationId && (
        <div className="grid grid-cols-[1fr,auto] items-center gap-2 pb-2 border-b border-gray-100 dark:border-gray-800">
          <div>
            <h4 className="text-sm font-medium flex items-center">
              <Lock className="h-4 w-4 mr-1.5 text-purple-500" />
              TEE Verification
            </h4>
            <p className="text-xs text-gray-500 truncate" title={teeVerificationId}>
              ID: {teeVerificationId.substring(0, 20)}...{teeVerificationId.substring(teeVerificationId.length - 8)}
            </p>
            <p className="text-xs text-blue-500 mt-1">
              {isMockTeeId 
                ? "Simulated verification in development environment" 
                : "Verified in Flare Trusted Execution Environment"}
            </p>
          </div>
          <div></div>
        </div>
      )}

      {blockchainReference && (
        <div className="grid grid-cols-[1fr,auto] items-center gap-2 pb-2 border-b border-gray-100 dark:border-gray-800">
          <div>
            <h4 className="text-sm font-medium flex items-center">
              <Shield className="h-4 w-4 mr-1.5 text-blue-500" />
              Transaction Hash
            </h4>
            <p className="text-xs text-gray-500 truncate" title={blockchainReference}>
              {isMockReference 
                ? "Simulated for development environment" 
                : `${blockchainReference.substring(0, 20)}...${blockchainReference.substring(blockchainReference.length - 8)}`}
            </p>
          </div>
          {!isMockReference && (
            <Button
              variant="ghost" 
              size="sm"
              className="text-blue-600"
              onClick={() => window.open(`https://flare-explorer.flare.network/tx/${blockchainReference}`, '_blank')}
            >
              <ExternalLink className="h-3.5 w-3.5 mr-1" />
              View
            </Button>
          )}
        </div>
      )}

      {attestationId && (
        <div className="grid grid-cols-[1fr,auto] items-center gap-2">
          <div>
            <h4 className="text-sm font-medium flex items-center">
              <Shield className="h-4 w-4 mr-1.5 text-green-500" />
              Attestation ID
            </h4>
            <p className="text-xs text-gray-500 truncate" title={attestationId}>
              {isMockAttestation 
                ? "Simulated for development environment" 
                : `${attestationId.substring(0, 20)}...${attestationId.substring(attestationId.length - 8)}`}
            </p>
          </div>
          {!isMockAttestation && (
            <Button
              variant="ghost" 
              size="sm"
              className="text-blue-600"
              onClick={() => window.open(`https://attestation.flare.network/attestation/${attestationId}`, '_blank')}
            >
              <ExternalLink className="h-3.5 w-3.5 mr-1" />
              View
            </Button>
          )}
        </div>
      )}

      <div className="mt-4 text-xs text-gray-500 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md flex items-start">
        <Shield className="h-3.5 w-3.5 mr-2 mt-0.5 text-blue-500" />
        <span>
          {isMockReference || isMockTeeId || isMockAttestation 
            ? "In development mode, blockchain verification is simulated. In production, responses will be cryptographically verified and permanently recorded on the Flare blockchain." 
            : `This response has been cryptographically verified and permanently recorded on the Flare blockchain, ensuring its authenticity and immutability.
              ${teeVerificationId && !isMockTeeId ? ' The verification was performed in Flare\'s Trusted Execution Environment (TEE) for additional security.' : ''}`}
        </span>
      </div>
    </div>
  );
};

export default BlockchainVerificationDetails;
