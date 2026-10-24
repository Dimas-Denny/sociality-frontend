import { BottomNav } from "@/components/layout/bottom-nav";

// Shared by every page that shows the bottom navigation
export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* bottom padding so the floating nav never covers content */}
      <div className="pb-28">{children}</div>
      <BottomNav />
    </>
  );
}
