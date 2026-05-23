'use client';
import { useSettings } from '../context/SettingsContext';
import { useState } from 'react';
import './AnnouncementBar.css';

export default function AnnouncementBar({ locale }) {
  const { settings } = useSettings();
  const isAr = locale === 'ar';
  const [visible, setVisible] = useState(true);

  // Handle both boolean and string "true"/"false"
  const isEnabled = settings.notice_enabled === true || settings.notice_enabled === 'true';

  if (!visible || !isEnabled) return null;

  const text = isAr ? settings.notice_text_ar : settings.notice_text_en;

  return (
    <div className="announcement-bar" style={{ background: settings.notice_bg_color || '#E67E22' }}>
      <div className="announcement-inner">
        <div className="announcement-scroll">
          <span className="announcement-text">{text}</span>
          <span className="announcement-separator">•</span>
          <span className="announcement-text">{text}</span>
          <span className="announcement-separator">•</span>
          <span className="announcement-text">{text}</span>
        </div>
      </div>
      <button className="announcement-close" onClick={() => setVisible(false)}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    </div>
  );
}
