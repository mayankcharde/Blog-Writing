import { motion } from 'framer-motion';
import { Sparkles, Zap, BookOpen } from 'lucide-react';

export default function Hero() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      className="flex flex-col items-center text-center px-4 w-full max-w-3xl mx-auto"
    >
      {/* Badge */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-300 text-[10px] font-bold uppercase tracking-[0.2em] mb-7">
        <Sparkles className="w-3 h-3" />
        Autonomous Blog Writing Agent
      </div>

      {/* Headline */}
      <h1 className="text-[2.6rem] md:text-6xl font-extrabold font-space leading-[1.1] tracking-tight text-white mb-5">
        Write Detailed Blogs<br />
        <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">From One Prompt</span>
      </h1>

      {/* Subheading */}
      <p className="text-slate-400 text-base md:text-[17px] leading-relaxed max-w-xl mb-10 font-medium">
        Describe your topic and let the AI agent research, plan, and generate a full technical blog post — complete with references and images.
      </p>

      {/* Feature pills */}
      <div className="flex flex-wrap justify-center gap-3 mb-6">
        {[
          { icon: BookOpen, text: 'Research-Backed' },
          { icon: Zap, text: 'Instant Generation' },
          { icon: Sparkles, text: 'AI-Powered' },
        ].map(({ icon: Icon, text }) => (
          <span key={text} className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
            <Icon className="w-3 h-3 text-violet-400" />
            {text}
          </span>
        ))}
      </div>
    </motion.div>
  );
}
