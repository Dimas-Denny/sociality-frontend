import type { Metadata } from "next";
import Providers from "@/providers";
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
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
