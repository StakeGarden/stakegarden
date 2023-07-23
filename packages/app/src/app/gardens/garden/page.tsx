// @ts-nocheck
"use client";

import { BodyText, Button, ButtonLink, CaptionText, HeadingSection, TitleText } from "@/src/ui";
import { useSearchParams } from "next/navigation";
import {
  createPublicClient,
  encodeFunctionData,
  formatEther,
  fromHex,
  getContract,
  http,
  parseEther,
  toHex,
} from "viem";
import { mainnet } from "viem/chains";
import SwapNativeEthABI from "@/src/abi/SwapNativeEth.json";
import PoolABI from "@/src/abi/Pool.json";
import { useEffect, useState } from "react";

const client = createPublicClient({
  chain: mainnet,
  transport: http(
    "https://rpc.tenderly.co/fork/179c6093-0531-4a86-9847-c6c2915798e1"
  ),
});

const tokenImages = [
  "https://tokens.1inch.io/0xae7ab96520de3a18e5e111b5eaab095312d7fe84.png",
  "https://tokens.1inch.io/0xae78736cd615f374d3085123a210448e74fc6393.png"
];
const tokensArrayETH = ["stETH", "rETH"];

const tokensAddressesETH = [
  "0xae7ab96520de3a18e5e111b5eaab095312d7fe84",
  "0xae78736cd615f374d3085123a210448e74fc6393",
];

const nativeAddress = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE";

const swapETHContract = "0x8168855279A17F8E5e16db2c5CF16a65c15F9d1b";

const oneInchEndpoint = (amount: string, sell: string, buy: string, poolAddress: string) =>
  `https://api.1inch.io/v5.2/1/swap?amount=${amount}&src=${sell}&dst=${buy}&from=${swapETHContract}&receiver=${poolAddress}&slippage=50&disableEstimate=true&compatibility=true&allowPartialFill=false`;

export default function Garden() {
  const searchParams = useSearchParams();
  const address = searchParams.get("address");
  const [pool, setPool] = useState<any>({});

  useEffect(() => {
    const getPool = async (index: number) => {
      const contract = getContract({
        address: address,
        abi: PoolABI,
        publicClient: client
      });

      const name = await contract.read.name() 
      const symbol = await contract.read.symbol()
      const stakeToken1 = await contract.read.stakeTokens(["0"]) as unknown[]
      const stakeToken2 = await contract.read.stakeTokens(["1"]) as unknown[]
      const tokenWeight1 = await contract.read.weights([stakeToken1])
      const tokenWeight2 = await contract.read.weights([stakeToken2])
      setPool({name, address, symbol, stakeTokens: [stakeToken1, stakeToken2], tokenWeights: [tokenWeight1, tokenWeight2]})
    };
    
      getPool()

  }, [address]);
  
  // stake into pool 
  const [name, setName] = useState<string>("");
  const [symbol, setSymbol] = useState<string>("");
  const [balance, setBalance] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [tokenWeights, setTokenWeights] = useState<Record<string, string>>();
  const [success, setSuccess] = useState<boolean>(false);

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
            to: "0x3fFce9082555D0383d23E091f74FF39D2374605C", // SwapNativeETH
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
        setSuccess(true)
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
    <main>
      {success &&
          <div className="absolute px-6 py-3 mx-auto rounded-lg border border-primary-200 right-[42%] top-24 bg-primary-100 w-[300px]">
            <BodyText size={3} className="text-center"> Staked ✅</BodyText>
          </div>
      }
      <div className="space-y-12">

     
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
     {Object.keys(pool).length > 0 ? <div
              key={pool.address}
              className="p-5 space-y-8 bg-white border shadow-lg rounded-2xl border-surface-50"
            >
              <div className="flex justify-between">
                <TitleText size={2}>{pool.name}</TitleText>
                <ButtonLink
                  action="tertiary"
                  size="sm"
                  href={`/gardens/garden?address=${pool.address}`}
                >
                  Stake
                </ButtonLink>
              </div>
              <div className="space-y-4 divide-y divide-surface-25"> 
                {pool.stakeTokens?.length > 0 && pool.stakeTokens?.map((value, index) =>
                  <div key={value} className="flex justify-between">
                    <div className="flex items-center space-x-5">
                      <img
                        src={tokenImages[index]}
                        className="w-8 h-8 border rounded-full border-surface-75"
                        alt="token logo"
                      />
                      <BodyText>{tokensArrayETH[index]}</BodyText>
                    </div>
                    <BodyText>{pool.tokenWeights[index].toString().slice(0, 2)}%</BodyText>
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <div className="flex justify-between px-4 py-2 rounded-lg bg-surface-25">
                  <BodyText className="text-em-med">Variable APY</BodyText>
                  <BodyText>4.23%</BodyText>
                </div>
                <div className="flex justify-between px-4 py-2 rounded-lg bg-surface-25">
                  <BodyText className="text-em-med">Total ETH</BodyText>
                  <BodyText>23</BodyText>
                </div>
                <div className="flex justify-between px-4 py-2 rounded-lg bg-surface-25">
                  <BodyText className="text-em-med">Unique Owners</BodyText>
                  <BodyText>74</BodyText>
                </div>
                <div className="flex justify-between px-4 py-2 rounded-lg bg-surface-25">
                  <BodyText className="text-em-med">Contract address</BodyText>
                  <BodyText className="truncate max-w-[160px] md:max-w-xl">
                   {pool.address}
                  </BodyText>
                </div>
              </div>
        </div> : <Loading />}
        </div>
    </main>
  );
}

const Loading = () => <div className="p-5 bg-white rounded-lg shadow h-72 animate-pulse text-em-low"></div>

