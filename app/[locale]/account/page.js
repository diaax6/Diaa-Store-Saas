'use client';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import brandLogos from '../components/BrandLogos';
import './account.css';

const I = ({ children, color }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color || 'currentColor'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{children}</svg>
);

export default function AccountDashboard() {
  const { locale } = useParams();
  const isAr = locale === 'ar';
  return (
    <div>
      <h1 className="account-page-title">
        <I color="#8B5CF6"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></I>
        {isAr ? 'لوحة التحكم' : 'Dashboard'}
      </h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
        <div className="stat-card">
          <div className="stat-icon stat-icon-purple">
            <I color="#8B5CF6"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></I>
          </div>
          <div><div className="stat-value">3</div><div className="stat-label">{isAr ? 'اشتراكات نشطة' : 'Active Subscriptions'}</div></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon stat-icon-cyan">
            <I color="#F59E0B"><rect x="1" y="4" width="22" height="16" rx="2"/><path d="M1 10h22"/></I>
          </div>
          <div><div className="stat-value">$45</div><div className="stat-label">{isAr ? 'رصيد المحفظة' : 'Wallet Balance'}</div></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon stat-icon-green">
            <I color="#3B82F6"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></I>
          </div>
          <div><div className="stat-value">12</div><div className="stat-label">{isAr ? 'إجمالي الطلبات' : 'Total Orders'}</div></div>
        </div>
      </div>
      <h3 style={{ fontWeight: 700, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: 8 }}>
        <I color="#F59E0B"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></I>
        {isAr ? 'تنتهي قريباً' : 'Expiring Soon'}
      </h3>
      <div className="sub-card">
        <span className="sub-icon" style={{width:36,height:36,display:'flex',alignItems:'center',justifyContent:'center'}}>{brandLogos.chatgpt}</span>
        <div className="sub-info">
          <div className="sub-name">ChatGPT Plus</div>
          <div className="sub-meta">
            <span style={{display:'flex',alignItems:'center',gap:4}}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              {isAr ? 'متبقي 3 أيام' : '3 days left'}
            </span>
          </div>
        </div>
        <Link href={`/${locale}/account/subscriptions`} className="btn btn-primary btn-sm">{isAr ? 'جدد الآن' : 'Renew Now'}</Link>
      </div>
    </div>
  );
}
