import type { Metadata } from "next";
import "./globals.css";
import { appConfig } from "@/config/app.config";
import { ThemeProvider } from "@/contexts/ThemeContext";
import DebugInitializer from "@/components/DebugInitializer";

import { Geist, Noto_Sans_SC } from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const notoSansSC = Noto_Sans_SC({
  variable: "--font-chinese",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: {
    template: `%s | ${appConfig.site.name}`,
    default: appConfig.site.name,
  },
  description: appConfig.site.description,
  metadataBase: new URL(appConfig.site.url),
  icons: {
    icon: [
      {
        url: '/favicon.svg',
        type: 'image/svg+xml',
      }
    ],
    apple: '/apple-touch-icon.svg',
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${notoSansSC.variable} antialiased`}>
        <ThemeProvider>
          {children}
        </ThemeProvider>
        <DebugInitializer />
      </body>
    </html>
  );
}
