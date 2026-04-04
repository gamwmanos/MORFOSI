import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileStickyBar from "@/components/MobileStickyBar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Μόρφωση - Φροντιστήριο Μέσης Εκπαίδευσης",
  description: "Το κορυφαίο φροντιστήριο για την εκπαιδευτική σου επιτυχία.",
};



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="el"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col pt-0">
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
        <MobileStickyBar />
        <SpeedInsights />
      </body>
    </html>
  );
}
