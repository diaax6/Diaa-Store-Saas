'use client';
import { createContext, useContext, useState, useEffect } from 'react';

const SettingsContext = createContext(null);

const defaults = {
  store_name: 'Diaa Store',
  store_description: 'Your Digital Subscriptions, Simplified',
  currency: 'USD',
  currency_symbol: '$',
  maintenance_mode: false,
  notice_enabled: true,
  notice_text_en: '🔥 Get 5% extra discount on PUBG purchases — Use code PUBG5',
  notice_text_ar: '🔥 احصل على خصم 5% إضافي على مشتريات PUBG — استخدم الكود PUBG5',
  notice_bg_color: '#E67E22',
  hero_title_en: 'Your Digital Subscriptions, Simplified',
  hero_title_ar: 'اشتراكاتك الرقمية، بكل بساطة',
  hero_subtitle_en: 'Get premium digital services at the best prices with instant delivery',
  hero_subtitle_ar: 'احصل على خدمات رقمية مميزة بأفضل الأسعار مع توصيل فوري',
  seo_title: 'Diaa Store — Premium Digital Subscriptions',
  seo_description: 'Get premium digital subscriptions at the best prices.',
  stats_products: '500+',
  stats_customers: '50K+',
  stats_speed: '<1 min',
  stats_languages: '9+',
  footer_text: '© 2025 Diaa Store. All rights reserved.',
  social_telegram: 'https://t.me/diaastore',
  social_instagram: '',
  social_twitter: '',
  social_whatsapp: '',
  social_facebook: '',
  social_youtube: '',
  social_discord: '',
  social_tiktok: '',
  color_primary: '#E67E22',
  color_accent: '#22D3EE',
  border_radius: '10',
  logo_url: '',
  favicon_url: '',
  bg_image: '',
  bg_opacity: '15',
};

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) return { settings: defaults, loading: false };
  return ctx;
}

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(defaults);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSettings() {
      // 1. ALWAYS load from localStorage FIRST (this is what admin saves to)
      try {
        const keys = ['store_name', 'notice_enabled', 'notice_text_en', 'notice_text_ar',
          'notice_bg_color', 'hero_title_en', 'hero_title_ar', 'hero_subtitle_en',
          'hero_subtitle_ar', 'social_telegram', 'social_instagram', 'social_whatsapp',
          'color_primary', 'color_accent', 'border_radius', 'logo_url',
          'maintenance_mode', 'maintenance_config'];
        const stored = {};
        keys.forEach(k => {
          const v = localStorage.getItem(`store_${k}`);
          if (v !== null) {
            // Handle booleans stored as strings
            if (v === 'true') stored[k] = true;
            else if (v === 'false') stored[k] = false;
            else stored[k] = v;
          }
        });
        if (Object.keys(stored).length > 0) {
          setSettings(prev => ({ ...prev, ...stored }));
        }
      } catch {}

      // 2. Try API as secondary source (merges but doesn't override localStorage)
      try {
        const res = await fetch('/api/settings', { cache: 'no-store' });
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data) {
            const apiSettings = {};
            if (Array.isArray(json.data)) {
              json.data.forEach(s => { apiSettings[s.key] = s.value; });
            } else {
              Object.assign(apiSettings, json.data);
            }
            // Only set API values that DON'T exist in localStorage
            setSettings(prev => {
              const merged = { ...prev };
              Object.entries(apiSettings).forEach(([k, v]) => {
                if (localStorage.getItem(`store_${k}`) === null) {
                  merged[k] = v;
                }
              });
              return merged;
            });
          }
        }
      } catch {}
      setLoading(false);
    }
    fetchSettings();

    // Apply saved theme colors
    try {
      const theme = localStorage.getItem('store_theme');
      if (theme) document.documentElement.setAttribute('data-theme', theme);
      const primary = localStorage.getItem('store_primary');
      if (primary) document.documentElement.style.setProperty('--color-primary', primary);
      const accent = localStorage.getItem('store_accent');
      if (accent) document.documentElement.style.setProperty('--color-accent', accent);
    } catch {}

    // Cross-tab sync: when admin saves in another tab, storefront picks it up
    const handleStorage = (e) => {
      if (e.key && e.key.startsWith('store_')) {
        const settingKey = e.key.replace('store_', '');
        const value = e.newValue;
        if (value !== null) {
          let parsed = value;
          if (value === 'true') parsed = true;
          else if (value === 'false') parsed = false;
          setSettings(prev => ({ ...prev, [settingKey]: parsed }));
        }
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const updateSetting = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const saveSettings = async (newSettings) => {
    const merged = { ...settings, ...newSettings };
    setSettings(merged);
    // Save to localStorage as fallback
    Object.entries(newSettings).forEach(([k, v]) => {
      localStorage.setItem(`store_${k}`, String(v));
    });
    // Try API
    try {
      await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSettings),
      });
    } catch {}
  };

  return (
    <SettingsContext.Provider value={{ settings, loading, updateSetting, saveSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}
