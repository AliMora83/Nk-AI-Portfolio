import "./globals.css";
import type { Metadata } from "next";
import { Syne, Instrument_Serif, IBM_Plex_Mono } from "next/font/google";
import { Cursor } from "@/components/ui/Cursor";

const syne = Syne({
    subsets: ["latin"],
    variable: "--font-syne",
    weight: ["400", "600", "700", "800"],
});

const instrument = Instrument_Serif({
    subsets: ["latin"],
    variable: "--font-instrument",
    weight: ["400"],
    style: ["normal", "italic"],
});

const mono = IBM_Plex_Mono({
    subsets: ["latin"],
    variable: "--font-mono",
    weight: ["400", "500"],
});

export const metadata: Metadata = {
    title: "Ali Mora · AI-Powered React Developer & Designer | Namka Portfolio",
    description: "React developer and designer from South Africa using Gemini & Kimi to build websites 3x faster. View live AI demos, client work, and hire for your project.",
    keywords: ["React developer South Africa", "AI web developer", "Next.js designer", "Gemini API demos", "hire React developer"],
    openGraph: {
        title: "Ali Mora · AI Web Studio Portfolio",
        description: "Live AI demos. Real client work. React + Design + AI from Bloemfontein, South Africa.",
        url: "https://mywork.namka.cloud",
        type: "website",
    }
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`${syne.variable} ${instrument.variable} ${mono.variable} antialiased selection:bg-rust selection:text-paper`}>
                <Cursor />
                {children}
            </body>
        </html>
    );
}
