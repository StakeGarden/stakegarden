"use client"

import { BodyText, ButtonLink, HeadingSection, TitleText } from "@/src/ui";
import { useEffect, useState } from "react";
import { createPublicClient, getContract, http } from "viem";
import { mainnet } from "viem/chains";
import PoolFactoryABI from "../../../abi/PoolFactory.json";
import PoolABI from "../../../abi/Pool.json";

const publicClient = createPublicClient({
  chain: mainnet,
  transport: http(
    "https://rpc.tenderly.co/fork/179c6093-0531-4a86-9847-c6c2915798e1"
  )
});

const tokenImages = [
  "https://tokens.1inch.io/0xae7ab96520de3a18e5e111b5eaab095312d7fe84.png",
  "https://tokens.1inch.io/0xae78736cd615f374d3085123a210448e74fc6393.png"
];
const tokensArrayETH = ["stETH", "rETH"];

export default function Portfolios() {
  const [pools, setPools] = useState<any[]>([]);

  useEffect(() => {
    const getPools = async (index: number) => {
      const newPools: `0x${string}`[] = [];

      try{
        const data = (await publicClient.readContract({
          address: "0x4F0399E887ED6D8A7573D9e118649605A8a40147",
          abi: PoolFactoryABI,
          functionName: "pools",
          args: [index.toString()]
        })) as `0x${string}`;
        
        newPools.push(data);
      } catch(e){
        return
      }

      const accounts = (await window.ethereum?.request({
        method: "eth_requestAccounts",
      })) as string[];

      const contractPromises = newPools.map(async (value: `0x${string}`) => {
        const contract = getContract({
          address: value,
          abi: PoolABI,
          publicClient
        });

        const name = await contract.read.name() 
        const symbol = await contract.read.symbol()
        const stakeToken1 = await contract.read.stakeTokens(["0"]) as unknown[]
        const stakeToken2 = await contract.read.stakeTokens(["1"]) as unknown[]
        const tokenWeight1 = await contract.read.weights([stakeToken1])
        const tokenWeight2 = await contract.read.weights([stakeToken2])
        const balance = await contract.read.balanceOf([accounts[0]])

        return {name, address: value, symbol, stakeTokens: [stakeToken1, stakeToken2], tokenWeights: [tokenWeight1, tokenWeight2], balance}
      });

      await Promise.all(contractPromises).then((responses: any) => setPools((currentPools) => [...currentPools, ...responses]))
    };
    
    for(let i = 0; i < 30; i++)
      getPools(i)

  }, []);

  console.log(pools)

  return (
    <main>
      <div className="space-y-6">
        <HeadingSection
          title="My Gardens"
          description="List of my portfolios"
          buttonText="Create Portfolio"
          href="/gardens/create"
        />
        <div className="space-y-6 md:space-y-12">
          {pools.length > 0 ? pools.map(pool => {
            console.log(pool)
          
            return (
            <div
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
                {pool.stakeTokens?.length > 0 && pool.stakeTokens?.map((value: string, index: number) =>
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
                  <BodyText className=" max-w-prose">
                  {pool.address}
                  </BodyText>
                </div>
              </div>
            </div>
          )}) : <LoadingCards/>}
          </div>
      </div>
    </main>
  );
}

const LoadingCards = () => <>
  <div className="p-5 bg-white rounded-lg h-72 animate-pulse text-em-low"></div>
  <div className="p-5 bg-white rounded-lg h-72 animate-pulse text-em-low"></div>
  <div className="p-5 bg-white rounded-lg h-72 animate-pulse text-em-low"></div>
</>