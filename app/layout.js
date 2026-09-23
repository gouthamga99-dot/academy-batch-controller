import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata = {
  title: "Academy Batch Controller",
  description:
    "Classroom display of the current time and the active academy shift.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f5f7fb",
  colorScheme: "light",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}
