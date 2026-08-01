import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Outfit, Mochiy_Pop_One } from "next/font/google";
import "../styles/globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

const mochiyPopOne = Mochiy_Pop_One({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-manga",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://tsuuchi.jackli.dev"),
  title: {
    default: "Tsuuchi 通知 — Discord Manga & Webtoon Tracker Bot",
    template: "%s | Tsuuchi 通知",
  },
  description: "Tsuuchi is a fast, clean & reliable Discord bot that sends instant chapter update notifications for manga, manhwa, and webtoons.",
  keywords: ["Tsuuchi", "MangaUpdates", "Discord Bot", "Manga Tracker", "Manhwa", "Webtoon", "Chapter Updates"],
  authors: [{ name: "ohashi", url: "https://github.com/jckli" }],
  icons: {
    icon: "https://cdn.discordapp.com/avatars/880694914365685781/afbcd6184ee3b21f2887d7c08c95a899.png?size=256",
    shortcut: "https://cdn.discordapp.com/avatars/880694914365685781/afbcd6184ee3b21f2887d7c08c95a899.png?size=256",
    apple: "https://cdn.discordapp.com/avatars/880694914365685781/afbcd6184ee3b21f2887d7c08c95a899.png?size=256",
  },
  openGraph: {
    title: "Tsuuchi 通知 — Discord Manga Tracker Bot",
    description: "Track your favorite mangas, manhwas, or webtoons and get every new chapter sent directly to your Discord server or DMs!",
    images: [{ url: "https://cdn.discordapp.com/avatars/880694914365685781/afbcd6184ee3b21f2887d7c08c95a899.png?size=1024" }],
    type: "website",
  },
};

import Footer from "../components/Footer";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${plusJakartaSans.variable} ${outfit.variable} ${mochiyPopOne.variable} dark`}
    >
      <body className="font-sans antialiased bg-background text-foreground selection:bg-primary/30 flex flex-col min-h-dvh">
        <div className="flex-1 flex flex-col w-full">
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}
