import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";
import { FreezeGuard } from "@/components/FreezeGuard";
import { UIProvider } from "@/context/UIContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Namka Mission Control",
  description: "V1.0.5 Strategic Command Center",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-[--background] text-slate-100 antialiased`}>
        <UIProvider>
          <FreezeGuard>
            <div className="flex min-h-screen">
              <Sidebar />
              <main className="flex-1 flex flex-col">
                {children}
              </main>
            </div>
          </FreezeGuard>
        </UIProvider>
      </body>
    </html>
  );
}
