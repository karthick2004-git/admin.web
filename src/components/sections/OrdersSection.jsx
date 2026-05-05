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
        <div className="flex-1 min-w-0">
          <h1 className="font-display text-2xl font-bold whitespace-nowrap">Order Management</h1>
          <p className="text-xs mt-1" style={{color:'var(--text-muted)'}}>Review and process customer shipments</p>
        </div>
        <div className="flex-shrink-0 ml-4">
          <select 
            className="input-field h-9 text-sm" 
            style={{ width: 180 }}
            value={statusFilter} 
            onChange={e => setStatusFilter(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="Placed">Placed</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Processing">Processing</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="section-container">
      <div className="card overflow-hidden">
        <table className="w-full" style={{tableLayout:'fixed'}}>
          <thead style={{background:'var(--bg-secondary)'}}>
            <tr>
              <th className="px-4 py-4 text-[10px] font-bold uppercase tracking-wider text-left" style={{color:'var(--text-muted)', width:'14%'}}>Order ID</th>
              <th className="px-4 py-4 text-[10px] font-bold uppercase tracking-wider text-left" style={{color:'var(--text-muted)', width:'20%'}}>Customer</th>
              <th className="px-4 py-4 text-[10px] font-bold uppercase tracking-wider text-left" style={{color:'var(--text-muted)', width:'20%'}}>Items</th>
              <th className="px-4 py-4 text-[10px] font-bold uppercase tracking-wider text-left" style={{color:'var(--text-muted)', width:'12%'}}>Total</th>
              <th className="px-4 py-4 text-[10px] font-bold uppercase tracking-wider text-left" style={{color:'var(--text-muted)', width:'10%'}}>Pay</th>
              <th className="px-4 py-4 text-[10px] font-bold uppercase tracking-wider text-left" style={{color:'var(--text-muted)', width:'12%'}}>Date</th>
              <th className="px-4 py-4 text-[10px] font-bold uppercase tracking-wider text-left" style={{color:'var(--text-muted)', width:'10%'}}>Status</th>
              <th className="px-4 py-4 text-[10px] font-bold uppercase tracking-wider text-right" style={{color:'var(--text-muted)', width:'12%'}}>Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y" style={{borderColor:'var(--border)'}}>
            {filtered.map(order => {
              const shortId = order.order_id ? order.order_id.replace('ORD-','').slice(-8) : '—';
              return (
                <tr key={order.id} className="table-row border-t" style={{borderColor:'var(--border)'}}>
                  <td className="px-4 py-4">
                    <span className="font-mono text-xs font-bold truncate block" style={{color:'var(--accent)'}} title={order.order_id}>#{shortId}</span>
                  </td>
                  <td className="px-4 py-4 overflow-hidden">
                    <p className="font-bold text-sm truncate">{order.customer_name}</p>
                    <p className="text-[11px] truncate" style={{color:'var(--text-muted)'}}>{order.phone}</p>
                  </td>
                  <td className="px-4 py-4 overflow-hidden">
                    {order.items && order.items.length > 0 ? (
                      <div className="truncate">
                        <p className="text-sm truncate">{order.items[0].product_name} <span style={{color:'var(--text-muted)'}}>x{order.items[0].quantity}</span></p>
                        {order.items.length > 1 && <p className="text-[10px]" style={{color:'var(--text-muted)'}}>+{order.items.length - 1} more items</p>}
                      </div>
                    ) : (
                      <span style={{color:'var(--text-muted)'}}>—</span>
                    )}
                  </td>
                  <td className="px-4 py-4 font-bold text-sm">{formatPrice(order.total_amount)}</td>
                  <td className="px-4 py-4">
                    <span style={{
                      padding:'3px 8px',
                      borderRadius:'50px',
                      fontSize:'10px',
                      fontWeight:700,
                      textTransform:'uppercase',
                      background: order.payment_method === 'cod' ? 'rgba(255,201,60,0.12)' : 'rgba(77,171,247,0.12)',
                      color: order.payment_method === 'cod' ? '#b8860b' : '#1976d2'
                    }}>
                      {order.payment_method || 'N/A'}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-[11px] font-medium" style={{color:'var(--text-secondary)'}}>{formatDate(order.created_at)}</td>
                  <td className="px-4 py-4">
                    <span className={`status-badge status-${(order.status||'').toLowerCase()}`} style={{fontSize:'10px', padding:'4px 8px'}}>{order.status}</span>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <div className="flex gap-1 justify-end">
                      <button onClick={() => onView(order.id)} className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-gray-100" style={{color:'var(--accent)'}} title="View">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                      </button>
                      <button onClick={() => onUpdateStatus(order.order_id)} className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-gray-100" style={{color:'var(--accent)'}} title="Update Status">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      </div>
    </section>
  );
}
