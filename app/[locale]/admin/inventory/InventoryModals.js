'use client';
import { useState } from 'react';
import { allProducts, detectDelimiter, parseBulkData, findDuplicates, generateId } from './inventoryData';

/* ═══ SVG Icons ═══ */
const CopyIcon = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>;

/* ═══ Add/Edit Single Item Modal ═══ */
export function SingleItemModal({ category, item, onSave, onClose }) {
  const isEdit = !!item;
  const [form, setForm] = useState(item || { email:'', password:'', twoFA:'', status:'available', maxUses:1, usedCount:0, costUSD:0, expiresAt:'' });
  const [maxUsesPreset, setMaxUsesPreset] = useState(
    form.maxUses===1?'1':form.maxUses===3?'3':form.maxUses===5?'5':form.maxUses>=9999?'unlimited':'custom'
  );
  const upd = (k,v) => setForm(p=>({...p,[k]:v}));

  const handleSave = () => {
    if (!form.email.trim()) return;
    onSave({
      ...form,
      id: item?.id || generateId(),
      addedAt: item?.addedAt || new Date().toISOString(),
      costUSD: parseFloat(form.costUSD)||0,
      maxUses: maxUsesPreset==='unlimited'?9999:parseInt(form.maxUses)||1,
    });
  };

  return (
    <div className="ap-modal-overlay" onClick={onClose}>
      <div className="ap-modal" onClick={e=>e.stopPropagation()} style={{maxWidth:560}}>
        <div className="ap-modal-header">
          <h2>{isEdit?'Edit Item':`Add to ${category?.name||'Category'}`}</h2>
          <button className="ap-modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="ap-modal-body">
          <div className="form-group">
            <label className="form-label">{category?.type==='codes'?'Code / Key':'Email / Data'} *</label>
            <input className="form-input" value={form.email} onChange={e=>upd('email',e.target.value)} placeholder={category?.type==='codes'?'KEY-XXXX-YYYY-ZZZZ':'user@example.com'} style={{fontFamily:'monospace'}}/>
          </div>
          {category?.type!=='codes' && (
            <div className="form-group">
              <label className="form-label">Password (optional)</label>
              <input className="form-input" value={form.password} onChange={e=>upd('password',e.target.value)} placeholder="password123" style={{fontFamily:'monospace'}}/>
            </div>
          )}
          <div className="form-group">
            <label className="form-label">2FA Link (optional)</label>
            <input className="form-input" value={form.twoFA} onChange={e=>upd('twoFA',e.target.value)} placeholder=".../otpauth://totp" style={{fontFamily:'monospace',color:'#22D3EE'}}/>
          </div>
          <div className="form-group">
            <label className="form-label">Max Uses</label>
            <div className="inv-uses-row">
              {[['1','Once'],['3','3x'],['5','5x'],['unlimited','Unlimited']].map(([v,l])=>(
                <button key={v} className={`inv-uses-btn ${maxUsesPreset===v?'active':''}`} onClick={()=>{setMaxUsesPreset(v);upd('maxUses',v==='unlimited'?9999:parseInt(v))}}>{l}</button>
              ))}
            </div>
            {!['1','3','5','unlimited'].includes(maxUsesPreset) && (
              <input type="number" className="form-input" value={form.maxUses} onChange={e=>{upd('maxUses',parseInt(e.target.value)||1);setMaxUsesPreset('custom')}} style={{marginTop:6,width:100}}/>
            )}
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
            <div className="form-group">
              <label className="form-label">Cost (USD)</label>
              <input type="number" step="0.01" className="form-input" value={form.costUSD} onChange={e=>upd('costUSD',e.target.value)} style={{fontFamily:'monospace'}}/>
            </div>
            <div className="form-group">
              <label className="form-label">Expires At</label>
              <input type="date" className="form-input" value={form.expiresAt?form.expiresAt.split('T')[0]:''} onChange={e=>upd('expiresAt',e.target.value?new Date(e.target.value).toISOString():'')}/>
            </div>
          </div>
          {isEdit && (
            <div className="form-group">
              <label className="form-label">Status</label>
              <select className="form-input" value={form.status} onChange={e=>upd('status',e.target.value)}>
                <option value="available">Available</option><option value="used">Used</option>
                <option value="reserved">Reserved</option><option value="expired">Expired</option>
              </select>
            </div>
          )}
        </div>
        <div className="ap-modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSave}>{isEdit?'Save Changes':'Add Item'}</button>
        </div>
      </div>
    </div>
  );
}

/* ═══ Bulk Import Modal ═══ */
export function BulkImportModal({ category, existingItems, onImport, onClose }) {
  const [tab, setTab] = useState('bulk'); // bulk | single
  const [text, setText] = useState('');
  const [delimiter, setDelimiter] = useState('|');
  const [costUSD, setCostUSD] = useState(0);
  const [maxUses, setMaxUses] = useState(1);

  const parsed = text.trim() ? parseBulkData(text, delimiter) : [];
  const dupes = parsed.length ? findDuplicates(parsed, existingItems||[]) : [];

  const handleImport = () => {
    if (!parsed.length) return;
    const items = parsed.filter(p=>!dupes.find(d=>d.email.toLowerCase()===p.email.toLowerCase())).map(p => ({
      id: generateId(),
      email: p.email, password: p.password, twoFA: p.twoFA,
      status: 'available', maxUses, usedCount: 0,
      costUSD: parseFloat(costUSD)||0,
      addedAt: new Date().toISOString(), soldTo:'', expiresAt:'',
    }));
    onImport(items);
  };

  return (
    <div className="ap-modal-overlay" onClick={onClose}>
      <div className="ap-modal" onClick={e=>e.stopPropagation()} style={{maxWidth:600}}>
        <div className="ap-modal-header">
          <h2>Import to {category?.name||'Category'}</h2>
          <button className="ap-modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="ap-modal-body">
          <div className="inv-modal-tabs">
            <button className={`inv-modal-tab ${tab==='bulk'?'active':''}`} onClick={()=>setTab('bulk')}>Bulk Add</button>
            <button className={`inv-modal-tab ${tab==='single'?'active':''}`} onClick={()=>setTab('single')}>Single Add</button>
          </div>
          {tab==='bulk'?(
            <>
              <div className="form-group">
                <label className="form-label">Delimiter</label>
                <div className="inv-delimiter-row">
                  {[['|','Pipe |'],['\\t','Tab'],':','Colon :'].map((d,i)=>{
                    const val = Array.isArray(d)?d[0]:d;
                    const label = Array.isArray(d)?d[1]:d;
                    return <button key={i} className={`inv-delimiter-btn ${delimiter===val?'active':''}`} onClick={()=>setDelimiter(val)}>{label}</button>;
                  })}
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Paste data (one per line)</label>
                <textarea className="form-textarea" rows={8} value={text} onChange={e=>{setText(e.target.value);if(e.target.value.trim()){const d=detectDelimiter(e.target.value);setDelimiter(d)}}} placeholder={`email@example.com${delimiter}password${delimiter}2fa_link\nemail2@example.com${delimiter}pass2`} style={{fontFamily:'monospace',fontSize:'0.82rem'}}/>
                {parsed.length>0 && <div className="inv-preview-count">✓ {parsed.length} items detected</div>}
                {dupes.length>0 && <div className="inv-dup-warning">⚠ {dupes.length} duplicates will be skipped</div>}
              </div>
            </>
          ):(
            <div className="form-group">
              <label className="form-label">This imports one item at a time. Use Bulk for multiple.</label>
            </div>
          )}
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
            <div className="form-group">
              <label className="form-label">Cost per item (USD)</label>
              <input type="number" step="0.01" className="form-input" value={costUSD} onChange={e=>setCostUSD(e.target.value)} style={{fontFamily:'monospace'}}/>
            </div>
            <div className="form-group">
              <label className="form-label">Max Uses</label>
              <input type="number" className="form-input" value={maxUses} onChange={e=>setMaxUses(parseInt(e.target.value)||1)}/>
            </div>
          </div>
        </div>
        <div className="ap-modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleImport} disabled={!parsed.length}>Import {parsed.length-dupes.length} Items</button>
        </div>
      </div>
    </div>
  );
}

/* ═══ Create Category Modal ═══ */
export function CreateCategoryModal({ onSave, onClose }) {
  const [name, setName] = useState('');
  const [type, setType] = useState('accounts');
  const [icon, setIcon] = useState('👤');
  const [linkedProduct, setLinkedProduct] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState([]);

  const addTag = () => { if(tagInput.trim()&&!tags.includes(tagInput.trim())){setTags(p=>[...p,tagInput.trim()]);setTagInput('')} };

  return (
    <div className="ap-modal-overlay" onClick={onClose}>
      <div className="ap-modal" onClick={e=>e.stopPropagation()} style={{maxWidth:520}}>
        <div className="ap-modal-header"><h2>Create New Category</h2><button className="ap-modal-close" onClick={onClose}>✕</button></div>
        <div className="ap-modal-body">
          <div className="form-group"><label className="form-label">Name *</label>
            <input className="form-input" value={name} onChange={e=>setName(e.target.value)} placeholder="Gmail Accounts (New)"/>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
            <div className="form-group"><label className="form-label">Type</label>
              <select className="form-input" value={type} onChange={e=>setType(e.target.value)}>
                <option value="accounts">Accounts</option><option value="codes">Codes / Keys</option>
              </select>
            </div>
            <div className="form-group"><label className="form-label">Icon</label>
              <input className="form-input" value={icon} onChange={e=>setIcon(e.target.value)} style={{fontSize:'1.2rem',textAlign:'center'}}/>
            </div>
          </div>
          <div className="form-group"><label className="form-label">Linked Product</label>
            <select className="form-input" value={linkedProduct} onChange={e=>setLinkedProduct(e.target.value)}>
              <option value="">None (manual only)</option>
              {allProducts.map(p=><option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div className="form-group"><label className="form-label">Tags</label>
            <div className="inv-tags-input">
              {tags.map(t=><span key={t} className="inv-tag-chip">{t}<button onClick={()=>setTags(p=>p.filter(x=>x!==t))}>×</button></span>)}
              <input value={tagInput} onChange={e=>setTagInput(e.target.value)} onKeyDown={e=>{if(e.key==='Enter'){e.preventDefault();addTag()}}} placeholder="Add tag..."/>
            </div>
          </div>
        </div>
        <div className="ap-modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={()=>{if(!name.trim())return;onSave({id:generateId(),name,type,icon,linkedProduct,tags,items:[]})}} disabled={!name.trim()}>Create Category</button>
        </div>
      </div>
    </div>
  );
}

/* ═══ Edit Category Modal ═══ */
export function EditCategoryModal({ category, onSave, onClose }) {
  const [name, setName] = useState(category.name);
  const [type, setType] = useState(category.type);
  const [icon, setIcon] = useState(category.icon);
  const [linkedProduct, setLinkedProduct] = useState(category.linkedProduct||'');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState(category.tags||[]);

  const addTag = () => { if(tagInput.trim()&&!tags.includes(tagInput.trim())){setTags(p=>[...p,tagInput.trim()]);setTagInput('')} };

  return (
    <div className="ap-modal-overlay" onClick={onClose}>
      <div className="ap-modal" onClick={e=>e.stopPropagation()} style={{maxWidth:520}}>
        <div className="ap-modal-header"><h2>Edit Category</h2><button className="ap-modal-close" onClick={onClose}>✕</button></div>
        <div className="ap-modal-body">
          <div className="form-group"><label className="form-label">Name *</label>
            <input className="form-input" value={name} onChange={e=>setName(e.target.value)}/>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
            <div className="form-group"><label className="form-label">Type</label>
              <select className="form-input" value={type} onChange={e=>setType(e.target.value)}>
                <option value="accounts">Accounts</option><option value="codes">Codes / Keys</option>
              </select>
            </div>
            <div className="form-group"><label className="form-label">Icon</label>
              <input className="form-input" value={icon} onChange={e=>setIcon(e.target.value)} style={{fontSize:'1.2rem',textAlign:'center'}}/>
            </div>
          </div>
          <div className="form-group"><label className="form-label">Linked Product</label>
            <select className="form-input" value={linkedProduct} onChange={e=>setLinkedProduct(e.target.value)}>
              <option value="">None</option>
              {allProducts.map(p=><option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div className="form-group"><label className="form-label">Tags</label>
            <div className="inv-tags-input">
              {tags.map(t=><span key={t} className="inv-tag-chip">{t}<button onClick={()=>setTags(p=>p.filter(x=>x!==t))}>×</button></span>)}
              <input value={tagInput} onChange={e=>setTagInput(e.target.value)} onKeyDown={e=>{if(e.key==='Enter'){e.preventDefault();addTag()}}} placeholder="Add tag..."/>
            </div>
          </div>
        </div>
        <div className="ap-modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={()=>{if(!name.trim())return;onSave({...category,name,type,icon,linkedProduct,tags})}}>Save Changes</button>
        </div>
      </div>
    </div>
  );
}
