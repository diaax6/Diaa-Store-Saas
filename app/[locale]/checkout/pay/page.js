'use client';
import { useEffect, useRef, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

/**
 * Custom Paymob payment page
 * Uses a hidden iframe approach: creates an iframe with a form that submits to Paymob
 */
function PaymobPayPageContent() {
  const searchParams = useSearchParams();
  const paymentToken = searchParams.get('token');
  const [status, setStatus] = useState('loading'); // loading, ready, error
  const iframeRef = useRef(null);

  useEffect(() => {
    if (!paymentToken) {
      setStatus('error');
      return;
    }

    // Create a temporary HTML document for the iframe that auto-submits to Paymob
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Processing Payment...</title>
        <style>
          body { margin: 0; display: flex; align-items: center; justify-content: center; min-height: 100vh; background: #f8fafc; font-family: system-ui; }
          .loader { text-align: center; }
          .spinner { width: 40px; height: 40px; border: 3px solid #e2e8f0; border-top-color: #3b82f6; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 12px; }
          @keyframes spin { to { transform: rotate(360deg); } }
        </style>
      </head>
      <body>
        <div class="loader">
          <div class="spinner"></div>
          <p>Loading payment form...</p>
        </div>
        <form id="pf" method="POST" action="https://accept.paymob.com/api/acceptance/post_pay" style="display:none">
          <input name="payment_token" value="${paymentToken}"/>
        </form>
        <script>document.getElementById('pf').submit();</script>
      </body>
      </html>
    `;

    if (iframeRef.current) {
      const blob = new Blob([htmlContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      iframeRef.current.src = url;
      setStatus('ready');
      return () => URL.revokeObjectURL(url);
    }
  }, [paymentToken]);

  if (!paymentToken) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'linear-gradient(135deg, #0f172a, #1e293b)', color: '#fff', fontFamily: 'system-ui',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>❌</div>
          <h1 style={{ fontSize: 20, fontWeight: 700 }}>خطأ في الدفع</h1>
          <p style={{ color: '#94a3b8', marginTop: 8 }}>رابط الدفع غير صالح</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh', background: '#f1f5f9', display: 'flex', flexDirection: 'column',
    }}>
      {/* Header */}
      <div style={{
        background: '#fff', borderBottom: '1px solid #e2e8f0', padding: '12px 24px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 20 }}>💳</span>
          <span style={{ fontWeight: 700, fontSize: 16, color: '#1e293b' }}>Secure Payment</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ color: '#10b981', fontSize: 14 }}>🔒</span>
          <span style={{ fontSize: 12, color: '#64748b' }}>Secured by Paymob</span>
        </div>
      </div>

      {/* Iframe */}
      <iframe
        ref={iframeRef}
        style={{
          flex: 1, border: 'none', width: '100%', minHeight: 'calc(100vh - 50px)',
        }}
        title="Paymob Payment"
        sandbox="allow-forms allow-scripts allow-same-origin allow-top-navigation allow-popups"
      />
    </div>
  );
}


export default function PaymobPayPage() {
  return (
    <Suspense fallback={<div style={{padding:40,textAlign:'center'}}>Loading...</div>}>
      <PaymobPayPageContent />
    </Suspense>
  );
}
