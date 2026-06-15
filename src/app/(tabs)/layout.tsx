import BottomNav from "@/components/BottomNav";

export default function TabsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative h-full">
      <main className="tab-panel">{children}</main>
      <BottomNav />
    </div>
  );
}
