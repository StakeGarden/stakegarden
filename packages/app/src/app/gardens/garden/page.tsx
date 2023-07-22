"use client";

import { Button, CaptionText, HeadingText, TitleText } from "@/src/ui";
import { useSearchParams } from "next/navigation";

export default function Garden() {
  const searchParams = useSearchParams();
  const address = searchParams.get("address");

  return (
    <main className="max-w-2xl py-16 mx-auto transperant">
      <div className="space-y-6">
        <div className="text-center">
          <HeadingText size={3}>Stake in {address} garden</HeadingText>
        </div>
        <TitleText className="text-center">
          Stake ETH and receive sgETH which represents our
          <br />
          decentralized pool.
        </TitleText>
        <div className="p-5 space-y-2 bg-white border shadow-lg rounded-2xl border-surface-25">
          <CaptionText>ETH Amount</CaptionText>
          <input
            className="w-full h-12 text-3xl"
            placeholder="0.0"
            type="number"
          />
          <div className="flex space-x-3">
            <Button width="fit" size="sm" action="secondary" className="">
              24%
            </Button>
            <Button width="fit" size="sm" action="secondary" className="">
              50%
            </Button>
            <Button width="fit" size="sm" action="secondary" className="">
              Max
            </Button>
          </div>
        </div>
        <Button width="full">Stake</Button>
      </div>
    </main>
  );
}
