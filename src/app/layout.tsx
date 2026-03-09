import type { Metadata } from "next";
import { Inter, Montserrat } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Providers from "./providers";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const montserrat = Montserrat({
  variable: "--font-heading",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const shareImage = "/favicon.png";

export const metadata: Metadata = {
  title: "NEVERSORE - Premium Gym Outfits",
  description: "Shop premium gym and fitness apparel",
  metadataBase: new URL(siteUrl),
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
  openGraph: {
    title: "NEVERSORE - Premium Gym Outfits",
    description: "Shop premium gym and fitness apparel",
    url: siteUrl,
    siteName: "NEVERSORE",
    images: [
      {
        url: shareImage,
        width: 512,
        height: 512,
        alt: "NEVERSORE logo",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "NEVERSORE - Premium Gym Outfits",
    description: "Shop premium gym and fitness apparel",
    images: [shareImage],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="beforeInteractive"
        />
        {/* <Script
          src="https://www.google.com/recaptcha/enterprise.js?render=6LfLfoAsAAAAABNKFMQWlpb3zRbGV5Wg89ideXqX"
          strategy="beforeInteractive"
        /> */}
      </head>
      <body
        className={`${inter.variable} ${montserrat.variable} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
