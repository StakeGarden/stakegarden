"use client";

import { BodyText, Button, HeadingSection, HeadingText } from "@/src/ui";
import { useEffect, useState } from "react";
import { encodeFunctionData, parseEther } from "viem";
import PoolFactoryABI from "@/src/abi/PoolFactory.json";
import { createPublicClient, http } from "viem";
import { gnosis } from "viem/chains";
import { useRouter } from "next/navigation";

// add ethereum type to window
declare global {
  interface Window {
    ethereum: any
  }
}

const client = createPublicClient({
  chain: gnosis,
  transport: http(
    "https://rpc.gnosischain.com/"
  ),
});

const Card = ({ children }: { children: any }) => (
  <div className="p-6 space-y-6 bg-white border rounded-xl border-surface-75">
    {children}
  </div>
);

const tokenImages = ["https://tokens.1inch.io/0xae7ab96520de3a18e5e111b5eaab095312d7fe84.png","https://tokens.1inch.io/0xae78736cd615f374d3085123a210448e74fc6393.png"]
const tokensArrayETH = ["stETH", "rETH"];
const tokensAddressesETH = [
  "0xddafbb505ad214d7b80b1f830fccc89b60fb7a83",
  "0x44fA8E6f47987339850636F88629646662444217",
];

const defaultTokenValue = (100 / tokensArrayETH.length).toString();

export default function Create() {
  const [values, setValues] = useState<string[]>(
    Array(tokensArrayETH.length).fill(defaultTokenValue)
  );
  const [calldatas, setCalldatas] = useState<(string | undefined)[]>(
    Array(tokensArrayETH.length).fill(undefined)
  );
  const router = useRouter();

  const [tokenName, setTokenName] = useState<string>();
  const [tokenSymbol, setTokenSymbol] = useState<string>();
  const [isValid, setIsValid] = useState(true);

  useEffect(() => {
    setIsValid(
      Boolean(values.reduce((acc, value) => Number(value) + acc, 0) === 100)
    );
  }, [values]);

  const createPool = async () => {
    if (!tokenName && !tokenSymbol) return;

    const weight = values.map((value) => parseEther(value).toString());

    const data = encodeFunctionData({
      abi: PoolFactoryABI,
      functionName: "createPool",
      // stakeTokens, weights, name, symbol
      // string[], string[], string, string
      args: [tokensAddressesETH, weight, tokenName, tokenSymbol],
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
            to: "0xc4FfDED34C56de709Be01A109e43EdB2c3bF8581", // Factory
            data,
          },
        ],
      })
      .then(async (txHash: string) => {
        const transaction = await client?.getTransactionReceipt({
          hash: txHash as `0x${string}`,
        });
        //setPoolAddress(transaction.logs[0].address);
        console.log(txHash)
        router.push("/gardens/garden?address=" + transaction.logs[0].address);
      })
      .catch((error: any) => console.error(error));
  };

  return (
    <main>
      <HeadingSection
        title="Create your garden"
        description="Your garden. Your rules"
      />
      <div className="space-y-10">
        <div className="space-y-2">
          <HeadingText>Details</HeadingText>
          <Card>
            <div className="space-y-2">
              <BodyText>Name</BodyText>
              <input
                type="text"
                placeholder="Zen"
                className="w-full p-3 border rounded-lg outline-none bg-surface-25"
                onChange={(e) => {
                  setTokenName(e.target.value);
                }}
                value={tokenName}
              />
            </div>
            <div className="space-y-2">
              <BodyText>Token symbol</BodyText>
              <input
                type="text"
                placeholder="zETH"
                className="w-full p-3 border rounded-lg outline-none bg-surface-25"
                onChange={(e) => {
                  setTokenSymbol(e.target.value);
                }}
                value={tokenSymbol}
              />
            </div>
          </Card>
        </div>
        <div className="space-y-2">
          <HeadingText>Tokens</HeadingText>
          <Card>
            <div className="divide-y divide-surface-25">
              {tokensArrayETH.map((name, index) => (
                <TokenRow
                  image={tokenImages[index]}
                  key={name}
                  title={name}
                  value={values[index]}
                  index={index}
                  setValue={(value: string) =>
                    setValues([
                      ...values.slice(0, index),
                      value,
                      ...values.slice(index + 1),
                  ])
                  }
                />
              ))}
            </div>
          </Card>
        </div>
        <Button
          action="primary"
          size="lg"
          width="full"
          onClick={createPool}
          disabled={!isValid || !tokenName || !tokenSymbol}
        >
          Create Portfolio
        </Button>
      </div>
    </main>
  );
}

const TokenRow = ({
  title,
  value,
  image,
  setValue,
}: {
    title: string;
    image: string;
  value: string;
  index: number;
  setValue: Function;
}) => (
  <div className="flex items-center justify-between py-2">
    <div className="flex items-center space-x-3">
      <img src={image} className="w-8 h-8 border rounded-full border-surface-75" alt="token logo" />
      <BodyText>{title}</BodyText>
    </div>
    <div className="flex items-center space-x-2">
      <input
        type="number"
        placeholder="0"
        value={value}
        className="w-20 h-8 p-3 border rounded-lg outline-none bg-surface-25"
        onChange={(e) => setValue(e.target.value)}
      />
      <Button
        size="icon"
        iconLeft="close"
        action="quaternary"
        onClick={() => setValue(0)}
      />
    </div>
  </div>
);
