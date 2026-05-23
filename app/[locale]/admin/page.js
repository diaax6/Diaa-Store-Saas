'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import brandLogos from '../components/BrandLogos';
import './dashboard.css';

const Ico = ({ d, d2, color, extra }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color||'currentColor'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    {d && <path d={d}/>}{d2 && <path d={d2}/>}{extra}
  </svg>
);

const demoStats = [
  { icon: <Ico color="#F59E0B" extra={<><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></>}/>, label: 'Revenue Today', value: '$1,240', change: '+12.5%', up: true, color: 'purple' },
  { icon: <Ico color="#3B82F6" extra={<><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></>}/>, label: 'Orders Today', value: '28', change: '+8.3%', up: true, color: 'cyan' },
  { icon: <Ico color="#10B981" d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" extra={<><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></>}/>, label: 'Active Customers', value: '342', change: '+2.1%', up: true, color: 'green' },
  { icon: <Ico color="#F97316" d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" extra={<><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></>}/>, label: 'Low Stock Items', value: '5', change: '-3', up: false, color: 'orange' },
];

const recentOrders = [
  { id: '#ORD-001', customer: 'Ahmed Mohamed', product: 'ChatGPT Plus', amount: '$12', status: 'COMPLETED', time: '5 min ago' },
  { id: '#ORD-002', customer: 'Sara Ali', product: 'Adobe CC', amount: '$25', status: 'PENDING', time: '12 min ago' },
  { id: '#ORD-003', customer: 'Omar Hassan', product: 'Spotify Premium', amount: '$8', status: 'COMPLETED', time: '25 min ago' },
  { id: '#ORD-004', customer: 'Fatma Youssef', product: 'Netflix Premium', amount: '$10', status: 'PROCESSING', time: '1 hr ago' },
  { id: '#ORD-005', customer: 'Khaled Ibrahim', product: 'ChatGPT Plus', amount: '$12', status: 'COMPLETED', time: '2 hr ago' },
];

const topProducts = [
  { name: 'ChatGPT Plus', sales: 156, revenue: '$1,872', brand: 'chatgpt', pct: 100 },
  { name: 'Adobe CC', sales: 89, revenue: '$2,225', brand: 'adobe', pct: 57 },
  { name: 'Spotify Premium', sales: 67, revenue: '$536', brand: 'spotify', pct: 43 },
  { name: 'Netflix Premium', sales: 54, revenue: '$540', brand: 'netflix', pct: 35 },
];

const quickActions = [
  { icon: <Ico color="#F97316" d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" extra={<><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></>}/>, label: 'Add Product', href: 'products' },
  { icon: <Ico color="#3B82F6" d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" d2="M7 10l5 5 5-5" extra={<line x1="12" y1="15" x2="12" y2="3"/>}/>, label: 'Bulk Import', href: 'inventory' },
  { icon: <Ico color="#F59E0B" d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" extra={<line x1="7" y1="7" x2="7.01" y2="7"/>}/>, label: 'Create Coupon', href: 'coupons' },
  { icon: <Ico color="#8B5CF6" d="M18 20V10" d2="M12 20V4" extra={<line x1="6" y1="20" x2="6" y2="14"/>}/>, label: 'Export Reports', href: '#' },
];

const alertDots = { danger: '#EF4444', warning: '#F59E0B', success: '#10B981', info: '#3B82F6' };
const alerts = [
  { type: 'danger', text: 'Netflix stock below 5 units', time: '2 min ago' },
  { type: 'warning', text: '12 subscriptions expiring tomorrow', time: '15 min ago' },
  { type: 'success', text: 'Auto-renewal: 45 successful', time: '1 hr ago' },
  { type: 'info', text: 'New customer registered', time: '2 hr ago' },
];

const revenueData = [
  { day: 'Mon', value: 420 },
  { day: 'Tue', value: 680 },
  { day: 'Wed', value: 530 },
  { day: 'Thu', value: 890 },
  { day: 'Fri', value: 1240 },
  { day: 'Sat', value: 760 },
  { day: 'Sun', value: 950 },
];

export default function AdminDashboard() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return <div className="db-loading">Loading...</div>;

  const maxRevenue = Math.max(...revenueData.map(d => d.value));

  return (
    <div className="db-page">
      {/* Header */}
      <div className="db-header">
        <div>
          <h1 className="db-title">Dashboard</h1>
          <p className="db-subtitle">Welcome back, Admin! Here's what's happening today.</p>
        </div>
        <div className="db-header-right">
          <span className="db-date">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
          </span>
        </div>
      </div>

      {/* Stats Row */}
      <div className="db-stats-row">
        {demoStats.map((stat) => (
          <div key={stat.label} className={`db-stat-card db-stat-${stat.color}`}>
            <div className="db-stat-top">
              <span className="db-stat-icon">{stat.icon}</span>
              <span className={`db-stat-change ${stat.up ? 'up' : 'down'}`}>{stat.change}</span>
            </div>
            <div className="db-stat-value">{stat.value}</div>
            <div className="db-stat-label">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="db-grid">
        {/* Revenue Chart */}
        <div className="db-card db-card-wide">
          <div className="db-card-head">
            <h3><Ico color="#8B5CF6" d="M18 20V10" d2="M12 20V4" extra={<line x1="6" y1="20" x2="6" y2="14"/>}/> Revenue (Last 7 Days)</h3>
            <span className="db-card-badge">$5,470 total</span>
          </div>
          <div className="db-chart">
            {revenueData.map((d) => (
              <div key={d.day} className="db-chart-bar-wrap">
                <div className="db-chart-bar" style={{ height: `${(d.value / maxRevenue) * 100}%` }}>
                  <span className="db-chart-tooltip">${d.value}</span>
                </div>
                <span className="db-chart-label">{d.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="db-card">
          <div className="db-card-head">
            <h3><Ico color="#F59E0B" d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/> Quick Actions</h3>
          </div>
          <div className="db-quick-actions">
            {quickActions.map(a => (
              <Link key={a.label} href={a.href} className="db-quick-btn">
                <span className="db-quick-icon">{a.icon}</span>
                <span>{a.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="db-grid">
        {/* Recent Orders */}
        <div className="db-card db-card-wide">
          <div className="db-card-head">
            <h3><Ico color="#3B82F6" extra={<><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></>}/> Recent Orders</h3>
            <Link href="orders" className="db-view-all">View All →</Link>
          </div>
          <div className="db-table-wrap">
            <table className="db-table">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Customer</th>
                  <th>Product</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id}>
                    <td><span className="db-order-id">{order.id}</span></td>
                    <td>{order.customer}</td>
                    <td>{order.product}</td>
                    <td style={{ fontWeight: 700 }}>{order.amount}</td>
                    <td>
                      <span className={`db-status-badge ${order.status.toLowerCase()}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="text-muted">{order.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column */}
        <div className="db-right-stack">
          {/* Top Products */}
          <div className="db-card">
            <div className="db-card-head">
              <h3><Ico color="#F59E0B" d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/> Top Products</h3>
            </div>
            <div className="db-top-products">
              {topProducts.map((product, i) => (
                <div key={product.name} className="db-top-item">
                  <div className="db-top-rank">#{i + 1}</div>
                  <div className="db-top-icon" style={{width:24,height:24}}>{brandLogos[product.brand]}</div>
                  <div className="db-top-info">
                    <span className="db-top-name">{product.name}</span>
                    <div className="db-top-bar-track">
                      <div className="db-top-bar-fill" style={{ width: `${product.pct}%` }}></div>
                    </div>
                  </div>
                  <div className="db-top-meta">
                    <span className="db-top-sales">{product.sales}</span>
                    <span className="db-top-revenue">{product.revenue}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Alerts */}
          <div className="db-card">
            <div className="db-card-head">
              <h3><Ico color="#EF4444" d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" d2="M13.73 21a2 2 0 0 1-3.46 0"/> Alerts</h3>
              <span className="db-alert-count">{alerts.length}</span>
            </div>
            <div className="db-alerts">
              {alerts.map((alert, i) => (
                <div key={i} className={`db-alert-item db-alert-${alert.type}`}>
                  <span className="db-alert-icon" style={{width:10,height:10,borderRadius:'50%',background:alertDots[alert.type],flexShrink:0}}></span>
                  <div className="db-alert-text">
                    <span>{alert.text}</span>
                    <span className="db-alert-time">{alert.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
