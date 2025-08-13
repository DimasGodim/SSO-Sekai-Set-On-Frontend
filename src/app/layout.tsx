import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import Navigation from "@/components/Navigation";

export const metadata: Metadata = {
  title: "Sekai Set On",
  description: "Connect to Japan. Seamlessly. An open-source Japanese API platform for developers integrating with Japanese services like VoiceVox, weather data, train schedules, and more.",
  icons: {
    icon: "/icon.png",
  },
  keywords: ["Japanese API", "VoiceVox", "Japan", "API platform", "open source", "developers"],
  metadataBase: new URL(process.env.NEXT_PUBLIC_URL || 'https://sekai-set-on.vercel.app/'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "Sekai Set On",
    description: "Connect to Japan. Seamlessly. An open-source Japanese API platform for developers integrating with Japanese services like VoiceVox, weather data, train schedules, and more.",
    url: process.env.NEXT_PUBLIC_URL || 'https://sekai-set-on.vercel.app/',
    siteName: 'Sekai Set On',
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_URL || 'https://sekai-set-on.vercel.app/'}/og-image.png`,
        width: 1200,
        height: 630,
        alt: 'Sekai Set On - Japanese API Platform',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Sekai Set On",
    description: "Connect to Japan. Seamlessly. An open-source Japanese API platform for developers integrating with Japanese services like VoiceVox, weather data, train schedules, and more.",
    images: [`${process.env.NEXT_PUBLIC_URL || 'https://sekai-set-on.vercel.app/'}/og-image.png`],
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION || '92riPU7igCRcK3S4_UzHHLacbBx2NC3rklnFpLTpO9w',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const GA_ID = process.env.NEXT_PUBLIC_GA_ID || 'G-2BJ9C2XGGT';
  
  return (
    <html lang="en">
      <body className="antialiased min-h-screen bg-black text-white">
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_ID}');
          `}
        </Script>
        <Navigation />
        <main className="pt-16">
          {children}
        </main>
      </body>
    </html>
  );
}