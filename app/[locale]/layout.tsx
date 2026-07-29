import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { ThemeProvider } from "next-themes";
import { routing } from "@/i18n/routing";
import { siteConfig } from "@/data/site-config";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PortfolioDataProvider } from "@/context/PortfolioDataContext";
import type { Metadata } from "next";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export async function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const loc = locale as "fr" | "en";

  return {
    title: siteConfig.title[loc],
    description: siteConfig.description[loc],
    keywords: [
      "architecture",
      "portfolio",
      "Lamia Akoubache",
      "design",
      "architect",
      "Master 2",
      loc === "fr" ? "architecte" : "architect",
      loc === "fr" ? "conception architecturale" : "architectural design",
    ],
    authors: [{ name: siteConfig.name }],
    openGraph: {
      title: siteConfig.title[loc],
      description: siteConfig.description[loc],
      url: siteConfig.url,
      siteName: siteConfig.name,
      locale: loc === "fr" ? "fr_FR" : "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: siteConfig.title[loc],
      description: siteConfig.description[loc],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      forcedTheme="dark"
      enableSystem={false}
      disableTransitionOnChange
    >
      <NextIntlClientProvider messages={messages}>
        <PortfolioDataProvider>
          {/* Skip to Content Link */}
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-[#C5A059] focus:text-white focus:rounded-xl focus:shadow-lg focus:font-semibold focus:text-xs uppercase focus:tracking-wider"
          >
            {locale === "fr" ? "Aller au contenu principal" : "Skip to main content"}
          </a>

          {/* Main content */}
          <Navbar locale={locale} />
          <main id="main-content" className="relative z-10">{children}</main>
          <Footer locale={locale} />
        </PortfolioDataProvider>
      </NextIntlClientProvider>
    </ThemeProvider>
  );
}
