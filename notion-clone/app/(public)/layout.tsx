import { EdgeStoreProvider } from "@/lib/edgestore";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <EdgeStoreProvider>
      <div className="h-full bg-background">{children}</div>
    </EdgeStoreProvider>
  );
}
