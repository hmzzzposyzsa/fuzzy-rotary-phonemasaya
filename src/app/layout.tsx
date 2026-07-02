import type { Metadata } from "next";
import { Outfit, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getSiteConfig } from "@/lib/api";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800", "900"],
  variable: "--font-outfit",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-jakarta",
});

export const metadata: Metadata = {
  title: "Arduyy Shop",
  description: "Top up game digital terpercaya & tercepat",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Ambil config situs (nama, logo) dari API eksternal.
  // Kalau API belum tersedia / env belum diset, fallback ke default
  // supaya build tetap jalan (lihat try/catch di lib/api konsumen).
  let siteConfig: { siteName: string; logoUrl: string | null } = {
    siteName: "Arduyy Shop",
    logoUrl: null,
  };
  try {
    const config = await getSiteConfig();
    siteConfig = { siteName: config.siteName, logoUrl: config.logoUrl ?? null };
  } catch {
    // API belum siap -> pakai default, tidak melempar error ke user.
  }

  return (
    <html lang="id" className={`${outfit.variable} ${jakarta.variable}`}>
      <body className="font-jakarta min-h-screen flex flex-col">
        <Header siteConfig={siteConfig} />
        <main className="flex-1 max-w-[1200px] w-full mx-auto px-5 py-8">
          {children}
        </main>
        <Footer siteName={siteConfig.siteName} />
      </body>
    </html>
  );
}
