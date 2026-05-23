'use client';

import { useState } from 'react';
import { useToast } from '../../components/ToastProvider';

const allPermissions = [
  { key:'products', label:'Products', desc:'View, create, edit, delete products' },
  { key:'categories', label:'Categories', desc:'Manage product categories' },
  { key:'inventory', label:'Inventory', desc:'View and manage stock/credentials' },
  { key:'orders', label:'Orders', desc:'View, process, and manage orders' },
  { key:'customers', label:'Customers', desc:'View and manage customers' },
  { key:'finance', label:'Finance', desc:'View transactions, revenue data' },
  { key:'coupons', label:'Coupons', desc:'Create and manage discount codes' },
  { key:'notifications', label:'Notifications', desc:'View and manage notifications' },
  { key:'appearance', label:'Appearance', desc:'Change theme, branding, colors' },
  { key:'site_content', label:'Site Content', desc:'Edit hero, FAQ, policies' },
  { key:'settings', label:'Settings', desc:'General store configuration' },
  { key:'integrations', label:'Integrations', desc:'Configure external services' },
  { key:'staff', label:'Staff Management', desc:'Add, remove, edit staff members' },
  { key:'audit_log', label:'Audit Log', desc:'View system audit trail' },
];

const rolePresets = {
  owner: { label:'Owner', color:'#E67E22', permissions: allPermissions.map(p=>p.key), desc:'Full access to everything. Cannot be modified.' },
  admin: { label:'Admin', color:'#8B5CF6', permissions: allPermissions.filter(p=>p.key!=='staff'&&p.key!=='settings'&&p.key!=='integrations').map(p=>p.key), desc:'Manage products, orders, customers. No staff or settings access.' },
  support: { label:'Support', color:'#3B82F6', permissions: ['orders','customers','notifications','inventory'], desc:'Handle customer orders and support tickets.' },
  viewer: { label:'Viewer', color:'#6B7280', permissions: ['products','categories','orders','customers','finance'], desc:'Read-only access to key data. Cannot edit.' },
};

const demoStaff = [
  { id:'1', name:'Admin', email:'admin@diaa.store', role:'owner', isActive:true, lastLogin:'2025-05-22T14:00:00Z', permissions:rolePresets.owner.permissions, customRole:false, avatar:'' },
  { id:'2', name:'Mohamed Support', email:'support@diaa.store', role:'support', isActive:true, lastLogin:'2025-05-22T10:00:00Z', permissions:rolePresets.support.permissions, customRole:false, avatar:'' },
  { id:'3', name:'Sara Manager', email:'sara@diaa.store', role:'admin', isActive:true, lastLogin:'2025-05-21T18:00:00Z', permissions:rolePresets.admin.permissions, customRole:false, avatar:'' },
  { id:'4', name:'Old Staff', email:'old@diaa.store', role:'viewer', isActive:false, lastLogin:'2025-04-10T12:00:00Z', permissions:rolePresets.viewer.permissions, customRole:false, avatar:'' },
];

const emptyStaff = { id:'', name:'', email:'', role:'support', isActive:true, password:'', permissions:[], customRole:false, avatar:'' };

export default function AdminStaffPage() {
  const [staff, setStaff] = useState(demoStaff);
  const [showModal, setShowModal] = useState(false);
  const [editStaff, setEditStaff] = useState(null);
  const [activeTab, setActiveTab] = useState('info');
  const toast = useToast();

  const openAdd = () => { setEditStaff({...emptyStaff, permissions:[...rolePresets.support.permissions]}); setActiveTab('info'); setShowModal(true); };
  const openEdit = (s) => { setEditStaff({...s, password:'', permissions:[...s.permissions]}); setActiveTab('info'); setShowModal(true); };

  const handleSave = () => {
    if (!editStaff.name || !editStaff.email) { toast.error('Name and email required'); return; }
    if (!editStaff.id && !editStaff.password) { toast.error('Password required for new staff'); return; }
    if (editStaff.id) {
      setStaff(prev => prev.map(s => s.id===editStaff.id ? {...editStaff} : s));
      toast.success('Staff member updated');
    } else {
      setStaff(prev => [...prev, {...editStaff, id:Date.now().toString(), lastLogin:null}]);
      toast.success('Staff member added');
    }
    setShowModal(false);
  };

  const handleDelete = (id) => {
    const target = staff.find(s=>s.id===id);
    if (target?.role==='owner') { toast.error('Cannot delete the owner'); return; }
    if (confirm(`Remove "${target?.name}"?`)) { setStaff(prev => prev.filter(s=>s.id!==id)); toast.success('Staff removed'); }
  };

  const toggleActive = (id) => {
    const target = staff.find(s=>s.id===id);
    if (target?.role==='owner') { toast.error('Cannot deactivate the owner'); return; }
    setStaff(prev => prev.map(s => s.id===id ? {...s, isActive:!s.isActive} : s));
  };

  const applyRolePreset = (role) => {
    setEditStaff(prev => ({...prev, role, permissions:[...rolePresets[role].permissions], customRole:false}));
  };

  const togglePermission = (key) => {
    if (editStaff.role==='owner') return;
    setEditStaff(prev => ({
      ...prev,
      customRole: true,
      permissions: prev.permissions.includes(key) ? prev.permissions.filter(p=>p!==key) : [...prev.permissions, key]
    }));
  };

  const timeAgo = (d) => { if(!d) return 'Never'; const m=Math.floor((Date.now()-new Date(d).getTime())/60000); return m<60?`${m}m ago`:m<1440?`${Math.floor(m/60)}h ago`:`${Math.floor(m/1440)}d ago`; };

  return (
    <div className="ap-page">
      <div className="ap-header">
        <div>
          <h1 className="ap-title">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8B5CF6" strokeWidth="1.8" style={{display:'inline',verticalAlign:'middle',marginRight:6}}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            Staff & Permissions
          </h1>
          <p className="ap-subtitle">{staff.length} members · {staff.filter(s=>s.isActive).length} active</p>
        </div>
        <div className="ap-header-actions">
          <button className="btn btn-primary" onClick={openAdd}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Add Staff
          </button>
        </div>
      </div>

      {/* Role Legend */}
      <div style={{display:'flex',gap:12,marginBottom:20,flexWrap:'wrap'}}>
        {Object.entries(rolePresets).map(([key,role])=>(
          <div key={key} style={{display:'flex',alignItems:'center',gap:8,padding:'8px 16px',background:'var(--color-surface)',border:'1px solid var(--color-border)',borderRadius:10,borderLeft:`3px solid ${role.color}`}}>
            <span style={{fontWeight:700,fontSize:'0.82rem',color:role.color,textTransform:'capitalize'}}>{role.label}</span>
            <span style={{fontSize:'0.72rem',color:'var(--color-text-muted)'}}>{role.permissions.length} permissions</span>
          </div>
        ))}
      </div>

      <div className="ap-table-wrap">
        <table className="ap-table">
          <thead><tr><th>Member</th><th>Email</th><th>Role</th><th>Permissions</th><th>Status</th><th>Last Login</th><th>Actions</th></tr></thead>
          <tbody>
            {staff.map(s=>(
              <tr key={s.id} style={{opacity:s.isActive?1:0.5}}>
                <td><div style={{display:'flex',alignItems:'center',gap:10}}><div style={{width:36,height:36,borderRadius:'50%',background:`linear-gradient(135deg,${rolePresets[s.role]?.color||'#6B7280'},${rolePresets[s.role]?.color||'#6B7280'}88)`,display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontWeight:700,fontSize:'0.82rem',flexShrink:0}}>{s.name.charAt(0)}</div><div><div style={{fontWeight:600,fontSize:'0.9rem'}}>{s.name}</div>{s.customRole&&<span style={{fontSize:'0.65rem',background:'rgba(245,158,11,0.1)',color:'#F59E0B',padding:'1px 6px',borderRadius:10}}>Custom</span>}</div></div></td>
                <td style={{fontSize:'0.85rem'}}>{s.email}</td>
                <td><span style={{padding:'3px 12px',borderRadius:20,fontSize:'0.72rem',fontWeight:700,background:`${rolePresets[s.role]?.color||'#6B7280'}15`,color:rolePresets[s.role]?.color||'#6B7280',textTransform:'capitalize'}}>{s.role}</span></td>
                <td><div style={{display:'flex',gap:3,flexWrap:'wrap',maxWidth:180}}>{s.permissions.slice(0,4).map(p=>(<span key={p} style={{fontSize:'0.65rem',padding:'1px 5px',borderRadius:4,background:'var(--color-bg-tertiary)',color:'var(--color-text-muted)'}}>{p}</span>))}{s.permissions.length>4&&<span style={{fontSize:'0.65rem',padding:'1px 5px',borderRadius:4,background:'var(--color-bg-tertiary)',color:'var(--color-text-muted)'}}>+{s.permissions.length-4}</span>}</div></td>
                <td><label className="toggle" style={{transform:'scale(0.8)'}}><input type="checkbox" checked={s.isActive} onChange={()=>toggleActive(s.id)} disabled={s.role==='owner'}/><span className="toggle-slider"></span></label></td>
                <td style={{fontSize:'0.8rem',color:'var(--color-text-muted)',whiteSpace:'nowrap'}}>{timeAgo(s.lastLogin)}</td>
                <td><div className="ap-actions">
                  <button className="ap-action-btn" onClick={()=>openEdit(s)} title="Edit"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></button>
                  {s.role!=='owner'&&<button className="ap-action-btn danger" onClick={()=>handleDelete(s.id)} title="Remove"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg></button>}
                </div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Staff Modal */}
      {showModal&&editStaff&&(
        <div className="ap-modal-overlay" onClick={()=>setShowModal(false)}>
          <div className="ap-modal" onClick={e=>e.stopPropagation()} style={{maxWidth:620}}>
            <div className="ap-modal-header"><h2>{editStaff.id?'Edit Staff':'Add Staff'}</h2><button className="ap-modal-close" onClick={()=>setShowModal(false)}>✕</button></div>
            
            <div className="ap-modal-tabs">
              {[['info','Basic Info'],['permissions','Permissions']].map(([k,l])=>(
                <button key={k} className={`ap-modal-tab ${activeTab===k?'active':''}`} onClick={()=>setActiveTab(k)}>{l}</button>
              ))}
            </div>

            <div className="ap-modal-body">
              {activeTab==='info'&&(
                <div>
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
                    <div className="form-group"><label className="form-label">Name *</label><input className="form-input" value={editStaff.name} onChange={e=>setEditStaff(p=>({...p,name:e.target.value}))} placeholder="Staff name"/></div>
                    <div className="form-group"><label className="form-label">Email *</label><input className="form-input" type="email" value={editStaff.email} onChange={e=>setEditStaff(p=>({...p,email:e.target.value}))} placeholder="staff@diaa.store"/></div>
                  </div>
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
                    <div className="form-group"><label className="form-label">Role</label>
                      <select className="form-input" value={editStaff.role} onChange={e=>applyRolePreset(e.target.value)} disabled={editStaff.role==='owner'&&editStaff.id}>
                        {Object.entries(rolePresets).map(([k,v])=>(<option key={k} value={k}>{v.label}</option>))}
                      </select>
                      <span style={{fontSize:'0.72rem',color:'var(--color-text-muted)',marginTop:4,display:'block'}}>{rolePresets[editStaff.role]?.desc}</span>
                    </div>
                    <div className="form-group"><label className="form-label">{editStaff.id?'New Password':'Password *'}</label><input className="form-input" type="password" value={editStaff.password} onChange={e=>setEditStaff(p=>({...p,password:e.target.value}))} placeholder={editStaff.id?'Leave blank':'••••••••'}/></div>
                  </div>
                </div>
              )}

              {activeTab==='permissions'&&(
                <div>
                  {editStaff.role==='owner'?(
                    <div style={{textAlign:'center',padding:30,color:'var(--color-text-muted)'}}>
                      <div style={{fontSize:'2rem',marginBottom:8}}>🔒</div>
                      <div style={{fontWeight:600}}>Owner has full access to everything</div>
                      <div style={{fontSize:'0.82rem'}}>Permissions cannot be modified for the owner role</div>
                    </div>
                  ):(
                    <div>
                      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16}}>
                        <span style={{fontSize:'0.82rem',color:'var(--color-text-muted)'}}>{editStaff.permissions.length}/{allPermissions.length} permissions enabled</span>
                        <div style={{display:'flex',gap:6}}>
                          <button className="btn btn-ghost btn-sm" onClick={()=>setEditStaff(p=>({...p,permissions:allPermissions.map(p=>p.key),customRole:true}))} style={{fontSize:'0.72rem'}}>Select All</button>
                          <button className="btn btn-ghost btn-sm" onClick={()=>setEditStaff(p=>({...p,permissions:[],customRole:true}))} style={{fontSize:'0.72rem'}}>Clear All</button>
                        </div>
                      </div>
                      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
                        {allPermissions.map(perm=>(
                          <div key={perm.key} onClick={()=>togglePermission(perm.key)} style={{
                            display:'flex',alignItems:'center',gap:10,padding:'10px 14px',borderRadius:8,cursor:'pointer',transition:'0.15s',
                            background:editStaff.permissions.includes(perm.key)?'rgba(16,185,129,0.06)':'var(--color-bg-secondary)',
                            border:`1px solid ${editStaff.permissions.includes(perm.key)?'rgba(16,185,129,0.25)':'var(--color-border)'}`,
                          }}>
                            <div style={{width:18,height:18,borderRadius:4,border:`2px solid ${editStaff.permissions.includes(perm.key)?'#10B981':'var(--color-border)'}`,background:editStaff.permissions.includes(perm.key)?'#10B981':'transparent',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,transition:'0.15s'}}>
                              {editStaff.permissions.includes(perm.key)&&<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>}
                            </div>
                            <div>
                              <div style={{fontWeight:600,fontSize:'0.82rem'}}>{perm.label}</div>
                              <div style={{fontSize:'0.7rem',color:'var(--color-text-muted)'}}>{perm.desc}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="ap-modal-footer"><button className="btn btn-ghost" onClick={()=>setShowModal(false)}>Cancel</button><button className="btn btn-primary" onClick={handleSave}>{editStaff.id?'Save':'Add Member'}</button></div>
          </div>
        </div>
      )}
    </div>
  );
}
