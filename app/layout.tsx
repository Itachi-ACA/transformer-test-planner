import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  title: "Test Schedule — Indo Tech Transformer Testing Planning System",
  description:
    "Professional scheduling platform for planning transformer testing experiments. Organize complex test sequences across multiple transformers and multiple days.",
  keywords: [
    "transformer testing",
    "test schedule",
    "Indo Tech",
    "industrial planning",
    "test management",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="antialiased font-sans">{children}</body>
    </html>
  );
}
