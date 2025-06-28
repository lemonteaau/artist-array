import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Toaster } from "sonner";
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
  title: {
    default: "Artist Array",
    template: "%s | Artist Array",
  },
  description: "Share and discover AI art prompts and techniques",
  keywords: [
    "AI art",
    "prompts",
    "artificial intelligence",
    "art generation",
    "creative AI",
  ],
  authors: [{ name: "Artist Array Team" }],
  creator: "Artist Array",
  publisher: "Artist Array",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "https://artist-array.vercel.app"
  ),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "Artist Array",
    description: "Share and discover AI art prompts and techniques",
    siteName: "Artist Array",
  },
  twitter: {
    card: "summary_large_image",
    title: "Artist Array",
    description: "Share and discover AI art prompts and techniques",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
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
        <div className="container mx-auto px-4 py-8">
          <Navbar />
          {children}
        </div>
        <Toaster richColors />
      </body>
      <Script
        defer
        src="https://umami.lemontea.xyz/script.js"
        data-website-id="7a89e33e-1d8b-4f4a-825b-439689fa6de7"
      />
    </html>
  );
}
