"use client";

import { useEffect, useState } from "react";
import { connectWallet } from "../metamask";
import { Button } from "../ui";

export const ConnectButton = () => {
  const [account, setAccount] = useState<string>();
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
