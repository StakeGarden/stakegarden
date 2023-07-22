import { ButtonLink, DisplayText, TitleText } from "@/src/ui";

export default function Home() {
  return (
    <main className="py-32">
      <div className="space-y-4">
        <div className="max-w-5xl mx-auto space-y-4 text-center">
          <DisplayText>
            Stake your ETH in the most diversified gardens
          </DisplayText>
          <TitleText size={2}>
            The garden is staked eth portfolios that are fully collateralize. Or
            you can create your own.{" "}
          </TitleText>
        </div>
        <ButtonLink href="/gardens" width="fit" className="mx-auto">
          Explore Gardens
        </ButtonLink>
      </div>
    </main>
  );
}
