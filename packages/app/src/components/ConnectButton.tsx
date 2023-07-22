"use client";

import { useEffect, useState } from "react";
import { connectWallet } from "../metamask";
import { Button } from "../ui";
import detectEthereumProvider from "@metamask/detect-provider";

export const ConnectButton = () => {
  const [hasProvider, setHasProvider] = useState<boolean | null>(null);
  const initialState = { accounts: [] };
  const [wallet, setWallet] = useState(initialState);

  useEffect(() => {
    const refreshAccounts = (accounts: any) => {
      if (accounts.length > 0) {
        updateWallet(accounts);
      } else {
        setWallet(initialState);
      }
    };

    const getProvider = async () => {
      const provider = await detectEthereumProvider({ silent: true });
      setHasProvider(Boolean(provider));

      if (provider) {
        const accounts = (await window.ethereum?.request({
          method: "eth_accounts"
        })) as string[];
        refreshAccounts(accounts);
        window.ethereum?.on("accountsChanged", refreshAccounts);
      }
    };

    getProvider();
    return () => {
      window.ethereum?.removeListener("accountsChanged", refreshAccounts);
    };
  }, []);

  const updateWallet = async (accounts: any) => {
    setWallet({ accounts });
  };

  const handleConnect = async () => {
    let accounts = await window.ethereum?.request({
      method: "eth_requestAccounts"
    });
    updateWallet(accounts);
  };

  const shortAddress = (account: string) =>
    `${account.slice(0, 4)}...${account.slice(
      account.length - 4,
      account.length
    )}`;

  return (
    <Button
      onClick={handleConnect}
      action={wallet.accounts.length > 0 ? "tertiary" : "primary"}
    >
      {wallet.accounts.length > 0 ? (
        <span>{shortAddress(wallet.accounts[0])}</span>
      ) : (
        "connect"
      )}
    </Button>
  );
};
