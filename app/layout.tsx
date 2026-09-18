import type { Metadata, Viewport } from "next";
import { Noto_Sans_Thai, Space_Grotesk } from "next/font/google";
import "./globals.css";

const sans = Noto_Sans_Thai({ subsets: ["thai", "latin"], variable: "--font-sans" });
const display = Space_Grotesk({ subsets: ["latin"], variable: "--font-display" });

export const metadata: Metadata = {
  title: "Tee-Jod | KMUTT Parking Prototype",
  description: "Check mock parking availability at KMUTT before you travel.",
  icons: { icon: "/favicon.svg" },
};
export const viewport: Viewport = { themeColor: "#F04400", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" className={`${sans.variable} ${display.variable}`}><body>{children}</body></html>;
}
