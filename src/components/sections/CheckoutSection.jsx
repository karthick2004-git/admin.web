import { useState } from 'react';
import { formatPrice } from './DashboardSection';

export default function CheckoutSection({ orders }) {
  const [viewingOrder, setViewingOrder] = useState(null);

  return (
    <>
      <section className="animate-in">
        <div className="page-header">
          <div>
            <h1 className="font-display text-2xl font-bold">Checkout Data</h1>
            <p className="text-xs" style={{color:'var(--text-muted)'}}>View customer checkout information and order summaries</p>
          </div>
        </div>

        <div className="section-container">
          {orders.length === 0 ? (
            <div className="card p-12 text-center text-sm" style={{color:'var(--text-muted)'}}>
              No checkout data found
            </div>
          ) : (
            <div className="card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b" style={{borderColor:'var(--border)', background:'rgba(255,255,255,0.02)'}}>
                      <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-widest" style={{color:'var(--text-muted)'}}>Order ID</th>
                      <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-widest" style={{color:'var(--text-muted)'}}>Customer</th>
                      <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-widest" style={{color:'var(--text-muted)'}}>Location</th>
                      <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-widest" style={{color:'var(--text-muted)'}}>Payment</th>
                      <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-widest" style={{color:'var(--text-muted)'}}>Total</th>
                      <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-widest" style={{color:'var(--text-muted)'}}>Status</th>
                      <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-right" style={{color:'var(--text-muted)'}}>Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y" style={{borderColor:'var(--border)'}}>
                    {orders.map((order, i) => (
                      <tr key={order.id} className="table-row animate-in" style={{animationDelay:`${i*0.05}s`}}>
                        <td className="px-6 py-4">
                          <div className="font-semibold text-xs tracking-tight">{order.order_id}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-semibold text-sm">{order.customer_name}</div>
                          <div className="text-[11px]" style={{color:'var(--text-secondary)'}}>{order.phone}</div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-xs truncate max-w-[200px]" style={{color:'var(--text-primary)'}}>
                            {order.address}, {order.pincode}
                          </p>
                        </td>
                        <td className="px-6 py-4 uppercase text-[10px] font-bold" style={{color:'var(--text-secondary)'}}>
                          {order.payment_method}
                        </td>
                        <td className="px-6 py-4 font-bold text-sm">
                          {formatPrice(order.total_amount)}
                        </td>
                        <td className="px-6 py-4 text-xs font-semibold">
                          <span className={`${(order.status || '').toLowerCase() === 'delivered' ? 'text-green-400' : 'text-amber-400'}`}>
                            {(order.status || 'Pending').toUpperCase()}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button 
                            onClick={() => setViewingOrder(order)}
                            className="btn-icon inline-flex"
                            style={{color:'var(--accent)'}}
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Details Modal */}
      {viewingOrder && (
        <div className="modal-overlay active" onClick={() => setViewingOrder(null)}>
          <div className="modal-content !max-w-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-xl font-bold font-display">Checkout Details</h3>
                <p className="text-xs" style={{color:'var(--text-muted)'}}>{viewingOrder.order_id}</p>
              </div>
              <button onClick={() => setViewingOrder(null)} className="p-2 hover:bg-red-500/10 hover:text-red-500 rounded-lg">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-8 mb-8">
              <div className="space-y-5">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest block mb-1.5" style={{color:'var(--text-muted)'}}>Customer Information</label>
                  <p className="text-sm font-bold">{viewingOrder.customer_name}</p>
                  <p className="text-sm" style={{color:'var(--text-secondary)'}}>{viewingOrder.phone}</p>
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest block mb-1.5" style={{color:'var(--text-muted)'}}>Delivery Address</label>
                  <p className="text-sm leading-relaxed" style={{color:'var(--text-primary)'}}>
                    {viewingOrder.address}<br/>
                    {viewingOrder.district}, {viewingOrder.state}<br/>
                    PIN: {viewingOrder.pincode}
                  </p>
                </div>
              </div>
              <div className="space-y-5">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest block mb-1.5" style={{color:'var(--text-muted)'}}>Payment Details</label>
                  <p className="text-sm font-bold uppercase">{viewingOrder.payment_method}</p>
                  <p className="text-sm" style={{color:'var(--text-secondary)'}}>Transaction ID: Pre-paid / COD Tracking</p>
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest block mb-1.5" style={{color:'var(--text-muted)'}}>Order Status</label>
                  <span className={`status-badge status-${(viewingOrder.status || '').toLowerCase()}`}>
                    {viewingOrder.status}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t" style={{borderColor:'var(--border)'}}>
              <label className="text-[10px] font-bold uppercase tracking-widest block mb-4" style={{color:'var(--text-muted)'}}>Order Summary</label>
              <div className="bg-slate-800/40 rounded-xl overflow-hidden border border-white/5">
                <div className="p-4 space-y-3">
                  {viewingOrder.items?.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center text-sm">
                      <div>
                        <span className="font-semibold">{item.product_name}</span>
                        <span className="text-xs ml-2 px-1.5 py-0.5 rounded bg-white/5" style={{color:'var(--text-secondary)'}}>x{item.quantity}</span>
                      </div>
                      <span className="font-medium">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
                <div className="p-4 bg-white/5 border-t border-white/5 flex justify-between items-center">
                  <span className="font-bold text-sm">Grand Total</span>
                  <span className="font-bold text-lg" style={{color:'var(--accent)'}}>{formatPrice(viewingOrder.total_amount)}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-8">
              <button 
                onClick={() => setViewingOrder(null)} 
                className="px-8 py-2.5 rounded-xl text-sm font-bold gradient-btn text-white"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
