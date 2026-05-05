import { useState } from 'react';

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(username, password);
  };

  return (
    <div className="login-bg min-h-screen flex items-center justify-center p-4">
      <div className="card glow-box p-10 w-full max-w-md animate-in">
        <div className="text-center mb-10">
          <div className="gradient-btn rounded-2xl flex items-center justify-center mx-auto mb-5"
               style={{width:72,height:72}}>
            <svg className="w-9 h-9 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
            </svg>
          </div>
          <h1 className="font-display text-2xl font-bold mb-3">Admin Portal</h1>
          <p className="text-sm" style={{color:'var(--text-secondary)'}}>Secure access to your dashboard</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-2" style={{color:'var(--text-secondary)'}}>Username</label>
            <input type="text" className="input-field" placeholder="Enter username" required
              value={username} onChange={e => setUsername(e.target.value)}/>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2" style={{color:'var(--text-secondary)'}}>Password</label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                className="input-field pr-12" 
                placeholder="Enter password" 
                required
                value={password} 
                onChange={e => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 transition-colors duration-200"
                style={{ color: showPassword ? 'var(--accent)' : 'var(--text-muted)' }}
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                )}
              </button>
            </div>
          </div>
          <button type="submit" className="gradient-btn w-full py-3.5 rounded-xl font-semibold text-white mt-8">
            Sign In
          </button>
        </form>
        <p className="text-center text-xs mt-8" style={{color:'var(--text-muted)'}}>
          Demo credentials: admin / admin123
        </p>
      </div>
    </div>
  );
}
