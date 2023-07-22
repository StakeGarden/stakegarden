import { BodyText, ButtonLink, HeadingSection, TitleText } from "@/src/ui";

export default function Gardens() {
  return (
    <main>
      <div className="space-y-6">
        <HeadingSection
          title="Staking gardens"
          description="List of all staking the portfolios"
          buttonText="create portfolio"
          href="/gardens/create"
        />
        <div className="p-5 space-y-8 bg-white border shadow-lg rounded-2xl border-surface-25">
          <div className="flex justify-between">
            <TitleText size={2}>SG</TitleText>
            <ButtonLink
              action="tertiary"
              size="sm"
              href="/garden?address=0x123456789"
            >
              Open
            </ButtonLink>
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
            <div className="flex justify-between px-4 py-2 bg-surface-75 rounded-xl">
              <BodyText>Variable APY</BodyText>
              <BodyText>100%</BodyText>
            </div>
            <div className="flex justify-between px-4 py-2 bg-surface-75 rounded-xl">
              <BodyText>Total ETH</BodyText>
              <BodyText>30</BodyText>
            </div>
            <div className="flex justify-between px-4 py-2 bg-surface-75 rounded-xl">
              <BodyText>Unique Owners</BodyText>
              <BodyText>30</BodyText>
            </div>
            <div className="flex justify-between px-4 py-2 bg-surface-75 rounded-xl">
              <BodyText>Contract address</BodyText>
              <BodyText>0x123456789</BodyText>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
