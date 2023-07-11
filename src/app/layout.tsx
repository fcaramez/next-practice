import Navbar from "@/components/Navbar";
import "./globals.css";
import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";

export const metadata: Metadata = {
  title: "Ecommerce website",
  description: "Ecommerce website",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="h-screen w-screen">
          <Navbar />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
