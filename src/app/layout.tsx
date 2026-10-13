import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/ThemeProvider';
import { CartProvider } from '@/context/CartContext';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: 'Apna Bhatta — Premium Brick Marketplace',
    template: '%s | Apna Bhatta'
  },
  description: "Pakistan's trusted marketplace for premium quality bricks — connecting Bhatta owners, buyers, and drivers on one platform with real-time tracking.",
  keywords: ['bricks', 'bhatta', 'pakistan construction', 'brick marketplace', 'construction materials'],
  authors: [{ name: 'Apna Bhatta Team' }],
  openGraph: {
    title: 'Apna Bhatta — Premium Brick Marketplace',
    description: "Quality bricks delivered at your doorstep with real-time tracking.",
    url: 'https://apnabhatta.com',
    siteName: 'Apna Bhatta',
    images: [
      {
        url: '/og-image.jpg', // User should add this later
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_PK',
    type: 'website',
  },
};

// Root layout — bare HTML shell only. Navbar/Footer live in (main)/layout.tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen transition-colors duration-300`} suppressHydrationWarning>
        <CartProvider>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </CartProvider>
      </body>
    </html>
  );
}
