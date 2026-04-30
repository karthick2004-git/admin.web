import { useState } from 'react';
import { formatPrice } from './DashboardSection';

export default function OrdersSection({ orders, onView, onUpdateStatus, onCancel }) {
  const [statusFilter, setStatusFilter] = useState('');

  const filtered = statusFilter ? orders.filter(o => o.status === statusFilter) : orders;

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  return (
    <section className="animate-in">
      <div className="page-header">
        <div>
          <h1 className="font-display text-2xl font-bold">Order Management</h1>
          <p className="text-xs" style={{color:'var(--text-muted)'}}>Review and process customer shipments</p>
        </div>
        <select className="input-field w-48 h-10 text-sm" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="">All Status</option>
          <option value="Placed">Placed</option>
          <option value="Confirmed">Confirmed</option>
          <option value="Processing">Processing</option>
          <option value="Shipped">Shipped</option>
          <option value="Delivered">Delivered</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      <div className="section-container">
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead style={{background:'var(--bg-secondary)'}}>
              <tr>
                {['Order ID','Customer','Items','Total','Payment','Date','Status','Actions'].map((h, i) => (
                  <th key={h} className={`px-6 py-4 text-[11px] font-bold uppercase tracking-widest ${h === 'Actions' ? 'text-right' : 'text-left'}`} style={{color:'var(--text-muted)'}}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y" style={{borderColor:'var(--border)'}}>
              {filtered.map(order => (
                <tr key={order.id} className="table-row border-t" style={{borderColor:'var(--border)'}}>
                  <td className="px-6 py-4 font-medium" style={{fontSize:'13px'}}>{order.order_id}</td>
                  <td className="px-6 py-4">
                    <p className="font-medium">{order.customer_name}</p>
                    <p className="text-sm" style={{color:'var(--text-muted)'}}>{order.phone}</p>
                  </td>
                  <td className="px-6 py-4">
                    {order.items && order.items.length > 0 ? (
                      <div>
                        {order.items.slice(0, 2).map((item, i) => (
                          <p key={i} className="text-sm">{item.product_name} <span style={{color:'var(--text-muted)'}}>x{item.quantity}</span></p>
                        ))}
                        {order.items.length > 2 && <p className="text-xs" style={{color:'var(--text-muted)'}}>+{order.items.length - 2} more</p>}
                      </div>
                    ) : (
                      <span style={{color:'var(--text-muted)'}}>—</span>
                    )}
                  </td>
                  <td className="px-6 py-4 font-semibold">{formatPrice(order.total_amount)}</td>
                  <td className="px-6 py-4">
                    <span style={{
                      padding:'4px 10px',
                      borderRadius:'6px',
                      fontSize:'11px',
                      fontWeight:600,
                      textTransform:'uppercase',
                      letterSpacing:'0.5px',
                      background: order.payment_method === 'cod' ? 'rgba(255,201,60,0.15)' : 'rgba(77,171,247,0.15)',
                      color: order.payment_method === 'cod' ? '#b8860b' : '#1976d2'
                    }}>
                      {order.payment_method || 'N/A'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm" style={{color:'var(--text-secondary)'}}>{formatDate(order.created_at)}</td>
                  <td className="px-6 py-4"><span className={`status-badge status-${order.status}`}>{order.status}</span></td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2 justify-end">
                      <button onClick={() => onView(order.id)} className="btn-icon" title="View">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                        </svg>
                      </button>
                      <button onClick={() => onUpdateStatus(order.order_id)} className="btn-icon" title="Update Status">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                        </svg>
                      </button>
                      <button onClick={() => onCancel(order.order_id)} className="btn-icon danger" title="Cancel">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      </div>
    </section>
  );
}
