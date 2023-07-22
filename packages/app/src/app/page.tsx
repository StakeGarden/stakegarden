import { ButtonLink, DisplayText, TitleText } from "@/src/ui";
import NounsGlasses from "../../public/assets/nouns/nouns-glasses.svg";

export default function Home() {
  return (
    <main className="py-32">
      <div className="space-y-24">
        <div className="max-w-5xl mx-auto space-y-4 text-center">
          <div className="flex items-center justify-center">
            <NounsGlasses />
          </div>
          <DisplayText>
            Stake your ETH in the most diversified gardens
          </DisplayText>
          <TitleText size={2} className="text-em-low">
            The garden is staked eth portfolios that are fully collateralize. Or
            you can create your own.{" "}
          </TitleText>
        </div>
        <ButtonLink href="/gardens" width="fit" className="mx-auto" size="lg">
          Explore Gardens
        </ButtonLink>
      </div>
    </main>
  );
}
