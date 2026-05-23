'use client';
import { useState } from 'react';
import '../products/products-admin.css';

const logs = [
  { id: '1', staff: 'Admin', action: 'UPDATE', entity: 'Setting', detail: 'Changed store name to "Diaa Store"', ip: '102.x.x.x', time: '5 min ago' },
  { id: '2', staff: 'Admin', action: 'CREATE', entity: 'Product', detail: 'Added "ChatGPT Plus" product', ip: '102.x.x.x', time: '1 hr ago' },
  { id: '3', staff: 'Admin', action: 'DELETE', entity: 'Inventory', detail: 'Removed expired item #42', ip: '102.x.x.x', time: '2 hr ago' },
  { id: '4', staff: 'Admin', action: 'LOGIN', entity: 'Auth', detail: 'Admin login from Egypt', ip: '102.x.x.x', time: '3 hr ago' },
  { id: '5', staff: 'Support', action: 'UPDATE', entity: 'Order', detail: 'Approved order #ORD-003', ip: '41.x.x.x', time: '5 hr ago' },
  { id: '6', staff: 'Admin', action: 'CREATE', entity: 'Coupon', detail: 'Created "FLASH10" coupon', ip: '102.x.x.x', time: '6 hr ago' },
  { id: '7', staff: 'Admin', action: 'IMPORT', entity: 'Inventory', detail: 'Bulk imported 25 items', ip: '102.x.x.x', time: '8 hr ago' },
  { id: '8', staff: 'Admin', action: 'UPDATE', entity: 'Product', detail: 'Updated "Adobe CC" pricing', ip: '102.x.x.x', time: '1 day ago' },
];

const actionColors = { CREATE: 'completed', UPDATE: 'processing', DELETE: 'cancelled', LOGIN: 'pending', IMPORT: 'completed' };
const actionIcons = { CREATE: '', UPDATE: '', DELETE: '', LOGIN: '', IMPORT: '' };

export default function AuditLogPage() {
  const [filter, setFilter] = useState('ALL');
  const [search, setSearch] = useState('');

  const filtered = logs.filter(l => {
    const matchFilter = filter === 'ALL' || l.action === filter;
    const matchSearch = !search || l.detail.toLowerCase().includes(search.toLowerCase()) || l.staff.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const actionCounts = {
    ALL: logs.length,
    CREATE: logs.filter(l => l.action === 'CREATE').length,
    UPDATE: logs.filter(l => l.action === 'UPDATE').length,
    DELETE: logs.filter(l => l.action === 'DELETE').length,
    LOGIN: logs.filter(l => l.action === 'LOGIN').length,
  };

  return (
    <div className="ap-page">
      <div className="ap-header">
        <div>
          <h1 className="ap-title"> Audit Log</h1>
          <p className="ap-subtitle">Track all admin activity · {logs.length} entries</p>
        </div>
        <button className="btn btn-outline">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          Export
        </button>
      </div>

      <div className="ap-toolbar">
        <div className="ap-filter-tabs">
          {Object.entries(actionCounts).map(([key, count]) => (
            <button key={key} className={`ap-filter-tab ${filter === key ? 'active' : ''}`} onClick={() => setFilter(key)}>
              {key !== 'ALL' && actionIcons[key]} {key} ({count})
            </button>
          ))}
        </div>
        <div className="ap-search-box">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
          <input placeholder="Search logs..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="ap-table-wrap">
        <table className="ap-table">
          <thead><tr><th>Staff</th><th>Action</th><th>Entity</th><th>Detail</th><th>IP Address</th><th>Time</th></tr></thead>
          <tbody>
            {filtered.map(log => (
              <tr key={log.id}>
                <td>
                  <div className="ap-product-cell">
                    <div className="admin-avatar" style={{ width: 32, height: 32, fontSize: '0.7rem', flexShrink: 0 }}>{log.staff[0]}</div>
                    <span style={{ fontWeight: 600 }}>{log.staff}</span>
                  </div>
                </td>
                <td><span className={`db-status-badge ${actionColors[log.action]}`}>{log.action}</span></td>
                <td><span className="ap-cat-badge">{log.entity}</span></td>
                <td style={{ fontSize: '0.85rem' }}>{log.detail}</td>
                <td style={{ fontFamily: 'monospace', fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>{log.ip}</td>
                <td style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', whiteSpace: 'nowrap' }}>{log.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (<div className="ap-empty"><span></span><p>No logs found</p></div>)}
      </div>
    </div>
  );
}
