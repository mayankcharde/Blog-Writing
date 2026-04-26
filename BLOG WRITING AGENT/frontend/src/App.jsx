import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import axios from 'axios';

import Header from './components/Header';
import Hero from './components/Hero';
import EditorialInput from './components/EditorialInput';
import ProcessLoading from './components/ProcessLoading';
import BlogResult from './components/BlogResult';
import Footer from './components/Footer';
import PlasmaWave from './components/Grainient';
import LandingPage from './pages/LandingPage';
import History from './components/History';
import About from './components/About';
import { AuthProvider, useAuth } from './context/AuthContext';

const API_BASE = import.meta.env.VITE_BLOG_API_URL;
const AUTH_BASE = import.meta.env.VITE_AUTH_API_URL;

function BlogApp() {
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [currentView, setCurrentView] = useState('write'); // 'write', 'history', or 'about'
  const { user, token, loading: authLoading } = useAuth();

  const handleAutoSave = async (blogData) => {
    try {
      await axios.post(`${AUTH_BASE}/blogs`, {
        title: blogData.plan?.blog_title || topic,
        content: blogData.final,
        topic: topic
      }, {
        headers: { 'x-auth-token': token }
      });
      console.log('Blog auto-saved successfully');
    } catch (err) {
      console.error('Auto-save failed');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!topic.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);
    setCurrentView('write');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    try {
      const response = await axios.post(`${API_BASE}/generate-blog`, {
        topic: topic.trim(),
        as_of: new Date().toISOString().split('T')[0],
      });
      if (response.data.status === 'success') {
        const generatedBlog = response.data.data;
        setResult(generatedBlog);
        // Auto-save to DB
        handleAutoSave(generatedBlog);
      } else {
        setError(response.data.error || 'Failed to generate content.');
      }
    } catch (err) {
      setError(err.message || 'Could not connect to the backend.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectHistoryBlog = (blog) => {
    setResult({
      final: blog.content,
      plan: { blog_title: blog.title }
    });
    setTopic(blog.topic || '');
    setCurrentView('write');
  };

  const downloadMarkdown = () => {
    if (!result?.final) return;
    const blob = new Blob([result.final], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${result.plan?.blog_title?.toLowerCase().replace(/\s+/g, '_') || 'blog'}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#06040f] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <LandingPage />;
  }

  return (
    <div className="relative flex flex-col min-h-screen overflow-x-hidden bg-[#06040f] selection:bg-violet-500/30 selection:text-white">

      {/* ── Background ──────────────────────────────────────────── */}
      <div className="fixed inset-0 z-0">
        <PlasmaWave
          colors={['#7c3aed', '#0891b2']}
          speed1={0.04}
          speed2={0.04}
          bend1={1.2}
          bend2={0.6}
          focalLength={0.8}
        />
        <div className="absolute inset-0 bg-[#06040f]/55" />
      </div>

      {/* ── Navbar ──────────────────────────────────────────────── */}
      <Header onNavigate={setCurrentView} />

      {/* ── Main ────────────────────────────────────────────────── */}
      <main className="relative z-10 flex-grow flex flex-col">

        {currentView === 'history' ? (
          <History onSelectBlog={handleSelectHistoryBlog} />
        ) : currentView === 'about' ? (
          <About />
        ) : (
          <>
            {/* HOME: Hero + Input */}
            <AnimatePresence mode="wait">
              {!result && !loading && (
                <motion.section
                  key="home"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="min-h-screen flex flex-col items-center justify-center px-4 pt-24 pb-10"
                >
                  <Hero />
                  <EditorialInput
                    topic={topic}
                    setTopic={setTopic}
                    loading={loading}
                    onSubmit={handleSubmit}
                  />
                </motion.section>
              )}
            </AnimatePresence>

            {/* LOADING */}
            <AnimatePresence mode="wait">
              {loading && (
                <motion.section
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="min-h-screen flex items-center justify-center px-4"
                >
                  <ProcessLoading />
                </motion.section>
              )}
            </AnimatePresence>

            {/* RESULT */}
            <AnimatePresence mode="wait">
              {result && !loading && (
                <motion.section
                  key="result"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="w-full pt-32 pb-16 lg:pt-44 px-4 md:px-6 flex flex-col items-center gap-8"
                >
                  <div className="text-center max-w-xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-[9px] font-black uppercase tracking-[0.25em] mb-4">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Ready to Publish
                    </div>
                    <h2 className="text-3xl md:text-4xl font-extrabold font-space text-white tracking-tight leading-tight mb-2">
                      Your Blog is Ready
                    </h2>
                    <p className="text-slate-500 text-[13px] mb-5">Click any section in the sidebar to jump directly to it.</p>
                    <button
                      onClick={() => { setResult(null); setTopic(''); }}
                      className="text-[10px] font-bold uppercase tracking-widest text-slate-600 hover:text-violet-400 border-b border-transparent hover:border-violet-400 transition-all pb-px w-fit mx-auto"
                    >
                      ← Write Another Blog
                    </button>
                  </div>

                  <BlogResult result={result} downloadMarkdown={downloadMarkdown} />
                </motion.section>
              )}
            </AnimatePresence>
          </>
        )}

        {/* ERROR */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 max-w-md w-full mx-4 p-4 rounded-2xl border border-red-500/20 bg-red-500/10 backdrop-blur-xl text-red-400 text-center shadow-2xl"
            >
              <p className="text-xs font-semibold mb-2">{error}</p>
              <button
                onClick={() => setError(null)}
                className="text-[10px] font-bold uppercase tracking-widest text-red-400/60 hover:text-red-300 transition-colors"
              >
                Dismiss
              </button>
            </motion.div>
          )}
        </AnimatePresence>

      </main>

      <Footer />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <BlogApp />
    </AuthProvider>
  );
}

export default App;
