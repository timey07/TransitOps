import { useState, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../components/layout/Sidebar'
import Navbar from '../components/layout/Navbar'
import { Sun, Moon } from 'lucide-react'

interface DashboardLayoutProps {
  children?: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' || 
        (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
    }
    return false
  })

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }, [darkMode])

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50/60 dark:bg-[#030712] font-sans transition-colors duration-300">
      {/* Mobile Drawer Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-[#030712]/60 backdrop-blur-md lg:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Enclosure */}
      <div
        className={`fixed inset-y-0 left-0 z-50 transform lg:relative lg:translate-x-0 transition-transform duration-300 ease-out shrink-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <Sidebar />
      </div>

      {/* Premium Content Body viewportholder */}
      <div className="flex flex-col flex-1 min-w-0 h-full overflow-hidden">
        {/* Sleek App Navigation Bar */}
        <header className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800/60 bg-white/70 dark:bg-[#090d16]/70 backdrop-blur-xl px-8 py-5">
          <Navbar onMenuToggle={() => setSidebarOpen(true)} />
          
          <div className="flex items-center gap-5">
            {/* Hackathon Pro-Indicator */}

            {/* Premium Theme Controller Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#090d16] text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-all duration-200 hover:scale-105 shadow-sm"
              aria-label="Toggle Theme"
            >
              {darkMode ? <Sun size={17} className="text-amber-400" /> : <Moon size={17} />}
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 sm:p-8 lg:p-10 space-y-8 max-w-[1700px] w-full mx-auto">
          {children || <Outlet />}
        </main>
      </div>
    </div>
  )
}