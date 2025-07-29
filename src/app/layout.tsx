import type { Metadata } from "next";
import "./globals.css";
import Navigation from "@/components/Navigation";

export const metadata: Metadata = {
  title: "Sekai-Set-On (世界) - Japanese API Platform",
  description: "Connect to Japan. Seamlessly. An open-source Japanese API platform for developers integrating with Japanese services like VoiceVox, weather data, train schedules, and more.",
  icons: {
    icon: "/icon.png",
  },
  keywords: ["Japanese API", "VoiceVox", "Japan", "API platform", "open source", "developers"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen bg-black text-white">
        <Navigation />
        <main className="pt-16">
          {children}
        </main>
      </body>
    </html>
  );
}