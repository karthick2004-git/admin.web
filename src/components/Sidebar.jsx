export default function Sidebar({ activeSection, onSectionChange, onLogout }) {
  const navItems = [
    {
      id: 'dashboard-section', label: 'Dashboard',
      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/>
    },
    {
      id: 'products-section', label: 'Products',
      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
    },
    {
      id: 'orders-section', label: 'Orders',
      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"/>
    },
    {
      id: 'payments-section', label: 'Payments',
      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/>
    },
    {
      id: 'customers-section', label: 'Customers',
      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/>
    },
    {
      id: 'checkout-section', label: 'Checkout Data',
      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/>
    },
    {
      id: 'support-section', label: 'Support',
      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/>
    },
  ];

  return (
    <aside className="sidebar fixed left-0 top-0 bottom-0 z-50" style={{width:270}}>
      <div className="p-6 border-b" style={{borderColor:'var(--border)'}}>
        <div className="flex items-center gap-4">
          <div className="gradient-btn rounded-xl flex items-center justify-center" style={{width:44,height:44}}>
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
            </svg>
          </div>
          <div>
            <h1 className="font-display font-bold text-lg text-white">Atix Admin</h1>
            <div className="flex items-center gap-2">
              <div className="live-dot"/>
              <p className="text-xs" style={{color:'rgba(255,255,255,0.5)'}}>Live Dashboard</p>
            </div>
          </div>
        </div>
      </div>

      <nav className="p-4 space-y-1.5">
        {navItems.map(item => (
          <a key={item.id}
             className={`sidebar-link ${activeSection === item.id ? 'active' : ''}`}
             onClick={() => onSectionChange(item.id)}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">{item.icon}</svg>
            {item.label}
          </a>
        ))}
      </nav>

      <div className="absolute bottom-0 left-0 right-0 p-4 border-t" style={{borderColor:'var(--border)'}}>
        <button onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-colors"
          style={{color:'var(--danger)'}}
          onMouseEnter={e => e.currentTarget.style.background='rgba(255,107,107,0.1)'}
          onMouseLeave={e => e.currentTarget.style.background='transparent'}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
          </svg>
          Logout
        </button>
      </div>
    </aside>
  );
}
