import { PenLine } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/5 bg-black/30 backdrop-blur-xl">
      <div className="max-w-5xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-violet-500/20 border border-violet-500/30 flex items-center justify-center">
            <PenLine className="w-3 h-3 text-violet-400" />
          </div>
          <span className="text-sm font-bold font-space text-white tracking-tight">
            Blog<span className="text-violet-400">Agent</span>
          </span>
        </div>

        {/* Links */}
        <div className="flex items-center gap-6 text-[10px] font-semibold text-slate-500 uppercase tracking-[0.15em]">
          <a href="#" className="hover:text-slate-300 transition-colors">Docs</a>
          <a href="#" className="hover:text-slate-300 transition-colors">GitHub</a>
          <a href="#" className="hover:text-slate-300 transition-colors">Contact</a>
        </div>

        {/* Copyright */}
        <p className="text-[10px] text-slate-600 font-medium">
          © {new Date().getFullYear()} BlogAgent · Built with LangGraph
        </p>
      </div>
    </footer>
  );
}
