import Bonsai from "@/public/assets/nouns/bonsai.svg";
import { londrina } from "@/src/app/fonts";

export default function Logo() {
  return (
    <div className="flex items-center space-x-2">
      <Bonsai />
      <div
        className={`text-2xl font-bold ${londrina.className} whitespace-nowrap`}
      >
        <span className="hidden md:block">Stake Garden</span>
      </div>
    </div>
  );
}
