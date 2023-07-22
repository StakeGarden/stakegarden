import Bambo from "@/public/assets/nouns/bambo.svg";

export default function GardensLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="max-w-2xl px-4 py-16 mx-auto">
      {children}
      <div className="absolute left-0 -bottom-64 -z-10 opacity-80">
        <Bambo />
      </div>
    </section>
  );
}