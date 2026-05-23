'use client';
import { useState, useEffect, createContext, useContext } from 'react';

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('wishlist');
    if (saved) setItems(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(items));
  }, [items]);

  const add = (product) => {
    setItems(prev => prev.find(p => p.id === product.id) ? prev : [...prev, { ...product, addedAt: new Date().toISOString() }]);
  };

  const remove = (id) => setItems(prev => prev.filter(p => p.id !== id));
  const has = (id) => items.some(p => p.id === id);
  const toggle = (product) => has(product.id) ? remove(product.id) : add(product);
  const clear = () => setItems([]);

  return (
    <WishlistContext.Provider value={{ items, add, remove, has, toggle, clear, count: items.length }}>
      {children}
    </WishlistContext.Provider>
  );
}

export const useWishlist = () => useContext(WishlistContext);

// Wishlist Heart Button Component
export function WishlistButton({ product, size = 20, style = {} }) {
  const { has, toggle } = useWishlist();
  const liked = has(product.id);

  return (
    <button
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggle(product); }}
      aria-label={liked ? 'Remove from wishlist' : 'Add to wishlist'}
      style={{
        background: liked ? 'rgba(239,68,68,.12)' : 'rgba(255,255,255,.06)',
        border: `1px solid ${liked ? 'rgba(239,68,68,.3)' : 'rgba(255,255,255,.1)'}`,
        borderRadius: '50%', width: size + 14, height: size + 14,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', transition: 'all .2s', ...style,
      }}
    >
      <svg width={size} height={size} viewBox="0 0 24 24"
        fill={liked ? '#EF4444' : 'none'}
        stroke={liked ? '#EF4444' : 'rgba(255,255,255,.5)'}
        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        style={{ transition: 'all .2s', transform: liked ? 'scale(1.1)' : 'scale(1)' }}
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    </button>
  );
}

// Wishlist Page Component
export function WishlistPage() {
  const { items, remove, clear } = useWishlist();

  if (items.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 20px' }}>
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.15)" strokeWidth="1.5" style={{ margin: '0 auto 16px', display: 'block' }}>
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
        <h2 style={{ fontWeight: 800, fontSize: '1.4rem', marginBottom: 8 }}>Your wishlist is empty</h2>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: 24 }}>Save products you love and come back to them later</p>
        <a href="/en/products" style={{
          padding: '12px 28px', borderRadius: 10, background: 'var(--color-primary)',
          color: '#fff', fontWeight: 700, textDecoration: 'none', display: 'inline-block',
        }}>Browse Products</a>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '30px 20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontWeight: 800, fontSize: '1.6rem' }}>My Wishlist</h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '.88rem' }}>{items.length} item{items.length > 1 ? 's' : ''} saved</p>
        </div>
        <button onClick={clear} style={{
          padding: '8px 16px', borderRadius: 8, border: '1px solid rgba(239,68,68,.3)',
          background: 'rgba(239,68,68,.08)', color: '#EF4444', fontWeight: 600,
          fontSize: '.82rem', cursor: 'pointer',
        }}>Clear All</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
        {items.map(p => (
          <div key={p.id} style={{
            background: 'var(--color-surface)', border: '1px solid var(--color-border)',
            borderRadius: 14, padding: 18, position: 'relative',
          }}>
            <button onClick={() => remove(p.id)} style={{
              position: 'absolute', top: 12, right: 12, background: 'rgba(239,68,68,.1)',
              border: 'none', borderRadius: '50%', width: 28, height: 28,
              display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
            </button>
            <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: 4 }}>{p.name}</div>
            <div style={{ fontSize: '.78rem', color: 'var(--color-text-muted)', marginBottom: 12 }}>{p.category}</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 800, fontFamily: 'monospace', color: 'var(--color-primary)', fontSize: '1.1rem' }}>${p.price}</span>
              <a href={`/en/products/${p.id}`} style={{
                padding: '6px 16px', borderRadius: 8, background: 'var(--color-primary)',
                color: '#fff', fontWeight: 600, fontSize: '.82rem', textDecoration: 'none',
              }}>View</a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
