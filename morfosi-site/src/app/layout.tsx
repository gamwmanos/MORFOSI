import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileStickyBar from "@/components/MobileStickyBar";
import { client } from "@/sanity/client";

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



import LayoutWrapper from "@/components/LayoutWrapper";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await client.fetch(`*[_type == "siteSettings"][0]{ contactPhone }`);
  const phone = settings?.contactPhone || "210 506 3610";
  return (
    <html
      lang="el"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col pt-0">
        <LayoutWrapper
          header={<Header contactPhone={phone} />}
          footer={<Footer />}
          mobileBar={<MobileStickyBar contactPhone={phone} />}
        >
          {children}
        </LayoutWrapper>
        <SpeedInsights />
      </body>
    </html>
  );
}
