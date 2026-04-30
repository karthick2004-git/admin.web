export default function MobileHeader({ onMenuToggle, onLogout }) {
  return (
    <header className="lg:hidden fixed top-0 left-0 right-0 z-50 border-b px-4 py-3 bg-[#141a24]/80 backdrop-blur-xl flex items-center h-[var(--header-height)]"
            style={{ borderColor:'var(--border)' }}>
      <div className="flex items-center justify-between w-full">
        <button onClick={onMenuToggle}
          className="p-2 rounded-lg transition-colors hover:bg-white/5"
          style={{color:'var(--text-primary)'}}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"/>
          </svg>
        </button>
        <div className="text-center">
          <h1 className="font-display font-bold text-base tracking-widest uppercase">Cozy Hood</h1>
          <p className="text-[10px] uppercase font-bold text-muted" style={{color:'var(--accent)'}}>Admin Panel</p>
        </div>
        <button onClick={onLogout}
          className="p-2 rounded-lg transition-colors hover:bg-danger/10"
          style={{color:'var(--danger)'}}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
          </svg>
        </button>
      </div>
    </header>
  );
}
