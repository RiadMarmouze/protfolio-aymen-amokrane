import type { Metadata } from "next";
import { Footer } from "@/components/common/Footer/Footer";
import { Header } from "@/components/common/Header/Header";
import { Geist, Geist_Mono } from "next/font/google";
import "@/app/globals.css";
import { footerData } from "@/components/common/Footer/FooterData";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Aymen Amokrane",
  description: "The Brand Wiz & An Artful Thinker",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Header />
        {children}
        <Footer  data={footerData} />
      </body>
    </html>
  );
}
