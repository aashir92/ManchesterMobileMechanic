import type { Metadata } from "next";
import { Montserrat, Open_Sans } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  weight: ["600", "700", "800"],
});

const openSans = Open_Sans({
  subsets: ["latin"],
  variable: "--font-open-sans",
});

export const metadata: Metadata = {
  title: "Manchester Mobile Mechanic | Repairs at Your Doorstep",
  description:
    "Professional mobile mechanic in Manchester — mechanical and auto electrical services at your home or workplace. No garages. No hassle.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${montserrat.variable} ${openSans.variable} h-full antialiased`}>
      <body className="min-h-full bg-white font-[family-name:var(--font-open-sans)] text-[#191c1d] selection:bg-[#fdc736] selection:text-[#251a00]">
        {children}
      </body>
    </html>
  );
}
