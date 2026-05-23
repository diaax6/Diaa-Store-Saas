'use client';
import { useState } from 'react';

const templates = [
  { id: 't1', name: 'Welcome Email', trigger: 'On Registration', subject: 'Welcome to Diaa Store!', active: true, lastEdited: '2025-05-20',
    body: 'Hi {{name}},\n\nWelcome to Diaa Store! Your account is ready.\n\nStart browsing our premium digital products and enjoy instant auto-delivery.\n\nBest regards,\nDiaa Store Team' },
  { id: 't2', name: 'Order Confirmation', trigger: 'On Purchase', subject: 'Order #{{orderId}} Confirmed', active: true, lastEdited: '2025-05-18',
    body: 'Hi {{name}},\n\nYour order #{{orderId}} has been confirmed!\n\nProduct: {{product}}\nAmount: ${{amount}}\nStatus: {{status}}\n\nYour credentials have been delivered to your account.\n\nThank you!' },
  { id: 't3', name: 'Cart Reminder', trigger: 'Abandoned Cart', subject: 'You left something behind!', active: true, lastEdited: '2025-05-19',
    body: 'Hi {{name}},\n\nYou have items waiting in your cart:\n\n{{cartItems}}\n\nComplete your purchase now and get instant delivery!\n\nUse code COMEBACK10 for 10% off.' },
  { id: 't4', name: 'Password Reset', trigger: 'On Request', subject: 'Reset Your Password', active: true, lastEdited: '2025-05-15',
    body: 'Hi {{name}},\n\nClick the link below to reset your password:\n\n{{resetLink}}\n\nThis link expires in 1 hour.\n\nIf you didn\'t request this, ignore this email.' },
  { id: 't5', name: 'Subscription Expiry', trigger: '3 Days Before', subject: 'Your subscription expires soon', active: false, lastEdited: '2025-05-12',
    body: 'Hi {{name}},\n\nYour {{product}} subscription expires on {{expiryDate}}.\n\nRenew now to keep your access:\n{{renewLink}}\n\nDon\'t miss out!' },
];

const variables = ['{{name}}', '{{email}}', '{{orderId}}', '{{product}}', '{{amount}}', '{{status}}', '{{resetLink}}', '{{expiryDate}}', '{{cartItems}}', '{{renewLink}}'];

export default function EmailTemplatesPage() {
  const [data, setData] = useState(templates);
  const [editing, setEditing] = useState(null);
  const [editForm, setEditForm] = useState({});

  const startEdit = (t) => {
    setEditing(t.id);
    setEditForm({ ...t });
  };
  const save = () => {
    setData(prev => prev.map(t => t.id === editing ? { ...editForm, lastEdited: new Date().toISOString().split('T')[0] } : t));
    setEditing(null);
  };
  const toggleActive = (id) => setData(prev => prev.map(t => t.id === id ? { ...t, active: !t.active } : t));

  return (
    <div style={{ padding: '24px 28px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontWeight: 800, fontSize: '1.4rem' }}>Email Templates</h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '.85rem' }}>Customize automated email notifications</p>
        </div>
      </div>

      {editing ? (
        <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 14, padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
            <h2 style={{ fontWeight: 700, fontSize: '1.1rem' }}>Edit: {editForm.name}</h2>
            <button onClick={() => setEditing(null)} style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer', fontSize: '.88rem' }}>Cancel</button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
            <div>
              <label style={{ fontSize: '.78rem', fontWeight: 600, marginBottom: 4, display: 'block' }}>Template Name</label>
              <input value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-bg-tertiary)', color: 'var(--color-text)', fontSize: '.9rem', outline: 'none' }} />
            </div>
            <div>
              <label style={{ fontSize: '.78rem', fontWeight: 600, marginBottom: 4, display: 'block' }}>Subject Line</label>
              <input value={editForm.subject} onChange={e => setEditForm({ ...editForm, subject: e.target.value })} style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-bg-tertiary)', color: 'var(--color-text)', fontSize: '.9rem', outline: 'none' }} />
            </div>
          </div>
          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: '.78rem', fontWeight: 600, marginBottom: 4, display: 'block' }}>Email Body</label>
            <textarea value={editForm.body} onChange={e => setEditForm({ ...editForm, body: e.target.value })} rows={10} style={{ width: '100%', padding: 14, borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-bg-tertiary)', color: 'var(--color-text)', fontSize: '.88rem', fontFamily: 'monospace', resize: 'vertical', outline: 'none', lineHeight: 1.6 }} />
          </div>
          <div style={{ marginBottom: 18 }}>
            <span style={{ fontSize: '.72rem', fontWeight: 600, color: 'var(--color-text-muted)' }}>Available Variables: </span>
            {variables.map(v => (
              <button key={v} onClick={() => setEditForm({ ...editForm, body: editForm.body + ' ' + v })} style={{
                fontSize: '.68rem', padding: '2px 8px', borderRadius: 6, margin: '2px',
                border: '1px solid rgba(230,126,34,.3)', background: 'rgba(230,126,34,.08)',
                color: 'var(--color-primary)', cursor: 'pointer', fontFamily: 'monospace',
              }}>{v}</button>
            ))}
          </div>
          <button onClick={save} style={{ padding: '10px 28px', borderRadius: 8, border: 'none', background: 'var(--color-primary)', color: '#fff', fontWeight: 700, cursor: 'pointer' }}>Save Template</button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {data.map(t => (
            <div key={t.id} style={{
              background: 'var(--color-surface)', border: '1px solid var(--color-border)',
              borderRadius: 12, padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              opacity: t.active ? 1 : 0.5,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(230,126,34,.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '.92rem' }}>{t.name}</div>
                  <div style={{ fontSize: '.72rem', color: 'var(--color-text-muted)' }}>{t.trigger} | Subject: {t.subject}</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: '.68rem', color: 'var(--color-text-muted)' }}>{t.lastEdited}</span>
                <button onClick={() => toggleActive(t.id)} style={{
                  width: 40, height: 22, borderRadius: 11, border: 'none', cursor: 'pointer',
                  background: t.active ? 'var(--color-primary)' : 'rgba(255,255,255,.1)',
                  position: 'relative', transition: '.2s',
                }}>
                  <div style={{ width: 16, height: 16, borderRadius: '50%', background: '#fff', position: 'absolute', top: 3, left: t.active ? 21 : 3, transition: '.2s' }} />
                </button>
                <button onClick={() => startEdit(t)} style={{
                  padding: '6px 14px', borderRadius: 8, border: '1px solid var(--color-border)',
                  background: 'transparent', color: 'var(--color-text)', fontWeight: 600,
                  fontSize: '.78rem', cursor: 'pointer',
                }}>Edit</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
