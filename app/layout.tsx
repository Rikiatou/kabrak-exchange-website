import type { Metadata } from "next";
import "./globals.css";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://kabrak.com';

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: "KABRAK Exchange Pro — Smart Currency Management",
  description: "Application professionnelle de gestion de bureau de change. Gérez vos transactions, clients et devises en toute simplicité. Professional currency exchange management app.",
  keywords: "bureau de change, currency exchange, gestion devises, KABRAK, exchange management, forex, Afrique",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "KABRAK Exchange Pro",
  },
  openGraph: {
    title: "KABRAK Exchange Pro — Smart Currency Management",
    description: "Application professionnelle pour bureaux de change. Transactions, clients, devises, rapports.",
    type: "website",
    url: BASE_URL,
    siteName: "KABRAK Exchange Pro",
    images: [{ url: '/icon-512', width: 512, height: 512, alt: 'KABRAK Exchange Pro' }],
  },
  twitter: {
    card: 'summary',
    title: 'KABRAK Exchange Pro',
    description: 'Application professionnelle pour bureaux de change.',
    images: ['/icon-512'],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <head>
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="KABRAK Exchange Pro" />
        <meta name="theme-color" content="#0B6E4F" />
        <meta name="application-name" content="KABRAK Exchange Pro" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icon-512" />
        <link rel="icon" type="image/svg+xml" href="/icon-192" />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
