import { motion } from 'framer-motion';
import { Send, Loader2 } from 'lucide-react';

export default function EditorialInput({ topic, setTopic, loading, onSubmit }) {
  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15, duration: 0.6, ease: 'easeOut' }}
      onSubmit={onSubmit}
      className="w-full max-w-2xl mx-auto"
      id="write"
    >
      <div className="relative rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.5)] overflow-hidden">
        {/* Glow accent */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500/50 to-transparent" />

        <textarea
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Describe what you want to blog about... (e.g. 'How Retrieval-Augmented Generation works in production')"
          rows={3}
          maxLength={500}
          className="w-full bg-transparent text-white placeholder-slate-500 text-sm font-medium p-5 resize-none outline-none leading-relaxed"
        />

        {/* Bottom bar */}
        <div className="flex items-center justify-between px-5 pb-4 pt-0 gap-4">
          <span className="text-[10px] text-slate-600 font-medium tabular-nums">
            {topic.length} / 500
          </span>

          <button
            type="submit"
            disabled={loading || !topic.trim()}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-[11px] font-bold uppercase tracking-widest transition-all duration-200 shadow-[0_4px_20px_rgba(124,58,237,0.4)] hover:shadow-[0_4px_28px_rgba(124,58,237,0.6)] active:scale-95 group"
          >
            {loading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Generating…
              </>
            ) : (
              <>
                Generate Blog
                <Send className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* <p className="text-center text-[10px] text-slate-600 mt-3 tracking-wide">
        Powered by LangGraph · Gemini · Tavily Search
      </p> */}
    </motion.form>
  );
}
