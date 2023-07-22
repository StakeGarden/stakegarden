"use client";

import {
  BodyText,
  Button,
  ButtonLink,
  CaptionText,
  DisplayText,
  HeadingText,
  TitleText,
} from "@/src/ui";
import { useSearchParams } from "next/navigation";

export default function Home() {
  const searchParams = useSearchParams();
  const address = searchParams.get("address");

  return (
    <main className="max-w-2xl mx-auto py-16 transperant">
      <div className="space-y-6">
        <div className="text-center">
          <HeadingText size={3}>Stake in {address} garden</HeadingText>
        </div>
        <TitleText className="text-center">
          Stake ETH and receive sgETH which represents our
          <br />
          decentralized pool.
        </TitleText>
        <div className=" shadow-lg bg-white rounded-2xl space-y-2 border border-surface-25 p-5">
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
