import { HeadingSection } from "@/src/ui";

export default function Portfolios() {
  return (
    <main>
      <div className="space-y-4">
        <HeadingSection
          title="My gardens"
          description="List of my portfolios"
          buttonText="Create Portfolio"
          href="/gardens/create"
        />
      </div>
    </main>
  );
}
