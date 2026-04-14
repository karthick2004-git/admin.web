import { useState } from 'react';

export default function OrdersSection({ orders, onView, onUpdateStatus, onCancel }) {
  const [statusFilter, setStatusFilter] = useState('');

  const filtered = statusFilter ? orders.filter(o => o.status === statusFilter) : orders;

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
                {['Order ID','Customer','Product','Qty','Payment','Status','Actions'].map(h => (
                  <th key={h} className="text-left px-6 py-4 text-sm font-semibold" style={{color:'var(--text-secondary)'}}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(order => (
                <tr key={order.id} className="table-row border-t" style={{borderColor:'var(--border)'}}>
                  <td className="px-6 py-4 font-medium">{order.id}</td>
                  <td className="px-6 py-4">
                    <p className="font-medium">{order.customer}</p>
                    <p className="text-sm" style={{color:'var(--text-muted)'}}>{order.phone}</p>
                  </td>
                  <td className="px-6 py-4">{order.product}</td>
                  <td className="px-6 py-4">{order.quantity}</td>
                  <td className="px-6 py-4">{order.payment}</td>
                  <td className="px-6 py-4"><span className={`status-badge status-${order.status}`}>{order.status}</span></td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button onClick={() => onView(order.id)} className="btn-icon" title="View">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                        </svg>
                      </button>
                      <button onClick={() => onUpdateStatus(order.id)} className="btn-icon" title="Update Status">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                        </svg>
                      </button>
                      <button onClick={() => onCancel(order.id)} className="btn-icon danger" title="Cancel">
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
