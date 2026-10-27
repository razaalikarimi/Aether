import type { Metadata } from 'next';
import { Inter, Cinzel, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/hooks/useCart';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { CartDrawer } from '@/components/layout/CartDrawer';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const cinzel = Cinzel({
  subsets: ['latin'],
  variable: '--font-clash',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'AETHER — Luxury 3D Acoustic & Horology Flagship',
  description:
    'An ultra-premium cinematic e-commerce flagship. Machined titanium acoustic systems, flying tourbillon complications, and cryptographic hardware vaults.',
  keywords: [
    'Planar Headphones',
    'Luxury Audio',
    'Tourbillon Watch',
    'Aerospace Titanium',
    'Audiophile Flagship',
    '3D E-Commerce',
  ],
  authors: [{ name: 'Aether Atelier' }],
  openGraph: {
    title: 'AETHER — Luxury 3D Acoustic & Horology Flagship',
    description:
      'Machined titanium acoustic systems, flying tourbillon complications, and cryptographic hardware vaults.',
    type: 'website',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=1200&q=80',
        width: 1200,
        height: 630,
        alt: 'Aether Flagship Planar Headphone',
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${cinzel.variable} ${jetbrainsMono.variable} dark`}
    >
      <body className="min-h-screen bg-[#070709] text-[#f3f4f8] flex flex-col antialiased selection:bg-accent-gold/30">
        <CartProvider>
          <Navbar />
          <CartDrawer />
          <main className="flex-1">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
