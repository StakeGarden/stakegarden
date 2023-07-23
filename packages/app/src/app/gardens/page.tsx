"use client"

import { BodyText, ButtonLink, HeadingSection, TitleText } from "@/src/ui";
import { useEffect, useState } from "react";
import { createPublicClient, getContract, http } from "viem";
import { mainnet } from "viem/chains";
import PoolFactoryABI from "../../abi/PoolFactory.json";
import PoolABI from "../../abi/Pool.json";

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

export default function Gardens() {
  const [pools, setPools] = useState();

  useEffect(() => {
    const getPools = async () => {
      const newPools: `0x${string}`[] = [];

      const data = (await publicClient.readContract({
        address: "0x5E87Eb8EB2DD334df0B0e3367CB53D9C435A20cC",
        abi: PoolFactoryABI,
        functionName: "pools",
        args: ["0"]
      })) as `0x${string}`;
      
      newPools.push(data);
        

      const contractPromises = newPools.map(async (value: `0x${string}`) => {
        const tokenWeights = [] 
        const contract = getContract({
          address: value,
          abi: PoolABI,
          publicClient
        });

        const name = await contract.read.name() 
        const symbol = await contract.read.symbol()
        const stakeToken = await contract.read.stakeTokens(["0"]) as unknown[]
        const tokenWeight = await contract.read.weights([stakeToken])

        return {name, symbol, stakeToken, tokenWeight}
      });

      await Promise.all(contractPromises).then((responses) => setPools(responses as any))
    };

    getPools()
  }, []);

  return (
    <main>
      <div className="space-y-6">
        <HeadingSection
          title="Staking gardens"
          description="List of all staking the portfolios"
          buttonText="Create Portfolio"
          href="/gardens/create"
        />
        <div className="space-y-6 md:space-y-12">
          {[1, 2].map(index => (
            <div
              key={index}
              className="p-5 space-y-8 bg-white border shadow-lg rounded-2xl border-surface-50"
            >
              <div className="flex justify-between">
                <TitleText size={2}>SG</TitleText>
                <ButtonLink
                  action="tertiary"
                  size="sm"
                  href="/gardens/garden?address=0x4df5aae5b1acdd48a4c2052e3f7d0efaddcb3d8c"
                >
                  Stake
                </ButtonLink>
              </div>
              <div className="space-y-4 divide-y divide-surface-25">
                <div className="flex justify-between">
                  <div className="flex items-center space-x-5">
                    <img
                      src={tokenImages[0]}
                      className="w-8 h-8 border rounded-full border-surface-75"
                      alt="token logo"
                    />
                    <BodyText>{tokensArrayETH[0]}</BodyText>
                  </div>
                  <BodyText>45%</BodyText>
                </div>
                <div className="flex justify-between">
                  <div className="flex items-center space-x-5">
                    <img
                      src={tokenImages[1]}
                      className="w-8 h-8 border rounded-full border-surface-75"
                      alt="token logo"
                    />
                    <BodyText>{tokensArrayETH[1]}</BodyText>
                  </div>
                  <BodyText>55%</BodyText>
                </div>
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
                  <BodyText>
                    0x4df5aae5b1acdd48a4c2052e3f7d0efaddcb3d8c
                  </BodyText>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
