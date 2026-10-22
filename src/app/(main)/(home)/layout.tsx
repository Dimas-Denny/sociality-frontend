import { AppHeader } from "@/components/layout/app-header";

// Pages with the logo header
export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AppHeader />
      <main>{children}</main>
    </>
  );
}
