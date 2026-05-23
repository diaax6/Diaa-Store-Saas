'use client';
import { useSettings } from '../context/SettingsContext';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

/**
 * MaintenanceGate: blocks the storefront when maintenance_mode is enabled.
 * Admin routes (/admin/*) are always accessible.
 * Shows a real countdown timer that ticks every second.
 */
export default function MaintenanceGate({ children }) {
  const { settings } = useSettings();
  const pathname = usePathname();
  const [countdown, setCountdown] = useState({ h: 0, m: 30, s: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  // Admin routes always accessible
  if (pathname.includes('/admin')) return children;

  const isMaintenanceOn = settings.maintenance_mode === true || settings.maintenance_mode === 'true';
  if (!isMaintenanceOn) return children;

  // Don't render maintenance page until client-side mounted
  if (!mounted) return children;

  // Load maintenance config
  let config = {
    title: "We'll be back soon!",
    message: 'We are performing scheduled maintenance. We\'ll be back online shortly.',
    showCountdown: true,
  };
  try {
    const saved = localStorage.getItem('store_maintenance_config');
    if (saved) config = { ...config, ...JSON.parse(saved) };
  } catch {}

  return <MaintenancePage config={config} />;
}

function MaintenancePage({ config }) {
  const [countdown, setCountdown] = useState({ h: 0, m: 0, s: 0 });
  const { saveSettings } = useSettings();

  useEffect(() => {
    const endTimeStr = localStorage.getItem('store_maintenance_end');
    if (!endTimeStr) {
      setCountdown({ h: 0, m: 30, s: 0 });
      return;
    }

    const endTime = parseInt(endTimeStr);
    const tick = () => {
      const diff = endTime - Date.now();
      if (diff <= 0) {
        setCountdown({ h: 0, m: 0, s: 0 });
        // Auto-restore storefront
        saveSettings({ maintenance_mode: false });
        localStorage.setItem('store_maintenance_mode', 'false');
        localStorage.removeItem('store_maintenance_end');
        window.location.reload();
        return;
      }
      const totalSec = Math.floor(diff / 1000);
      setCountdown({
        h: Math.floor(totalSec / 3600),
        m: Math.floor((totalSec % 3600) / 60),
        s: totalSec % 60,
      });
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  const pad = (n) => String(n).padStart(2, '0');

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--color-bg)',
      padding: 20,
    }}>
      <div style={{ textAlign: 'center', maxWidth: 500, padding: 40 }}>
        {/* Icon */}
        <div style={{
          width: 80, height: 80, borderRadius: '50%',
          background: 'rgba(230,126,34,.1)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 24px',
          animation: 'pulse 2s infinite',
        }}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#E67E22" strokeWidth="1.5">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
        </div>

        <h1 style={{ fontWeight: 800, fontSize: '2rem', marginBottom: 12, color: 'var(--color-text)' }}>
          {config.title}
        </h1>
        <p style={{
          color: 'var(--color-text-muted)', fontSize: '1rem',
          lineHeight: 1.7, marginBottom: 30, maxWidth: 400, margin: '0 auto 30px',
        }}>
          {config.message}
        </p>

        {config.showCountdown && (
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginBottom: 30 }}>
            {[[pad(countdown.h), 'HRS'], [pad(countdown.m), 'MIN'], [pad(countdown.s), 'SEC']].map(([v, l], i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{
                  background: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 12, padding: '12px 18px',
                  fontFamily: 'monospace', fontSize: '1.5rem', fontWeight: 800,
                  minWidth: 60,
                  color: countdown.s % 2 === 0 ? '#E67E22' : 'var(--color-text)',
                  transition: 'color 0.5s',
                }}>{v}</div>
                <div style={{ fontSize: '.65rem', color: 'var(--color-text-muted)', marginTop: 4, fontWeight: 600, letterSpacing: '0.1em' }}>{l}</div>
              </div>
            ))}
          </div>
        )}

        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '8px 20px', borderRadius: 20,
          background: 'rgba(239,68,68,.08)', border: '1px solid rgba(239,68,68,.2)',
          fontSize: '.78rem', fontWeight: 600, color: '#EF4444',
        }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#EF4444', animation: 'pulse 1.5s infinite' }} />
          Under Maintenance
        </div>

        <div style={{ marginTop: 24, fontSize: '.72rem', color: 'var(--color-text-muted)', opacity: .5 }}>
          Diaa Store
        </div>
      </div>
    </div>
  );
}
