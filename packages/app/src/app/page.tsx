import { ButtonLink, DisplayText, TitleText } from "@/src/ui";
import { ConnectButton } from "../components/ConnectButton";

export default function Home() {
  return (
    <main className="">
      <div className="">
        <ConnectButton />
        <div className="space-y-4">
          <div className="max-w-5xl mx-auto space-y-4 text-center">
            <DisplayText>
              Stake your ETH in the most diversified gardens
            </DisplayText>
            <TitleText size={2}>
              The garden is staked eth portfolios that are fully collateralize.
              Or you can create your own.{" "}
            </TitleText>
          </div>
          <ButtonLink href="/portfolios" width="fit" className="mx-auto">
            Explore Portfolios
          </ButtonLink>
        </div>
      </div>
    </main>
  );
}
