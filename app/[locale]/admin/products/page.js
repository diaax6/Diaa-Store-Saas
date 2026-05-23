'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { useToast } from '../../components/ToastProvider';
import brandLogos from '../../components/BrandLogos';
import './products-admin.css';

const demoProducts = [
  { id: '1', nameEn: 'ChatGPT Plus', nameAr: 'شات جي بي تي بلس', image: '', brand: 'chatgpt', descEn: 'Full access to GPT-4', descAr: 'وصول كامل لـ GPT-4', category: 'AI', price: 12, comparePrice: 20, stock: 45, status: 'active', featured: true, autoDeliver: true, guestPurchase: true, slug: 'chatgpt-plus', durations: [{id:'d1',label:'1 Month',days:30,price:12,default:true},{id:'d2',label:'3 Months',days:90,price:30},{id:'d3',label:'1 Year',days:365,price:100}] },
  { id: '2', nameEn: 'Adobe Creative Cloud', nameAr: 'أدوبي كريتف كلاود', image: '', brand: 'adobe', descEn: 'All Adobe apps', descAr: 'كل تطبيقات أدوبي', category: 'Design', price: 25, comparePrice: 55, stock: 23, status: 'active', featured: true, autoDeliver: true, guestPurchase: true, slug: 'adobe-cc', durations: [{id:'d4',label:'1 Month',days:30,price:25,default:true},{id:'d5',label:'6 Months',days:180,price:130}] },
  { id: '3', nameEn: 'Spotify Premium', nameAr: 'سبوتيفاي بريميوم', image: '', brand: 'spotify', descEn: 'Unlimited music', descAr: 'موسيقى بلا حدود', category: 'Music', price: 8, comparePrice: 10, stock: 67, status: 'active', featured: false, autoDeliver: true, guestPurchase: true, slug: 'spotify-premium', durations: [{id:'d6',label:'1 Month',days:30,price:8,default:true}] },
  { id: '4', nameEn: 'Netflix Premium', nameAr: 'نتفلكس بريميوم', image: '', brand: 'netflix', descEn: '4K UHD streaming', descAr: 'بث 4K عالي الجودة', category: 'Streaming', price: 10, comparePrice: 16, stock: 3, status: 'active', featured: true, autoDeliver: true, guestPurchase: false, slug: 'netflix-premium', durations: [{id:'d7',label:'1 Month',days:30,price:10,default:true},{id:'d8',label:'3 Months',days:90,price:25},{id:'d9',label:'6 Months',days:180,price:45},{id:'d10',label:'1 Year',days:365,price:80}] },
  { id: '5', nameEn: 'Gemini Advanced', nameAr: 'جيميناي أدفانسد', image: '', brand: 'gemini', descEn: 'Google AI Premium', descAr: 'جوجل AI المميز', category: 'AI', price: 15, comparePrice: 20, stock: 28, status: 'active', featured: false, autoDeliver: true, guestPurchase: true, slug: 'gemini-advanced', durations: [{id:'d11',label:'1 Month',days:30,price:15,default:true}] },
  { id: '6', nameEn: 'Canva Pro', nameAr: 'كانفا برو', image: '', brand: 'canva', descEn: 'Professional design', descAr: 'تصميم احترافي', category: 'Design', price: 9, comparePrice: 13, stock: 0, status: 'inactive', featured: false, autoDeliver: true, guestPurchase: true, slug: 'canva-pro', durations: [{id:'d12',label:'1 Month',days:30,price:9,default:true},{id:'d13',label:'1 Year',days:365,price:90}] },
];

const emptyProduct = {
  id: '', nameEn: '', nameAr: '', image: '', brand: '', descEn: '', descAr: '',
  category: '', price: 0, comparePrice: 0, stock: 0, status: 'active',
  featured: false, autoDeliver: true, guestPurchase: true, slug: '',
  durations: [],
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState(demoProducts);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');
  const [selectedIds, setSelectedIds] = useState([]);
  const [newDuration, setNewDuration] = useState({label:'',days:30,price:0});
  const fileRef = useRef(null);

  const filtered = products.filter(p => {
    const matchSearch = p.nameEn.toLowerCase().includes(search.toLowerCase()) || p.nameAr.includes(search);
    const matchStatus = filterStatus === 'all' || (filterStatus === 'active' && p.stock > 0) || (filterStatus === 'out' && p.stock === 0) || (filterStatus === 'featured' && p.featured);
    return matchSearch && matchStatus;
  });

  const openAdd = () => { setEditProduct({ ...emptyProduct, durations:[] }); setActiveTab('basic'); setNewDuration({label:'',days:30,price:0}); setShowModal(true); };
  const openEdit = (p) => { setEditProduct({ ...p, durations: (p.durations||[]).map(d=>({...d})) }); setActiveTab('basic'); setNewDuration({label:'',days:30,price:0}); setShowModal(true); };

  const toast = useToast();

  const handleSave = () => {
    if (!editProduct.nameEn) { toast.error('Product name is required'); return; }
    if (!editProduct.slug) editProduct.slug = editProduct.nameEn.toLowerCase().replace(/\s+/g, '-');
    if (editProduct.id) {
      setProducts(prev => prev.map(p => p.id === editProduct.id ? editProduct : p));
      toast.success(`"${editProduct.nameEn}" updated successfully`);
    } else {
      setProducts(prev => [...prev, { ...editProduct, id: Date.now().toString() }]);
      toast.success(`"${editProduct.nameEn}" created successfully`);
    }
    setShowModal(false);
  };

  const handleDelete = (id) => {
    if (confirm('Delete this product? This cannot be undone.')) {
      setProducts(prev => prev.filter(p => p.id !== id));
      toast.success('Product deleted');
    }
  };

  const handleDuplicate = (p) => {
    setProducts(prev => [...prev, { ...p, id: Date.now().toString(), nameEn: p.nameEn + ' (Copy)', slug: p.slug + '-copy' }]);
    toast.success(`"${p.nameEn}" duplicated`);
  };

  const handleBulkDelete = () => {
    if (selectedIds.length && confirm(`Delete ${selectedIds.length} products?`)) {
      setProducts(prev => prev.filter(p => !selectedIds.includes(p.id)));
      toast.success(`${selectedIds.length} products deleted`);
      setSelectedIds([]);
    }
  };

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
        setEditProduct(prev => ({ ...prev, image: data.url }));
      } else {
        alert(data.error || 'Upload failed');
      }
    } catch { alert('Upload failed'); }
    setUploading(false);
  };

  const toggleSelect = (id) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const toggleSelectAll = () => {
    setSelectedIds(prev => prev.length === filtered.length ? [] : filtered.map(p => p.id));
  };

  const stats = {
    total: products.length,
    active: products.filter(p => p.stock > 0).length,
    out: products.filter(p => p.stock === 0).length,
    featured: products.filter(p => p.featured).length,
  };

  return (
    <div className="ap-page">
      {/* Header */}
      <div className="ap-header">
        <div>
          <h1 className="ap-title">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8B5CF6" strokeWidth="1.8" style={{display:'inline',verticalAlign:'middle',marginRight:6}}><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
            Products
          </h1>
          <p className="ap-subtitle">{stats.total} total · {stats.active} active · {stats.out} out of stock</p>
        </div>
        <div className="ap-header-actions">
          {selectedIds.length > 0 && (
            <button className="btn btn-danger btn-sm" onClick={handleBulkDelete}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
              Delete ({selectedIds.length})
            </button>
          )}
          <button className="btn btn-primary" onClick={openAdd}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Add Product
          </button>
        </div>
      </div>

      {/* Filters + Search */}
      <div className="ap-toolbar">
        <div className="ap-filter-tabs">
          {[['all', `All (${stats.total})`], ['active', `Active (${stats.active})`], ['out', `Out of Stock (${stats.out})`], ['featured', `Featured (${stats.featured})`]].map(([key, label]) => (
            <button key={key} className={`ap-filter-tab ${filterStatus === key ? 'active' : ''}`} onClick={() => setFilterStatus(key)}>{label}</button>
          ))}
        </div>
        <div className="ap-search-box">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
          <input placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      {/* Table */}
      <div className="ap-table-wrap">
        <table className="ap-table">
          <thead>
            <tr>
              <th className="ap-th-check"><input type="checkbox" onChange={toggleSelectAll} checked={selectedIds.length === filtered.length && filtered.length > 0} /></th>
              <th>Product</th>
              <th>Category</th>
              <th>Price</th>
              <th>Durations</th>
              <th>Stock</th>
              <th>Status</th>
              <th>Flags</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(product => (
              <tr key={product.id} className={selectedIds.includes(product.id) ? 'selected' : ''}>
                <td><input type="checkbox" checked={selectedIds.includes(product.id)} onChange={() => toggleSelect(product.id)} /></td>
                <td>
                  <div className="ap-product-cell">
                    <div className="ap-product-thumb">
                      {product.image ? (
                        <img src={product.image} alt={product.nameEn} />
                      ) : (
                        <span style={{width:28,height:28,display:'flex',alignItems:'center',justifyContent:'center'}}>{brandLogos[product.brand] || <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-muted)" strokeWidth="1.5"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>}</span>
                      )}
                    </div>
                    <div className="ap-product-info">
                      <div className="ap-product-name">{product.nameEn}</div>
                      <div className="ap-product-name-ar">{product.nameAr}</div>
                      <div className="ap-product-slug">/{product.slug}</div>
                    </div>
                  </div>
                </td>
                <td><span className="ap-cat-badge">{product.category}</span></td>
                <td>
                  <div className="ap-price-cell">
                    <span className="ap-price">${product.price}</span>
                    {product.comparePrice > product.price && (
                      <span className="ap-compare-price">${product.comparePrice}</span>
                    )}
                  </div>
                </td>
                <td>
                  <div style={{display:'flex',gap:3,flexWrap:'wrap'}}>
                    {(product.durations||[]).length > 0 ? product.durations.map(d => (
                      <span key={d.id} className="ap-cat-badge" style={d.default?{background:'rgba(230,126,34,.1)',color:'var(--color-primary)',borderColor:'rgba(230,126,34,.3)'}:{}}>{d.label}</span>
                    )) : <span style={{color:'var(--color-text-muted)',fontSize:'.78rem'}}>—</span>}
                  </div>
                </td>
                <td>
                  <span className={`ap-stock ${product.stock === 0 ? 'out' : product.stock < 5 ? 'low' : 'ok'}`}>
                    {product.stock}
                  </span>
                </td>
                <td>
                  <span className={`ap-status-badge ${product.stock > 0 ? 'active' : 'inactive'}`}>
                    {product.stock > 0 ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td>
                  <div className="ap-flags">
                    {product.featured && <span className="ap-flag featured" title="Featured" style={{color:'#F59E0B'}}><svg width="12" height="12" viewBox="0 0 24 24" fill="#F59E0B" stroke="none"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg></span>}
                    {product.autoDeliver && <span className="ap-flag auto" title="Auto Deliver" style={{color:'#10B981'}}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg></span>}
                    {product.guestPurchase && <span className="ap-flag guest" title="Guest Purchase" style={{color:'#3B82F6'}}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></span>}
                  </div>
                </td>
                <td>
                  <div className="ap-actions">
                    <button className="ap-action-btn" onClick={() => openEdit(product)} title="Edit">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    </button>
                    <button className="ap-action-btn" onClick={() => handleDuplicate(product)} title="Duplicate">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                    </button>
                    <button className="ap-action-btn danger" onClick={() => handleDelete(product.id)} title="Delete">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="ap-empty">
            <span><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-muted)" strokeWidth="1.5"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg></span>
            <p>No products found</p>
          </div>
        )}
      </div>

      {/* ═══ Product Modal ═══ */}
      {showModal && (
        <div className="ap-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="ap-modal" onClick={e => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="ap-modal-header">
              <h2>{editProduct.id ? 'Edit Product' : 'New Product'}</h2>
              <button className="ap-modal-close" onClick={() => setShowModal(false)}>✕</button>
            </div>

            {/* Tabs */}
            <div className="ap-modal-tabs">
              {[['basic', 'Basic Info'], ['media', 'Media'], ['pricing', 'Pricing & Durations'], ['settings', 'Settings']].map(([key, label]) => (
                <button key={key} className={`ap-modal-tab ${activeTab === key ? 'active' : ''}`} onClick={() => setActiveTab(key)}>{label}</button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="ap-modal-body">
              {/* ── Basic Info ── */}
              {activeTab === 'basic' && (
                <div className="ap-tab-content">
                  <div className="ap-form-grid">
                    <div className="form-group">
                      <label className="form-label">Product Name (English) *</label>
                      <input className="form-input" value={editProduct.nameEn} onChange={e => setEditProduct(p => ({ ...p, nameEn: e.target.value }))} placeholder="e.g. ChatGPT Plus" />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Product Name (Arabic)</label>
                      <input className="form-input" value={editProduct.nameAr} onChange={e => setEditProduct(p => ({ ...p, nameAr: e.target.value }))} dir="rtl" placeholder="مثال: شات جي بي تي بلس" />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">URL Slug</label>
                    <div className="ap-slug-input">
                      <span className="ap-slug-prefix">/products/</span>
                      <input className="form-input" value={editProduct.slug} onChange={e => setEditProduct(p => ({ ...p, slug: e.target.value }))} placeholder="chatgpt-plus" />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Description (English)</label>
                    <textarea className="form-textarea" value={editProduct.descEn} onChange={e => setEditProduct(p => ({ ...p, descEn: e.target.value }))} placeholder="Product description..." rows={3} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Description (Arabic)</label>
                    <textarea className="form-textarea" value={editProduct.descAr} onChange={e => setEditProduct(p => ({ ...p, descAr: e.target.value }))} dir="rtl" placeholder="وصف المنتج..." rows={3} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Category</label>
                    <select className="form-input" value={editProduct.category} onChange={e => setEditProduct(p => ({ ...p, category: e.target.value }))}>
                      <option value="">Select category</option>
                      <option value="AI">AI Tools</option>
                      <option value="Design">Design</option>
                      <option value="Streaming">Streaming</option>
                      <option value="Music">Music</option>
                      <option value="Productivity">Productivity</option>
                      <option value="Gaming">Gaming</option>
                    </select>
                  </div>
                </div>
              )}

              {/* ── Media ── */}
              {activeTab === 'media' && (
                <div className="ap-tab-content">
                  <div className="form-group">
                    <label className="form-label">Product Image</label>
                    <div className="ap-image-upload">
                      {editProduct.image ? (
                        <div className="ap-image-preview">
                          <img src={editProduct.image} alt="Product" />
                          <div className="ap-image-actions">
                            <button className="btn btn-sm btn-ghost" onClick={() => fileRef.current?.click()}>Change</button>
                            <button className="btn btn-sm btn-danger" onClick={() => setEditProduct(p => ({ ...p, image: '' }))}>Remove</button>
                          </div>
                        </div>
                      ) : (
                        <div className="ap-image-dropzone" onClick={() => fileRef.current?.click()}>
                          <div className="ap-dropzone-icon">
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                          </div>
                          <p className="ap-dropzone-text">Click to upload product image</p>
                          <p className="ap-dropzone-hint">JPG, PNG, WebP · Max 5MB</p>
                        </div>
                      )}
                      <input ref={fileRef} type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
                      {uploading && <div className="ap-upload-progress"><div className="ap-progress-bar"></div></div>}
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Brand Logo</label>
                    <select className="form-input" value={editProduct.brand} onChange={e => setEditProduct(p => ({ ...p, brand: e.target.value }))} style={{ maxWidth: '160px' }}>
                      <option value="">Select Brand</option>
                      <option value="chatgpt">ChatGPT</option>
                      <option value="adobe">Adobe</option>
                      <option value="spotify">Spotify</option>
                      <option value="netflix">Netflix</option>
                      <option value="gemini">Gemini</option>
                      <option value="canva">Canva</option>
                      <option value="youtube">YouTube</option>
                      <option value="grammarly">Grammarly</option>
                      <option value="microsoft">Microsoft</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Or paste image URL</label>
                    <input className="form-input" value={editProduct.image} onChange={e => setEditProduct(p => ({ ...p, image: e.target.value }))} placeholder="https://example.com/image.png" />
                  </div>
                </div>
              )}

              {/* ── Pricing ── */}
              {activeTab === 'pricing' && (
                <div className="ap-tab-content">
                  <div className="ap-form-grid">
                    <div className="form-group">
                      <label className="form-label">Price ($) *</label>
                      <div className="ap-price-input">
                        <span className="ap-price-prefix">$</span>
                        <input className="form-input" type="number" step="0.01" value={editProduct.price} onChange={e => setEditProduct(p => ({ ...p, price: Number(e.target.value) }))} />
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Compare-at Price ($)</label>
                      <div className="ap-price-input">
                        <span className="ap-price-prefix">$</span>
                        <input className="form-input" type="number" step="0.01" value={editProduct.comparePrice} onChange={e => setEditProduct(p => ({ ...p, comparePrice: Number(e.target.value) }))} />
                      </div>
                      {editProduct.comparePrice > editProduct.price && (
                        <span className="ap-discount-badge">
                          {Math.round((1 - editProduct.price / editProduct.comparePrice) * 100)}% OFF
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="ap-pricing-note">
                    <span><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg></span> The compare-at price shows as a strikethrough. Durations let customers pick subscription length.
                  </div>

                  {/* Durations Section */}
                  <div style={{marginTop:20,borderTop:'1px solid var(--color-border)',paddingTop:16}}>
                    <h4 style={{fontSize:'0.92rem',fontWeight:700,marginBottom:12,display:'flex',alignItems:'center',gap:6}}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                      Subscription Durations
                    </h4>
                    
                    {(editProduct.durations||[]).length > 0 && (
                      <div className="ap-toggle-list" style={{marginBottom:12}}>
                        {editProduct.durations.map(d => (
                          <div key={d.id} className="ap-toggle-item">
                            <div style={{flex:1}}>
                              <div className="ap-toggle-label" style={{display:'flex',alignItems:'center',gap:6}}>
                                {d.label}
                                {d.default && <span style={{fontSize:'.68rem',color:'var(--color-success)',background:'rgba(16,185,129,.1)',padding:'2px 8px',borderRadius:20,fontWeight:700}}>DEFAULT</span>}
                              </div>
                              <div className="ap-toggle-desc">{d.days} days · ${d.price}</div>
                            </div>
                            <div style={{display:'flex',gap:6,alignItems:'center'}}>
                              {!d.default && <button className="ap-action-btn" title="Set default" style={{width:28,height:28}} onClick={()=>setEditProduct(p=>({...p,durations:p.durations.map(x=>({...x,default:x.id===d.id}))}))}><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg></button>}
                              <button className="ap-action-btn danger" title="Remove" style={{width:28,height:28}} onClick={()=>{
                                const updated = editProduct.durations.filter(x=>x.id!==d.id);
                                if(updated.length && !updated.some(x=>x.default)) updated[0].default=true;
                                setEditProduct(p=>({...p,durations:updated}));
                              }}><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Add duration form */}
                    <div style={{display:'grid',gridTemplateColumns:'1fr 80px 80px auto',gap:8,alignItems:'end'}}>
                      <div className="form-group" style={{margin:0}}>
                        <label className="form-label" style={{fontSize:'.72rem'}}>Label</label>
                        <input className="form-input" value={newDuration.label} onChange={e=>setNewDuration(p=>({...p,label:e.target.value}))} placeholder="e.g. 1 Month" style={{padding:'6px 10px',fontSize:'.85rem'}}/>
                      </div>
                      <div className="form-group" style={{margin:0}}>
                        <label className="form-label" style={{fontSize:'.72rem'}}>Days</label>
                        <input className="form-input" type="number" min="1" value={newDuration.days} onChange={e=>setNewDuration(p=>({...p,days:Number(e.target.value)}))} style={{padding:'6px 10px',fontSize:'.85rem'}}/>
                      </div>
                      <div className="form-group" style={{margin:0}}>
                        <label className="form-label" style={{fontSize:'.72rem'}}>Price ($)</label>
                        <input className="form-input" type="number" min="0" step="0.01" value={newDuration.price} onChange={e=>setNewDuration(p=>({...p,price:Number(e.target.value)}))} style={{padding:'6px 10px',fontSize:'.85rem'}}/>
                      </div>
                      <button className="btn btn-primary" style={{padding:'6px 14px',fontSize:'.82rem',height:34}} onClick={()=>{
                        if(!newDuration.label||!newDuration.days){toast.error('Label & days required');return;}
                        const dur={...newDuration,id:`d-${Date.now()}`,default:(editProduct.durations||[]).length===0};
                        setEditProduct(p=>({...p,durations:[...(p.durations||[]),dur]}));
                        setNewDuration({label:'',days:30,price:0});
                        toast.success(`"${dur.label}" added`);
                      }}>+ Add</button>
                    </div>

                    {/* Quick presets */}
                    <div style={{marginTop:12,display:'flex',gap:4,flexWrap:'wrap'}}>
                      <span style={{fontSize:'.72rem',color:'var(--color-text-muted)',alignSelf:'center',marginRight:4}}>Quick:</span>
                      {[{label:'1 Week',days:7},{label:'1 Month',days:30},{label:'3 Months',days:90},{label:'6 Months',days:180},{label:'1 Year',days:365},{label:'Lifetime',days:9999}]
                        .filter(p=>!(editProduct.durations||[]).some(d=>d.days===p.days))
                        .map(p=>(<button key={p.days} className="ap-filter-tab" style={{fontSize:'.72rem',padding:'3px 10px'}} onClick={()=>{
                          const dur={...p,id:`d-${Date.now()}-${p.days}`,price:0,default:(editProduct.durations||[]).length===0};
                          setEditProduct(prev=>({...prev,durations:[...(prev.durations||[]),dur]}));
                          toast.success(`"${p.label}" added — set a price!`);
                        }}>+ {p.label}</button>))}
                    </div>
                  </div>
                </div>
              )}

              {/* ── Settings ── */}
              {activeTab === 'settings' && (
                <div className="ap-tab-content">
                  <div className="ap-toggle-list">
                    <div className="ap-toggle-item">
                      <div>
                        <div className="ap-toggle-label">Featured Product</div>
                        <div className="ap-toggle-desc">Show on homepage featured section</div>
                      </div>
                      <label className="toggle"><input type="checkbox" checked={editProduct.featured} onChange={e => setEditProduct(p => ({ ...p, featured: e.target.checked }))} /><span className="toggle-slider"></span></label>
                    </div>
                    <div className="ap-toggle-item">
                      <div>
                        <div className="ap-toggle-label">Auto Delivery</div>
                        <div className="ap-toggle-desc">Automatically deliver inventory after payment</div>
                      </div>
                      <label className="toggle"><input type="checkbox" checked={editProduct.autoDeliver} onChange={e => setEditProduct(p => ({ ...p, autoDeliver: e.target.checked }))} /><span className="toggle-slider"></span></label>
                    </div>
                    <div className="ap-toggle-item">
                      <div>
                        <div className="ap-toggle-label">Guest Purchase</div>
                        <div className="ap-toggle-desc">Allow buying without an account</div>
                      </div>
                      <label className="toggle"><input type="checkbox" checked={editProduct.guestPurchase} onChange={e => setEditProduct(p => ({ ...p, guestPurchase: e.target.checked }))} /><span className="toggle-slider"></span></label>
                    </div>
                    <div className="ap-toggle-item">
                      <div>
                        <div className="ap-toggle-label">Product Status</div>
                        <div className="ap-toggle-desc">Active products are visible in the store</div>
                      </div>
                      <select className="form-input" style={{ width: '140px' }} value={editProduct.status} onChange={e => setEditProduct(p => ({ ...p, status: e.target.value }))}>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="draft">Draft</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="ap-modal-footer">
              <button className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSave}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
                {editProduct.id ? 'Save Changes' : 'Create Product'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
