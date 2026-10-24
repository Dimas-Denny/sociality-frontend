import { AppHeader } from "@/components/layout/app-header";

// Pages with the logo header (Home)
export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AppHeader />
      {/* Desktop: centered feed column like the Figma */}
      <main className="md:mx-auto md:max-w-150 md:pt-6">{children}</main>
    </>
  );
}
