import type { Metadata } from "next";
import { Inter, Cormorant_Garamond, Caveat } from "next/font/google";
import CustomCursor from "@/components/CustomCursor";
import "./globals.css";
import Footer from "@/components/shared/Footer";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const caveat = Caveat({
  variable: "--font-hand",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: "INSAT Press",
  description: "The creative voice of INSAT.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${cormorant.variable} ${caveat.variable}`}>
        <CustomCursor />
        {children}
        <Footer />
      </body>
    </html>
  );
}