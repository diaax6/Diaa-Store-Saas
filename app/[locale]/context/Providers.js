'use client';
import { CartProvider } from './CartContext';
import { AuthProvider } from './AuthContext';
import { SettingsProvider } from './SettingsContext';
import { CurrencyProvider } from './CurrencyContext';

export function Providers({ children }) {
  return (
    <SettingsProvider>
      <CurrencyProvider>
        <AuthProvider>
          <CartProvider>
            {children}
          </CartProvider>
        </AuthProvider>
      </CurrencyProvider>
    </SettingsProvider>
  );
}
