import Image from "next/image";
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
const shareImage = `${siteUrl}/favicon.png`;
const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "9166660436";
const whatsappMessage = encodeURIComponent(
  process.env.NEXT_PUBLIC_WHATSAPP_MESSAGE ||
    "Hey, I want to know about upcoming products."
);
const whatsappLink = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

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
        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat with us on WhatsApp"
          className="fixed bottom-4 right-4 z-50 flex items-center gap-3 px-4 py-3  font-semibold md:bottom-8 md:right-8 md:hidden"
        >
          <span className="sr-only">Open WhatsApp chat</span>
          <Image
            src="/social.png"
            alt="WhatsApp"
            width={45}
            height={45}
            priority
            className="h-[45px] w-[45px]"
          />
          <span className="hidden sm:inline">Chat on WhatsApp</span>
        </a>
      </body>
    </html>
  );
}
