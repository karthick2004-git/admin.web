import { useState } from 'react';

export default function SupportSection({ supportRequests, onUpdateStatus }) {
  const [statusFilter, setStatusFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [viewingRequest, setViewingRequest] = useState(null);

  const filtered = supportRequests.filter(r => {
    const matchStatus = statusFilter === 'All' ? true : r.status === statusFilter;
    const matchType = typeFilter === 'All' ? true : r.type === typeFilter;
    
    let matchDate = true;
    if (startDate || endDate) {
      const requestDate = new Date(r.created_at);
      requestDate.setHours(0, 0, 0, 0);
      
      if (startDate) {
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        if (requestDate < start) matchDate = false;
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(0, 0, 0, 0);
        if (requestDate > end) matchDate = false;
      }
    }
    
    return matchStatus && matchType && matchDate;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'status-pending';
      case 'Resolved': return 'status-delivered';
      case 'Closed': return 'status-cancelled';
      default: return 'status-shipped';
    }
  };

  return (
    <>
      <section className="animate-in">
        <div className="page-header">
          <div className="flex-1 min-w-0">
            <h1 className="font-display text-2xl font-bold whitespace-nowrap">Support & Complaints</h1>
            <p className="text-xs mt-1" style={{color:'var(--text-muted)'}}>Manage customer inquiries and resolved issues</p>
          </div>
        </div>

        <div className="section-container">
          {/* Filters */}
          <div className="card p-5 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider px-1" style={{color:'var(--text-muted)'}}>Status</label>
                <select className="input-field" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                  <option value="All">All Statuses</option>
                  <option value="Pending">Pending</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>
              
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider px-1" style={{color:'var(--text-muted)'}}>Request Type</label>
                <select className="input-field" value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
                  <option value="All">All Types</option>
                  <option value="Support">Support Inquiry</option>
                  <option value="Complaint">Complaint</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider px-1" style={{color:'var(--text-muted)'}}>From Date</label>
                <input type="date" className="input-field" value={startDate} onChange={e => setStartDate(e.target.value)} />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider px-1" style={{color:'var(--text-muted)'}}>To Date</label>
                <input type="date" className="input-field" value={endDate} onChange={e => setEndDate(e.target.value)} />
              </div>
            </div>
          </div>

          {/* List */}
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b" style={{borderColor:'var(--border)', background:'rgba(255,255,255,0.02)'}}>
                    <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-widest" style={{color:'var(--text-muted)'}}>Customer</th>
                    <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-widest" style={{color:'var(--text-muted)'}}>Type</th>
                    <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-widest" style={{color:'var(--text-muted)'}}>Location</th>
                    <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-widest" style={{color:'var(--text-muted)'}}>Message</th>
                    <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-widest" style={{color:'var(--text-muted)'}}>Status</th>
                    <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-widest" style={{color:'var(--text-muted)'}}>Date</th>
                    <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-right" style={{color:'var(--text-muted)'}}>Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y" style={{borderColor:'var(--border)'}}>
                  {filtered.length > 0 ? filtered.map((req, i) => (
                    <tr key={req.id} className="table-row animate-in" style={{animationDelay:`${i*0.05}s`}}>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-sm">{req.name}</div>
                        <div className="text-xs" style={{color:'var(--text-secondary)'}}>{req.phone}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${req.type === 'Complaint' ? 'bg-red-500/10 text-red-400' : 'bg-blue-500/10 text-blue-400'}`}>
                          {req.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs" style={{color:'var(--text-secondary)'}}>
                        {req.city}, {req.pincode}
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-xs truncate max-w-[200px]" style={{color:'var(--text-primary)'}}>{req.message || 'No message'}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`status-badge ${getStatusColor(req.status)}`}>
                          {req.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs" style={{color:'var(--text-secondary)'}}>
                        {new Date(req.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-3">
                          <button 
                            onClick={() => setViewingRequest(req)}
                            className="btn-icon"
                            title="View All Details"
                            style={{color:'var(--accent)'}}
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>
                          <select 
                            className="bg-transparent text-[11px] border rounded-lg px-2 py-1 outline-none"
                            style={{borderColor:'var(--border)', color:'var(--text-primary)'}}
                            value={req.status}
                            onChange={(e) => onUpdateStatus(req.id, e.target.value)}
                          >
                            <option value="Pending" className="bg-slate-800">Pending</option>
                            <option value="Resolved" className="bg-slate-800">Resolved</option>
                            <option value="Closed" className="bg-slate-800">Closed</option>
                          </select>
                        </div>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="7" className="px-6 py-20 text-center" style={{color:'var(--text-muted)'}}>
                        <div className="flex flex-col items-center gap-3">
                          <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/>
                          </svg>
                          <p>No requests found matching your filters</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Message Modal */}
      {viewingRequest && (
        <div className="modal-overlay active" onClick={() => setViewingRequest(null)}>
          <div className="modal-content !max-w-lg" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-xl font-bold font-display">Support Request Details</h3>
                <p className="text-xs" style={{color:'var(--text-muted)'}}>Request ID: #{viewingRequest.id}</p>
              </div>
              <button 
                onClick={() => setViewingRequest(null)}
                className="p-2 hover:bg-red-500/10 hover:text-red-500 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-6 mb-8">
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest block mb-1" style={{color:'var(--text-muted)'}}>Customer Name</label>
                  <p className="text-sm font-semibold">{viewingRequest.name}</p>
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest block mb-1" style={{color:'var(--text-muted)'}}>Phone Number</label>
                  <p className="text-sm font-semibold">{viewingRequest.phone}</p>
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest block mb-1" style={{color:'var(--text-muted)'}}>Location</label>
                  <p className="text-sm font-semibold">{viewingRequest.city}, {viewingRequest.pincode}</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest block mb-1" style={{color:'var(--text-muted)'}}>Request Type</label>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${viewingRequest.type === 'Complaint' ? 'bg-red-500/10 text-red-400' : 'bg-blue-500/10 text-blue-400'}`}>
                    {viewingRequest.type}
                  </span>
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest block mb-1" style={{color:'var(--text-muted)'}}>Current Status</label>
                  <span className={`status-badge ${getStatusColor(viewingRequest.status)}`}>
                    {viewingRequest.status}
                  </span>
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest block mb-1" style={{color:'var(--text-muted)'}}>Date Submitted</label>
                  <p className="text-sm font-semibold">{new Date(viewingRequest.created_at).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              <label className="text-[10px] font-bold uppercase tracking-widest block mb-2" style={{color:'var(--text-muted)'}}>Customer Message</label>
              <div className="bg-slate-800/40 rounded-xl p-4 border border-white/5 min-h-[100px]">
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{viewingRequest.message || 'No message provided.'}</p>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 pt-4 border-t" style={{borderColor:'var(--border)'}}>
              <button 
                onClick={() => setViewingRequest(null)}
                className="px-6 py-2.5 rounded-xl text-sm font-bold transition-all hover:bg-white/5"
                style={{color:'var(--text-primary)'}}
              >
                Close
              </button>
              <button 
                onClick={() => setViewingRequest(null)}
                className="gradient-btn px-8 py-2.5 rounded-xl text-sm font-bold text-white shadow-lg shadow-amber-500/20"
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
