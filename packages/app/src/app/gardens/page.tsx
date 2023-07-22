import {
  BodyText,
  ButtonLink,
  DisplayText,
  HeadingText,
  TitleText,
} from "@/src/ui";

export default function Home() {
  return (
    <main className="max-w-2xl mx-auto py-16 transperant">
      <div className="space-y-6">
        <div className="flex justify-between">
          <HeadingText size={3}>Staking gardens</HeadingText>
          <ButtonLink href="/create-garden" width="fit">
            Create Garden
          </ButtonLink>
        </div>
        <TitleText>List of all staking the portfolios</TitleText>
        <div className=" shadow-lg bg-white rounded-2xl space-y-8 border border-surface-25 p-5">
          <div className="flex justify-between">
            <TitleText size={2}>SG</TitleText>
            <ButtonLink href="/garden?address=0x123456789">Open</ButtonLink>
          </div>
          <BodyText>
            Stake any amount of ETH, get daily staking rewards and use your
            stETH across the DeFi ecosystem and L2.
          </BodyText>
          <div className="space-y-2">
            <div className="flex justify-between">
              <BodyText>Lido</BodyText>
              <BodyText>45%</BodyText>
            </div>
            <div className="flex justify-between">
              <BodyText>Lido</BodyText>
              <BodyText>45%</BodyText>
            </div>
            <div className="flex justify-between">
              <BodyText>Lido</BodyText>
              <BodyText>45%</BodyText>
            </div>
          </div>
          <div className="space-y-2">
            <div className="  bg-surface-75 rounded-xl flex justify-between py-2 px-4">
              <BodyText>Variable APY</BodyText>
              <BodyText>100%</BodyText>
            </div>
            <div className="  bg-surface-75 rounded-xl flex justify-between py-2 px-4">
              <BodyText>Total ETH</BodyText>
              <BodyText>30</BodyText>
            </div>
            <div className="  bg-surface-75 rounded-xl flex justify-between py-2 px-4">
              <BodyText>Unique Owners</BodyText>
              <BodyText>30</BodyText>
            </div>
            <div className="  bg-surface-75 rounded-xl flex justify-between py-2 px-4">
              <BodyText>Contract address</BodyText>
              <BodyText>0x123456789</BodyText>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
