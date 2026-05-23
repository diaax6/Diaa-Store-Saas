'use client';
import { useState, useEffect, useRef } from 'react';
import { useSettings } from '../../context/SettingsContext';
import { useToast } from '../../components/ToastProvider';

export default function MaintenancePage() {
  const { settings: globalSettings, saveSettings } = useSettings();
  const toast = useToast();

  const [enabled, setEnabled] = useState(false);
  const [localSettings, setLocalSettings] = useState({
    title: 'We\'ll be back soon!',
    message: 'We are performing scheduled maintenance. We\'ll be back online shortly.',
    estimatedTime: '30',
    allowAdminAccess: true,
    showCountdown: true,
    notifySubscribers: false,
  });

  // Real countdown state
  const [countdown, setCountdown] = useState({ h: 0, m: 30, s: 0 });
  const [endTime, setEndTime] = useState(null);
  const timerRef = useRef(null);

  // Load saved settings on mount
  useEffect(() => {
    const isOn = globalSettings.maintenance_mode === true || globalSettings.maintenance_mode === 'true';
    setEnabled(isOn);
    try {
      const saved = localStorage.getItem('store_maintenance_config');
      if (saved) {
        const parsed = JSON.parse(saved);
        setLocalSettings(prev => ({ ...prev, ...parsed }));
      }
      // Load saved end time for live countdown
      const savedEnd = localStorage.getItem('store_maintenance_end');
      if (savedEnd) {
        const endMs = parseInt(savedEnd);
        if (endMs > Date.now()) {
          setEndTime(endMs);
        }
      }
    } catch {}
  }, [globalSettings.maintenance_mode]);

  // Live countdown timer
  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current);

    if (enabled && endTime && endTime > Date.now()) {
      timerRef.current = setInterval(() => {
        const diff = endTime - Date.now();
        if (diff <= 0) {
          setCountdown({ h: 0, m: 0, s: 0 });
          clearInterval(timerRef.current);
          // Auto-disable maintenance when timer ends
          setEnabled(false);
          saveSettings({ maintenance_mode: false });
          localStorage.setItem('store_maintenance_mode', 'false');
          localStorage.removeItem('store_maintenance_end');
          toast.success('⏰ Maintenance timer ended — Store is back LIVE!');
          return;
        }
        const totalSec = Math.floor(diff / 1000);
        setCountdown({
          h: Math.floor(totalSec / 3600),
          m: Math.floor((totalSec % 3600) / 60),
          s: totalSec % 60,
        });
      }, 1000);
    } else if (!enabled) {
      // Show static preview from estimated time
      const mins = parseInt(localSettings.estimatedTime) || 30;
      setCountdown({ h: Math.floor(mins / 60), m: mins % 60, s: 0 });
    }

    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [enabled, endTime, localSettings.estimatedTime]);

  const update = (key, val) => setLocalSettings(prev => ({ ...prev, [key]: val }));

  const toggleMaintenance = () => {
    const newState = !enabled;
    setEnabled(newState);

    if (newState) {
      // Calculate end time from estimated minutes
      const mins = parseInt(localSettings.estimatedTime) || 30;
      const end = Date.now() + mins * 60 * 1000;
      setEndTime(end);
      localStorage.setItem('store_maintenance_end', String(end));
    } else {
      setEndTime(null);
      localStorage.removeItem('store_maintenance_end');
    }

    // Save to SettingsContext + localStorage
    saveSettings({ maintenance_mode: newState });
    localStorage.setItem('store_maintenance_mode', String(newState));
    localStorage.setItem('store_maintenance_config', JSON.stringify(localSettings));

    if (newState) {
      toast.warning('⚠️ Maintenance Mode ACTIVATED — Storefront is now blocked');
    } else {
      toast.success('✅ Store is LIVE — Storefront is accessible');
    }
  };

  const handleSave = () => {
    localStorage.setItem('store_maintenance_config', JSON.stringify(localSettings));
    saveSettings({ maintenance_mode: enabled });
    localStorage.setItem('store_maintenance_mode', String(enabled));

    // Update end time if maintenance is active
    if (enabled) {
      const mins = parseInt(localSettings.estimatedTime) || 30;
      const end = Date.now() + mins * 60 * 1000;
      setEndTime(end);
      localStorage.setItem('store_maintenance_end', String(end));
    }
    toast.success('Maintenance settings saved!');
  };

  const pad = (n) => String(n).padStart(2, '0');

  return (
    <div style={{ padding: '24px 28px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontWeight: 800, fontSize: '1.4rem' }}>Maintenance Mode</h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '.85rem' }}>Enable maintenance mode to temporarily disable the storefront</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={handleSave} className="btn btn-ghost">Save Settings</button>
          <button onClick={toggleMaintenance} style={{
            padding: '10px 24px', borderRadius: 10, border: 'none', fontWeight: 700,
            cursor: 'pointer', fontSize: '.88rem',
            background: enabled ? 'linear-gradient(135deg, #10B981, #059669)' : 'linear-gradient(135deg, #EF4444, #DC2626)',
            color: '#fff', boxShadow: enabled ? '0 4px 15px rgba(16,185,129,.3)' : '0 4px 15px rgba(239,68,68,.3)',
          }}>
            {enabled ? '✅ Go LIVE' : '🔧 Enable Maintenance'}
          </button>
        </div>
      </div>

      {/* Status Card */}
      <div style={{
        background: enabled ? 'rgba(239,68,68,.06)' : 'rgba(16,185,129,.06)',
        border: `1px solid ${enabled ? 'rgba(239,68,68,.2)' : 'rgba(16,185,129,.2)'}`,
        borderRadius: 14, padding: '20px 24px', marginBottom: 24,
        display: 'flex', alignItems: 'center', gap: 16,
      }}>
        <div style={{
          width: 48, height: 48, borderRadius: '50%',
          background: enabled ? 'rgba(239,68,68,.12)' : 'rgba(16,185,129,.12)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {enabled ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
          )}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: '1rem', color: enabled ? '#EF4444' : '#10B981' }}>
            {enabled ? 'Maintenance Mode is ACTIVE' : 'Store is LIVE'}
          </div>
          <div style={{ fontSize: '.82rem', color: 'var(--color-text-muted)' }}>
            {enabled ? `Countdown: ${pad(countdown.h)}:${pad(countdown.m)}:${pad(countdown.s)} remaining` : 'All systems operational, storefront is accessible'}
          </div>
        </div>
        <div style={{
          padding: '6px 14px', borderRadius: 20, fontSize: '.72rem', fontWeight: 700,
          background: enabled ? 'rgba(239,68,68,.15)' : 'rgba(16,185,129,.15)',
          color: enabled ? '#EF4444' : '#10B981',
        }}>
          {enabled ? 'MAINTENANCE' : 'LIVE'}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* Settings */}
        <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 14, padding: 22 }}>
          <h3 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: 18 }}>Maintenance Settings</h3>
          
          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: '.78rem', fontWeight: 600, marginBottom: 4, display: 'block' }}>Page Title</label>
            <input value={localSettings.title} onChange={e => update('title', e.target.value)} className="form-input" style={{ width: '100%' }} />
          </div>

          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: '.78rem', fontWeight: 600, marginBottom: 4, display: 'block' }}>Message</label>
            <textarea value={localSettings.message} onChange={e => update('message', e.target.value)} rows={3} className="form-textarea" style={{ width: '100%' }} />
          </div>

          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: '.78rem', fontWeight: 600, marginBottom: 4, display: 'block' }}>Estimated Downtime (minutes)</label>
            <input type="number" value={localSettings.estimatedTime} onChange={e => update('estimatedTime', e.target.value)} className="form-input" style={{ width: '100%' }} />
          </div>

          {[
            ['allowAdminAccess', 'Allow admin access during maintenance'],
            ['showCountdown', 'Show countdown timer to visitors'],
            ['notifySubscribers', 'Notify subscribers via email'],
          ].map(([key, label]) => (
            <div key={key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0' }}>
              <span style={{ fontSize: '.85rem' }}>{label}</span>
              <label className="toggle-switch">
                <input type="checkbox" checked={localSettings[key]} onChange={() => update(key, !localSettings[key])} />
                <span className="toggle-slider"></span>
              </label>
            </div>
          ))}
        </div>

        {/* Live Preview */}
        <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 14, padding: 22 }}>
          <h3 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: 18 }}>Live Preview</h3>
          <div style={{
            background: 'var(--color-bg)', borderRadius: 12, padding: 30,
            border: '1px solid var(--color-border)', textAlign: 'center', minHeight: 300,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(230,126,34,.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#E67E22" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
            </div>
            <h2 style={{ fontWeight: 800, fontSize: '1.3rem', marginBottom: 8 }}>{localSettings.title}</h2>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '.88rem', maxWidth: 350, lineHeight: 1.6, marginBottom: 20 }}>{localSettings.message}</p>
            {localSettings.showCountdown && (
              <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
                {[[pad(countdown.h), 'HRS'], [pad(countdown.m), 'MIN'], [pad(countdown.s), 'SEC']].map(([v, l], i) => (
                  <div key={i} style={{ textAlign: 'center' }}>
                    <div style={{
                      background: 'rgba(0,0,0,.4)', borderRadius: 10, padding: '8px 14px',
                      fontFamily: 'monospace', fontSize: '1.3rem', fontWeight: 800,
                      border: '1px solid rgba(255,255,255,.06)', minWidth: 50,
                      color: enabled && countdown.s % 2 === 0 ? '#E67E22' : 'var(--color-text)',
                      transition: 'color 0.5s',
                    }}>{v}</div>
                    <div style={{ fontSize: '.6rem', color: 'var(--color-text-muted)', marginTop: 4, fontWeight: 600 }}>{l}</div>
                  </div>
                ))}
              </div>
            )}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '5px 14px', borderRadius: 16, fontSize: '.7rem', fontWeight: 600,
              background: enabled ? 'rgba(239,68,68,.1)' : 'rgba(16,185,129,.1)',
              color: enabled ? '#EF4444' : '#10B981',
            }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: enabled ? '#EF4444' : '#10B981', animation: enabled ? 'pulse 1.5s infinite' : 'none' }} />
              {enabled ? 'Under Maintenance' : 'Preview Mode'}
            </div>
            <div style={{ marginTop: 16, fontSize: '.72rem', color: 'var(--color-text-muted)', opacity: .5 }}>Diaa Store</div>
          </div>
        </div>
      </div>
    </div>
  );
}
