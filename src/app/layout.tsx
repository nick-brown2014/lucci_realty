import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lucci Living",
  description: "Lucci Signature Homes",
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    title: "Lucci Living",
    description: "Lucci Signature Homes",
    type: "website",
    locale: "en_US",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
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
      <body className='antialiased'>
        {children}
      </body>
    </html>
  );
}
