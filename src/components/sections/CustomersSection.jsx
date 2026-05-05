import { useState } from 'react';

export default function CustomersSection({ customers, onDelete, onView }) {
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
        <div className="flex-1 min-w-0">
          <h1 className="font-display text-2xl font-bold whitespace-nowrap">Customer Management</h1>
          <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Manage and monitor registered customers</p>
        </div>
      </div>

      <div className="section-container">
        <div className="card p-5 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <svg className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input type="text" className="input-field pl-12" placeholder="     Search by name or email..."
                value={search} onChange={e => setSearch(e.target.value)} />
            </div>
          </div>
        </div>

        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-opacity-50" style={{ background: 'rgba(0,0,0,0.02)' }}>
                  <th className="px-6 py-4 text-xs font-extrabold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Customer</th>
                  <th className="px-6 py-4 text-xs font-extrabold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Signup Date</th>
                  <th className="px-6 py-4 text-xs font-extrabold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Phone</th>
                  <th className="px-6 py-4 text-xs font-extrabold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Status</th>
                  <th className="px-6 py-4 text-xs font-extrabold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Orders</th>
                  <th className="px-6 py-4 text-xs font-extrabold uppercase tracking-widest text-right" style={{ color: 'var(--text-muted)' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((customer, i) => (
                  <tr key={customer.id} className="border-t border-opacity-5 transition-colors hover:bg-black/5" style={{ borderColor: 'var(--border)' }}>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white uppercase"
                          style={{ background: `hsl(${customer.id * 137.5 % 360}, 60%, 45%)` }}>
                          {customer.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-sm">{customer.name}</p>
                          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{customer.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <p className="text-sm font-medium">{formatDate(customer.created_at)}</p>
                    </td>
                    <td className="px-6 py-5">
                      <p className="text-sm font-medium" style={{ color: customer.orders?.[0]?.phone ? 'inherit' : 'var(--text-muted)' }}>
                        {customer.orders?.[0]?.phone || 'N/A'}
                      </p>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${customer.is_verified ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
                        {customer.is_verified ? 'Verified' : 'Unverified'}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-sm font-semibold">
                      {customer._count?.orders || 0}
                    </td>
                    <td className="px-6 py-5 text-right flex items-center justify-end gap-2">
                      <button onClick={() => onView(customer)} className="btn-icon inline-flex" title="View Customer Details">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                      <button onClick={() => onDelete(customer.id)} className="btn-icon danger inline-flex" title="Delete Customer">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && (
            <div className="p-12 text-center" style={{ color: 'var(--text-muted)' }}>
              <p>No customers found</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
