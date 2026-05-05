export default function LoadingOverlay() {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white">
      <div className="relative">
        {/* Outer Glow */}
        <div className="absolute inset-0 rounded-full blur-xl opacity-20" style={{ background: 'var(--accent)' }} />
        
        {/* Spinner */}
        <div className="w-16 h-16 border-4 border-slate-100 border-t-[var(--accent)] rounded-full animate-spin" />
        
        {/* Inner Logo/Icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-2 h-2 bg-[var(--accent)] rounded-full animate-pulse" />
        </div>
      </div>
      
      <div className="mt-8 text-center animate-pulse">
        <h2 className="font-display text-xl font-bold tracking-tight">Atix Admin</h2>
        <p className="text-sm mt-2 font-medium" style={{ color: 'var(--text-muted)' }}>
          Preparing your workspace...
        </p>
      </div>
    </div>
  );
}
