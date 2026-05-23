'use client';
import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const CurrencyContext = createContext(null);

const defaultCurrencies = [
  { code:'USD', symbol:'$', name:'US Dollar', rate:1, enabled:true },
  { code:'EGP', symbol:'E£', name:'Egyptian Pound', rate:49.5, enabled:true },
];

export function useCurrency() {
  const ctx = useContext(CurrencyContext);
  if (!ctx) {
    // Fallback if used outside provider
    return {
      activeCurrency: 'USD',
      currencies: defaultCurrencies,
      formatPrice: (usdPrice) => `$${Number(usdPrice).toFixed(2)}`,
      switchCurrency: () => {},
      currencySymbol: '$',
    };
  }
  return ctx;
}

export function CurrencyProvider({ children }) {
  const [activeCurrency, setActiveCurrency] = useState('USD');
  const [currencies, setCurrencies] = useState(defaultCurrencies);

  // Load from admin settings on mount + listen for changes
  useEffect(() => {
    const loadCurrencies = () => {
      try {
        const saved = JSON.parse(localStorage.getItem('storeAppearance') || '{}');
        if (saved.currencies && saved.currencies.length > 0) {
          const enabled = saved.currencies.filter(c => c.enabled);
          if (enabled.length > 0) setCurrencies(enabled);
          if (saved.defaultCurrency) {
            const userPref = localStorage.getItem('userCurrency');
            setActiveCurrency(userPref || saved.defaultCurrency);
          }
        }
      } catch {}
    };

    loadCurrencies();

    // Listen for changes from admin panel (cross-tab or same tab)
    const handleStorage = (e) => {
      if (e.key === 'storeAppearance') loadCurrencies();
      if (e.key === 'userCurrency' && e.newValue) setActiveCurrency(e.newValue);
    };
    window.addEventListener('storage', handleStorage);

    // Also poll for same-tab changes (admin saves then navigates to store)
    const interval = setInterval(loadCurrencies, 3000);

    return () => {
      window.removeEventListener('storage', handleStorage);
      clearInterval(interval);
    };
  }, []);

  const switchCurrency = useCallback((code) => {
    setActiveCurrency(code);
    localStorage.setItem('userCurrency', code);
  }, []);

  const formatPrice = useCallback((usdPrice) => {
    const price = Number(usdPrice);
    if (isNaN(price)) return '$0.00';
    const curr = currencies.find(c => c.code === activeCurrency);
    if (!curr) return `$${price.toFixed(2)}`;
    const converted = price * curr.rate;
    // Format based on currency magnitude
    if (curr.rate >= 10) {
      return `${curr.symbol}${Math.round(converted)}`;
    }
    return `${curr.symbol}${converted.toFixed(2)}`;
  }, [activeCurrency, currencies]);

  const currencySymbol = currencies.find(c => c.code === activeCurrency)?.symbol || '$';

  return (
    <CurrencyContext.Provider value={{ activeCurrency, currencies, formatPrice, switchCurrency, currencySymbol }}>
      {children}
    </CurrencyContext.Provider>
  );
}
