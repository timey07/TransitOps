import { Menu, User } from 'lucide-react'

interface NavbarProps {
  onMenuToggle?: () => void
}

export default function Navbar({ onMenuToggle }: NavbarProps) {
  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-1.5 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>
        <span className="text-sm font-medium text-slate-500">Transit Operations Hub</span>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 border border-slate-200 text-slate-600">
          <User size={16} />
        </div>
      </div>
    </header>
  )
}
