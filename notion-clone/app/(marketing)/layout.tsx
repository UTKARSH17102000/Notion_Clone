import { Navbar } from "./_components/Navbar";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-[100dvh] bg-background">
      <Navbar />
      {/* Offsets the fixed 64px navbar. The old value was pt-40, which pushed
          the hero halfway down the viewport. */}
      <div className="pt-16">{children}</div>
    </div>
  );
}
