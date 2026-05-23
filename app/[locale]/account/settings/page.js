'use client';
import { useState } from 'react';
import { useParams } from 'next/navigation';
import '../account.css';

export default function AccountSettingsPage() {
  const { locale } = useParams();
  const isAr = locale === 'ar';
  const [name, setName] = useState('Ahmed Mohamed');
  const [email, setEmail] = useState('ahmed@gmail.com');
  const [phone, setPhone] = useState('01XXXXXXXXX');
  const [telegram, setTelegram] = useState('@ahmed_m');
  const [saved, setSaved] = useState(false);

  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  return (
    <div>
      <h1 className="account-page-title"> {isAr ? 'إعدادات الحساب' : 'Account Settings'}</h1>
      <div className="card" style={{ maxWidth: '500px' }}>
        <div className="form-group"><label className="form-label">{isAr ? 'الاسم' : 'Name'}</label><input className="form-input" value={name} onChange={e => setName(e.target.value)} /></div>
        <div className="form-group"><label className="form-label">{isAr ? 'البريد' : 'Email'}</label><input className="form-input" type="email" value={email} onChange={e => setEmail(e.target.value)} /></div>
        <div className="form-group"><label className="form-label">{isAr ? 'الهاتف' : 'Phone'}</label><input className="form-input" value={phone} onChange={e => setPhone(e.target.value)} /></div>
        <div className="form-group"><label className="form-label">Telegram</label><input className="form-input" value={telegram} onChange={e => setTelegram(e.target.value)} /></div>
        <button className="btn btn-primary" onClick={handleSave}>
          {saved ? ' Saved!' : ` ${isAr ? 'حفظ التغييرات' : 'Save Changes'}`}
        </button>
      </div>
    </div>
  );
}
