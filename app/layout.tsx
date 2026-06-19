import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import SmoothScroll from "@/components/layout/SmoothScroll";
import "./globals.css";
import CustomCursor from "@/components/ui/CustomCursor";
import { CartProvider } from "@/lib/cartStore";

const playfair = Playfair_Display({
    subsets: ["latin"],
    variable: "--font-playfair",
});

const inter = Inter({
    subsets: ["latin"],
    variable: "--font-inter",
});

import { getStoreSettings } from "@/app/actions/config";

export async function generateMetadata(): Promise<Metadata> {
    const store = await getStoreSettings();
    return {
        title: `${store.name} | O Aroma da Tradição`,
        description: "Pães artesanais quentinhos, fermentação natural e aconchego em cada fornada.",
        keywords: ["padaria artesanal", "fermentação natural", "levain", "pão quentinho", "gastronomia"],
        icons: {
            icon: [
                { url: "/images/favicon/favicon.ico" },
                { url: "/images/favicon/favicon-16x16.png", sizes: "16x16", type: "image/png" },
                { url: "/images/favicon/favicon-32x32.png", sizes: "32x32", type: "image/png" },
                { url: "/images/favicon/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
                { url: "/images/favicon/android-chrome-512x512.png", sizes: "512x512", type: "image/png" },
            ],
            apple: [
                { url: "/images/favicon/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
            ]
        }
    };
}

export default function RootLayout({
                                       children,
                                   }: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="pt-BR">
        <body suppressHydrationWarning className={`${inter.variable} ${playfair.variable}`}>
        <div style={{ position: 'relative', zIndex: 1 }}>
            <CartProvider>
                {children}
            </CartProvider>
        </div>
        <div style={{ position: 'relative', zIndex: 999999, pointerEvents: 'none' }}>
            <CustomCursor />
        </div>
        </body>
        </html>
    );
}