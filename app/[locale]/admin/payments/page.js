'use client';
import { useState, useEffect } from 'react';
import { useToast } from '../../components/ToastProvider';

const integrationFields = [
  { key: 'onlineCard', label: 'Online Card', icon: '💳', desc: 'Visa / Mastercard — دفع أونلاين بالكارت' },
  { key: 'cashDeposit', label: 'Cash Deposit', icon: '💵', desc: 'إيداع كاش في فرع بنك أو فوري' },
  { key: 'tapOnPhone', label: 'Tap on Phone', icon: '📱', desc: 'الدفع بالتقريب على الموبايل (NFC)' },
  { key: 'inStore', label: 'In Store', icon: '🏪', desc: 'دفع في المتجر / POS' },
];

const apiFields = [
  { key: 'apiKey', label: 'API Key', icon: '🔑', placeholder: 'ZXlKaGJHY2lP...' },
  { key: 'secretKey', label: 'Secret Key', icon: '🔐', placeholder: 'egy_sk_live_... / egy_sk_test_...' },
  { key: 'publicKey', label: 'Public Key', icon: '🌐', placeholder: 'egy_pk_live_... / egy_pk_test_...' },
  { key: 'hmacSecret', label: 'HMAC Secret', icon: '🛡️', placeholder: '18B9FD4A4FFC...' },
];

export default function PaymentSettingsPage() {
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [showKeys, setShowKeys] = useState({});
  const [mode, setMode] = useState('live');
  const [config, setConfig] = useState({
    mode: 'live',
    live: { apiKey: '', secretKey: '', publicKey: '', hmacSecret: '', integrations: {} },
    test: { apiKey: '', secretKey: '', publicKey: '', hmacSecret: '', integrations: {} },
  });

  useEffect(() => {
    fetch('/api/settings/paymob')
      .then(r => r.json())
      .then(data => {
        if (data.success && data.config) {
          setConfig(data.config);
          setMode(data.config.mode || 'live');
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const activeKeys = config[mode] || { apiKey: '', secretKey: '', publicKey: '', hmacSecret: '', integrations: {} };

  const updateKey = (key, val) => {
    setConfig(prev => ({
      ...prev,
      [mode]: { ...prev[mode], [key]: val }
    }));
  };

  const updateIntegration = (key, val) => {
    setConfig(prev => ({
      ...prev,
      [mode]: {
        ...prev[mode],
        integrations: { ...(prev[mode]?.integrations || {}), [key]: val }
      }
    }));
  };

  const switchMode = (m) => {
    setMode(m);
    setConfig(prev => ({ ...prev, mode: m }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/settings/paymob', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...config, mode }),
      });
      const data = await res.json();
      if (data.success) toast.success('✅ تم حفظ إعدادات الدفع بنجاح!');
      else toast.error('فشل الحفظ: ' + (data.error || ''));
    } catch (err) {
      toast.error('خطأ: ' + err.message);
    }
    setSaving(false);
  };

  const handleTest = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      // Save first so the API can read the latest config
      await fetch('/api/settings/paymob', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...config, mode }),
      });
      // Then test
      const res = await fetch('/api/paymob/pay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: 1,
          productName: 'Test Payment',
          customerEmail: 'test@test.com',
          customerName: 'Test User',
          paymentMethod: 'card',
        }),
      });
      const data = await res.json();
      if (data.success) {
        setTestResult({ ok: true, msg: '🎉 الاتصال ناجح! Paymob رد بـ checkout URL صالح.' });
        toast.success('🎉 اختبار Paymob نجح!');
      } else {
        setTestResult({ ok: false, msg: data.error || 'فشل الاتصال' });
      }
    } catch (err) {
      setTestResult({ ok: false, msg: err.message });
    }
    setTesting(false);
  };

  const toggleShow = (k) => setShowKeys(p => ({ ...p, [k]: !p[k] }));

  if (loading) return <div style={{ padding: 28, textAlign: 'center', color: 'var(--color-text-muted)', minHeight: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>;

  return (
    <div style={{ padding: '24px 28px', maxWidth: 900 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontWeight: 800, fontSize: '1.4rem', display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: '1.5rem' }}>💳</span> Payment Gateway
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '.82rem' }}>إعدادات بوابة الدفع Paymob — كل طرق الدفع</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={handleTest} disabled={testing || !activeKeys.secretKey} style={{
            padding: '9px 18px', borderRadius: 10, border: '1px solid var(--color-border)',
            background: 'transparent', color: 'var(--color-text)', fontWeight: 600,
            cursor: 'pointer', fontSize: '.82rem', opacity: testing ? .5 : 1,
          }}>
            {testing ? '⏳ جاري...' : '🧪 اختبار الاتصال'}
          </button>
          <button onClick={handleSave} disabled={saving} style={{
            padding: '9px 22px', borderRadius: 10, border: 'none',
            background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-dark, #e85d04))',
            color: '#fff', fontWeight: 700, cursor: 'pointer', fontSize: '.82rem',
            opacity: saving ? .5 : 1,
          }}>
            {saving ? '⏳ جاري...' : '💾 حفظ الإعدادات'}
          </button>
        </div>
      </div>

      {/* Test Result */}
      {testResult && (
        <div style={{
          padding: '12px 16px', borderRadius: 10, marginBottom: 16,
          background: testResult.ok ? 'rgba(16,185,129,.06)' : 'rgba(239,68,68,.06)',
          border: `1px solid ${testResult.ok ? 'rgba(16,185,129,.2)' : 'rgba(239,68,68,.2)'}`,
          fontSize: '.85rem', fontWeight: 600, color: testResult.ok ? '#10B981' : '#EF4444',
        }}>
          {testResult.ok ? '✅' : '❌'} {testResult.msg}
        </div>
      )}

      {/* Mode Toggle */}
      <div style={{
        background: 'var(--color-surface)', border: '1px solid var(--color-border)',
        borderRadius: 14, padding: '16px 20px', marginBottom: 16,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: '.92rem' }}>
            الوضع الحالي: <span style={{ color: mode === 'live' ? '#10B981' : '#F59E0B' }}>{mode === 'live' ? '🟢 Live (إنتاج)' : '🟡 Test (تجربة)'}</span>
          </div>
          <div style={{ fontSize: '.72rem', color: 'var(--color-text-muted)', marginTop: 2 }}>
            {mode === 'live' ? 'المدفوعات حقيقية — الفلوس هتتحول فعلاً' : 'وضع التجربة — مفيش فلوس حقيقية هتتحول'}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 4, background: 'var(--color-bg-tertiary)', borderRadius: 8, padding: 3 }}>
          {['test', 'live'].map(m => (
            <button key={m} onClick={() => switchMode(m)} style={{
              padding: '8px 20px', borderRadius: 6, border: 'none', fontWeight: 700,
              fontSize: '.78rem', cursor: 'pointer', transition: '.2s',
              background: mode === m
                ? (m === 'live' ? '#10B981' : '#F59E0B')
                : 'transparent',
              color: mode === m ? '#fff' : 'var(--color-text-muted)',
            }}>
              {m === 'live' ? '🟢 Live' : '🟡 Test'}
            </button>
          ))}
        </div>
      </div>

      {/* API Keys */}
      <div style={{
        background: 'var(--color-surface)', border: '1px solid var(--color-border)',
        borderRadius: 14, padding: 20, marginBottom: 16,
      }}>
        <h3 style={{ fontWeight: 700, fontSize: '.95rem', marginBottom: 4 }}>
          🔑 API Keys — <span style={{ color: mode === 'live' ? '#10B981' : '#F59E0B', fontSize: '.82rem' }}>{mode.toUpperCase()}</span>
        </h3>
        <p style={{ fontSize: '.72rem', color: 'var(--color-text-muted)', marginBottom: 16 }}>
          من <a href="https://accept.paymob.com" target="_blank" style={{ color: 'var(--color-primary)' }}>accept.paymob.com</a> → Settings → API Keys
          {mode === 'test' && <span style={{ color: '#F59E0B', fontWeight: 600 }}> (فعّل Test mode أولاً من الداشبورد)</span>}
        </p>
        {apiFields.map(f => (
          <div key={f.key} style={{ marginBottom: 12 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '.8rem', fontWeight: 600, marginBottom: 4 }}>
              {f.icon} {f.label}
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showKeys[`${mode}_${f.key}`] ? 'text' : 'password'}
                value={activeKeys[f.key] || ''}
                onChange={e => updateKey(f.key, e.target.value)}
                placeholder={f.placeholder}
                className="form-input"
                style={{ width: '100%', paddingRight: 40, fontFamily: 'monospace', fontSize: '.8rem' }}
              />
              <button onClick={() => toggleShow(`${mode}_${f.key}`)} style={{
                position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)',
                background: 'none', border: 'none', cursor: 'pointer', fontSize: '.85rem',
              }}>
                {showKeys[`${mode}_${f.key}`] ? '🙈' : '👁️'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Integration IDs */}
      <div style={{
        background: 'var(--color-surface)', border: '1px solid var(--color-border)',
        borderRadius: 14, padding: 20, marginBottom: 16,
      }}>
        <h3 style={{ fontWeight: 700, fontSize: '.95rem', marginBottom: 4 }}>
          🔗 Integration IDs — <span style={{ color: mode === 'live' ? '#10B981' : '#F59E0B', fontSize: '.82rem' }}>{mode.toUpperCase()}</span>
        </h3>
        <p style={{ fontSize: '.72rem', color: 'var(--color-text-muted)', marginBottom: 16 }}>
          من Settings → Integrations & Webhooks → انسخ الـ Integration ID لكل طريقة دفع
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {integrationFields.map(f => (
            <div key={f.key} style={{
              background: 'var(--color-bg-tertiary)', borderRadius: 10, padding: '14px 16px',
              border: activeKeys.integrations?.[f.key] ? '1px solid rgba(16,185,129,.3)' : '1px solid var(--color-border)',
            }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '.82rem', fontWeight: 700, marginBottom: 4 }}>
                <span style={{ fontSize: '1.1rem' }}>{f.icon}</span> {f.label}
                {activeKeys.integrations?.[f.key] && <span style={{ marginLeft: 'auto', fontSize: '.65rem', color: '#10B981', fontWeight: 600 }}>✓ مفعّل</span>}
              </label>
              <div style={{ fontSize: '.68rem', color: 'var(--color-text-muted)', marginBottom: 8 }}>{f.desc}</div>
              <input
                value={activeKeys.integrations?.[f.key] || ''}
                onChange={e => updateIntegration(f.key, e.target.value)}
                placeholder="Integration ID (e.g. 4475998)"
                className="form-input"
                style={{ width: '100%', fontFamily: 'monospace', fontSize: '.82rem' }}
              />
            </div>
          ))}
        </div>

        {/* Iframe ID */}
        <div style={{ marginTop: 14, background: 'var(--color-bg-tertiary)', borderRadius: 10, padding: '14px 16px', border: activeKeys.iframeId ? '1px solid rgba(16,185,129,.3)' : '1px solid var(--color-border)' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '.82rem', fontWeight: 700, marginBottom: 4 }}>
            <span style={{ fontSize: '1.1rem' }}>🖼️</span> Iframe ID
            {activeKeys.iframeId && <span style={{ marginLeft: 'auto', fontSize: '.65rem', color: '#10B981', fontWeight: 600 }}>✓ مفعّل</span>}
          </label>
          <div style={{ fontSize: '.68rem', color: 'var(--color-text-muted)', marginBottom: 8 }}>
            من Paymob → Settings → اضغط على الـ Integration → Iframe ID (لو مش لاقيه استخدم نفس الـ Online Card Integration ID)
          </div>
          <input
            value={activeKeys.iframeId || ''}
            onChange={e => updateKey('iframeId', e.target.value)}
            placeholder="Iframe ID (e.g. 850000)"
            className="form-input"
            style={{ width: '100%', fontFamily: 'monospace', fontSize: '.82rem' }}
          />
        </div>
      </div>

      {/* Webhook URL */}
      <div style={{
        background: 'var(--color-surface)', border: '1px solid var(--color-border)',
        borderRadius: 14, padding: 20, marginBottom: 16,
      }}>
        <h3 style={{ fontWeight: 700, fontSize: '.95rem', marginBottom: 10 }}>📡 Webhook (Callback URL)</h3>
        <p style={{ fontSize: '.72rem', color: 'var(--color-text-muted)', marginBottom: 10 }}>
          حط الرابط ده في Paymob → Integrations & Webhooks → Callback URL
        </p>
        <div style={{
          background: 'var(--color-bg-tertiary)', borderRadius: 8, padding: '10px 14px',
          fontFamily: 'monospace', fontSize: '.8rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <code>{typeof window !== 'undefined' ? window.location.origin : 'https://yourdomain.com'}/api/paymob/callback</code>
          <button onClick={() => {
            navigator.clipboard.writeText(`${window.location.origin}/api/paymob/callback`);
            toast.success('تم النسخ!');
          }} style={{
            background: 'var(--color-primary)', color: '#fff', border: 'none', borderRadius: 6,
            padding: '4px 12px', cursor: 'pointer', fontSize: '.7rem', fontWeight: 600,
          }}>Copy</button>
        </div>
      </div>

      {/* Quick Guide */}
      <div style={{
        background: 'rgba(59,130,246,.04)', border: '1px solid rgba(59,130,246,.12)',
        borderRadius: 14, padding: '18px 20px',
      }}>
        <h3 style={{ fontWeight: 700, fontSize: '.92rem', marginBottom: 10, color: '#3B82F6' }}>📖 دليل سريع</h3>
        <div style={{ fontSize: '.78rem', color: 'var(--color-text-secondary)', lineHeight: 2.2 }}>
          <div>① سجل دخول في <a href="https://accept.paymob.com" target="_blank" style={{ color: 'var(--color-primary)' }}>accept.paymob.com</a></div>
          <div>② لو عايز تجرب → فعّل <strong>Test Mode</strong> من الأعلى</div>
          <div>③ روح <strong>Settings → API Keys</strong> → انسخ الـ 4 مفاتيح</div>
          <div>④ روح <strong>Settings → Integrations & Webhooks</strong> → انسخ الـ Integration IDs</div>
          <div>⑤ الصق كل حاجة هنا → <strong>حفظ الإعدادات</strong></div>
          <div>⑥ اضغط <strong>اختبار الاتصال</strong> → لو ظهر ✅ يبقى تمام!</div>
        </div>
      </div>
    </div>
  );
}
