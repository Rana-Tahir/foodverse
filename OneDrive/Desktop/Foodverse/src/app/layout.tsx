import './globals.css';
import type { Metadata } from 'next';
import { AuthProvider } from '@/features/auth/auth-context';
import { CartProvider } from '@/features/ordering/cart-context';

export const metadata: Metadata = {
  title: 'Foodverse - Food Delivery Platform',
  description: 'Your modern food delivery platform inspired by Foodpanda.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <CartProvider>{children}</CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
