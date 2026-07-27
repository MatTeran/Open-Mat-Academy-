import type { Metadata } from 'next';
import { Outfit, Syne } from 'next/font/google';

import './globals.css';

const syne = Syne({
  subsets: ['latin'],
  variable: '--font-syne',
  weight: ['600', '700'],
});

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'Open Mat Coach',
  description: 'Desktop command center for Open Mat academies.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${syne.variable} ${outfit.variable}`}>
      <body className="min-h-screen bg-ink text-white antialiased">
        {children}
      </body>
    </html>
  );
}
