import { MetaMaskSDK } from "@metamask/sdk";

const MMSDK = new MetaMaskSDK({ dappMetadata: { name: "Stake Garden" } });

export const connectWallet = () => {
  return MMSDK.connect()
    .then(async (accounts: any) => {
      console.log("MetaMask SDK is connected", accounts);
      return;
    })
    .catch((error: any) => {
      console.error(error);
    });
};
