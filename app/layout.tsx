import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "QRJustapedia - QR codes for Justapedia",
  description: "Generate QR codes for Justapedia articles",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
