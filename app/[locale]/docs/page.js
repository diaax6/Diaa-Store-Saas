'use client';
import { useState } from 'react';
import { useParams } from 'next/navigation';

const endpoints = [
  { group: 'Authentication', color: '#10B981', endpoints: [
    { method: 'POST', path: '/api/auth/login', desc: 'Login with email and password', body: '{ "email": "user@test.com", "password": "..." }', response: '{ "token": "jwt...", "user": {...} }' },
    { method: 'POST', path: '/api/auth/register', desc: 'Create a new account', body: '{ "name": "...", "email": "...", "password": "..." }', response: '{ "message": "Verification email sent" }' },
    { method: 'POST', path: '/api/auth/forgot-password', desc: 'Request password reset', body: '{ "email": "..." }', response: '{ "message": "Reset link sent" }' },
  ]},
  { group: 'Products', color: '#3B82F6', endpoints: [
    { method: 'GET', path: '/api/products', desc: 'List all products', body: null, response: '[ { "id": "...", "name": "...", "price": 12, ... } ]' },
    { method: 'GET', path: '/api/products/:id', desc: 'Get product details', body: null, response: '{ "id": "...", "name": "...", "stock": 45, ... }' },
    { method: 'POST', path: '/api/products', desc: 'Create a product (admin)', body: '{ "name": "...", "price": 12, "categoryId": "..." }', response: '{ "id": "...", "created": true }' },
  ]},
  { group: 'Orders', color: '#F59E0B', endpoints: [
    { method: 'GET', path: '/api/orders', desc: 'List orders (authenticated)', body: null, response: '[ { "id": "ORD-...", "status": "delivered", ... } ]' },
    { method: 'POST', path: '/api/orders', desc: 'Create an order', body: '{ "productId": "...", "duration": "1month", "paymentMethod": "stripe" }', response: '{ "orderId": "ORD-...", "paymentUrl": "..." }' },
  ]},
  { group: 'Wallet', color: '#8B5CF6', endpoints: [
    { method: 'GET', path: '/api/wallet/balance', desc: 'Get wallet balance', body: null, response: '{ "balance": 50.00, "currency": "USD" }' },
    { method: 'POST', path: '/api/wallet/deposit', desc: 'Deposit to wallet', body: '{ "amount": 25, "method": "stripe" }', response: '{ "newBalance": 75.00, "transactionId": "..." }' },
  ]},
  { group: 'Webhooks', color: '#EF4444', endpoints: [
    { method: 'POST', path: '/api/payments/webhook', desc: 'Payment webhook endpoint', body: 'Stripe/PayPal webhook payload', response: '{ "received": true }' },
    { method: 'POST', path: '/api/telegram/webhook', desc: 'Telegram bot webhook', body: 'Telegram update object', response: '{ "ok": true }' },
  ]},
];

const methodColors = { GET: '#10B981', POST: '#3B82F6', PUT: '#F59E0B', DELETE: '#EF4444', PATCH: '#8B5CF6' };

export default function APIDocsPage() {
  const { locale } = useParams();
  const isAr = locale === 'ar';
  const [activeGroup, setActiveGroup] = useState(endpoints[0].group);
  const [expandedEndpoint, setExpandedEndpoint] = useState(null);
  const [apiKey] = useState('sk_live_diaastore_xxxxxxxxxxxxxxxxxxxx');

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: '40px 20px' }}>
      <div style={{ marginBottom: 30 }}>
        <h1 style={{ fontWeight: 800, fontSize: '1.8rem', marginBottom: 6 }}>{isAr ? 'وثائق API' : 'API Documentation'}</h1>
        <p style={{ color: 'var(--color-text-muted)' }}>{isAr ? 'دمج Diaa Store في تطبيقاتك' : 'Integrate Diaa Store into your applications'}</p>
      </div>

      {/* API Key */}
      <div style={{
        background: 'var(--color-surface)', border: '1px solid var(--color-border)',
        borderRadius: 14, padding: '16px 22px', marginBottom: 24,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div>
          <div style={{ fontSize: '.78rem', fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: 4 }}>{isAr ? 'مفتاح API الخاص بك' : 'Your API Key'}</div>
          <code style={{ fontSize: '.85rem', fontFamily: 'monospace', color: 'var(--color-primary)' }}>{apiKey.substring(0, 20)}...{apiKey.substring(apiKey.length - 4)}</code>
        </div>
        <button onClick={() => navigator.clipboard?.writeText(apiKey)} style={{
          padding: '8px 16px', borderRadius: 8, border: '1px solid var(--color-border)',
          background: 'transparent', color: 'var(--color-text)', fontWeight: 600,
          fontSize: '.78rem', cursor: 'pointer',
        }}>{ isAr ? 'نسخ المفتاح' : 'Copy Key'}</button>
      </div>

      {/* Base URL */}
      <div style={{
        background: 'rgba(16,185,129,.05)', border: '1px solid rgba(16,185,129,.15)',
        borderRadius: 12, padding: '12px 18px', marginBottom: 24, fontSize: '.85rem',
      }}>
        <span style={{ fontWeight: 600 }}>Base URL: </span>
        <code style={{ fontFamily: 'monospace', color: '#10B981' }}>https://api.diaastore.com/v1</code>
      </div>

      <div style={{ display: 'flex', gap: 20 }}>
        {/* Sidebar */}
        <div style={{ width: 200, flexShrink: 0 }}>
          <div style={{ position: 'sticky', top: 80 }}>
            {endpoints.map(g => (
              <button key={g.group} onClick={() => setActiveGroup(g.group)} style={{
                display: 'flex', alignItems: 'center', gap: 8, width: '100%',
                padding: '10px 14px', marginBottom: 4, borderRadius: 8,
                border: 'none', cursor: 'pointer', textAlign: 'left',
                background: activeGroup === g.group ? `${g.color}12` : 'transparent',
                color: activeGroup === g.group ? g.color : 'var(--color-text-muted)',
                fontWeight: activeGroup === g.group ? 700 : 500, fontSize: '.88rem',
                transition: '.15s',
              }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: g.color }} />
                {g.group}
                <span style={{ marginLeft: 'auto', fontSize: '.68rem', opacity: .6 }}>{g.endpoints.length}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div style={{ flex: 1 }}>
          {endpoints.filter(g => g.group === activeGroup).map(g => (
            <div key={g.group}>
              <h2 style={{ fontWeight: 800, fontSize: '1.2rem', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: g.color }} />
                {g.group}
              </h2>
              {g.endpoints.map((ep, i) => (
                <div key={i} style={{
                  background: 'var(--color-surface)', border: '1px solid var(--color-border)',
                  borderRadius: 12, marginBottom: 10, overflow: 'hidden',
                }}>
                  <button onClick={() => setExpandedEndpoint(expandedEndpoint === `${g.group}-${i}` ? null : `${g.group}-${i}`)} style={{
                    width: '100%', padding: '14px 18px', background: 'transparent', border: 'none',
                    display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer',
                    color: 'var(--color-text)', textAlign: 'left',
                  }}>
                    <span style={{
                      fontSize: '.68rem', fontWeight: 800, padding: '3px 10px', borderRadius: 6,
                      background: `${methodColors[ep.method]}15`, color: methodColors[ep.method],
                      fontFamily: 'monospace', minWidth: 45, textAlign: 'center',
                    }}>{ep.method}</span>
                    <code style={{ fontSize: '.88rem', fontFamily: 'monospace', flex: 1 }}>{ep.path}</code>
                    <span style={{ fontSize: '.78rem', color: 'var(--color-text-muted)' }}>{ep.desc}</span>
                  </button>
                  {expandedEndpoint === `${g.group}-${i}` && (
                    <div style={{ padding: '0 18px 18px', borderTop: '1px solid var(--color-border)' }}>
                      {ep.body && (
                        <div style={{ marginTop: 14 }}>
                          <div style={{ fontSize: '.72rem', fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: 6 }}>Request Body</div>
                          <pre style={{ background: 'var(--color-bg-tertiary)', borderRadius: 8, padding: 14, fontSize: '.82rem', fontFamily: 'monospace', color: '#F59E0B', overflow: 'auto', border: '1px solid var(--color-border)' }}>{ep.body}</pre>
                        </div>
                      )}
                      <div style={{ marginTop: 14 }}>
                        <div style={{ fontSize: '.72rem', fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: 6 }}>Response</div>
                        <pre style={{ background: 'var(--color-bg-tertiary)', borderRadius: 8, padding: 14, fontSize: '.82rem', fontFamily: 'monospace', color: '#10B981', overflow: 'auto', border: '1px solid var(--color-border)' }}>{ep.response}</pre>
                      </div>
                      <div style={{ marginTop: 10 }}>
                        <div style={{ fontSize: '.72rem', fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: 6 }}>cURL Example</div>
                        <pre style={{ background: 'rgba(0,0,0,.3)', borderRadius: 8, padding: 14, fontSize: '.78rem', fontFamily: 'monospace', color: 'var(--color-text-muted)', overflow: 'auto', border: '1px solid var(--color-border)' }}>
{`curl -X ${ep.method} https://api.diaastore.com/v1${ep.path} \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json"${ep.body ? ` \\
  -d '${ep.body}'` : ''}`}
                        </pre>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
