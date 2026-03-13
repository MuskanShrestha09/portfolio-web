import type { Metadata } from "next";
import "./globals.css";
import CustomCursor from "@/components/CustomCursor/CustomCursor";

export const metadata: Metadata = {
  metadataBase: new URL('https://muskanshrestha.com.np'),
  title: {
    default: "Muskan Shrestha — UI/UX Designer in Kathmandu, Nepal",
    template: "%s | Muskan Shrestha"
  },
  description: "Muskan Shrestha is a UI/UX focused designer with 2 years of experience based in Kathmandu, Nepal, specializing in crafting intuitive digital experiences and visual identities.",
  keywords: ["UI/UX Design", "Product Designer", "Visual Identity", "Graphic Design", "Kathmandu", "Nepal", "Muskan Shrestha"],
  authors: [{ name: "Muskan Shrestha" }],
  creator: "Muskan Shrestha",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://muskanshrestha.com.np",
    title: "Muskan Shrestha — UI/UX Designer",
    description: "Independent designer crafting visual identities with clarity and purpose.",
    siteName: "Muskan Shrestha Portfolio",
    images: [
      {
        url: "/muskan.png",
        width: 1200,
        height: 1200,
        alt: "Muskan Shrestha - UI/UX Designer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Muskan Shrestha — UI/UX Designer",
    description: "UI/UX focused designer with 2 years of experience crafting intuitive digital experiences.",
    images: ["/muskan.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <CustomCursor />
        {children}
      </body>
    </html>
  );
}
