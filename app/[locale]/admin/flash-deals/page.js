'use client';
import { useState } from 'react';

const defaultDeals = [
  { id: 'd1', name: 'ChatGPT Plus', from: 20, to: 12, badge: '-40%', color: '#10B981', active: true, endDate: '2025-06-01', endTime: '23:59' },
  { id: 'd2', name: 'Adobe Creative Cloud', from: 55, to: 25, badge: '-55%', color: '#FF3366', active: true, endDate: '2025-05-28', endTime: '23:59' },
  { id: 'd3', name: 'Spotify Premium', from: 13, to: 8, badge: '-38%', color: '#1DB954', active: false, endDate: '2025-05-30', endTime: '23:59' },
];

export default function FlashDealsPage() {
  const [deals, setDeals] = useState(defaultDeals);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({});
  const [bannerEnabled, setBannerEnabled] = useState(true);

  const startEdit = (d) => { setEditing(d.id); setForm({ ...d }); };
  const startNew = () => {
    const newId = 'd' + Date.now();
    setForm({ id: newId, name: '', from: 0, to: 0, badge: '', color: '#10B981', active: true, endDate: '', endTime: '23:59' });
    setEditing(newId);
  };
  const save = () => {
    const badge = form.from > 0 ? `-${Math.round((1 - form.to / form.from) * 100)}%` : '-0%';
    const updated = { ...form, badge };
    setDeals(prev => prev.find(d => d.id === updated.id) ? prev.map(d => d.id === updated.id ? updated : d) : [...prev, updated]);
    setEditing(null);
  };
  const remove = (id) => setDeals(prev => prev.filter(d => d.id !== id));
  const toggleActive = (id) => setDeals(prev => prev.map(d => d.id === id ? { ...d, active: !d.active } : d));
  const u = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

  return (
    <div style={{ padding: '24px 28px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontWeight: 800, fontSize: '1.4rem' }}>Flash Deals</h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '.85rem' }}>Manage flash deal banners on the storefront</p>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', borderRadius: 10, background: bannerEnabled ? 'rgba(16,185,129,.08)' : 'rgba(239,68,68,.08)', border: `1px solid ${bannerEnabled ? 'rgba(16,185,129,.2)' : 'rgba(239,68,68,.2)'}` }}>
            <span style={{ fontSize: '.82rem', fontWeight: 600, color: bannerEnabled ? '#10B981' : '#EF4444' }}>{bannerEnabled ? 'Banner Active' : 'Banner Hidden'}</span>
            <button onClick={() => setBannerEnabled(!bannerEnabled)} style={{ width: 40, height: 22, borderRadius: 11, border: 'none', cursor: 'pointer', background: bannerEnabled ? '#10B981' : 'rgba(255,255,255,.1)', position: 'relative', transition: '.2s' }}>
              <div style={{ width: 16, height: 16, borderRadius: '50%', background: '#fff', position: 'absolute', top: 3, left: bannerEnabled ? 21 : 3, transition: '.2s' }} />
            </button>
          </div>
          <button onClick={startNew} style={{ padding: '10px 20px', borderRadius: 10, border: 'none', background: 'var(--color-primary)', color: '#fff', fontWeight: 700, cursor: 'pointer', fontSize: '.88rem' }}>+ Add Deal</button>
        </div>
      </div>

      {editing ? (
        <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 14, padding: 24 }}>
          <h2 style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: 20 }}>{deals.find(d => d.id === form.id) ? 'Edit Deal' : 'New Deal'}</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14, marginBottom: 14 }}>
            <div>
              <label style={{ fontSize: '.78rem', fontWeight: 600, marginBottom: 4, display: 'block' }}>Product Name</label>
              <input value={form.name} onChange={e => u('name', e.target.value)} placeholder="e.g. ChatGPT Plus" style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-bg-tertiary)', color: 'var(--color-text)', fontSize: '.9rem', outline: 'none' }} />
            </div>
            <div>
              <label style={{ fontSize: '.78rem', fontWeight: 600, marginBottom: 4, display: 'block' }}>Original Price ($)</label>
              <input type="number" value={form.from} onChange={e => u('from', +e.target.value)} style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-bg-tertiary)', color: 'var(--color-text)', fontSize: '.9rem', outline: 'none' }} />
            </div>
            <div>
              <label style={{ fontSize: '.78rem', fontWeight: 600, marginBottom: 4, display: 'block' }}>Sale Price ($)</label>
              <input type="number" value={form.to} onChange={e => u('to', +e.target.value)} style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-bg-tertiary)', color: 'var(--color-text)', fontSize: '.9rem', outline: 'none' }} />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14, marginBottom: 14 }}>
            <div>
              <label style={{ fontSize: '.78rem', fontWeight: 600, marginBottom: 4, display: 'block' }}>End Date</label>
              <input type="date" value={form.endDate} onChange={e => u('endDate', e.target.value)} style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-bg-tertiary)', color: 'var(--color-text)', fontSize: '.9rem', outline: 'none' }} />
            </div>
            <div>
              <label style={{ fontSize: '.78rem', fontWeight: 600, marginBottom: 4, display: 'block' }}>End Time</label>
              <input type="time" value={form.endTime} onChange={e => u('endTime', e.target.value)} style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-bg-tertiary)', color: 'var(--color-text)', fontSize: '.9rem', outline: 'none' }} />
            </div>
            <div>
              <label style={{ fontSize: '.78rem', fontWeight: 600, marginBottom: 4, display: 'block' }}>Accent Color</label>
              <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                <input type="color" value={form.color} onChange={e => u('color', e.target.value)} style={{ width: 40, height: 38, border: 'none', borderRadius: 8, cursor: 'pointer', background: 'transparent' }} />
                <input value={form.color} onChange={e => u('color', e.target.value)} style={{ flex: 1, padding: '10px 14px', borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-bg-tertiary)', color: 'var(--color-text)', fontSize: '.82rem', fontFamily: 'monospace', outline: 'none' }} />
              </div>
            </div>
          </div>

          {/* Preview */}
          {form.name && (
            <div style={{ marginBottom: 18 }}>
              <label style={{ fontSize: '.78rem', fontWeight: 600, marginBottom: 8, display: 'block' }}>Preview</label>
              <div style={{ background: `linear-gradient(135deg, ${form.color}15, transparent 60%)`, border: `1px solid ${form.color}30`, borderRadius: 14, padding: '16px 22px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: `${form.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={form.color} strokeWidth="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                  </div>
                  <div>
                    <div style={{ display: 'flex', gap: 6, marginBottom: 4 }}>
                      <span style={{ fontSize: '.64rem', fontWeight: 800, padding: '2px 8px', borderRadius: 20, background: `${form.color}20`, color: form.color }}>FLASH DEAL</span>
                      {form.from > 0 && <span style={{ fontSize: '.64rem', fontWeight: 700, padding: '2px 8px', borderRadius: 20, background: '#EF444420', color: '#EF4444' }}>-{Math.round((1 - form.to / form.from) * 100)}%</span>}
                    </div>
                    <div style={{ fontWeight: 800 }}>
                      {form.name}
                      <span style={{ marginLeft: 8, textDecoration: 'line-through', color: 'var(--color-text-muted)', fontSize: '.82rem', fontWeight: 400 }}>${form.from}</span>
                      <span style={{ marginLeft: 6, color: form.color, fontFamily: 'monospace' }}>${form.to}</span>
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  {['12','30','45'].map((v, i) => (
                    <div key={i} style={{ textAlign: 'center' }}>
                      <div style={{ background: 'rgba(0,0,0,.3)', borderRadius: 6, padding: '4px 6px', fontFamily: 'monospace', fontSize: '1rem', fontWeight: 800, color: '#fff', border: '1px solid rgba(255,255,255,.08)' }}>{v}</div>
                      <div style={{ fontSize: '.5rem', color: 'var(--color-text-muted)', marginTop: 1 }}>{['HRS','MIN','SEC'][i]}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={save} style={{ padding: '10px 28px', borderRadius: 8, border: 'none', background: 'var(--color-primary)', color: '#fff', fontWeight: 700, cursor: 'pointer' }}>Save Deal</button>
            <button onClick={() => setEditing(null)} style={{ padding: '10px 20px', borderRadius: 8, border: '1px solid var(--color-border)', background: 'transparent', color: 'var(--color-text-muted)', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {deals.length === 0 && (
            <div style={{ textAlign: 'center', padding: 60, background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 14 }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.1)" strokeWidth="1.5" style={{ margin: '0 auto 16px', display: 'block' }}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
              <h3 style={{ fontWeight: 700, marginBottom: 4 }}>No flash deals yet</h3>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '.88rem', marginBottom: 16 }}>Create your first flash deal to boost conversions</p>
              <button onClick={startNew} style={{ padding: '10px 24px', borderRadius: 10, border: 'none', background: 'var(--color-primary)', color: '#fff', fontWeight: 700, cursor: 'pointer' }}>Create Flash Deal</button>
            </div>
          )}
          {deals.map(d => (
            <div key={d.id} style={{
              background: 'var(--color-surface)', border: '1px solid var(--color-border)',
              borderRadius: 12, padding: '16px 20px', display: 'flex', alignItems: 'center',
              justifyContent: 'space-between', opacity: d.active ? 1 : 0.5,
              borderLeft: `3px solid ${d.color}`,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ width: 42, height: 42, borderRadius: 10, background: `${d.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={d.color} strokeWidth="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '.95rem' }}>{d.name}</div>
                  <div style={{ fontSize: '.75rem', color: 'var(--color-text-muted)', display: 'flex', gap: 10 }}>
                    <span><span style={{ textDecoration: 'line-through' }}>${d.from}</span> → <span style={{ color: d.color, fontWeight: 700 }}>${d.to}</span></span>
                    <span style={{ color: '#EF4444', fontWeight: 700 }}>{d.badge}</span>
                    <span>Ends: {d.endDate} {d.endTime}</span>
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <button onClick={() => toggleActive(d.id)} style={{ width: 40, height: 22, borderRadius: 11, border: 'none', cursor: 'pointer', background: d.active ? d.color : 'rgba(255,255,255,.1)', position: 'relative', transition: '.2s' }}>
                  <div style={{ width: 16, height: 16, borderRadius: '50%', background: '#fff', position: 'absolute', top: 3, left: d.active ? 21 : 3, transition: '.2s' }} />
                </button>
                <button onClick={() => startEdit(d)} style={{ padding: '6px 14px', borderRadius: 8, border: '1px solid var(--color-border)', background: 'transparent', color: 'var(--color-text)', fontWeight: 600, fontSize: '.78rem', cursor: 'pointer' }}>Edit</button>
                <button onClick={() => remove(d.id)} style={{ padding: '6px 10px', borderRadius: 8, border: '1px solid rgba(239,68,68,.2)', background: 'rgba(239,68,68,.06)', color: '#EF4444', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
