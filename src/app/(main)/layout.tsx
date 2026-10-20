import { AppHeader } from "@/components/layout/app-header";
import { BottomNav } from "@/components/layout/bottom-nav";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AppHeader />
      {/* bottom padding so the floating nav never covers content */}
      <main className="pb-28">{children}</main>
      <BottomNav />
    </>
  );
}
