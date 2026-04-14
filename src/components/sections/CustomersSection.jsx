import { useState } from 'react';

export default function CustomersSection({ customers, onDelete }) {
  const [search, setSearch] = useState('');

  const filtered = customers.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.email.toLowerCase().includes(search.toLowerCase())
  );

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <section className="animate-in">
      <div className="page-header">
        <div>
          <h1 className="font-display text-2xl font-bold">Customer Management</h1>
          <p className="text-xs" style={{color:'var(--text-muted)'}}>Manage and monitor registered customers</p>
        </div>
      </div>

      <div className="section-container">
        <div className="card p-5 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <svg className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2" style={{color:'var(--text-muted)'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
              <input type="text" className="input-field pl-12" placeholder="Search by name or email..."
                value={search} onChange={e => setSearch(e.target.value)}/>
            </div>
          </div>
        </div>

        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-opacity-50" style={{background:'rgba(0,0,0,0.02)'}}>
                  <th className="px-6 py-4 text-xs font-extrabold uppercase tracking-widest" style={{color:'var(--text-muted)'}}>Customer</th>
                  <th className="px-6 py-4 text-xs font-extrabold uppercase tracking-widest" style={{color:'var(--text-muted)'}}>Signup Date</th>
                  <th className="px-6 py-4 text-xs font-extrabold uppercase tracking-widest" style={{color:'var(--text-muted)'}}>Status</th>
                  <th className="px-6 py-4 text-xs font-extrabold uppercase tracking-widest" style={{color:'var(--text-muted)'}}>Orders</th>
                  <th className="px-6 py-4 text-xs font-extrabold uppercase tracking-widest text-right" style={{color:'var(--text-muted)'}}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((customer, i) => (
                  <tr key={customer.id} className="border-t border-opacity-5 transition-colors hover:bg-black/5" style={{borderColor:'var(--border)'}}>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white uppercase" 
                             style={{background: `hsl(${customer.id * 137.5 % 360}, 60%, 45%)`}}>
                          {customer.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-sm">{customer.name}</p>
                          <p className="text-xs" style={{color:'var(--text-muted)'}}>{customer.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <p className="text-sm font-medium">{formatDate(customer.created_at)}</p>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${customer.is_verified ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
                        {customer.is_verified ? 'Verified' : 'Unverified'}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-sm font-semibold">
                      {customer._count?.orders || 0}
                    </td>
                    <td className="px-6 py-5 text-right">
                      <button onClick={() => onDelete(customer.id)} className="btn-icon danger inline-flex" title="Delete Customer">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && (
            <div className="p-12 text-center" style={{color:'var(--text-muted)'}}>
              <p>No customers found</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
