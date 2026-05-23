'use client';
import { useParams } from 'next/navigation';
import '../account.css';

const orders = [
  { id: 'ORD-001', items: ['ChatGPT Plus'], total: 12, status: 'COMPLETED', date: '2025-05-20', payment: 'Wallet' },
  { id: 'ORD-002', items: ['Adobe CC', 'Spotify'], total: 33, status: 'COMPLETED', date: '2025-05-18', payment: 'Stripe' },
  { id: 'ORD-003', items: ['Netflix Premium'], total: 10, status: 'PENDING', date: '2025-05-15', payment: 'Vodafone Cash' },
  { id: 'ORD-004', items: ['YouTube Premium'], total: 7, status: 'COMPLETED', date: '2025-05-10', payment: 'Crypto' },
];

export default function OrdersPage() {
  const { locale } = useParams();
  const isAr = locale === 'ar';
  const statusColors = { COMPLETED: 'success', PENDING: 'warning', PROCESSING: 'info', CANCELLED: 'danger' };

  return (
    <div>
      <h1 className="account-page-title"> {isAr ? 'طلباتي' : 'My Orders'}</h1>
      <div className="table-container">
        <table className="table">
          <thead><tr><th>{isAr ? 'رقم الطلب' : 'Order'}</th><th>{isAr ? 'المنتجات' : 'Products'}</th><th>{isAr ? 'الإجمالي' : 'Total'}</th><th>{isAr ? 'الدفع' : 'Payment'}</th><th>{isAr ? 'الحالة' : 'Status'}</th><th>{isAr ? 'التاريخ' : 'Date'}</th></tr></thead>
          <tbody>
            {orders.map(o => (
              <tr key={o.id}>
                <td><span className="text-primary" style={{ fontWeight: 700 }}>#{o.id}</span></td>
                <td>{o.items.join(', ')}</td>
                <td style={{ fontWeight: 700 }}>${o.total}</td>
                <td><span className="badge badge-info">{o.payment}</span></td>
                <td><span className={`badge badge-${statusColors[o.status]}`}>{o.status}</span></td>
                <td className="text-muted">{o.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
