
import { useState } from 'react';
import { toast } from '@/components/ui/use-toast';
import { recordOnFlareBlockchain, createAttestation } from '../services/blockchainService';
import { Response } from '../types/query';
import { saveResponseToDatabase } from '../services/databaseService';
import { ToastAction } from '@/components/ui/toast';
import React from 'react';
import { submitToFlareTee, verifyTeeConsensusOnChain } from '../utils/flareTeeUtils';

export const useBlockchainRecording = () => {
  const [blockchainReference, setBlockchainReference] = useState<string | null>(null);
  const [attestationId, setAttestationId] = useState<string | null>(null);
  const [isRecordingOnChain, setIsRecordingOnChain] = useState(false);
  const [teeVerificationId, setTeeVerificationId] = useState<string | null>(null);

  const recordResponseOnBlockchain = async (
    privateKey: string | null,
    userId: string | null,
    queryText: string,
    consensusResponse: string,
    responses: Response[]
  ) => {
    if (!privateKey) {
      console.error('No private key provided for blockchain recording');
      toast({
        title: "Missing Private Key",
        description: "Please add your wallet key in settings to enable blockchain verification.",
        variant: "destructive",
        duration: 5000,
      });
      return null;
    }
    
    setIsRecordingOnChain(true);
    
    try {
      // Add timestamp to blockchain record
      const timestamp = Math.floor(Date.now() / 1000);
      console.log(`Recording on blockchain with timestamp: ${timestamp}`);
      
      // Step 1: Process responses through Flare TEE for secure consensus
      console.log('Starting TEE verification process...');
      let teeResult;
      try {
        teeResult = await submitToFlareTee(
          queryText,
          responses,
          privateKey
        );
        
        setTeeVerificationId(teeResult.verificationId);
        console.log(`TEE verification completed with ID: ${teeResult.verificationId}`);
      } catch (error) {
        console.error('TEE verification failed:', error);
        toast({
          title: "TEE Verification Failed",
          description: "Secure consensus verification failed. Continuing with standard verification.",
          variant: "destructive",
          duration: 5000,
        });
        // Continue with other steps even if TEE fails
        teeResult = {
          verificationId: `fallback-${Date.now()}`,
          signature: "fallback-signature",
          consensusResponse: consensusResponse
        };
      }
      
      // Step 2: Verify the TEE result on chain (if we have a valid TEE result)
      let teeTxHash = null;
      if (teeResult.verificationId && !teeResult.verificationId.startsWith('fallback-')) {
        try {
          teeTxHash = await verifyTeeConsensusOnChain(
            teeResult.verificationId,
            teeResult.signature,
            privateKey
          );
          console.log(`TEE verification recorded on blockchain: ${teeTxHash}`);
        } catch (error) {
          console.error('Error verifying TEE consensus on chain:', error);
          // Continue with other steps even if on-chain verification fails
        }
      }
      
      // Step 3: Record on Flare blockchain (traditional method as backup)
      let txHash;
      try {
        txHash = await recordOnFlareBlockchain(
          privateKey,
          queryText,
          consensusResponse,
          timestamp
        );
        setBlockchainReference(txHash);
        console.log(`Transaction recorded on blockchain: ${txHash}`);
      } catch (error) {
        console.error('Error recording on blockchain:', error);
        txHash = `error-${Date.now()}`;
        setBlockchainReference(txHash);
        toast({
          title: "Blockchain Recording Issue",
          description: "Could not record on the blockchain. Using simulated reference instead.",
          variant: "destructive",
          duration: 5000,
        });
      }
      
      // Step 4: Create attestation
      let attestationUID;
      try {
        attestationUID = await createAttestation(
          privateKey,
          queryText,
          consensusResponse,
          timestamp
        );
        setAttestationId(attestationUID);
        console.log(`Attestation created: ${attestationUID}`);
      } catch (error) {
        console.error('Error creating attestation:', error);
        attestationUID = `error-${Date.now()}`;
        setAttestationId(attestationUID);
      }
      
      // Step 5: Save to database if user is logged in
      if (userId) {
        try {
          await saveResponseToDatabase(
            userId, 
            queryText, 
            consensusResponse, 
            responses,
            txHash,
            attestationUID,
            teeResult.verificationId
          );
          console.log(`Response saved to database for user: ${userId}`);
        } catch (error) {
          console.error('Error saving to database:', error);
          toast({
            title: "Database Error",
            description: "Could not save the response to the database.",
            variant: "destructive",
            duration: 5000,
          });
        }
      }
      
      // Create a toast notification with transaction details
      toast({
        title: "Blockchain Verification Complete",
        description: `Your consensus response has been ${txHash.startsWith('error') ? 'simulated' : 'recorded'} on the blockchain.${txHash.startsWith('error') ? '' : ` Transaction Hash: ${txHash.substring(0, 18)}...${txHash.substring(txHash.length - 6)}`}`,
        duration: 10000,
        action: txHash.startsWith('error') ? undefined : (
          <ToastAction 
            altText="View on Flare Explorer" 
            onClick={() => window.open(`https://flare-explorer.flare.network/tx/${txHash}`, '_blank')}
          >
            View on Flare Explorer
          </ToastAction>
        )
      });
      
      return { 
        txHash, 
        attestationUID,
        teeVerificationId: teeResult.verificationId 
      };
    } catch (error) {
      console.error('Blockchain recording error:', error);
      toast({
        title: "Blockchain Recording Failed",
        description: "An error occurred while recording to the blockchain. Please try again later.",
        variant: "destructive",
        duration: 5000,
      });
      return null;
    } finally {
      setIsRecordingOnChain(false);
    }
  };

  return {
    blockchainReference,
    attestationId,
    teeVerificationId,
    isRecordingOnChain,
    recordResponseOnBlockchain
  };
};
