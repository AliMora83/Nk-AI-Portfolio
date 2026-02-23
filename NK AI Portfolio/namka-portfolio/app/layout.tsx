import type { Metadata } from "next";
import { Syne, Instrument_Serif, IBM_Plex_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import Cursor from "@/components/ui/Cursor";
import "./globals.css";

const syne = Syne({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-syne"
});

const instrument = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument"
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-ibm-plex-mono"
});

export const metadata: Metadata = {
  title: "Ali Mora | AI Developer & Designer",
  description: "Senior Full-Stack Engineer and Designer specializing in AI integrations, React, Next.js, and Agentic Workflows.",
  keywords: ["Ali Mora", "Namka", "Portfolio", "AI Engineer", "Next.js", "React"],
  openGraph: {
    title: "Ali Mora | Namka",
    description: "Senior Full-Stack Engineer and Designer specializing in AI integrations.",
    url: "https://mywork.namka.cloud",
    siteName: "Namka Portfolio",
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${syne.variable} ${instrument.variable} ${ibmPlexMono.variable} font-syne antialiased selection:bg-rust selection:text-paper`}
      >
        <ThemeProvider
          attribute="data-theme"
          defaultTheme="dark"
          enableSystem={false}
        >
          <Cursor />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
