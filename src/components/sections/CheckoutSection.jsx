import { formatPrice } from './DashboardSection';

export default function CheckoutSection({ orders }) {
  return (
    <section className="p-4 lg:p-8">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold mb-2">Checkout Data</h1>
        <p style={{color:'var(--text-secondary)'}}>View customer checkout information and order summaries</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {orders.map(order => (
          <div key={order.id} className="card p-6 animate-in">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-display font-bold text-lg">{order.id}</h3>
              <span className={`status-badge status-${order.status}`}>{order.status}</span>
            </div>

            <div className="space-y-4">
              {[
                { color:'var(--accent)', bg:'var(--accent-soft)', icon:<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>, label:'Customer Name', value: order.customer },
                { color:'var(--info)',   bg:'rgba(77,171,247,0.12)', icon:<><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></>, label:'Address', value: order.address },
                { color:'var(--warning)',bg:'rgba(255,201,60,0.12)', icon:<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>, label:'Phone', value: order.phone },
                { color:'#a855f7',       bg:'rgba(168,85,247,0.12)', icon:<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/>, label:'Payment Type', value: order.payment },
              ].map(row => (
                <div key={row.label} className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{background:row.bg}}>
                    <svg className="w-5 h-5" style={{color:row.color}} fill="none" stroke="currentColor" viewBox="0 0 24 24">{row.icon}</svg>
                  </div>
                  <div>
                    <p className="text-sm" style={{color:'var(--text-muted)'}}>{row.label}</p>
                    <p className="font-medium text-sm">{row.value}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 pt-5 border-t" style={{borderColor:'var(--border)'}}>
              <p className="text-sm mb-3" style={{color:'var(--text-muted)'}}>Order Summary</p>
              <div className="rounded-xl p-4" style={{background:'var(--bg-secondary)'}}>
                <div className="flex justify-between mb-2">
                  <span className="text-sm" style={{color:'var(--text-secondary)'}}>Product</span>
                  <span className="text-sm font-medium">{order.product}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm" style={{color:'var(--text-secondary)'}}>Quantity</span>
                  <span className="text-sm font-medium">{order.quantity}</span>
                </div>
                <div className="flex justify-between pt-2 border-t" style={{borderColor:'var(--border)'}}>
                  <span className="font-medium">Total</span>
                  <span className="font-bold" style={{color:'var(--accent)'}}>{formatPrice(order.total)}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
