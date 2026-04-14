import { useRef } from 'react';

function StatusBadge({ active }) {
  return <span className={`status-badge ${active ? 'status-delivered' : 'status-pending'}`}>{active ? 'Active' : 'Inactive'}</span>;
}

export default function PaymentsSection({ paymentSettings, onToggle, onSave, onQRUpload }) {
  const qrInputRef = useRef();

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
        <div>
          <h1 className="font-display text-2xl font-bold">Payment Configuration</h1>
          <p className="text-xs" style={{color:'var(--text-muted)'}}>Manage transaction methods and gateways</p>
        </div>
        <button onClick={onSave} className="gradient-btn px-6 py-2.5 rounded-xl font-semibold text-white text-sm">
          Save Settings
        </button>
      </div>

      <div className="section-container">

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* UPI */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{background:'rgba(0,212,170,0.12)'}}>
                <svg className="w-6 h-6" style={{color:'var(--accent)'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"/>
                </svg>
              </div>
              <div>
                <h3 className="font-semibold">UPI Payment</h3>
                <p className="text-sm" style={{color:'var(--text-muted)'}}>Accept UPI payments</p>
              </div>
            </div>
            <div className={`toggle-switch ${paymentSettings.upi.enabled ? 'active' : ''}`} onClick={() => onToggle('upi')}/>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2" style={{color:'var(--text-secondary)'}}>UPI ID</label>
              <input type="text" id="upi-id" className="input-field" placeholder="yourname@upi" defaultValue={paymentSettings.upi.id}/>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" style={{color:'var(--text-secondary)'}}>Merchant Name</label>
              <input type="text" id="upi-name" className="input-field" placeholder="Merchant Name" defaultValue={paymentSettings.upi.name}/>
            </div>
          </div>
        </div>

        {/* QR Code */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{background:'rgba(77,171,247,0.12)'}}>
                <svg className="w-6 h-6" style={{color:'var(--info)'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"/>
                </svg>
              </div>
              <div>
                <h3 className="font-semibold">QR Code Payment</h3>
                <p className="text-sm" style={{color:'var(--text-muted)'}}>Scan & Pay</p>
              </div>
            </div>
            <div className={`toggle-switch ${paymentSettings.qr.enabled ? 'active' : ''}`} onClick={() => onToggle('qr')}/>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2" style={{color:'var(--text-secondary)'}}>QR Code Image</label>
            <div className="file-input-wrapper">
              <input type="file" accept="image/*" ref={qrInputRef} onChange={handleQRChange}/>
              <div className="file-input-label">
                {paymentSettings.qr.image ? (
                  <><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg><span>QR Code Loaded</span></>
                ) : (
                  <><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg><span>Upload QR Code</span></>
                )}
              </div>
            </div>
            {paymentSettings.qr.image && (
              <div className="mt-3">
                <img src={paymentSettings.qr.image} alt="QR Preview"
                  className="w-32 h-32 object-contain rounded-lg mx-auto border"
                  style={{background:'var(--bg-secondary)', borderColor:'var(--border)'}}/>
              </div>
            )}
          </div>
        </div>

        {/* COD */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{background:'rgba(255,201,60,0.12)'}}>
                <svg className="w-6 h-6" style={{color:'var(--warning)'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"/>
                </svg>
              </div>
              <div>
                <h3 className="font-semibold">Cash on Delivery</h3>
                <p className="text-sm" style={{color:'var(--text-muted)'}}>Accept COD orders</p>
              </div>
            </div>
            <div className={`toggle-switch ${paymentSettings.cod.enabled ? 'active' : ''}`} onClick={() => onToggle('cod')}/>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2" style={{color:'var(--text-secondary)'}}>COD Charges</label>
              <input type="number" id="cod-charges" className="input-field" placeholder="0" defaultValue={paymentSettings.cod.charges}/>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" style={{color:'var(--text-secondary)'}}>Max COD Order Value</label>
              <input type="number" id="cod-max" className="input-field" placeholder="5000" defaultValue={paymentSettings.cod.maxOrder}/>
            </div>
          </div>
        </div>

        {/* Status */}
        <div className="card p-6">
          <h3 className="font-semibold mb-4">Payment Gateway Status</h3>
          <div className="space-y-3">
            {[
              { label: 'UPI',      active: paymentSettings.upi.enabled },
              { label: 'QR Code', active: paymentSettings.qr.enabled },
              { label: 'COD',     active: paymentSettings.cod.enabled },
            ].map(item => (
              <div key={item.label} className="flex items-center justify-between p-3 rounded-xl" style={{background:'var(--bg-secondary)'}}>
                <span className="text-sm">{item.label}</span>
                <StatusBadge active={item.active}/>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </section>
  );
}
