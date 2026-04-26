import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PenLine, Menu, X, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const navLinks = [
  { label: 'Write', href: '#write' },
  { label: 'History', href: '#' },
  { label: 'About', href: '#' },
];

export default function Header({ onNavigate }) {
  const [open, setOpen] = useState(false);
  const { logout, user } = useAuth();

  const handleNavClick = (view, e) => {
    e.preventDefault();
    onNavigate(view);
    setOpen(false);
  };

  return (
    <>
      {/* ── Top Bar ───────────────────────────────── */}
      <header className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-5 px-4">
        <motion.nav
          initial={{ y: -16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="flex items-center gap-6 w-full max-w-2xl px-5 py-3 rounded-full border border-white/10 bg-black/50 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.5)]"
        >
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer group flex-1" onClick={(e) => handleNavClick('write', e)}>
            <div className="w-7 h-7 rounded-lg bg-violet-500/20 border border-violet-500/40 flex items-center justify-center group-hover:bg-violet-500/30 transition-colors">
              <PenLine className="w-3.5 h-3.5 text-violet-400" />
            </div>
            <span className="text-sm font-bold font-space text-white tracking-tight">
              Blog<span className="text-violet-400">Agent</span>
            </span>
          </div>

          {/* Desktop Links */}
          <div className="hidden sm:flex items-center gap-6 text-[11px] font-semibold text-slate-400 uppercase tracking-widest">
            <a href="#" onClick={(e) => handleNavClick('write', e)} className="hover:text-white transition-colors duration-200">Write</a>
            <a href="#" onClick={(e) => handleNavClick('history', e)} className="hover:text-white transition-colors duration-200">History</a>
            <a href="#" className="hover:text-white transition-colors duration-200">About</a>
          </div>

          {/* User Info & Logout */}
          <div className="hidden sm:flex items-center gap-4 border-l border-white/10 pl-4">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">
              {user?.username}
            </span>
            <button
              onClick={logout}
              className="flex items-center justify-center w-8 h-8 rounded-full border border-red-500/20 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all duration-300"
              title="Logout"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setOpen(!open)}
            className="sm:hidden flex items-center justify-center w-8 h-8 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-colors"
            aria-label="Toggle menu"
          >
            {open ? (
              <X className="w-4 h-4 text-white" />
            ) : (
              <Menu className="w-4 h-4 text-white" />
            )}
          </button>
        </motion.nav>
      </header>

      {/* ── Mobile Dropdown ───────────────────────── */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="fixed top-[4.5rem] left-4 right-4 z-40 sm:hidden rounded-2xl border border-white/10 bg-black/70 backdrop-blur-2xl shadow-[0_16px_48px_rgba(0,0,0,0.6)] overflow-hidden"
          >
            <div className="flex flex-col py-2">
              <div className="px-5 py-3 border-b border-white/10 mb-2">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Logged in as</p>
                <p className="text-sm font-bold text-white">{user?.username}</p>
              </div>
              {navLinks.map(({ label, href }) => (
                <a
                  key={label}
                  href={href}
                  onClick={() => setOpen(false)}
                  className="px-5 py-3.5 text-sm font-semibold text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
                >
                  {label}
                </a>
              ))}
              <div className="mx-5 mt-1 mb-3 pt-3 border-t border-white/10 flex flex-col gap-3">
                <button
                  onClick={() => { logout(); setOpen(false); }}
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-red-500/20 bg-red-500/10 text-red-400 text-[11px] font-bold uppercase tracking-widest transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Logout
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop to close menu */}
      {open && (
        <div
          className="fixed inset-0 z-30 sm:hidden"
          onClick={() => setOpen(false)}
        />
      )}
    </>
  );
}
