'use client';
import { useState, useRef } from 'react';
import { useToast } from '../../components/ToastProvider';
import '../products/products-admin.css';

const catSvgIcons = {
  ai: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a4 4 0 0 1 4 4v2a4 4 0 0 1-8 0V6a4 4 0 0 1 4-4z"/><circle cx="12" cy="17" r="4"/></svg>,
  design: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#8B5CF6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><circle cx="11" cy="11" r="2"/></svg>,
  streaming: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><polygon points="10,8 16,11 10,14" fill="#EF4444" stroke="none"/></svg>,
  music: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1DB954" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>,
  productivity: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>,
};

const demoCats = [
  {
    id: '1', nameEn: 'AI Tools', nameAr: 'أدوات ذكاء اصطناعي', iconKey: 'ai', slug: 'ai-tools',
    descEn: 'AI-powered tools and services', descAr: 'أدوات وخدمات الذكاء الاصطناعي',
    products: 3, active: true, order: 1,

    subType: 'account', autoRenew: true, deliveryType: 'auto',
  },
  {
    id: '2', nameEn: 'Design', nameAr: 'تصميم', iconKey: 'design', slug: 'design',
    descEn: 'Design and creative tools', descAr: 'أدوات التصميم والإبداع',
    products: 2, active: true, order: 2,

    subType: 'account', autoRenew: true, deliveryType: 'auto',
  },
  {
    id: '3', nameEn: 'Streaming', nameAr: 'بث مباشر', iconKey: 'streaming', slug: 'streaming',
    descEn: 'Video streaming services', descAr: 'خدمات البث المرئي',
    products: 3, active: true, order: 3,

    subType: 'cdk', autoRenew: false, deliveryType: 'manual',
  },
  {
    id: '4', nameEn: 'Music', nameAr: 'موسيقى', iconKey: 'music', slug: 'music',
    descEn: 'Music streaming platforms', descAr: 'منصات بث الموسيقى',
    products: 1, active: true, order: 4,

    subType: 'account', autoRenew: true, deliveryType: 'auto',
  },
  {
    id: '5', nameEn: 'Productivity', nameAr: 'إنتاجية', iconKey: 'productivity', slug: 'productivity',
    descEn: 'Productivity and work tools', descAr: 'أدوات الإنتاجية والعمل',
    products: 0, active: false, order: 5,

    subType: 'account', autoRenew: true, deliveryType: 'auto',
  },
];

const emptyCategory = {
  nameEn: '', nameAr: '', iconKey: 'ai', slug: '', descEn: '', descAr: '', image: '',
  active: true, order: 0, subType: 'account', autoRenew: true, deliveryType: 'auto',
};



export default function CategoriesPage() {
  const [cats, setCats] = useState(demoCats);
  const [showModal, setShowModal] = useState(false);
  const [edit, setEdit] = useState(null);
  const [activeTab, setActiveTab] = useState('basic');
  const [search, setSearch] = useState('');

  const [uploading, setUploading] = useState(false);
  const fileRef = useRef(null);
  const toast = useToast();

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (data.success) {
        setEdit(prev => ({ ...prev, image: data.url }));
        toast.success('Image uploaded');
      } else { toast.error(data.error || 'Upload failed'); }
    } catch { toast.error('Upload failed'); }
    setUploading(false);
  };

  const filtered = cats.filter(c => !search || c.nameEn.toLowerCase().includes(search.toLowerCase()) || c.nameAr.includes(search));

  const openAdd = () => {
    setEdit({ ...emptyCategory, order: cats.length + 1 });
    setActiveTab('basic');
    setShowModal(true);
  };

  const openEdit = (cat) => {
    setEdit({ ...cat });
    setActiveTab('basic');
    setShowModal(true);
  };

  const handleSave = () => {
    if (!edit.nameEn) { toast.error('Category name (EN) is required'); return; }
    if (!edit.slug) edit.slug = edit.nameEn.toLowerCase().replace(/\s+/g, '-');
    if (edit.id) {
      setCats(prev => prev.map(c => c.id === edit.id ? { ...edit, products: c.products } : c));
      toast.success(`"${edit.nameEn}" updated`);
    } else {
      setCats(prev => [...prev, { ...edit, id: Date.now().toString(), products: 0 }]);
      toast.success(`"${edit.nameEn}" created`);
    }
    setShowModal(false);
  };

  const handleDelete = (id, name) => {
    if (confirm(`Delete "${name}"? Products in this category won't be deleted.`)) {
      setCats(prev => prev.filter(c => c.id !== id));
      toast.success(`"${name}" deleted`);
    }
  };

  const toggleActive = (id) => {
    setCats(prev => prev.map(c => c.id === id ? { ...c, active: !c.active } : c));
    toast.info('Category status updated');
  };


  const activeCats = cats.filter(c => c.active).length;

  const tabs = [
    { key: 'basic', label: 'Basic Info' },
    { key: 'media', label: 'Image' },
    { key: 'settings', label: 'Settings' },
  ];

  return (
    <div className="ap-page">
      {/* Header */}
      <div className="ap-header">
        <div>
          <h1 className="ap-title">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="1.8" style={{display:'inline',verticalAlign:'middle',marginRight:6}}><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
            Categories
          </h1>
          <p className="ap-subtitle">{cats.length} total · {activeCats} active</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Add Category
        </button>
      </div>

      {/* Toolbar */}
      <div className="ap-toolbar">
        <div></div>
        <div className="ap-search-box">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
          <input placeholder="Search categories..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      {/* Table */}
      <div className="ap-table-wrap">
        <table className="ap-table">
          <thead>
            <tr>
              <th style={{ width: '50px' }}>Icon</th>
              <th>Name</th>
              <th>Slug</th>
              <th>Products</th>
              <th>Sub Type</th>
              <th>Delivery</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(c => (
              <tr key={c.id}>
                <td style={{ textAlign: 'center' }}>
                  {c.image ? <img src={c.image} alt={c.nameEn} style={{width:36,height:36,borderRadius:8,objectFit:'cover'}}/> : (catSvgIcons[c.iconKey] || catSvgIcons.ai)}
                </td>
                <td>
                  <div className="ap-product-info">
                    <div className="ap-product-name">{c.nameEn}</div>
                    <div className="ap-product-name-ar">{c.nameAr}</div>
                  </div>
                </td>
                <td><span className="ap-product-slug">/{c.slug}</span></td>
                <td>
                  <span className={`ap-stock ${c.products > 0 ? 'ok' : 'out'}`}>{c.products}</span>
                </td>
                <td><span className="ap-cat-badge">{c.subType === 'account' ? ' Account' : ' CDK'}</span></td>
                <td>
                  <span className="ap-cat-badge" style={c.deliveryType === 'auto' ? { color: 'var(--color-success)', background: 'rgba(16,185,129,0.08)', borderColor: 'rgba(16,185,129,0.2)' } : {}}>
                    {c.deliveryType === 'auto' ? ' Auto' : ' Manual'}
                  </span>
                </td>
                <td>
                  <span className={`db-status-badge ${c.active ? 'completed' : 'cancelled'}`}>
                    {c.active ? 'ACTIVE' : 'INACTIVE'}
                  </span>
                </td>
                <td>
                  <div className="ap-actions">
                    <button className="ap-action-btn" title="Edit" onClick={() => openEdit(c)}>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    </button>
                    <button className="ap-action-btn" title={c.active ? 'Deactivate' : 'Activate'} onClick={() => toggleActive(c.id)}>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18.36 6.64a9 9 0 1 1-12.73 0"/><line x1="12" y1="2" x2="12" y2="12"/></svg>
                    </button>
                    <button className="ap-action-btn danger" title="Delete" onClick={() => handleDelete(c.id, c.nameEn)}>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (<div className="ap-empty"><span></span><p>No categories found</p></div>)}
      </div>

      {/* Modal */}
      {showModal && edit && (
        <div className="ap-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="ap-modal" style={{ maxWidth: '640px' }} onClick={e => e.stopPropagation()}>
            {/* Header */}
            <div className="ap-modal-header">
              <h2>{edit.id ? ' Edit' : ' Add'} Category</h2>
              <button className="ap-modal-close" onClick={() => setShowModal(false)}></button>
            </div>

            {/* Tabs */}
            <div className="ap-modal-tabs">
              {tabs.map(t => (
                <button key={t.key} className={`ap-modal-tab ${activeTab === t.key ? 'active' : ''}`} onClick={() => setActiveTab(t.key)}>{t.label}</button>
              ))}
            </div>

            {/* Body */}
            <div className="ap-modal-body">
              {/* ── Basic Info Tab ── */}
              {activeTab === 'basic' && (
                <div className="ap-tab-content">
                  <div className="ap-form-grid">
                    <div className="form-group">
                      <label className="form-label">Icon (Emoji) *</label>
                      <input className="form-input" value={edit.icon} onChange={e => setEdit({ ...edit, icon: e.target.value })} placeholder="" style={{ fontSize: '1.5rem', textAlign: 'center' }} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Display Order</label>
                      <input className="form-input" type="number" value={edit.order} onChange={e => setEdit({ ...edit, order: Number(e.target.value) })} />
                    </div>
                  </div>

                  <div className="ap-form-grid">
                    <div className="form-group">
                      <label className="form-label">Name (English) *</label>
                      <input className="form-input" value={edit.nameEn} onChange={e => setEdit({ ...edit, nameEn: e.target.value })} placeholder="e.g. AI Tools" />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Name (Arabic)</label>
                      <input className="form-input" value={edit.nameAr} onChange={e => setEdit({ ...edit, nameAr: e.target.value })} placeholder="أدوات ذكاء اصطناعي" dir="rtl" />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">URL Slug</label>
                    <div className="ap-slug-input">
                      <span className="ap-slug-prefix">/category/</span>
                      <input className="form-input" value={edit.slug} onChange={e => setEdit({ ...edit, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })} placeholder="ai-tools" />
                    </div>
                  </div>

                  <div className="ap-form-grid">
                    <div className="form-group">
                      <label className="form-label">Description (EN)</label>
                      <textarea className="form-input" rows="2" value={edit.descEn} onChange={e => setEdit({ ...edit, descEn: e.target.value })} placeholder="Short description..." />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Description (AR)</label>
                      <textarea className="form-input" rows="2" value={edit.descAr} onChange={e => setEdit({ ...edit, descAr: e.target.value })} dir="rtl" placeholder="وصف قصير..." />
                    </div>
                  </div>
                </div>
              )}

              {/* ── Media Tab ── */}
              {activeTab === 'media' && (
                <div className="ap-tab-content">
                  <div className="form-group">
                    <label className="form-label">Category Image</label>
                    <div style={{marginBottom:16}}>
                      {edit.image ? (
                        <div style={{position:'relative',width:200,height:140,borderRadius:12,overflow:'hidden',border:'2px solid var(--color-border)'}}>
                          <img src={edit.image} alt="Category" style={{width:'100%',height:'100%',objectFit:'cover'}}/>
                          <div style={{position:'absolute',bottom:0,left:0,right:0,display:'flex',gap:6,padding:8,background:'rgba(0,0,0,0.6)'}}>
                            <button className="btn btn-sm btn-ghost" style={{flex:1,color:'#fff',fontSize:'0.75rem'}} onClick={()=>fileRef.current?.click()}>Change</button>
                            <button className="btn btn-sm btn-danger" style={{flex:1,fontSize:'0.75rem'}} onClick={()=>setEdit({...edit,image:''})}>Remove</button>
                          </div>
                        </div>
                      ) : (
                        <div onClick={()=>fileRef.current?.click()} style={{width:200,height:140,borderRadius:12,border:'2px dashed var(--color-border)',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',cursor:'pointer',background:'var(--color-bg-tertiary)',transition:'0.2s'}}>
                          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-muted)" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                          <p style={{fontSize:'0.78rem',color:'var(--color-text-muted)',marginTop:8}}>Click to upload</p>
                          <p style={{fontSize:'0.7rem',color:'var(--color-text-muted)'}}>JPG, PNG, WebP · Max 5MB</p>
                        </div>
                      )}
                      <input ref={fileRef} type="file" accept="image/*" onChange={handleImageUpload} style={{display:'none'}}/>
                      {uploading && <div style={{marginTop:8,fontSize:'0.78rem',color:'var(--color-primary)'}}>Uploading...</div>}
                    </div>
                    <div className="form-group">
                      <label className="form-label">Or paste image URL</label>
                      <input className="form-input" value={edit.image||''} onChange={e=>setEdit({...edit,image:e.target.value})} placeholder="https://example.com/image.png"/>
                    </div>
                  </div>
                </div>
              )}


              {/* ── Settings Tab ── */}
              {activeTab === 'settings' && (
                <div className="ap-tab-content">
                  <div className="form-group">
                    <label className="form-label">Subscription Type</label>
                    <select className="form-input" value={edit.subType} onChange={e => setEdit({ ...edit, subType: e.target.value })}>
                      <option value="account"> Account — Login credentials delivered</option>
                      <option value="cdk"> CDK/Key — Activation keys delivered</option>
                    </select>
                    <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                      {edit.subType === 'account' ? 'Customer receives email/password combo' : 'Customer receives a product/activation key'}
                    </p>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Delivery Method</label>
                    <select className="form-input" value={edit.deliveryType} onChange={e => setEdit({ ...edit, deliveryType: e.target.value })}>
                      <option value="auto"> Automatic — Delivered instantly from inventory</option>
                      <option value="manual"> Manual — Admin delivers manually after payment</option>
                    </select>
                  </div>

                  <div className="ap-toggle-list">
                    <div className="ap-toggle-item">
                      <div>
                        <div className="ap-toggle-label"> Auto-Renew</div>
                        <div className="ap-toggle-desc">Products in this category can be auto-renewed by customers</div>
                      </div>
                      <label className="toggle-switch">
                        <input type="checkbox" checked={edit.autoRenew} onChange={e => setEdit({ ...edit, autoRenew: e.target.checked })} />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>

                    <div className="ap-toggle-item">
                      <div>
                        <div className="ap-toggle-label"> Active</div>
                        <div className="ap-toggle-desc">Show this category on the storefront</div>
                      </div>
                      <label className="toggle-switch">
                        <input type="checkbox" checked={edit.active} onChange={e => setEdit({ ...edit, active: e.target.checked })} />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="ap-modal-footer">
              <button className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSave}>
                 {edit.id ? 'Save Changes' : 'Create Category'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
