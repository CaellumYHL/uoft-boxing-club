import type { Metadata, Viewport } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { CartProvider } from "../context/CartContext";
import { SiteConfigProvider } from "../context/SiteConfigContext";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "UofT Boxing Club",
  description: "Official website of the UofT Boxing Club",
  icons: {
    icon: "/favicon.ico",
  },
};

/** Explicit mobile viewport so phones render at device width (issues #3, #17). */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${outfit.variable} font-sans antialiased`}
      >
        <SiteConfigProvider>
          <CartProvider>
            {children}
          </CartProvider>
        </SiteConfigProvider>
      </body>
    </html>
  );
}