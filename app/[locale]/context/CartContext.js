'use client';
import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const CartContext = createContext(null);

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [loaded, setLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('diaa_cart');
      if (saved) setItems(JSON.parse(saved));
    } catch {}
    setLoaded(true);
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    if (loaded) {
      localStorage.setItem('diaa_cart', JSON.stringify(items));
    }
  }, [items, loaded]);

  const addToCart = useCallback((product) => {
    setItems(prev => {
      const key = `${product.id}-${product.pricingId || 'default'}`;
      const existing = prev.find(i => `${i.id}-${i.pricingId || 'default'}` === key);
      if (existing) {
        return prev.map(i =>
          `${i.id}-${i.pricingId || 'default'}` === key
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  }, []);

  const removeFromCart = useCallback((id, pricingId) => {
    setItems(prev => prev.filter(i => !(i.id === id && (i.pricingId || 'default') === (pricingId || 'default'))));
  }, []);

  const updateQuantity = useCallback((id, pricingId, quantity) => {
    if (quantity <= 0) return removeFromCart(id, pricingId);
    setItems(prev => prev.map(i =>
      i.id === id && (i.pricingId || 'default') === (pricingId || 'default')
        ? { ...i, quantity }
        : i
    ));
  }, [removeFromCart]);

  const clearCart = useCallback(() => setItems([]), []);

  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = items.reduce((sum, i) => sum + (i.price * i.quantity), 0);

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, itemCount, subtotal, loaded }}>
      {children}
    </CartContext.Provider>
  );
}
