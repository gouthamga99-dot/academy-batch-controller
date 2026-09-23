import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata = {
  title: "Academy Batch Controller",
  description: "Live display of the currently active academy shift (IST).",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f0fdfa",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}
