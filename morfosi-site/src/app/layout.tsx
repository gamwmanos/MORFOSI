import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileStickyBar from "@/components/MobileStickyBar";
import CookieConsent from "@/components/CookieConsent";
import { client } from "@/sanity/client";
import Script from "next/script";

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
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-LQM2YQEMFS" strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){window.dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-LQM2YQEMFS');
          `}
        </Script>
        <LayoutWrapper
          header={<Header contactPhone={phone} />}
          footer={<Footer />}
          mobileBar={<MobileStickyBar contactPhone={phone} />}
        >
          {children}
        </LayoutWrapper>
        <CookieConsent />
        <SpeedInsights />
      </body>
    </html>
  );
}
