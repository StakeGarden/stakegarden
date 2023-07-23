// @ts-nocheck
"use client";

import { Button, CaptionText, HeadingSection } from "@/src/ui";
import { useSearchParams } from "next/navigation";
import {
  createPublicClient,
  encodeFunctionData,
  formatEther,
  fromHex,
  http,
  parseEther,
  toHex,
} from "viem";
import { gnosis } from "viem/chains";
import SwapNativeEthABI from "@/src/abi/SwapNativeEth.json";
import PoolABI from "@/src/abi/Pool.json";
import { useEffect, useState } from "react";

const client = createPublicClient({
  chain: gnosis,
  transport: http(
    "https://rpc.gnosischain.com/"
  ),
});

const tokensArrayETH = ["stETH", "RPL"];
const tokensAddressesETH = [
  "0xddafbb505ad214d7b80b1f830fccc89b60fb7a83",
  "0x44fA8E6f47987339850636F88629646662444217",
];

const nativeAddress = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE";
//const wethAddress = "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619";

const swapETHContract = "0x8168855279A17F8E5e16db2c5CF16a65c15F9d1b";

// https://api.1inch.io/v5.2/1/swap?amount=1000000000000000000&src=0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE&dst=0xae7ab96520de3a18e5e111b5eaab095312d7fe84&from=0x24509E1F87eDD8fC7c00f0738f45bC70aCe8BD4B&slippage=50&disableEstimate=true&receiver=0x4df5aae5b1acdd48a4c2052e3f7d0efaddcb3d8c&compatibility=true&allowPartialFill=false
const oneInchEndpoint = (amount: string, sell: string, buy: string, poolAddress: string) =>
  `https://api.1inch.io/v5.2/100/swap?amount=${amount}&src=${sell}&dst=${buy}&from=${swapETHContract}&receiver=${poolAddress}&slippage=50&disableEstimate=true&compatibility=true&allowPartialFill=false`;

export default function Garden() {
  const searchParams = useSearchParams();
  const address = searchParams.get("address");

  const [name, setName] = useState<string>("");
  const [symbol, setSymbol] = useState<string>("");
  const [balance, setBalance] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [tokenWeights, setTokenWeights] = useState<Record<string, string>>();

  const createStake = async () => {
    let newAmount = "0"
    const newCalldatas: string[] = [];
    const fetchPromises = tokensAddressesETH.map(async (value) => {
      if (!tokenWeights || !amount) return;

      const tokenAmount =
        (parseEther(amount) * parseEther(tokenWeights[value])) /
        parseEther("100");

      const res = await fetch(
        oneInchEndpoint(tokenAmount.toString(), nativeAddress, value, address)
      );
      return await res.json();
    });

    await Promise.all(fetchPromises).then((responses) => {
      responses.forEach((value, index) => {
        newCalldatas[index] = value.tx.data;
        
        newAmount = (BigInt(newAmount) + BigInt(value.tx.value)).toString();
      });
    });


    const data = encodeFunctionData({
      abi: SwapNativeEthABI,
      functionName: "executeSwaps",
      // stakeTokens, weights, name, symbol
      // string, string[]
      args: [address, newCalldatas],
    });


    const accounts = (await window.ethereum?.request({
      method: "eth_requestAccounts",
    })) as string[];

    window.ethereum
      ?.request({
        method: "eth_sendTransaction",
        // The following sends an EIP-1559 transaction. Legacy transactions are also supported.
        params: [
          {
            from: accounts[0], // The user's active address.
            to: "0xA5ec07bA6Fb90424F17Cf40e630C5452055282B2", // SwapNativeETH
            value: newAmount,
            data,
            gasLimit: toHex(90000000000)
          },
        ],
      })
      .then(async (txHash) => {
        const transaction = await client?.getTransactionReceipt({
          hash: txHash as `0x${string}`,
        });
        //setPoolAddress(transaction.logs[0].address);
        console.log(txHash)
        console.log(transaction)
      })
      .catch((error) => console.error(error));
  };

  useEffect(() => {
    let newTokenWeights = {};
    const readContract = async () => {
      const newName = await client.readContract({
        address: address as `0x${string}`,
        abi: PoolABI,
        functionName: "name",
      });
      const newSymbol = await client.readContract({
        address: address as `0x${string}`,
        abi: PoolABI,
        functionName: "symbol",
      });
      for (const value of tokensAddressesETH) {
        const newWeights = await client.readContract({
          address: address as `0x${string}`,
          abi: PoolABI,
          functionName: "weights",
          args: [value],
        });
        newTokenWeights = {
          ...newTokenWeights,
          [value]: formatEther(newWeights as bigint),
        };
      }

      setTokenWeights(newTokenWeights);
      setName(newName as string);
      setSymbol(newSymbol as string);
    };

    const getBalance = async () => {
      const accounts = (await window.ethereum?.request({
        method: "eth_requestAccounts",
      })) as string[];

      const walletBalance = (await window.ethereum?.request({
        method: "eth_getBalance",
        params: [accounts[0], "latest"],
      })) as `0x${string}`;
      setBalance(formatEther(fromHex(walletBalance, "bigint")));
    };

    readContract();
    getBalance();
  }, [address, name]);

  return (
    <main className="max-w-2xl py-16 mx-auto transperant">
      <div className="space-y-6">
        <HeadingSection
          title={`Stake in ${name} garden`}
          description={` Stake ETH and receive ${symbol} which represents our decentralized pool.`}
        />
        <div className="p-5 space-y-2 bg-white border shadow-lg rounded-2xl border-surface-25">
          <CaptionText>ETH Amount</CaptionText>
          <input
            className="w-full h-12 text-3xl"
            placeholder="0.0"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <div className="flex space-x-3">
            <Button
              width="fit"
              size="sm"
              action="secondary"
              onClick={() => setAmount(formatEther(parseEther(balance) / 4n))}
            >
              25%
            </Button>
            <Button
              width="fit"
              size="sm"
              action="secondary"
              onClick={() => setAmount(formatEther(parseEther(balance) / 2n))}
            >
              50%
            </Button>
            <Button
              width="fit"
              size="sm"
              action="secondary"
              onClick={() => setAmount(balance)}
            >
              Max
            </Button>
          </div>
        </div>
        <Button
          width="full"
          onClick={createStake}
          disabled={!tokenWeights || !amount}
        >
          Stake
        </Button>
      </div>
    </main>
  );
}
