import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import CustomCursor from "@/components/ui/CustomCursor";
import { ThemeProvider } from "@/context/ThemeContext";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#090909",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: "LUMIÈRE STUDIO | Luxury International Photography & Visual Direction",
  description:
    "Award-winning international luxury photography studio based in Paris and New York. Specializing in Haute Couture Weddings, Fashion Editorials, Fine Art Portraits, and High Jewelry Campaigns.",
  keywords: [
    "Luxury Photography",
    "Haute Couture Wedding Photographer",
    "Fashion Editorial Photography",
    "Fine Art Studio Portraits",
    "Paris Wedding Photographer",
    "New York Editorial Photographer",
    "Lumiere Studio",
  ],
  authors: [{ name: "Julian Vance & Elena Vance", url: "https://lumiere-studio.com" }],
  creator: "Lumière Studio",
  openGraph: {
    title: "LUMIÈRE STUDIO — Capturing Timeless Moments",
    description: "Where every frame tells a beautiful story. World-class luxury photography agency.",
    url: "https://lumiere-studio.com",
    siteName: "LUMIÈRE STUDIO",
    images: [
      {
        url: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1600",
        width: 1600,
        height: 1067,
        alt: "Lumière Studio Luxury Photography",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "LUMIÈRE STUDIO | Luxury Photography Agency",
    description: "Capturing timeless moments. Where every frame tells a beautiful story.",
    images: ["https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1600"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth" suppressHydrationWarning>
      <body
        className={`${cormorant.variable} ${plusJakarta.variable} font-sans antialiased bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors duration-300 selection:bg-[#D6B77A] selection:text-[#090909]`}
      >
        <ThemeProvider>
          <CustomCursor />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
