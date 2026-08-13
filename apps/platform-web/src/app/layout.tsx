import type { Metadata } from 'next';
import { Figtree, Fraunces } from 'next/font/google';

import './globals.css';

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  weight: ['600', '700'],
});

const figtree = Figtree({
  subsets: ['latin'],
  variable: '--font-figtree',
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'My Gi Command Center',
  description: 'Platform directory for My Gi organizations and academies.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${fraunces.variable} ${figtree.variable}`}>
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
