import { ethers } from 'ethers';
import { ZkProof } from '../types/blockchain';
import { VERIFICATION_ABI } from '../constants/abi';
import * as dotenv from 'dotenv';

dotenv.config();

export class MonadService {
  private provider: ethers.providers.JsonRpcProvider;
  private signer: ethers.Signer;

  constructor() {
    this.provider = new ethers.providers.JsonRpcProvider(process.env.MONAD_RPC_URL);
    this.signer = new ethers.Wallet(process.env.PRIVATE_KEY!, this.provider);
  }

  async submitVerification(contentHash: string, zkProof: ZkProof) {
    const contract = new ethers.Contract(
      process.env.VERIFICATION_CONTRACT_ADDRESS!,
      VERIFICATION_ABI,
      this.signer
    );

    const tx = await contract.submitVerification(contentHash, zkProof);
    return await tx.wait();
  }

  async getVerificationStatus(contentHash: string) {
    const contract = new ethers.Contract(
      process.env.VERIFICATION_CONTRACT_ADDRESS!,
      VERIFICATION_ABI,
      this.provider
    );

    return await contract.verificationStatus(contentHash);
  }
} 
