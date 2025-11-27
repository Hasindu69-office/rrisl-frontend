import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Header from "./components/header/Header";
import LocaleUpdater from "./components/ui/LocaleUpdater";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Rubber Research Institute of Sri Lanka",
  description: "Empowering Sri Lanka's rubber industry with world-class research, eco-friendly innovations, and data-driven solutions",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${plusJakartaSans.variable} font-sans antialiased`}
      >
        <LocaleUpdater />
        <main>{children}</main>
      </body>
    </html>
  );
}
