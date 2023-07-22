"use client";

import { BodyText, Button, HeadingSection, HeadingText } from "@/src/ui";
import { useState } from "react";
import { encodeFunctionData, parseEther } from "viem";
import PoolFactoryABI from "@/src/abi/PoolFactory.json";
import { createPublicClient, http } from "viem";
import { polygon } from "viem/chains";
import { useRouter } from "next/navigation";

const client = createPublicClient({
  chain: polygon,
  transport: http(
    "https://rpc.tenderly.co/fork/089c3934-4b2c-4e2c-942e-03cd2c6b580f"
  ),
});

const Card = ({ children }: { children: any }) => (
  <div className="p-6 space-y-6 bg-white border rounded-xl border-surface-75">
    {children}
  </div>
);

//const tokensArray = ["stEth", "rEth", "wEth", "saEth"];
const tokensArray = ["USDC", "WETH"];
const tokensAddresses = [
  "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
  "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619",
];

// const nativeAddress = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE";
const wethAddress = "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619";

const defaultTokenValue = (100 / tokensArray.length).toString();

const swapETHContract = "0x8168855279A17F8E5e16db2c5CF16a65c15F9d1b";

const oneInchEndpoint = (amount: string, sell: string, buy: string) =>
  `https://api.1inch.io/v5.0/137/swap?amount=${amount}&src=${sell}&dst=${buy}&from=${swapETHContract}&slippage=1&disableEstimate=true`;

export default function Create() {
  const [values, setValues] = useState<string[]>(
    Array(tokensArray.length).fill(defaultTokenValue)
  );
  const [calldatas, setCalldatas] = useState<(string | undefined)[]>(
    Array(tokensArray.length).fill(undefined)
  );
  const router = useRouter();

  const [poolAddress, setPoolAddress] = useState<string>();
  const [tokenName, setTokenName] = useState<string>();
  const [tokenSymbol, setTokenSymbol] = useState<string>();
  console.log(poolAddress);

  const createStake = async () => {
    const newCalldatas: string[] = [];
    const fetchPromises = tokensAddresses.map(async (value, index) => {
      const res = await fetch(
        oneInchEndpoint("1000000000000000", wethAddress, value)
      );
      return await res.json();
    });

    await Promise.all(fetchPromises).then((responses) => {
      responses.forEach((value, index) => {
        newCalldatas[index] = value.tx.data;
      });
      setCalldatas(newCalldatas);
    });

    console.log(newCalldatas);
  };

  const createPool = async () => {
    if (!tokenName && !tokenSymbol) return;

    const weight = values.map((value) => parseEther(value).toString());

    const data = encodeFunctionData({
      abi: PoolFactoryABI,
      functionName: "createPool",
      // stakeTokens, weights, name, symbol
      // string[], string[], string, string
      args: [tokensAddresses, weight, tokenName, tokenSymbol],
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
            to: "0x5BEBd2841FAaeCF9de2F1ebbA29C9573Fc38DEF0", //<recipient address> // Required except during contract publications.
            data,
          },
        ],
      })
      .then(async (txHash) => {
        const transaction = await client?.getTransactionReceipt({
          hash: txHash as `0x${string}`,
        });
        //setPoolAddress(transaction.logs[0].address);
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
              {tokensArray.map((token, index) => (
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
          disabled={!!poolAddress}
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
