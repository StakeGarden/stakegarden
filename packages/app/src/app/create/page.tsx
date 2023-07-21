import { BodyText, Button, DisplayText, HeadingText } from "@/src/ui";

const Card = ({ children }: { children: any }) => (
  <div className="p-6 space-y-6 bg-white border rounded-xl border-surface-75">
    {children}
  </div>
);
export default function Create() {
  return (
    <main className="max-w-2xl px-5 py-32 mx-auto">
      <div className="space-y-10">
        <div className="max-w-5xl mx-auto space-y-4 text-center">
          <DisplayText>Create your garden</DisplayText>
          <HeadingText className="text-em-low">
            Your garden. Your rules
          </HeadingText>
        </div>
        <div className="space-y-2">
          <HeadingText>Details</HeadingText>
          <Card>
            <div className="space-y-2">
              <BodyText>Name</BodyText>
              <input
                type="text"
                placeholder="Zen"
                className="w-full p-3 border rounded-lg outline-none bg-surface-25"
              />
            </div>
            <div className="space-y-2">
              <BodyText>Token symbol</BodyText>
              <input
                type="text"
                placeholder="zETH"
                className="w-full p-3 border rounded-lg outline-none bg-surface-25"
              />
            </div>
            <div className="space-y-2">
              <BodyText>Description</BodyText>
              <input
                type="text"
                placeholder="zETH is a zen portfolio ..."
                className="w-full p-3 border rounded-lg outline-none bg-surface-25"
              />
            </div>
          </Card>
        </div>
        <div className="space-y-2">
          <HeadingText>Tokens</HeadingText>
          <Card>
            <div className="divide-y divide-surface-25">
              {["stEth", "rEth", "wEth", "saEth"].map((token) => (
                <TokenRow key={token} token={token} />
              ))}
            </div>
          </Card>
        </div>
        <Button action="primary" size="lg" width="full">
          Create portfolio
        </Button>
      </div>
    </main>
  );
}

const TokenRow = ({ token }: { token: any }) => (
  <div className="flex items-center justify-between py-2">
    <div className="flex items-center space-x-3">
      <div className="w-8 h-8 rounded-full bg-primary-100"></div>
      <BodyText>{token}</BodyText>
    </div>
    <div className="flex items-center space-x-2">
      <input
        type="text"
        placeholder="25"
        value={25}
        className="w-20 h-8 p-3 border rounded-lg outline-none bg-surface-25"
      />
      <Button size="icon" iconLeft="close" action="quaternary" />
    </div>
  </div>
);
