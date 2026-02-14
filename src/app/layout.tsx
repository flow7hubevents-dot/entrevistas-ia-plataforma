import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: "AI Entrevistas Pro | Domina tus Entrevistas Técnicas",
  description: "La plataforma líder de preparación de entrevistas con IA. Practica con entrevistadores especializados, recibe feedback en tiempo real y descarga tus informes de evaluación.",
  keywords: ["entrevistas ia", "preparación de entrevistas", "entrevistas técnicas", "simulador de entrevistas", "feedback ia"],
  authors: [{ name: "AI Entrevistas Pro Team" }],
  openGraph: {
    title: "AI Entrevistas Pro | Simulador de Entrevistas con Inteligencia Artificial",
    description: "Prepárate para el trabajo de tus sueños con nuestro simulador de entrevistas de nivel senior.",
    url: "https://aientrevistas.pro",
    siteName: "AI Entrevistas Pro",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "AI Entrevistas Pro Dashboard",
      },
    ],
    locale: "es_ES",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Entrevistas Pro | Prepárate con IA",
    description: "Simulador de entrevistas técnicas y de RRHH con feedback en tiempo real.",
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: "https://aientrevistas.pro",
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
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "AI Entrevistas Pro",
    "url": "https://aientrevistas.pro",
    "description": "Plataforma de simulación de entrevistas con IA.",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://aientrevistas.pro/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <Script
          id="json-ld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {/* Google Analytics placeholder */}
        <Script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX" />
        <Script id="ga-init">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-XXXXXXXXXX');
          `}
        </Script>
      </head>
      <body className={`${inter.variable} ${outfit.variable} font-sans antialiased transition-colors duration-300`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
