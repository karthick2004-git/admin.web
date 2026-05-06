import { useRef } from 'react';

function StatusBadge({ active }) {
  return <span className={`status-badge ${active ? 'status-delivered' : 'status-pending'}`}>{active ? 'Active' : 'Inactive'}</span>;
}

export default function PaymentsSection({ paymentSettings, orders = [], onToggle, onSave, onQRUpload, onView }) {
  const qrInputRef = useRef();

  // Get recent 5 payments
  const recentPayments = orders
    .filter(o => o.payment_method !== 'cod')
    .slice(0, 5);

  const handleQRChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const max = 800;
        let w = img.width, h = img.height;
        if (w > h && w > max) { h *= max/w; w = max; } else if (h > max) { w *= max/h; h = max; }
        canvas.width = w; canvas.height = h;
        canvas.getContext('2d').drawImage(img, 0, 0, w, h);
        onQRUpload(canvas.toDataURL('image/jpeg', 0.7));
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  };

  return (
    <section className="animate-in">
      <div className="page-header">
        <div className="flex-1 min-w-0">
          <h1 className="font-display text-2xl font-bold whitespace-nowrap">Payment Configuration</h1>
          <p className="text-xs mt-1" style={{color:'var(--text-muted)'}}>Manage transaction methods and gateways</p>
        </div>
        <div className="flex-shrink-0 ml-4">
          <button onClick={onSave} className="gradient-btn px-6 py-2.5 rounded-xl font-semibold text-white text-sm">
            Save Changes
          </button>
        </div>
      </div>

      <div className="section-container">
        <div className="space-y-6 mb-8">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <span className="w-1.5 h-6 bg-blue-600 rounded-full"></span>
            Gateway Configuration
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* UPI Settings Card */}
            <div className="card p-6 border-l-4" style={{borderLeftColor: paymentSettings.upi.enabled ? 'var(--success)' : 'var(--border)'}}>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-blue-50">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">UPI Payment</h3>
                    <p className="text-xs text-gray-500">Direct wallet-to-wallet transfer</p>
                  </div>
                </div>
                <div className={`toggle-switch ${paymentSettings.upi.enabled ? 'active' : ''}`} onClick={() => onToggle('upi')}/>
              </div>
              
              <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 transition-opacity duration-300 ${paymentSettings.upi.enabled ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">UPI VPA ID</label>
                  <input type="text" id="upi-id" className="input-field" placeholder="username@upi" defaultValue={paymentSettings.upi.upiId || paymentSettings.upi.id}/>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Merchant Display Name</label>
                  <input type="text" id="upi-name" className="input-field" placeholder="Store Name" defaultValue={paymentSettings.upi.name}/>
                </div>
              </div>
            </div>

            {/* QR Code Card */}
            <div className="card p-6 border-l-4" style={{borderLeftColor: paymentSettings.qr.enabled ? 'var(--success)' : 'var(--border)'}}>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-purple-50">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">QR Code Checkout</h3>
                    <p className="text-xs text-gray-500">Manual verification via screenshot</p>
                  </div>
                </div>
                <div className={`toggle-switch ${paymentSettings.qr.enabled ? 'active' : ''}`} onClick={() => onToggle('qr')}/>
              </div>

              <div className={`space-y-4 transition-opacity duration-300 ${paymentSettings.qr.enabled ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
                <div className="file-input-wrapper">
                  <input type="file" accept="image/*" ref={qrInputRef} onChange={handleQRChange}/>
                  <div className="file-input-label py-6">
                    <svg className="w-5 h-5 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                    <span className="text-sm font-semibold">Upload Static QR Code</span>
                  </div>
                </div>
                {paymentSettings.qr.image && (
                  <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl border border-dashed">
                    <img src={paymentSettings.qr.image} alt="QR" className="w-16 h-16 object-contain rounded-lg bg-white p-1 border"/>
                    <div>
                      <p className="text-xs font-bold text-gray-700">Live QR Code</p>
                      <p className="text-[10px] text-gray-500">This will be displayed to customers</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* COD Card */}
            <div className="card p-6 border-l-4" style={{borderLeftColor: paymentSettings.cod.enabled ? 'var(--success)' : 'var(--border)'}}>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-orange-50">
                    <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Cash on Delivery</h3>
                    <p className="text-xs text-gray-500">Pay at the doorstep</p>
                  </div>
                </div>
                <div className={`toggle-switch ${paymentSettings.cod.enabled ? 'active' : ''}`} onClick={() => onToggle('cod')}/>
              </div>
              
              <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 transition-opacity duration-300 ${paymentSettings.cod.enabled ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Extra Charges (₹)</label>
                  <input type="number" id="cod-charges" className="input-field" placeholder="0" defaultValue={paymentSettings.cod.charges}/>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Max Order Value (₹)</label>
                  <input type="number" id="cod-max" className="input-field" placeholder="5000" defaultValue={paymentSettings.cod.maxOrder}/>
                </div>
              </div>
            </div>
            {/* Info Card */}
            <div className="card p-6 bg-blue-50 border-blue-100 flex items-center gap-6">
              <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center shrink-0 shadow-lg shadow-blue-200">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              </div>
              <div>
                <h3 className="font-bold text-blue-900">Professional Setup</h3>
                <p className="text-xs text-blue-700 mt-1">Configure your payment methods correctly to ensure a smooth checkout experience for your customers. Static QR codes are used for manual verification via screenshots.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Transactions Section */}
        <div className="card overflow-hidden">
          <div className="p-6 border-b bg-gray-50 flex items-center justify-between">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <span className="w-1.5 h-6 bg-green-500 rounded-full"></span>
              Recent Payment Transactions
            </h2>
            <span className="text-xs font-medium text-gray-400">Showing last 5 non-COD orders</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-[10px] font-bold uppercase tracking-wider text-gray-400 border-b">
                <tr>
                  <th className="px-6 py-4">Order ID</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Method</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Proof</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentPayments.length > 0 ? (
                  recentPayments.map(order => (
                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-mono text-xs text-blue-600 font-bold">#{order.order_id.split('-').pop()}</td>
                      <td className="px-6 py-4">
                        <p className="font-bold text-gray-900">{order.customer_name}</p>
                        <p className="text-[10px] text-gray-400">{order.phone}</p>
                      </td>
                      <td className="px-6 py-4 uppercase font-bold text-[10px] text-gray-500">{order.payment_method}</td>
                      <td className="px-6 py-4 font-bold text-gray-900">₹{order.total_amount.toLocaleString()}</td>
                      <td className="px-6 py-4">
                        {order.payment_proof ? (
                          <span className="flex items-center gap-1.5 text-green-600 font-bold text-[10px]">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"/></svg>
                            ATTACHED
                          </span>
                        ) : (
                          <span className="text-gray-300 font-bold text-[10px]">MISSING</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`status-badge status-${(order.status||'').toLowerCase()}`} style={{fontSize:'9px'}}>{order.status}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => onView(order.id)}
                          className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                          title="View Proof & Details"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-gray-400 italic">No recent non-COD transactions found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
