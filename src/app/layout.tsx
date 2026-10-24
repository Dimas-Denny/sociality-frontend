import type { Metadata } from "next";
import Providers from "@/providers";
import { GlobalSheets } from "@/components/layout/global-sheets";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sociality",
  description: "Share your moments with the world",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {children}
          <GlobalSheets />
        </Providers>
      </body>
    </html>
  );
}
