import { useEffect } from 'react';

export default function CustomerModal({ isOpen, onClose, customer }) {
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  if (!customer) return null;

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const latestPhone = customer.orders?.[0]?.phone || 'N/A';
  const latestAddress = customer.orders?.[0]?.address || 'No address history';

  return (
    <div className={`modal-overlay ${isOpen ? 'active' : ''}`} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-content max-w-2xl">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full flex items-center justify-center font-bold text-white text-xl uppercase shadow-lg" 
                 style={{background: `hsl(${customer.id * 137.5 % 360}, 60%, 45%)`}}>
              {customer.name.charAt(0)}
            </div>
            <div>
              <h2 className="font-display text-2xl font-bold">{customer.name}</h2>
              <p className="text-sm" style={{color:'var(--text-muted)'}}>Customer ID: #{customer.id}</p>
            </div>
          </div>
          <button onClick={onClose} className="btn-icon">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="p-5 rounded-2xl bg-black/5 flex flex-col gap-1">
            <span className="text-[10px] uppercase font-bold tracking-widest" style={{color:'var(--text-muted)'}}>Contact Info</span>
            <p className="font-semibold">{customer.email}</p>
            <p className="text-sm font-medium" style={{color:'var(--text-secondary)'}}>{latestPhone}</p>
          </div>
          <div className="p-5 rounded-2xl bg-black/5 flex flex-col gap-1">
            <span className="text-[10px] uppercase font-bold tracking-widest" style={{color:'var(--text-muted)'}}>Membership History</span>
            <p className="font-semibold">Joined {formatDate(customer.created_at)}</p>
            <div className={`text-[10px] font-bold uppercase inline-flex self-start px-2 py-0.5 rounded ${customer.is_verified ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
              {customer.is_verified ? 'Account Verified' : 'Email Pending'}
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-xs font-black uppercase tracking-widest mb-4 px-1" style={{color:'var(--text-muted)'}}>Last Known Address</h3>
          <div className="p-5 rounded-2xl bg-black/5 border" style={{borderColor:'var(--border)'}}>
            <p className="text-sm leading-relaxed">{latestAddress}</p>
          </div>
        </div>

        <div>
          <h3 className="text-xs font-black uppercase tracking-widest mb-4 px-1" style={{color:'var(--text-muted)'}}>Recent Orders ({customer._count?.orders || 0})</h3>
          <div className="space-y-3">
            {customer.orders?.length > 0 ? (
              customer.orders.map(order => (
                <div key={order.id} className="p-4 rounded-xl border flex items-center justify-between transition-colors hover:bg-black/5" style={{borderColor:'var(--border)'}}>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-bold">Order #{order.order_id}</span>
                    <span className="text-[10px]" style={{color:'var(--text-muted)'}}>{formatDate(order.created_at)}</span>
                  </div>
                  <div className="flex items-center gap-6">
                    <span className="text-xs font-bold">₹{order.total_amount.toLocaleString()}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider status-${order.status}`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="p-4 text-center text-sm" style={{color:'var(--text-muted)'}}>No orders placed yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
