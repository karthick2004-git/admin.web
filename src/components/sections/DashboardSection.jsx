export function formatPrice(p) { return 'Rs ' + (p || 0).toLocaleString('en-IN'); }

export default function DashboardSection({ orders, products, stats: backendStats }) {
  const displayStats = [
    { label:'Total Orders',   value: backendStats.totalOrders, icon:<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>, color:'var(--accent)', bg:'rgba(0,212,170,0.12)', badge:'+12%', badgeBg:'var(--accent-soft)', id:'stat-orders' },
    { label:'Total Products', value: backendStats.totalProducts, icon:<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>, color:'var(--info)', bg:'rgba(77,171,247,0.12)', badge:'+5%', badgeBg:'rgba(77,171,247,0.12)', id:'stat-products' },
    { label:'Total Revenue',  value: formatPrice(backendStats.totalRevenue), icon:<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>, color:'var(--warning)', bg:'rgba(255,201,60,0.12)', badge:'+18%', badgeBg:'rgba(255,201,60,0.12)', id:'stat-revenue' },
    { label:'Total Users',    value: backendStats.totalCustomers, icon:<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>, color:'#a855f7', bg:'rgba(168,85,247,0.12)', badge:'+8%', badgeBg:'rgba(168,85,247,0.12)', id:'stat-users' },
  ];

  const staggerClasses = ['stagger-1','stagger-2','stagger-3','stagger-4'];

  return (
    <section className="animate-in">
      <div className="page-header">
        <div className="flex-1 min-w-0">
          <h1 className="font-display text-2xl font-bold whitespace-nowrap">Dashboard Overview</h1>
          <p className="text-xs mt-1" style={{color:'var(--text-muted)'}}>Real-time store metrics and activity</p>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0 ml-4">
          <div className="live-dot"></div>
          <span className="text-xs font-semibold tracking-wider uppercase" style={{color:'var(--accent)'}}>Live Updates</span>
        </div>
      </div>

      <div className="section-container">

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {displayStats.map((s, i) => (
          <div key={s.id} className={`stat-card p-6 animate-in ${staggerClasses[i]}`}>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{background:s.bg}}>
                <svg className="w-6 h-6" style={{color:s.color}} fill="none" stroke="currentColor" viewBox="0 0 24 24">{s.icon}</svg>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full font-semibold" style={{color:s.color, background:s.badgeBg}}>{s.badge}</span>
            </div>
            <p className="text-sm mb-1" style={{color:'var(--text-muted)'}}>{s.label}</p>
            <p className="font-display text-3xl font-bold">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="card overflow-hidden animate-in">
        <div className="p-5 border-b flex items-center justify-between" style={{borderColor:'var(--border)'}}>
          <div>
            <h2 className="font-display text-lg font-bold">Recent Orders</h2>
            <p className="text-xs mt-0.5" style={{color:'var(--text-muted)'}}>Latest customer orders</p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{background:'var(--accent-soft)', color:'var(--accent)'}}>Last 5</span>
        </div>
        {/* No overflow-x-auto — fixed layout keeps everything in view */}
        <table className="w-full" style={{tableLayout:'fixed'}}>
          <thead style={{background:'var(--bg-secondary)'}}>
            <tr>
              <th className="text-left px-4 py-3 text-[11px] font-bold uppercase tracking-wider" style={{color:'var(--text-muted)', width:'20%'}}>Order ID</th>
              <th className="text-left px-4 py-3 text-[11px] font-bold uppercase tracking-wider" style={{color:'var(--text-muted)', width:'28%'}}>Customer</th>
              <th className="text-left px-4 py-3 text-[11px] font-bold uppercase tracking-wider" style={{color:'var(--text-muted)', width:'20%'}}>Phone</th>
              <th className="text-left px-4 py-3 text-[11px] font-bold uppercase tracking-wider" style={{color:'var(--text-muted)', width:'17%'}}>Amount</th>
              <th className="text-left px-4 py-3 text-[11px] font-bold uppercase tracking-wider" style={{color:'var(--text-muted)', width:'15%'}}>Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.slice(0,5).map(order => {
              const shortId = order.order_id ? order.order_id.replace('ORD-','').slice(0,12) : '—';
              return (
                <tr key={order.id || order.order_id} className="table-row border-t" style={{borderColor:'var(--border)'}}>
                  <td className="px-4 py-3" style={{overflow:'hidden'}}>
                    <span className="font-mono text-xs font-semibold truncate block" style={{color:'var(--accent)'}} title={order.order_id}>#{shortId}</span>
                  </td>
                  <td className="px-4 py-3" style={{overflow:'hidden'}}>
                    <p className="font-semibold text-sm truncate">{order.customer_name}</p>
                    <p className="text-xs truncate" style={{color:'var(--text-muted)'}}>{order.email}</p>
                  </td>
                  <td className="px-4 py-3 text-sm" style={{overflow:'hidden'}}>
                    <span className="truncate block">{order.phone || '—'}</span>
                  </td>
                  <td className="px-4 py-3 font-bold text-sm" style={{overflow:'hidden'}}>
                    {formatPrice(order.total_amount)}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`status-badge status-${(order.status||'').toLowerCase()}`}>{order.status}</span>
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
