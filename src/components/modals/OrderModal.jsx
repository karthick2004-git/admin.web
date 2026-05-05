import { useEffect } from 'react';
import { formatPrice } from '../sections/DashboardSection';

export default function OrderModal({ isOpen, onClose, order }) {
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  if (!order) return null;

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

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
              <p className="font-semibold" style={{fontSize:'13px'}}>{order.order_id}</p>
            </div>
            <div className="p-4 rounded-xl" style={{background:'var(--bg-secondary)'}}>
              <p className="text-sm mb-1" style={{color:'var(--text-muted)'}}>Date</p>
              <p className="font-semibold">{formatDate(order.created_at)}</p>
            </div>
          </div>

          <div className="p-4 rounded-xl" style={{background:'var(--bg-secondary)'}}>
            <p className="text-sm mb-2" style={{color:'var(--text-muted)'}}>Customer Details</p>
            <p className="font-semibold">{order.customer_name}</p>
            <p className="text-sm">{order.email}</p>
            <p className="text-sm font-medium">{order.phone}</p>
            <p className="text-sm mt-2" style={{color:'var(--text-secondary)'}}>
              {order.address}
              {order.district && `, ${order.district}`}
              {order.state && `, ${order.state}`}
              {order.pincode && ` - ${order.pincode}`}
            </p>
          </div>

          <div className="p-4 rounded-xl" style={{background:'var(--bg-secondary)'}}>
            <p className="text-sm mb-3" style={{color:'var(--text-muted)'}}>Order Items</p>
            {order.items && order.items.length > 0 ? (
              <div className="space-y-3">
                {order.items.map((item, idx) => (
                  <div key={idx} className={`flex justify-between items-center ${idx > 0 ? 'pt-3 border-t' : ''}`} style={{borderColor:'var(--border)'}}>
                    <div>
                      <p className="font-medium text-sm">{item.product_name}</p>
                      <p className="text-xs" style={{color:'var(--text-muted)'}}>Qty: {item.quantity} × {formatPrice(item.price)}</p>
                    </div>
                    <p className="font-semibold">{formatPrice(item.price * item.quantity)}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm" style={{color:'var(--text-muted)'}}>No items</p>
            )}
            <div className="flex justify-between items-center pt-3 mt-3 border-t" style={{borderColor:'var(--border)'}}>
              <p className="font-semibold">Total</p>
              <p className="font-bold text-lg" style={{color:'var(--accent)'}}>{formatPrice(order.total_amount)}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl" style={{background:'var(--bg-secondary)'}}>
              <p className="text-sm mb-1" style={{color:'var(--text-muted)'}}>Payment Method</p>
              <p className="font-semibold" style={{textTransform:'uppercase'}}>{order.payment_method || 'N/A'}</p>
            </div>
            <div className="p-4 rounded-xl" style={{background:'var(--bg-secondary)'}}>
              <p className="text-sm mb-1" style={{color:'var(--text-muted)'}}>Status</p>
              <span className={`status-badge status-${(order.status || 'placed').toLowerCase()}`}>{order.status}</span>
            </div>
          </div>

          {(order.payment_proof || order.transaction_id) && (
            <div className="p-4 rounded-xl border-2 border-dashed" style={{borderColor:'var(--accent-soft)', background:'white'}}>
              <p className="text-xs font-bold mb-3 uppercase tracking-wider text-blue-600 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04M12 21.48V22m0-11V3"/></svg>
                Payment Verification
              </p>
              
              {order.transaction_id && (
                <div className="mb-3">
                  <p className="text-[10px] text-gray-400 font-bold uppercase">Transaction ID / UTR</p>
                  <p className="font-mono text-sm text-blue-700">{order.transaction_id}</p>
                </div>
              )}

              {order.payment_proof && (
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase mb-2">Proof Screenshot</p>
                  <div className="relative group">
                    <img 
                      src={order.payment_proof} 
                      alt="Payment Proof" 
                      className="w-full max-h-64 object-contain rounded-lg border bg-gray-50 p-1"
                      onError={(e) => {
                        // Handle case where proof is just a filename string (from route.js line 31)
                        if (!order.payment_proof.startsWith('data:')) {
                           e.target.style.display = 'none';
                           e.target.nextSibling.style.display = 'block';
                        }
                      }}
                    />
                    <div className="hidden text-xs text-gray-400 p-4 text-center bg-gray-50 rounded-lg border border-dashed">
                      <p>Screenshot: {order.payment_proof}</p>
                      <p className="mt-1">(Manual verification required)</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
