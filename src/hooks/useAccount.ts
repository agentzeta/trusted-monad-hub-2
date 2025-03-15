import { useState, useEffect, useCallback } from "react";
import { ethers } from "ethers";

export function useAccount() {
  const [account, setAccount] = useState<string | null>(null);
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);
  
  useEffect(() => {
    // Check if already connected on component mount
    const checkConnection = async () => {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const accounts = await provider.listAccounts();
        
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          setProvider(provider);
        }
      }
    };
    
    checkConnection();
    
    // Listen for account changes
    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        setAccount(null);
        setProvider(null);
      } else {
        setAccount(accounts[0]);
      }
    };
    
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
    }
    
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      }
    };
  }, []);
  
  const connect = useCallback(async () => {
    if (!window.ethereum) {
      throw new Error("Ethereum wallet not found");
    }
    
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const accounts = await provider.send("eth_requestAccounts", []);
    
    if (accounts.length > 0) {
      setAccount(accounts[0]);
      setProvider(provider);
    }
    
    return accounts[0];
  }, []);
  
  const disconnect = useCallback(() => {
    setAccount(null);
    setProvider(null);
    return Promise.resolve();
  }, []);
  
  return { account, provider, connect, disconnect };
}
