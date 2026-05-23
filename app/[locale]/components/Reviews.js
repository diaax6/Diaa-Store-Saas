'use client';
import { useState } from 'react';

const demoReviews = {
  '1': [
    { id: 'r1', user: 'Ahmed M.', rating: 5, text: 'Instant delivery, works perfectly. Best price I found online!', date: '2025-05-20', verified: true },
    { id: 'r2', user: 'Sara A.', rating: 4, text: 'Great service, account delivered in seconds.', date: '2025-05-19', verified: true },
    { id: 'r3', user: 'Omar H.', rating: 5, text: 'Third time buying from here. Never had an issue.', date: '2025-05-18', verified: true },
    { id: 'r4', user: 'Mona K.', rating: 5, text: 'Amazing prices and the auto-delivery is incredible!', date: '2025-05-17', verified: false },
  ],
};

function Stars({ rating, size = 14, interactive = false, onChange }) {
  const [hover, setHover] = useState(0);
  return (
    <div style={{ display: 'flex', gap: 2 }}>
      {[1, 2, 3, 4, 5].map(i => (
        <svg key={i} width={size} height={size} viewBox="0 0 24 24"
          fill={(interactive ? (hover || rating) : rating) >= i ? '#F59E0B' : 'none'}
          stroke={(interactive ? (hover || rating) : rating) >= i ? '#F59E0B' : 'rgba(255,255,255,.2)'}
          strokeWidth="2" style={{ cursor: interactive ? 'pointer' : 'default', transition: '.15s' }}
          onMouseEnter={() => interactive && setHover(i)}
          onMouseLeave={() => interactive && setHover(0)}
          onClick={() => interactive && onChange?.(i)}
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </div>
  );
}

export function ReviewsSummary({ productId }) {
  const reviews = demoReviews[productId] || demoReviews['1'];
  const avg = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
  const distribution = [5, 4, 3, 2, 1].map(r => ({ rating: r, count: reviews.filter(rv => rv.rating === r).length }));

  return (
    <div style={{ display: 'flex', gap: 30, alignItems: 'flex-start', flexWrap: 'wrap' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '2.5rem', fontWeight: 800, lineHeight: 1 }}>{avg.toFixed(1)}</div>
        <Stars rating={Math.round(avg)} size={18} />
        <div style={{ fontSize: '.78rem', color: 'var(--color-text-muted)', marginTop: 4 }}>{reviews.length} reviews</div>
      </div>
      <div style={{ flex: 1, minWidth: 200 }}>
        {distribution.map(d => (
          <div key={d.rating} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span style={{ fontSize: '.72rem', fontWeight: 600, width: 14 }}>{d.rating}</span>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="#F59E0B" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
            <div style={{ flex: 1, height: 6, borderRadius: 3, background: 'var(--color-bg-tertiary)' }}>
              <div style={{ height: '100%', borderRadius: 3, background: '#F59E0B', width: `${reviews.length ? (d.count / reviews.length) * 100 : 0}%` }} />
            </div>
            <span style={{ fontSize: '.68rem', color: 'var(--color-text-muted)', width: 20, textAlign: 'right' }}>{d.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ReviewsList({ productId }) {
  const reviews = demoReviews[productId] || demoReviews['1'];
  const [showForm, setShowForm] = useState(false);
  const [newRating, setNewRating] = useState(0);
  const [newText, setNewText] = useState('');

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h3 style={{ fontWeight: 800, fontSize: '1.1rem' }}>Customer Reviews</h3>
        <button onClick={() => setShowForm(!showForm)} style={{
          padding: '8px 18px', borderRadius: 8, border: '1px solid var(--color-primary)',
          background: 'rgba(230,126,34,.08)', color: 'var(--color-primary)',
          fontWeight: 600, fontSize: '.82rem', cursor: 'pointer',
        }}>Write a Review</button>
      </div>

      {showForm && (
        <div style={{
          background: 'var(--color-surface)', border: '1px solid var(--color-border)',
          borderRadius: 12, padding: 20, marginBottom: 20,
        }}>
          <div style={{ marginBottom: 12 }}>
            <span style={{ fontSize: '.82rem', fontWeight: 600, marginRight: 10 }}>Your Rating:</span>
            <Stars rating={newRating} size={20} interactive onChange={setNewRating} />
          </div>
          <textarea value={newText} onChange={e => setNewText(e.target.value)}
            placeholder="Share your experience..."
            style={{
              width: '100%', minHeight: 80, padding: 12, borderRadius: 8,
              border: '1px solid var(--color-border)', background: 'var(--color-bg-tertiary)',
              color: 'var(--color-text)', fontSize: '.9rem', resize: 'vertical',
              fontFamily: 'inherit', outline: 'none',
            }}
          />
          <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
            <button style={{
              padding: '8px 20px', borderRadius: 8, border: 'none',
              background: 'var(--color-primary)', color: '#fff', fontWeight: 700,
              fontSize: '.82rem', cursor: 'pointer',
            }}>Submit Review</button>
            <button onClick={() => setShowForm(false)} style={{
              padding: '8px 16px', borderRadius: 8, border: '1px solid var(--color-border)',
              background: 'transparent', color: 'var(--color-text-muted)', fontWeight: 600,
              fontSize: '.82rem', cursor: 'pointer',
            }}>Cancel</button>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {reviews.map(r => (
          <div key={r.id} style={{
            background: 'var(--color-surface)', border: '1px solid var(--color-border)',
            borderRadius: 12, padding: '16px 20px',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: '50%',
                  background: 'linear-gradient(135deg, #E67E22, #F39C12)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#fff', fontWeight: 700, fontSize: '.72rem',
                }}>{r.user.charAt(0)}</div>
                <div>
                  <span style={{ fontWeight: 600, fontSize: '.88rem' }}>{r.user}</span>
                  {r.verified && <span style={{
                    marginLeft: 6, fontSize: '.62rem', fontWeight: 700, padding: '1px 6px',
                    borderRadius: 10, background: 'rgba(16,185,129,.1)', color: '#10B981',
                  }}>Verified</span>}
                </div>
              </div>
              <span style={{ fontSize: '.72rem', color: 'var(--color-text-muted)' }}>{r.date}</span>
            </div>
            <Stars rating={r.rating} size={13} />
            <p style={{ marginTop: 8, fontSize: '.88rem', lineHeight: 1.5, color: 'var(--color-text-muted)' }}>{r.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export { Stars };
