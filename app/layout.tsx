import type { Metadata } from "next";
import { Noto_Serif, Supermercado_One } from "next/font/google";
import { Geist, Geist_Mono, Ubuntu, Roboto, Inter } from "next/font/google";
import localFont from "next/font/local";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import Header from "@/app/components/Header";
import Footer from "./components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "700", "900"],
  variable: "--font-roboto",
  display: "swap",
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

const ubuntu = Ubuntu({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-ubuntu",
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
  variable: "--font-segoe-ui",
  display: "swap",
});

export const googleSans = localFont({
  src: "../public/fonts/another.woff2",
  variable: "--font-google-sans",
  weight: "400",
  style: "normal",
  display: "swap",
});
export const verdana = localFont({
  src: "../public/fonts/Verdana.woff2",
  variable: "--font-verdana",
  weight: "400",
  style: "normal",
  display: "swap",
});

export const notoSerif = Noto_Serif({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"], // adjust as needed
  variable: "--font-noto-serif",
  display: "swap",
});

const supermercado = Supermercado_One({
  subsets: ["latin"],
  weight: "400", // only available weight
  variable: "--font-supermercado",
  display: "swap",
});

export const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});
export const metadata: Metadata = {
  title: {
    default: "Kosha - Your Private Cloud Storage Solution",
    template: "%s | Kosha",
  },
  description:
    "Kosha is a secure, private cloud storage platform designed for personal data management, file syncing, and privacy-first storage solutions.",

  keywords: [
    "Kosha",
    "private cloud storage",
    "secure file storage",
    "self hosted cloud",
    "personal cloud",
    "file management",
  ],

  authors: [{ name: "Kijauk" }],
  creator: "Kijauk",

  metadataBase: new URL("https://kosha.cloudkinshuk.in"),

  icons: {
    icon: [{ url: "/logo.svg", type: "image/svg+xml" }],
    shortcut: "/logo.svg",
    apple: "/logo.svg",
  },

  openGraph: {
    title: "Kosha - Your Private Cloud Storage Solution",
    description:
      "A privacy-first custom cloud storage solution to securely store, manage, and access your files anywhere.",
    url: "https://kosha.cloudkinhuk.in",
    siteName: "Kosha",
    images: [
      {
        url: "/logo.svg", // MUST be SVG if you want consistency
        width: 1200,
        height: 630,
        alt: "Kosha Cloud Storage",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Kosha - Your Private Cloud Storage Solution",
    description: "Secure and private cloud storage built for personal use.",
    images: ["/logo.svg"],
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" data-google-analytics-opt-out="">
        <body
          className={`${geistSans.variable} ${ubuntu.variable} ${notoSerif.variable} ${roboto.variable} ${verdana.variable} ${segoeui.variable} ${geistMono.variable} ${inter.variable} ${lucideSans.variable} ${googleSans.variable} ${supermercado.variable}  antialiased`}
        >
          <Header />
          <main>{children}</main>
          <Footer />
        </body>
      </html>
    </ClerkProvider>
  );
}
