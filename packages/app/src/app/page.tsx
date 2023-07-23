import { ButtonLink, DisplayText, TitleText } from "@/src/ui";
import NounsGlasses from "@/public/assets/nouns/nouns-glasses.svg";
import Garden from "@/public/assets/nouns/garden.svg";
import Curves from "@/public/assets/curves.svg";

export default function Home() {
  return (
    <main>
      <Curves className="top-0 hidden w-full md:inline-flex -z-20 md:absolute" />
      <div className="pt-16 space-y-24">
        <div className="max-w-3xl px-4 mx-auto space-y-4 text-center">
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
      <Garden className="absolute w-full -bottom-52 md:-bottom-20 -z-10" />
    </main>
  );
}
