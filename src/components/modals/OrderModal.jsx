import { useEffect } from 'react';
import { formatPrice } from '../sections/DashboardSection';

export default function OrderModal({ isOpen, onClose, order }) {
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  if (!order) return null;

  return (
    <div className={`modal-overlay ${isOpen ? 'active' : ''}`} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-content">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-xl font-bold">Order Details</h2>
          <button onClick={onClose} className="btn-icon">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl" style={{background:'var(--bg-secondary)'}}>
              <p className="text-sm mb-1" style={{color:'var(--text-muted)'}}>Order ID</p>
              <p className="font-semibold">{order.id}</p>
            </div>
            <div className="p-4 rounded-xl" style={{background:'var(--bg-secondary)'}}>
              <p className="text-sm mb-1" style={{color:'var(--text-muted)'}}>Date</p>
              <p className="font-semibold">{order.date}</p>
            </div>
          </div>

          <div className="p-4 rounded-xl" style={{background:'var(--bg-secondary)'}}>
            <p className="text-sm mb-2" style={{color:'var(--text-muted)'}}>Customer Details</p>
            <p className="font-semibold">{order.customer}</p>
            <p className="text-sm">{order.email}</p>
            <p className="text-sm">{order.phone}</p>
            <p className="text-sm mt-2" style={{color:'var(--text-secondary)'}}>{order.address}</p>
          </div>

          <div className="p-4 rounded-xl" style={{background:'var(--bg-secondary)'}}>
            <p className="text-sm mb-2" style={{color:'var(--text-muted)'}}>Order Details</p>
            <div className="flex justify-between items-center">
              <div>
                <p className="font-semibold">{order.product}</p>
                <p className="text-sm" style={{color:'var(--text-secondary)'}}>Qty: {order.quantity}</p>
              </div>
              <p className="font-bold text-lg">{formatPrice(order.total)}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl" style={{background:'var(--bg-secondary)'}}>
              <p className="text-sm mb-1" style={{color:'var(--text-muted)'}}>Payment Method</p>
              <p className="font-semibold">{order.payment}</p>
            </div>
            <div className="p-4 rounded-xl" style={{background:'var(--bg-secondary)'}}>
              <p className="text-sm mb-1" style={{color:'var(--text-muted)'}}>Status</p>
              <span className={`status-badge status-${order.status}`}>{order.status}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
