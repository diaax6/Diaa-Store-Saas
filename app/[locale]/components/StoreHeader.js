'use client';
import { useTranslations } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';
import { useCurrency } from '../context/CurrencyContext';
import brandLogos from './BrandLogos';
import './StoreHeader.css';

// All demo products for instant search
const allDemoProducts = [
  { id: '1', nameEn: 'ChatGPT Plus', nameAr: 'شات جي بي تي بلس', price: 12, brand: 'chatgpt', category: 'AI' },
  { id: '2', nameEn: 'Adobe Creative Cloud', nameAr: 'أدوبي كريتف كلاود', price: 25, brand: 'adobe', category: 'Design' },
  { id: '3', nameEn: 'Spotify Premium', nameAr: 'سبوتيفاي بريميوم', price: 8, brand: 'spotify', category: 'Music' },
  { id: '4', nameEn: 'Netflix Premium', nameAr: 'نتفلكس بريميوم', price: 10, brand: 'netflix', category: 'Streaming' },
  { id: '5', nameEn: 'Gemini Advanced', nameAr: 'جيميناي أدفانسد', price: 15, brand: 'gemini', category: 'AI' },
  { id: '6', nameEn: 'Canva Pro', nameAr: 'كانفا برو', price: 9, brand: 'canva', category: 'Design' },
  { id: '7', nameEn: 'YouTube Premium', nameAr: 'يوتيوب بريميوم', price: 7, brand: 'youtube', category: 'Streaming' },
  { id: '8', nameEn: 'Microsoft 365', nameAr: 'مايكروسوفت 365', price: 11, brand: 'microsoft', category: 'Productivity' },
  { id: '9', nameEn: 'Grammarly Premium', nameAr: 'جرامرلي بريميوم', price: 11, brand: 'grammarly', category: 'Productivity' },
];

export default function StoreHeader({ locale }) {
  const t = useTranslations('common');
  const { items, itemCount, subtotal, removeFromCart, updateQuantity } = useCart();
  const { isLoggedIn, user, logout } = useAuth();
  const { settings } = useSettings();
  const { activeCurrency, currencies, formatPrice, switchCurrency: ctxSwitchCurrency } = useCurrency();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [scrolled, setScrolled] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  const switchCurrency = (code) => {
    ctxSwitchCurrency(code);
    setLangOpen(false);
  };
  const pathname = usePathname();
  const router = useRouter();
  const isAr = locale === 'ar';
  const cartRef = useRef(null);
  const langRef = useRef(null);
  const searchRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClick = (e) => {
      if (cartRef.current && !cartRef.current.contains(e.target)) setCartOpen(false);
      if (langRef.current && !langRef.current.contains(e.target)) setLangOpen(false);
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Instant search — filter demo products immediately, try API in background
  useEffect(() => {
    if (searchQuery.length < 1) { setSearchResults([]); return; }
    
    // Instant local search
    const q = searchQuery.toLowerCase();
    const localResults = allDemoProducts.filter(p =>
      p.nameEn.toLowerCase().includes(q) || p.nameAr.includes(searchQuery)
    ).slice(0, 6);
    setSearchResults(localResults);

    // Also try API (will override if available)
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/products?search=${encodeURIComponent(searchQuery)}&limit=6`);
        if (res.ok) {
          const data = await res.json();
          const apiProducts = data.products || data.data || [];
          if (apiProducts.length > 0) {
            setSearchResults(apiProducts);
          }
        }
      } catch {}
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const switchLocale = (loc) => {
    setLangOpen(false);
    const newPath = pathname.replace(`/${locale}`, `/${loc}`);
    router.push(newPath || `/${loc}`);
  };

  const toggleTheme = () => {
    const html = document.documentElement;
    const current = html.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    localStorage.setItem('store_theme', next);
  };

  const isActive = (path) => {
    if (path === `/${locale}`) return pathname === `/${locale}`;
    return pathname.startsWith(path);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/${locale}/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
      setSearchResults([]);
    }
  };

  const storeName = settings.store_name || t('storeName');

  return (
    <header className={`store-header ${scrolled ? 'scrolled' : ''}`}>
      <div className="header-inner container">
        {/* Logo */}
        <Link href={`/${locale}`} className="header-logo">
          <span className="logo-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
          </span>
          <span className="logo-text">{storeName}</span>
        </Link>

        {/* Center — Search Bar */}
        <div className="header-search-wrap" ref={searchRef}>
          <form className="header-search-bar" onSubmit={handleSearchSubmit}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
            <input
              type="text"
              placeholder={isAr ? 'ابحث عن منتج...' : 'Search products...'}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onFocus={() => setSearchOpen(true)}
              className="search-bar-input"
            />
            {searchQuery && (
              <button type="button" className="search-clear" onClick={() => { setSearchQuery(''); setSearchResults([]); }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            )}
          </form>
          {/* Search Results Dropdown */}
          {searchOpen && searchResults.length > 0 && (
            <div className="search-results-dropdown">
              {searchResults.map(product => (
                <Link
                  key={product.id}
                  href={`/${locale}/products/${product.id}`}
                  className="search-result-item"
                  onClick={() => { setSearchOpen(false); setSearchQuery(''); setSearchResults([]); }}
                >
                  <div className="search-result-left">
                    <span className="search-result-logo">
                      {brandLogos[product.brand] || (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-muted)" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="3"/></svg>
                      )}
                    </span>
                    <div className="search-result-info">
                      <span className="search-result-name">{isAr ? product.nameAr : product.nameEn}</span>
                      {product.category && <span className="search-result-cat">{product.category}</span>}
                    </div>
                  </div>
                  <span className="search-result-price">{formatPrice(product.price)}</span>
                </Link>
              ))}
              <button className="search-see-all" onClick={(e) => { e.preventDefault(); handleSearchSubmit({ preventDefault: () => {} }); }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
                {isAr ? `عرض كل النتائج لـ "${searchQuery}"` : `View all results for "${searchQuery}"`}
              </button>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className={`header-nav ${menuOpen ? 'open' : ''}`}>
          <Link href={`/${locale}`} className={`nav-pill ${isActive(`/${locale}`) && !pathname.includes('/products') && !pathname.includes('/cart') ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="nav-pill-svg"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            {t('home')}
          </Link>
          <Link href={`/${locale}/products`} className={`nav-pill ${isActive(`/${locale}/products`) ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="nav-pill-svg"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
            {t('products')}
          </Link>
          <Link href={`/${locale}/account`} className={`nav-pill ${isActive(`/${locale}/account`) ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="nav-pill-svg"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            {t('account')}
          </Link>
        </nav>

        {/* Right Actions */}
        <div className="header-actions">
          {/* Mobile Search */}
          <button className="header-action-btn mobile-search-btn" onClick={() => setSearchOpen(!searchOpen)} title={isAr ? 'بحث' : 'Search'}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
          </button>

          {/* Language/Currency */}
          <div className="lang-dropdown-wrap" ref={langRef}>
            <button className="header-action-btn" onClick={() => setLangOpen(!langOpen)}>
              <span className="lang-label">{isAr ? 'AR' : 'EN'} | {activeCurrency}</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
            </button>
            {langOpen && (
              <div className="lang-dropdown">
                <div style={{padding:'6px 12px',fontSize:'0.68rem',fontWeight:700,color:'var(--color-text-muted)',textTransform:'uppercase',letterSpacing:'0.08em'}}>Language</div>
                <button className={`lang-option ${!isAr ? 'active' : ''}`} onClick={() => switchLocale('en')}>
                  <span className="lang-flag">🇺🇸</span> English
                </button>
                <button className={`lang-option ${isAr ? 'active' : ''}`} onClick={() => switchLocale('ar')}>
                  <span className="lang-flag">🇪🇬</span> العربية
                </button>
                {currencies.length > 1 && (<>
                  <div style={{height:1,background:'var(--color-border)',margin:'6px 0'}}></div>
                  <div style={{padding:'6px 12px',fontSize:'0.68rem',fontWeight:700,color:'var(--color-text-muted)',textTransform:'uppercase',letterSpacing:'0.08em'}}>Currency</div>
                  {currencies.map(c => (
                    <button key={c.code} className={`lang-option ${activeCurrency===c.code ? 'active' : ''}`} onClick={() => switchCurrency(c.code)}>
                      <span className="lang-flag" style={{fontWeight:700,fontSize:'0.9rem'}}>{c.symbol}</span> {c.code}
                    </button>
                  ))}
                </>)}
              </div>
            )}
          </div>

          {/* Theme Toggle */}
          <button className="header-action-btn" onClick={toggleTheme} title={isAr ? 'تبديل المظهر' : 'Toggle theme'}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
          </button>

          {/* Cart */}
          <div className="cart-dropdown-wrap" ref={cartRef}>
            <button className="header-action-btn cart-btn" onClick={() => setCartOpen(!cartOpen)}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
              {itemCount > 0 && <span className="cart-badge">{itemCount}</span>}
            </button>
            {cartOpen && (
              <div className="cart-dropdown">
                <div className="cart-dd-header">
                  <span className="cart-dd-title">{isAr ? 'سلة التسوق' : 'Shopping Cart'}</span>
                  <span className="cart-dd-count">{itemCount} {isAr ? 'منتج' : 'items'}</span>
                </div>
                {items.length === 0 ? (
                  <div className="cart-dd-empty">{isAr ? 'السلة فارغة' : 'Cart is empty'}</div>
                ) : (
                  <>
                    <div className="cart-dd-items">
                      {items.map(item => (
                        <div key={`${item.id}-${item.pricingId || 'def'}`} className="cart-dd-item">
                          <span className="cart-dd-item-logo">
                            {brandLogos[item.brand] || (
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-muted)" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="3"/></svg>
                            )}
                          </span>
                          <div className="cart-dd-item-info">
                            <span className="cart-dd-item-name">{isAr ? item.nameAr : item.nameEn}</span>
                            <span className="cart-dd-item-sku">{item.duration || '1 month'}</span>
                          </div>
                          <div className="cart-dd-qty">
                            <button
                              className="cart-dd-qty-btn"
                              onClick={() => {
                                if (item.quantity <= 1) removeFromCart(item.id, item.pricingId);
                                else updateQuantity(item.id, item.pricingId, item.quantity - 1);
                              }}
                            >
                              {item.quantity <= 1 ? (
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                              ) : (
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"/></svg>
                              )}
                            </button>
                            <span className="cart-dd-qty-val">{item.quantity}</span>
                            <button
                              className="cart-dd-qty-btn"
                              onClick={() => updateQuantity(item.id, item.pricingId, item.quantity + 1)}
                            >
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                            </button>
                          </div>
                          <span className="cart-dd-item-price">{formatPrice(item.price * item.quantity)}</span>
                        </div>
                      ))}
                    </div>
                    <div className="cart-dd-footer">
                      <div className="cart-dd-total">
                        <span>{isAr ? 'الإجمالي' : 'Total'}</span>
                        <span className="cart-dd-total-price">{formatPrice(subtotal)}</span>
                      </div>
                      <Link href={`/${locale}/checkout`} className="cart-dd-checkout" onClick={() => setCartOpen(false)}>
                        {isAr ? 'إتمام الشراء' : 'Checkout'}
                      </Link>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Auth Button */}
          {isLoggedIn ? (
            <div className="user-menu-wrap">
              <Link href={`/${locale}/account`} className="header-user-btn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                <span className="user-name">{user?.name || (isAr ? 'حسابي' : 'Account')}</span>
              </Link>
            </div>
          ) : (
            <Link href={`/${locale}/auth/login`} className="header-login-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
              <span className="login-text">{isAr ? 'دخول' : 'Login'}</span>
            </Link>
          )}

          {/* Mobile Menu */}
          <button className="header-action-btn menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen
              ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>}
          </button>
        </div>
      </div>

      {/* Mobile Search Overlay */}
      {searchOpen && (
        <div className="mobile-search-overlay animate-fade-in">
          <div className="container">
            <form className="mobile-search-form" onSubmit={handleSearchSubmit}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
              <input type="text" placeholder={isAr ? 'ابحث عن منتج...' : 'Search products...'} value={searchQuery} onChange={e => setSearchQuery(e.target.value)} autoFocus className="search-input" />
              <button type="button" className="search-close" onClick={() => { setSearchOpen(false); setSearchQuery(''); }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </form>
            {searchResults.length > 0 && (
              <div className="mobile-search-results">
                {searchResults.map(product => (
                  <Link key={product.id} href={`/${locale}/products/${product.id}`} className="search-result-item" onClick={() => { setSearchOpen(false); setSearchQuery(''); }}>
                    <div className="search-result-left">
                      <span className="search-result-logo">
                        {brandLogos[product.brand] || <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-muted)" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="3"/></svg>}
                      </span>
                      <span className="search-result-name">{isAr ? product.nameAr : product.nameEn}</span>
                    </div>
                    <span className="search-result-price">${product.price}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
