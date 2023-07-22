"use client";

import { BodyText, Button, HeadingSection, HeadingText } from "@/src/ui";
import { useEffect, useState } from "react";
import { encodeFunctionData, parseEther } from "viem";
import PoolFactoryABI from "@/src/abi/PoolFactory.json";
import { createPublicClient, http } from "viem";
import { mainnet } from "viem/chains";
import { useRouter } from "next/navigation";

const client = createPublicClient({
  chain: mainnet,
  transport: http(
    "https://rpc.tenderly.co/fork/179c6093-0531-4a86-9847-c6c2915798e1"
  ),
});

const Card = ({ children }: { children: any }) => (
  <div className="p-6 space-y-6 bg-white border rounded-xl border-surface-75">
    {children}
  </div>
);

//const tokensArray = ["stEth", "rEth", "wEth", "saEth"];
// const tokensArray = ["USDC", "WETH"];
// const tokensAddresses = [
//   "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
//   "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619",
// ];

const tokensArrayETH = ["stETH", "RPL"];
const tokensAddressesETH = [
  "0xae7ab96520de3a18e5e111b5eaab095312d7fe84",
  "0xae78736cd615f374d3085123a210448e74fc6393",
];

// const nativeAddress = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE";

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
            to: "0x5E87Eb8EB2DD334df0B0e3367CB53D9C435A20cC", //<recipient address> // Required except during contract publications.
            data,
          },
        ],
      })
      .then(async (txHash) => {
        const transaction = await client?.getTransactionReceipt({
          hash: txHash as `0x${string}`,
        });
        //setPoolAddress(transaction.logs[0].address);
        console.log(txHash)
        router.push("/gardens/garden?address=" + transaction.logs[0].address);
      })
      .catch((error) => console.error(error));
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
            {/* <div className="space-y-2">
              <BodyText>Description</BodyText>
              <input
                type="text"
                placeholder="zETH is a zen portfolio ..."
                className="w-full p-3 border rounded-lg outline-none bg-surface-25"
              />
            </div> */}
          </Card>
        </div>
        <div className="space-y-2">
          <HeadingText>Tokens</HeadingText>
          <Card>
            <div className="divide-y divide-surface-25">
              {tokensArrayETH.map((token, index) => (
                <TokenRow
                  key={token}
                  token={token}
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
          Create garden
        </Button>
      </div>
    </main>
  );
}

const TokenRow = ({
  token,
  value,
  setValue,
}: {
  token: any;
  value: string;
  index: number;
  setValue: Function;
}) => (
  <div className="flex items-center justify-between py-2">
    <div className="flex items-center space-x-3">
      <div className="w-8 h-8 rounded-full bg-primary-100"></div>
      <BodyText>{token}</BodyText>
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
