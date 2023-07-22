export default function GardensLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return <section className="max-w-2xl px-4 py-16 mx-auto">{children}</section>;
}
