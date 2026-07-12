import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Shield, Lock, Mail, Users2 } from 'lucide-react';

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

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#030712] font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      
      {/* Left Panel - Premium Synced Visual Deck */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#090d16] border-r border-slate-800/60 relative flex-col p-16 justify-between overflow-hidden">
        
        {/* Strict Color Grid Pattern Background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b10_1px,transparent_1px)] bg-[size:3rem_3rem]" />
        
        {/* Precise Application Theme Glowing Orb */}
        <div className="absolute top-1/3 left-1/4 w-[450px] h-[450px] bg-indigo-500/5 rounded-full blur-[140px] pointer-events-none animate-pulse duration-[6000ms]" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-12">
            <div className="h-9 w-9 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold font-mono text-sm shadow-[0_0_15px_rgba(99,102,241,0.05)]">
              T
            </div>
            <span className="text-base font-black text-white tracking-wider uppercase">
              Transit<span className="text-indigo-400">Ops</span>
            </span>
          </div>
          
          <h1 className="text-4xl font-black text-white tracking-tight leading-[1.1]">
            Automated Fleet <br />
            <span className="text-indigo-400">Orchestration System</span>
          </h1>
        </div>

        {/* High-Fidelity App Wireframe Vector Mockup */}
        <div className="relative z-10 my-auto max-w-sm w-full space-y-12">
          <div className="p-5 bg-[#030712]/90 border border-slate-800/80 rounded-2xl relative shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-sm group hover:border-indigo-500/30 transition-colors duration-300">
            <div className="absolute top-3 right-3 flex gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-800" />
              <span className="w-1.5 h-1.5 rounded-full bg-slate-800" />
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500/40" />
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
                <div className="h-3 w-28 bg-indigo-500/10 rounded border border-indigo-500/20" />
              </div>
              
              <div className="space-y-2 pt-1">
                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div className="w-[78%] h-full bg-indigo-500 rounded-full shadow-[0_0_8px_#6366f1]" />
                </div>
                <div className="flex justify-between text-[10px] font-mono text-slate-500 font-bold">
                  <span>METRIC CODES</span>
                  <span className="text-indigo-400">78% EFFICIENCY</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-2 px-1">
            <h3 className="text-sm font-bold text-slate-200 tracking-wide">Next-Gen Telematics Terminal</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-medium">
              Synchronize real-time operational states, analyze metrics, and dispatch updates over isolated channels with enterprise-grade token execution.
            </p>
          </div>
        </div>

        <div className="relative z-10 text-[10px] font-bold text-slate-600 uppercase tracking-widest flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500/30" />
          TRANSITOPS CORE ENGINE • EST. 2026
        </div>
      </div>

      {/* Right Panel - Core Authentication Module (UNTOUCHED Structure with Matched Colors) */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8 relative">
        
        {/* Floating System Alerts */}
        {error && (
          <div className="absolute right-8 top-8 left-8 sm:left-auto sm:w-80 p-4 rounded-xl border border-rose-500/30 bg-rose-950/10 backdrop-blur-md text-rose-400 z-20 shadow-2xl animate-in fade-in slide-in-from-top-4 duration-200">
            <div className="flex items-start justify-between">
              <div className="flex gap-2.5">
                <X className="w-4 h-4 shrink-0 mt-0.5" />
                <p className="text-xs font-bold tracking-wide leading-relaxed">{error}</p>
              </div>
              <button onClick={() => setError('')} className="text-rose-400/50 hover:text-rose-400 ml-2">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        <div className="w-full max-w-sm">
          <header className="mb-8">
            <h2 className="text-xl font-black text-white tracking-tight">Sign in to console</h2>
            <p className="text-slate-400 text-xs font-medium mt-1">Enter authorized credentials to gain entry token</p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Email Form Entry */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 tracking-wider uppercase flex items-center gap-2">
                <Mail size={12} className="text-slate-500" /> Email Identity
              </label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#090d16] border border-slate-800/80 rounded-xl px-4 py-3 text-white text-xs font-medium focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:focus:ring-indigo-500/40 transition-all placeholder-slate-600"
                placeholder="operator@transitops.in"
                required
              />
            </div>

            {/* Password Form Entry */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 tracking-wider uppercase flex items-center gap-2">
                <Lock size={12} className="text-slate-500" /> System Password
              </label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#090d16] border border-slate-800/80 rounded-xl px-4 py-3 text-white text-xs font-medium focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:focus:ring-indigo-500/40 transition-all placeholder-slate-700"
                placeholder="••••••••"
                required
              />
            </div>

            {/* Role Target Select */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 tracking-wider uppercase flex items-center gap-2">
                <Users2 size={12} className="text-slate-500" /> Target Access Scope
              </label>
              <div className="relative">
                <select 
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full bg-[#090d16] border border-slate-800/80 rounded-xl px-4 py-3 text-white text-xs font-bold focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all cursor-pointer appearance-none"
                >
                  <option>Fleet Manager</option>
                  <option>Dispatcher</option>
                  <option>Safety Officer</option>
                  <option>Financial Analyst</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4 text-slate-500">
                  <Shield size={14} />
                </div>
              </div>
            </div>

            {/* Persistence Controls */}
            <div className="flex items-center justify-between pt-2">
              <label className="flex items-center space-x-2.5 cursor-pointer group">
                <input type="checkbox" defaultChecked className="sr-only peer" />
                <div className="w-4 h-4 rounded border border-slate-700 bg-[#090d16] flex items-center justify-center peer-checked:border-indigo-500 peer-checked:bg-indigo-600 transition-all">
                  <div className="w-1.5 h-1.5 bg-white rounded-sm"></div>
                </div>
                <span className="text-slate-400 text-xs font-semibold group-hover:text-slate-300 transition-colors">Keep session active</span>
              </label>
              <a href="#" className="text-indigo-400 hover:text-indigo-300 text-xs font-bold transition-colors">
                Recover Access
              </a>
            </div>

            {/* Action Trigger */}
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl py-3.5 mt-4 shadow-lg shadow-indigo-600/10 transition-all duration-200 hover:scale-[1.01] disabled:opacity-50 disabled:hover:scale-100 cursor-pointer"
            >
              {loading ? 'Authorizing Console Token...' : 'Initialize Secure Session'}
            </button>
          </form>

        </div>
      </div>

    </div>
  );
}