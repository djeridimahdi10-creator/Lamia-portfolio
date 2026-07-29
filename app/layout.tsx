import type { Metadata } from "next";
import { playfair, inter } from "@/lib/fonts";
import { siteConfig } from "@/data/site-config";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lamia Akoubache — Architecture Portfolio",
  description: "Portfolio d'architecture de Lamia Akoubache",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Lamia Akoubache",
  jobTitle: "Architect",
  url: siteConfig.url,
  sameAs: [
    "https://linkedin.com/in/lamia-akoubache",
    "https://instagram.com/lamia.archi",
    "https://behance.net/lamia-akoubache",
  ],
  knowsAbout: [
    "Architecture",
    "Sustainable Architecture",
    "Bioclimatic Design",
    "Urban Planning",
    "3D Rendering",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html className="dark" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${playfair.variable} ${inter.variable} font-sans antialiased bg-[#0F0F0F] text-[#EDEDEF]`}>
        {children}
      </body>
    </html>
  );
}
