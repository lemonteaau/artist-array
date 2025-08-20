import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/app/globals.css";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import Script from "next/script";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { type Locale, locales } from "@/i18n.config";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";

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
    process.env.NEXT_PUBLIC_APP_URL || "https://artistarray.com"
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

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: { locale: Locale };
}>) {
  const { locale } = await params;
  if (!hasLocale(locales, locale)) notFound();

  let messages;

  try {
    messages = await getMessages();
  } catch (error) {
    console.error(error);
    notFound();
  }

  return (
    <html lang={locale} className="scroll-smooth" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <NextIntlClientProvider locale={locale} messages={messages}>
            <div className="flex-1">
              <div className="fixed inset-0 -z-10 h-full w-full bg-background">
                <div className="absolute h-full w-full bg-[radial-gradient(#e5e7eb_1px,transparent_2px)] [background-size:24px_24px] dark:bg-[radial-gradient(#374151_1px,transparent_2px)] opacity-65 dark:opacity-20"></div>
              </div>
              <Navbar />
              <main className="container mx-auto px-4 py-8">{children}</main>
            </div>
            <Footer />
            <Toaster />
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
      <Script
        defer
        src="https://umami.lemontea.xyz/script.js"
        data-website-id="7a89e33e-1d8b-4f4a-825b-439689fa6de7"
      />
    </html>
  );
}
