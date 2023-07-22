// @ts-nocheck
"use client";

import { Button, CaptionText, HeadingSection } from "@/src/ui";
import { useSearchParams } from "next/navigation";
import {
  createPublicClient,
  formatEther,
  fromHex,
  http,
  parseEther,
} from "viem";
import { polygon } from "viem/chains";
import PoolABI from "@/src/abi/Pool.json";
import { useEffect, useState } from "react";

const client = createPublicClient({
  chain: polygon,
  transport: http(
    "https://rpc.tenderly.co/fork/089c3934-4b2c-4e2c-942e-03cd2c6b580f"
  ),
});

const tokensArray = ["USDC", "WETH"];
const tokensAddresses = [
  "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
  "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619",
];

const nativeAddress = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE";
//const wethAddress = "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619";

const defaultTokenValue = (100 / tokensArray.length).toString();

const swapETHContract = "0x8168855279A17F8E5e16db2c5CF16a65c15F9d1b";

const oneInchEndpoint = (amount: string, sell: string, buy: string) =>
  `https://api.1inch.io/v5.0/137/swap?amount=${amount}&src=${sell}&dst=${buy}&from=${swapETHContract}&slippage=1&disableEstimate=true`;

export default function Garden() {
  const searchParams = useSearchParams();
  const address = searchParams.get("address");

  const [name, setName] = useState<string>("");
  const [symbol, setSymbol] = useState<string>("");
  const [balance, setBalance] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [tokenWeights, setTokenWeights] = useState<Record<string, string>>();

  const createStake = async () => {
    const newCalldatas: string[] = [];
    const fetchPromises = tokensAddresses.map(async (value) => {
      if (!tokenWeights || !amount) return;

      const tokenAmount =
        (parseEther(amount) * parseEther(tokenWeights[value])) /
        parseEther("100");

      const res = await fetch(
        oneInchEndpoint(tokenAmount.toString(), nativeAddress, value)
      );
      return await res.json();
    });

    await Promise.all(fetchPromises).then((responses) => {
      responses.forEach((value, index) => {
        newCalldatas[index] = value.tx.data;
      });
    });

    console.log("new call datas", newCalldatas);
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
      for (const value of tokensAddresses) {
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
