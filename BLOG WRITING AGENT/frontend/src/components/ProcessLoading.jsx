import { motion } from 'framer-motion';
import { Search, Layers, FileText, Image as ImageIcon, Sparkles } from 'lucide-react';

const steps = [
  { icon: Search, label: 'Researching', color: 'text-teal-400', bg: 'bg-teal-400/10' },
  { icon: Layers, label: 'Planning', color: 'text-indigo-400', bg: 'bg-indigo-400/10' },
  { icon: FileText, label: 'Drafting', color: 'text-pink-400', bg: 'bg-pink-400/10' },
  { icon: ImageIcon, label: 'Visualizing', color: 'text-amber-400', bg: 'bg-amber-400/10' }
];

export default function ProcessLoading() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="max-w-4xl mx-auto w-full px-4 mb-20"
    >
      <div className="glass-card p-16 text-center flex flex-col items-center gap-8 relative overflow-hidden backdrop-blur-2xl">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-500 via-indigo-500 to-pink-500 animate-pulse" />
        
        <div className="relative">
          <div className="w-24 h-24 border-[6px] border-indigo-500/10 border-t-indigo-500 rounded-full animate-spin transition-all duration-1000" />
          <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-indigo-400 w-10 h-10 animate-pulse" />
        </div>
        
        <div className="max-w-md">
          <h3 className="text-2xl font-bold mb-3 tracking-tight font-space">Architecting your blog...</h3>
          <p className="text-slate-400 font-medium">Our autonomous agents are currently navigating the web, structuring nodes, and drafting deep content for your topic.</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full mt-6">
          {steps.map((step, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15 }}
              className={`flex flex-col items-center gap-3 p-5 rounded-2xl ${step.bg} border border-white/5 group hover:scale-105 transition-transform duration-300`}
            >
              <step.icon className={`w-6 h-6 ${step.color} animate-pulse-slow`} />
              <span className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-500 group-hover:text-slate-300 transition-colors">{step.label}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
