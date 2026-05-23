'use client';

import { useEffect } from 'react';

/**
 * ThemeInitializer — reads theme settings from localStorage (set by admin appearance page)
 * and applies them to the document on first load. This bridges admin ↔ storefront theming.
 */
export default function ThemeInitializer() {
  useEffect(() => {
    // Apply saved theme
    const savedTheme = localStorage.getItem('store_theme') || localStorage.getItem('theme');
    if (savedTheme) {
      document.documentElement.setAttribute('data-theme', savedTheme);
    }

    // Apply saved primary color
    const savedPrimary = localStorage.getItem('store_primary');
    if (savedPrimary) {
      document.documentElement.style.setProperty('--color-primary', savedPrimary);
      document.documentElement.style.setProperty('--color-primary-light', savedPrimary + 'CC');
    }

    // Apply saved accent color
    const savedAccent = localStorage.getItem('store_accent');
    if (savedAccent) {
      document.documentElement.style.setProperty('--color-accent', savedAccent);
    }

    // Apply saved border radius
    const savedRadius = localStorage.getItem('store_radius');
    if (savedRadius) {
      document.documentElement.style.setProperty('--radius-md', savedRadius + 'px');
    }

    // Apply saved background image
    const savedBg = localStorage.getItem('store_bg_image');
    const savedBgOpacity = localStorage.getItem('store_bg_opacity');
    if (savedBg) {
      let bgEl = document.getElementById('store-custom-bg');
      if (!bgEl) {
        bgEl = document.createElement('div');
        bgEl.id = 'store-custom-bg';
        bgEl.style.cssText = `
          position: fixed;
          inset: 0;
          z-index: -1;
          pointer-events: none;
          background-image: url(${savedBg});
          background-size: cover;
          background-position: center;
          opacity: ${(savedBgOpacity || 15) / 100};
        `;
        document.body.prepend(bgEl);
      }
    }
  }, []);

  return null;
}
