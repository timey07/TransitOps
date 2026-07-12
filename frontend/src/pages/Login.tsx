import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Dispatcher');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const API_URL = 'http://localhost:3000/api/auth/login';

  const roleMapping: Record<string, string> = {
    'Fleet Manager': 'FLEET_MANAGER',
    'Dispatcher': 'DISPATCHER',
    'Safety Officer': 'SAFETY_OFFICER',
    'Financial Analyst': 'FINANCIAL_ANALYST'
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email, 
          password,
          role: roleMapping[role]
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Invalid credentials.');
      }

      // Save token and user details to localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      // Navigate to dashboard
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen font-sans">
      
      {/* Left Panel - Light */}
      <div className="w-1/2 bg-[#d1d5db] relative flex flex-col p-16">
        
        <div className="mt-8">
          <div className="w-12 h-12 bg-transparent border-2 border-amber-600 rounded grid grid-cols-3 gap-0.5 p-1 mb-6">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="bg-amber-600 rounded-sm"></div>
            ))}
          </div>
          
          <h1 className="text-4xl font-semibold text-gray-900 tracking-tight">TransitOps</h1>
          <p className="text-gray-600 mt-2 font-medium">Smart Transport Operations Platform</p>
        </div>

        <div className="my-auto">
          <p className="text-gray-800 font-semibold mb-4 text-lg">One login, four roles:</p>
          <ul className="space-y-3">
            {['Fleet Manager', 'Dispatcher', 'Safety Officer', 'Financial Analyst'].map((r) => (
              <li key={r} className="flex items-center text-gray-700 text-sm font-medium">
                <span className="w-2 h-2 rounded-full bg-amber-600 mr-3"></span>
                {r}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-auto text-xs text-gray-500 font-semibold uppercase tracking-wider">
          TRANSITOPS © 2026 • RBAC ENABLED
        </div>
      </div>

      {/* Right Panel - Dark */}
      <div className="w-1/2 bg-[#111111] flex flex-col items-center justify-center relative">
        
        {/* Error State Overlay */}
        {error && (
          <div className="absolute right-12 top-48 w-64 p-4 rounded-xl border border-dashed border-red-500 bg-[#1a1a1a] text-red-400 z-10 shadow-2xl">
            <div className="flex items-start">
              <X className="w-5 h-5 mr-2 shrink-0 mt-0.5 font-bold" />
              <p className="text-sm font-medium leading-relaxed">
                {error}
              </p>
            </div>
          </div>
        )}

        <div className="w-full max-w-sm">
          <h2 className="text-2xl font-semibold text-white mb-2">Sign in to your account</h2>
          <p className="text-gray-400 text-sm mb-10">Enter your credentials to continue</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-500 tracking-widest uppercase">EMAIL</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#1a1a1a] border border-gray-800 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-amber-600 transition-colors"
                placeholder="raven.k@transitops.in"
                required
              />
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-500 tracking-widest uppercase">PASSWORD</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#1a1a1a] border border-gray-800 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-amber-600 transition-colors"
                placeholder="••••••••"
                required
              />
            </div>

            {/* Role Field */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-500 tracking-widest uppercase">ROLE (RBAC)</label>
              <select 
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full bg-[#1a1a1a] border border-gray-800 rounded-lg px-4 py-3 text-white text-sm appearance-none focus:outline-none focus:border-amber-600 transition-colors"
              >
                <option>Fleet Manager</option>
                <option>Dispatcher</option>
                <option>Safety Officer</option>
                <option>Financial Analyst</option>
              </select>
            </div>

            {/* Options */}
            <div className="flex items-center justify-between pt-2">
              <label className="flex items-center space-x-3 cursor-pointer">
                <div className="w-5 h-5 rounded border border-gray-600 bg-[#1a1a1a] flex items-center justify-center">
                  <div className="w-3 h-3 bg-green-500 rounded-sm"></div>
                </div>
                <span className="text-gray-300 text-sm font-medium">Remember me</span>
              </label>
              <a href="#" className="text-blue-500 hover:text-blue-400 text-sm font-medium transition-colors">
                Forgot password?
              </a>
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-[#b45309] hover:bg-[#92400e] text-white font-medium rounded-lg py-3 mt-4 transition-colors disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Scoped Access Info */}
          <div className="mt-12">
            <p className="text-gray-500 text-xs mb-3">Access is scoped by role after login:</p>
            <ul className="space-y-1.5 text-gray-400 text-xs">
              <li>• Fleet Manager → Fleet, Maintenance</li>
              <li>• Dispatcher → Dashboard, Trips</li>
              <li>• Safety Officer → Drivers, Compliance</li>
              <li>• Financial Analyst → Fuel & Expenses, Analytics</li>
            </ul>
          </div>

        </div>
      </div>

    </div>
  );
}
