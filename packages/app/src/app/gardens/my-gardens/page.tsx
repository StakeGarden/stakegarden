import { HeadingSection } from "@/src/ui";

export default function Portfolios() {
  return (
    <main className="max-w-2xl py-32 mx-auto">
      <div className="space-y-4">
        <HeadingSection
          title="My gardens"
          description="List of my portfolios"
          buttonText="create portfolio"
          href="/gardens/create"
        />
      </div>
    </main>
  );
}
