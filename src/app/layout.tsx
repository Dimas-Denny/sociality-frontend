import type { Metadata } from "next";
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
      <body>{children}</body>
    </html>
  );
}
