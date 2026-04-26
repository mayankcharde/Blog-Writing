import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  FileText, Code2, Download, FileDown, Layers,
  ExternalLink, Tag, Users, Mic2, ChevronDown,
  ChevronUp, CheckCircle2, Search, Circle, Copy, Check
} from 'lucide-react';

/* ─── Slug helper ─────────────────────────────────────────────────────────── */
function toSlug(text = '') {
  return text.toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

/* ─── PDF print export ────────────────────────────────────────────────────── */
function downloadAsPDF(contentRef, title) {
  const printWindow = window.open('', '_blank');
  const html = `<!DOCTYPE html><html><head><title>${title || 'Blog'}</title>
  <meta charset="utf-8"/>
  <style>
    *{box-sizing:border-box;margin:0;padding:0}
    body{font-family:Georgia,serif;color:#111;max-width:760px;margin:40px auto;padding:0 24px 80px;line-height:1.8;font-size:16px}
    h1{font-size:2rem;font-weight:800;margin-bottom:24px;line-height:1.2}
    h2{font-size:1.4rem;font-weight:700;margin:36px 0 12px;border-bottom:2px solid #e5e7eb;padding-bottom:8px}
    h3{font-size:1.15rem;font-weight:600;margin:28px 0 8px}
    p{margin-bottom:18px}
    ul,ol{margin:0 0 18px 24px}li{margin-bottom:6px}
    code{font-family:monospace;background:#f3f4f6;padding:2px 6px;border-radius:4px;font-size:.9em}
    pre{background:#1e293b;color:#e2e8f0;padding:20px;border-radius:8px;overflow:auto;margin-bottom:24px}
    pre code{background:none;padding:0;color:inherit}
    blockquote{border-left:4px solid #7c3aed;padding-left:16px;color:#4b5563;margin:0 0 18px}
    a{color:#7c3aed}
    img{max-width:100%;border-radius:8px;margin:16px 0}
    @media print{body{margin:0;padding:24px}}
  </style></head><body>${contentRef.current?.innerHTML || ''}</body></html>`;
  printWindow.document.write(html);
  printWindow.document.close();
  setTimeout(() => { printWindow.print(); printWindow.close(); }, 600);
}

/* ─── Sidebar collapsible section ────────────────────────────────────────── */
function SidebarBlock({ title, icon: Icon, color, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="rounded-xl border border-white/8 overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 bg-white/[0.04] hover:bg-white/[0.07] transition-colors"
      >
        <div className="flex items-center gap-2">
          <Icon className={`w-3.5 h-3.5 ${color}`} />
          <span className={`text-[9px] font-black uppercase tracking-[0.25em] ${color}`}>{title}</span>
        </div>
        {open
          ? <ChevronUp className="w-3 h-3 text-slate-600" />
          : <ChevronDown className="w-3 h-3 text-slate-600" />
        }
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="p-3.5">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Main ────────────────────────────────────────────────────────────────── */
export default function BlogResult({ result, downloadMarkdown }) {
  const [activeTab, setActiveTab] = useState('preview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState(null);
  const [copied, setCopied] = useState(false);
  const contentRef = useRef(null);
  const scrollRef  = useRef(null);

  const plan     = result?.plan;
  const evidence = result?.evidence || [];
  const final    = result?.final || '';
  const blogTitle = plan?.blog_title || 'Blog Post';
  const wordCount = final.split(/\s+/).filter(Boolean).length;

  const copyBlog = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(final);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback for older browsers
      const ta = document.createElement('textarea');
      ta.value = final;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [final]);

  /* Scroll to heading inside the panel */
  const scrollToSection = useCallback((title) => {
    const slug = toSlug(title);
    const heading = scrollRef.current?.querySelector(`#section-${slug}`);
    if (heading) {
      heading.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveSection(slug);
    }
    setSidebarOpen(false); // close on mobile after click
  }, []);

  /* Observe which heading is visible → highlight task */
  useEffect(() => {
    if (activeTab !== 'preview' || !scrollRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(e => {
          if (e.isIntersecting) setActiveSection(e.target.id.replace('section-', ''));
        });
      },
      { root: scrollRef.current, rootMargin: '-30% 0px -60% 0px', threshold: 0 }
    );
    scrollRef.current?.querySelectorAll('[id^="section-"]').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [activeTab, final]);

  /* Custom heading renderer – adds anchor ids */
  const mdComponents = {
    h1: ({ children }) => {
      const text = String(children);
      return <h1 id={`section-${toSlug(text)}`} className="scroll-mt-6">{children}</h1>;
    },
    h2: ({ children }) => {
      const text = String(children);
      return <h2 id={`section-${toSlug(text)}`} className="scroll-mt-6">{children}</h2>;
    },
    h3: ({ children }) => {
      const text = String(children);
      return <h3 id={`section-${toSlug(text)}`} className="scroll-mt-6">{children}</h3>;
    },
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-6">

      {/* ── Mobile sidebar toggle ─────────────────────────────────────────── */}
      <div className="lg:hidden mb-3">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-white/10 bg-white/[0.04] text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-white hover:bg-white/8 transition-all"
        >
          <Layers className="w-3.5 h-3.5" />
          {sidebarOpen ? 'Hide' : 'Show'} Blog Structure & Navigation
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-5">

        {/* ══ LEFT SIDEBAR ═════════════════════════════════════════════════ */}
        <AnimatePresence>
          {(sidebarOpen || true) && (
            <motion.aside
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              className={`${sidebarOpen ? 'flex' : 'hidden'} lg:flex flex-col gap-3 lg:w-64 xl:w-72 shrink-0 lg:sticky lg:top-28 lg:self-start`}
            >
              {/* Editorial Meta */}
              {plan && (
                <SidebarBlock title="Editorial" icon={Layers} color="text-violet-400">
                  <div className="space-y-3">
                    <div>
                      <p className="text-[9px] text-slate-600 uppercase font-bold tracking-wider mb-1">Title</p>
                      <p className="text-white text-[12px] font-bold leading-snug">{plan.blog_title}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { icon: Users, label: 'Audience', value: plan.audience },
                        { icon: Mic2,  label: 'Tone',     value: plan.tone },
                      ].map(({ icon: Icon, label, value }) => (
                        <div key={label} className="rounded-lg bg-white/[0.03] border border-white/5 p-2">
                          <div className="flex items-center gap-1 mb-1">
                            <Icon className="w-2.5 h-2.5 text-slate-600" />
                            <span className="text-[8px] text-slate-600 uppercase font-bold tracking-wider">{label}</span>
                          </div>
                          <p className="text-slate-300 text-[10px] font-medium leading-tight">{value}</p>
                        </div>
                      ))}
                    </div>
                    {plan.blog_kind && (
                      <div className="flex">
                        <span className="inline-flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-violet-300 bg-violet-500/10 border border-violet-500/20 px-2.5 py-1 rounded-full">
                          <Tag className="w-2.5 h-2.5" />
                          {plan.blog_kind.replace(/_/g, ' ')}
                        </span>
                      </div>
                    )}
                  </div>
                </SidebarBlock>
              )}

              {/* Node Sequence → click to scroll */}
              {plan?.tasks?.length > 0 && (
                <SidebarBlock title="Sections" icon={CheckCircle2} color="text-teal-400">
                  <div className="space-y-1">
                    {plan.tasks.map((task) => {
                      const slug = toSlug(task.title);
                      const isActive = activeSection === slug;
                      return (
                        <button
                          key={task.id}
                          onClick={() => scrollToSection(task.title)}
                          title={`Jump to: ${task.title}`}
                          className={`w-full flex items-start gap-2.5 px-2.5 py-2 rounded-lg text-left transition-all duration-200 group ${
                            isActive
                              ? 'bg-violet-500/15 border border-violet-500/30'
                              : 'hover:bg-white/[0.04] border border-transparent hover:border-white/8'
                          }`}
                        >
                          <div className={`mt-0.5 w-5 h-5 rounded-md flex items-center justify-center text-[9px] font-black shrink-0 transition-all ${
                            isActive
                              ? 'bg-violet-500 text-white shadow-[0_0_12px_rgba(124,58,237,0.5)]'
                              : 'bg-white/[0.06] text-slate-500 group-hover:bg-violet-500/20 group-hover:text-violet-400'
                          }`}>
                            {task.id}
                          </div>
                          <span className={`text-[11px] leading-tight transition-colors ${
                            isActive ? 'text-violet-200 font-semibold' : 'text-slate-400 group-hover:text-slate-200'
                          }`}>
                            {task.title}
                          </span>
                          {isActive && (
                            <Circle className="w-1.5 h-1.5 text-violet-400 fill-violet-400 ml-auto mt-1.5 shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </SidebarBlock>
              )}

              {/* Sources */}
              <SidebarBlock title="Sources" icon={Search} color="text-cyan-400" defaultOpen={false}>
                {evidence.length > 0 ? (
                  <div className="space-y-1.5">
                    {evidence.slice(0, 6).map((e, i) => (
                      <a
                        key={i} href={e.url} target="_blank" rel="noreferrer"
                        className="flex items-start justify-between gap-2 p-2.5 rounded-lg bg-white/[0.03] border border-white/5 hover:border-cyan-500/30 hover:bg-cyan-500/5 transition-all group"
                      >
                        <span className="text-[10px] text-slate-400 group-hover:text-cyan-300 line-clamp-2 leading-tight transition-colors">
                          {e.title || 'Source'}
                        </span>
                        <ExternalLink className="w-3 h-3 text-slate-700 group-hover:text-cyan-400 shrink-0 mt-0.5 transition-colors" />
                      </a>
                    ))}
                  </div>
                ) : (
                  <p className="text-[10px] text-slate-600 italic text-center py-3">Closed-book — no external sources</p>
                )}
              </SidebarBlock>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* ══ MAIN CONTENT PANEL ═══════════════════════════════════════════ */}
        <div className="flex-1 min-w-0 flex flex-col gap-3">

          {/* Tab bar + downloads */}
          <div className="flex items-center justify-between gap-3 flex-wrap">
            {/* Preview / Source tabs */}
            <div className="flex items-center bg-black/40 border border-white/8 rounded-xl p-1 gap-1">
              {[
                { id: 'preview',  label: 'Preview', icon: FileText },
                { id: 'markdown', label: 'Source',  icon: Code2   },
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-lg transition-all duration-200 ${
                    activeTab === id
                      ? 'bg-violet-600 text-white shadow-[0_2px_12px_rgba(124,58,237,0.4)]'
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  <Icon className="w-3 h-3" />
                  <span>{label}</span>
                </button>
              ))}
            </div>

            {/* Export buttons */}
            <div className="flex items-center gap-2">
              {/* Copy */}
              <button
                onClick={copyBlog}
                title="Copy blog as Markdown"
                className={`flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest px-3.5 py-2 rounded-lg border transition-all duration-200 ${
                  copied
                    ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400'
                    : 'border-white/10 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white'
                }`}
              >
                {copied
                  ? <><Check className="w-3.5 h-3.5" /><span className="hidden sm:inline">Copied!</span></>
                  : <><Copy className="w-3.5 h-3.5" /><span className="hidden sm:inline">Copy</span></>}
              </button>
              {/* Download MD */}
              <button
                onClick={downloadMarkdown}
                title="Download as Markdown"
                className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest px-3.5 py-2 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">MD</span>
              </button>
              {/* Download PDF */}
              <button
                onClick={() => downloadAsPDF(contentRef, blogTitle)}
                title="Download as PDF"
                className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest px-3.5 py-2 rounded-lg border border-violet-500/40 bg-violet-500/10 hover:bg-violet-500/20 text-violet-300 hover:text-white transition-all shadow-[0_0_20px_rgba(124,58,237,0.15)]"
              >
                <FileDown className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">PDF</span>
              </button>
            </div>
          </div>

          {/* Content panel */}
          <div className="rounded-2xl border border-white/8 bg-black/35 backdrop-blur-xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
            {/* Top border glow */}
            <div className="h-px bg-gradient-to-r from-transparent via-violet-500/40 to-transparent" />

            <div
              ref={scrollRef}
              className="overflow-y-auto custom-scrollbar"
              style={{ maxHeight: 'calc(100vh - 230px)' }}
            >
              <AnimatePresence mode="wait">
                {activeTab === 'preview' ? (
                  <motion.div
                    key="preview"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="p-6 sm:p-8 md:p-10"
                    ref={contentRef}
                  >
                    <div className="
                      prose prose-invert max-w-none
                      prose-h1:text-2xl prose-h1:sm:text-3xl prose-h1:font-extrabold prose-h1:text-white prose-h1:leading-tight prose-h1:mb-8 prose-h1:mt-0
                      prose-h2:text-lg prose-h2:sm:text-xl prose-h2:font-bold prose-h2:text-slate-100 prose-h2:mt-12 prose-h2:mb-4 prose-h2:pb-3 prose-h2:border-b prose-h2:border-white/8
                      prose-h3:text-base prose-h3:font-semibold prose-h3:text-slate-200 prose-h3:mt-8 prose-h3:mb-3
                      prose-p:text-slate-300 prose-p:text-[15px] prose-p:leading-[1.9] prose-p:mb-5
                      prose-li:text-slate-300 prose-li:text-[15px] prose-li:leading-relaxed
                      prose-a:text-violet-400 prose-a:no-underline hover:prose-a:text-violet-300 hover:prose-a:underline
                      prose-code:text-cyan-300 prose-code:bg-white/5 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-[13px] prose-code:font-medium
                      prose-pre:bg-[#0a0f1e] prose-pre:border prose-pre:border-white/8 prose-pre:rounded-xl
                      prose-blockquote:border-l-violet-500 prose-blockquote:bg-violet-500/5 prose-blockquote:rounded-r-lg prose-blockquote:py-1 prose-blockquote:text-slate-400
                      prose-strong:text-white prose-strong:font-semibold
                      prose-img:rounded-xl prose-img:border prose-img:border-white/10
                      prose-table:text-sm prose-th:text-slate-300 prose-td:text-slate-400
                      prose-hr:border-white/8
                    ">
                      <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents}>
                        {final}
                      </ReactMarkdown>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="markdown"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="p-6 sm:p-8"
                  >
                    <pre className="text-[12px] font-mono text-slate-400 whitespace-pre-wrap leading-relaxed break-words">
                      {final}
                    </pre>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Stats row */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 px-1">
            {[
              { label: 'Words',    val: wordCount.toLocaleString() },
              { label: 'Sections', val: plan?.tasks?.length ?? '—' },
              { label: 'Sources',  val: evidence.length },
              { label: 'Mode',     val: result?.mode || 'Closed-Book' },
            ].map(({ label, val }) => (
              <div key={label} className="flex items-center gap-1.5">
                <span className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-600">{label}</span>
                <span className="text-[11px] font-bold text-slate-300 capitalize">{val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
