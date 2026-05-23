'use client';
import { useSettings } from '../context/SettingsContext';
import './StatsSection.css';

export default function StatsSection({ locale }) {
  const { settings } = useSettings();
  const isAr = locale === 'ar';

  const stats = [
    {
      icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/></svg>,
      value: settings.stats_products || '500+',
      labelEn: 'Gift Cards',
      labelAr: 'بطاقات الهدايا',
      color: '#E67E22',
    },
    {
      icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
      value: settings.stats_customers || '50K+',
      labelEn: 'Customers',
      labelAr: 'العملاء',
      color: '#3B82F6',
    },
    {
      icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>,
      value: settings.stats_speed || '<1 min',
      labelEn: 'Purchase Speed',
      labelAr: 'سرعة الشراء',
      color: '#27AE60',
    },
    {
      icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>,
      value: settings.stats_languages || '9+',
      labelEn: 'Languages',
      labelAr: 'اللغات',
      color: '#8B5CF6',
    },
  ];

  return (
    <section className="stats-section">
      <div className="stats-bar container">
        {stats.map((stat, i) => (
          <div key={i} className="stats-item">
            <span className="stats-icon" style={{ color: stat.color, background: `${stat.color}15` }}>
              {stat.icon}
            </span>
            <div className="stats-text">
              <span className="stats-value" style={{ color: stat.color }}>{stat.value}</span>
              <span className="stats-label">{isAr ? stat.labelAr : stat.labelEn}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
