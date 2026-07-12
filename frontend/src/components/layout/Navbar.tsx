import { Menu, User, LogOut } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface NavbarProps {
  onMenuToggle?: () => void
}

export default function Navbar({ onMenuToggle }: NavbarProps) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <header className="w-full h-20 bg-white dark:bg-[#090d16] border-b border-slate-200/80 dark:border-slate-800/60 flex items-center justify-between px-8 shrink-0 shadow-[0_1px_3px_rgba(0,0,0,0.02)] backdrop-blur-xl">
      
      {/* Left Aligned Sector */}
      <div className="flex items-center gap-6">
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-[#030712] rounded-xl border border-transparent hover:border-slate-200/60 dark:hover:border-slate-800/60 transition-colors"
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>
        <span className="text-sm font-bold tracking-tight text-slate-800 dark:text-slate-200">
          Transit Operations Hub
        </span>
      </div>

      {/* Right Aligned Sector */}
      <div className="flex items-center gap-5">
        <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-slate-50 dark:bg-[#030712] border border-slate-200/80 dark:border-slate-800/60 text-slate-600 dark:text-slate-400 shadow-sm">
          <User size={16} />
        </div>
        
        {/* Fixed Alignment Divider Typo */}
        <div className="h-5 w-px bg-slate-200 dark:bg-slate-800/80" />
        
        <button 
          onClick={handleLogout}
          className="flex items-center justify-center p-2 rounded-xl text-slate-400 dark:text-slate-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 hover:text-rose-600 dark:hover:text-rose-400 border border-transparent hover:border-rose-100 dark:hover:border-rose-900/30 transition-all cursor-pointer"
          title="Logout"
        >
          <LogOut size={18} />
        </button>
      </div>

    </header>
  )
}