import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { Navbar } from "@/components/navbar";
import Script from "next/script";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
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
      locale: locale === "zh" ? "zh_CN" : locale === "ja" ? "ja_JP" : "en_US",
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
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  // Ensure that the incoming locale is valid
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale} className="scroll-smooth">
      <body>
        <NextIntlClientProvider messages={messages}>
          <div className="flex-1">
            <div className="fixed inset-0 -z-10 h-full w-full bg-background">
              <div className="absolute h-full w-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] dark:bg-[radial-gradient(#1f2937_1px,transparent_1px)] opacity-20"></div>
            </div>
            <Navbar />
            <main className="container mx-auto px-4 py-8">{children}</main>
          </div>
        </NextIntlClientProvider>
        <Script
          defer
          src="https://umami.lemontea.xyz/script.js"
          data-website-id="7a89e33e-1d8b-4f4a-825b-439689fa6de7"
        />
      </body>
    </html>
  );
}
