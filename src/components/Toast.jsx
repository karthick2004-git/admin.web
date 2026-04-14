import { useEffect, useState } from 'react';

function ToastItem({ message, type, onRemove }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setShow(true), 10);
    const t2 = setTimeout(() => { setShow(false); setTimeout(onRemove, 300); }, 3000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [onRemove]);

  const icons = {
    success: <svg className="w-5 h-5" style={{color:'var(--accent)'}} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>,
    error:   <svg className="w-5 h-5" style={{color:'var(--danger)'}} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>,
    warning: <svg className="w-5 h-5" style={{color:'var(--warning)'}} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>,
  };

  return (
    <div className={`toast ${type} ${show ? 'show' : ''}`}>
      {icons[type]}
      <span>{message}</span>
    </div>
  );
}

export default function ToastContainer({ toasts, removeToast }) {
  return (
    <div className="toast-container">
      {toasts.map(t => (
        <ToastItem key={t.id} message={t.message} type={t.type} onRemove={() => removeToast(t.id)} />
      ))}
    </div>
  );
}
