import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import Header from "@/app/components/Header";
import localFont from "next/font/local";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const lucideSans = localFont({
  src: "../public/fonts/myfont.woff2",
  variable: "--font-lucida",
  weight: "400",
  display: "swap",
});

export const segoeui = localFont({
  src: [
    {
      path: "../public/fonts/segoeui.woff2",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-segoe-ui", // optional CSS variable
  display: "swap", // recommended
});
export const googleSans = localFont({
  src: "../public/fonts/another.woff2",
  variable: "--font-google-sans",
  weight: "400",
  style: "normal",
  display: "swap",
});

export const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Private cloud storage",
  description: "This is my own custom private cloud storage",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-google-analytics-opt-out="">
      <body
        className={`${geistSans.variable} ${segoeui.variable} ${geistMono.variable} ${inter.variable} ${lucideSans.variable} ${googleSans.variable} antialiased`}
      >
        <Header />
        <main>{children}</main>
      </body>
    </html>
  );
}
