"use client";

import { useEffect, useState } from "react";
import { connectWallet } from "../metamask";
import { Button } from "../ui";

export const ConnectButton = () => {
  const [account, setAccount] = useState<string | undefined>();
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const getAddress = async () => {
      const accounts = (await window.ethereum?.request({
        method: "eth_requestAccounts",
      })) as string[];
      if (accounts) {
        console.log(accounts, accounts[0]);
        setAccount(accounts[0]);
      }
    };

    if (isConnected && !account) {
      getAddress();
    }
  });

  useEffect(() => {
    // Note that this event is emitted on page load.
    // If the array of accounts is non-empty, you're already
    // connected.
    window.ethereum?.on("accountsChanged", handleAccountsChanged);

    // eth_accounts always returns an array.
    function handleAccountsChanged(accounts: any) {
      if (accounts.length === 0) {
        // MetaMask is locked or the user has not connected any accounts.
        console.log("Please connect to MetaMask.");
        setAccount(undefined);
        setIsConnected(false);
      } else if (accounts[0] !== account) {
        // Reload your interface with accounts[0].
        setAccount(accounts[0]);
      }
    }
  });

  const onClickConnectWallet = () => {
    connectWallet().then(() => {
      setIsConnected(true);
    });
  };

  return (
    <Button onClick={onClickConnectWallet}>
      {account
        ? account.slice(0, 4) +
          "..." +
          account.slice(account.length - 4, account.length)
        : "Connect"}
    </Button>
  );
};
