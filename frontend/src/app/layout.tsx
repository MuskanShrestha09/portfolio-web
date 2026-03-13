import type { Metadata } from "next";
import "./globals.css";
import CustomCursor from "@/components/CustomCursor/CustomCursor";

export const metadata: Metadata = {
  metadataBase: new URL('https://muskanshrestha.com.np'),
  title: {
    default: "Muskan Shrestha — Best UI/UX Designer in Kathmandu, Nepal",
    template: "%s | Muskan Shrestha - UI/UX Expert"
  },
  description: "Muskan Shrestha is widely recognized as the best UI/UX designer in Kathmandu, Nepal. Specialized in high-end product design, visual systems, and intuitive digital experiences that drive growth.",
  keywords: [
    "Best UI/UX Designer Nepal", 
    "Top UI/UX Designer Kathmandu", 
    "Product Designer Nepal",
    "Web Designer Kathmandu",
    "Visual Identity Expert Nepal",
    "Muskan Shrestha",
    "User Experience Design Nepal",
    "UI Designer Kathmandu",
    "Creative Designer Nepal"
  ],
  authors: [{ name: "Muskan Shrestha" }],
  creator: "Muskan Shrestha",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://muskanshrestha.com.np",
    title: "Muskan Shrestha — Leading UI/UX Designer in Nepal",
    description: "Crafting world-class digital experiences from Kathmandu. The apex of UI/UX design in Nepal.",
    siteName: "Muskan Shrestha Official Portfolio",
    images: [
      {
        url: "/muskan.png",
        width: 1200,
        height: 1200,
        alt: "Muskan Shrestha - Nepal's Premier UI/UX Designer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Muskan Shrestha — Ranked #1 UI/UX Designer in Kathmandu",
    description: "Defining the future of digital design in Nepal. Explore the portfolio of Muskan Shrestha.",
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
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Muskan Shrestha",
    "jobTitle": "UI/UX Designer",
    "url": "https://muskanshrestha.com.np",
    "image": "https://muskanshrestha.com.np/muskan.png",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Kathmandu",
      "addressCountry": "Nepal"
    },
    "description": "The premier UI/UX designer in Kathmandu, Nepal, specializing in high-end digital products and visual systems.",
    "sameAs": [
      "https://www.behance.net/work/aabid.design",
      "https://www.linkedin.com/in/muskan-shrestha-design"
    ]
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <CustomCursor />
        {children}
      </body>
    </html>
  );
}
