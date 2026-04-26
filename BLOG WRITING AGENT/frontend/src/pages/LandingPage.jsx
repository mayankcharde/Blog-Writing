import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { LogIn, UserPlus, Mail, Lock, User, ArrowRight, CheckCircle2 } from 'lucide-react';
import ColorBends from '../components/ColorBends';

const LandingPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login, register } = useAuth();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            if (isLogin) {
                await login(formData.email, formData.password);
            } else {
                await register(formData.username, formData.email, formData.password);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Authentication failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-[#030014]">
            {/* Professional Background Animation */}
            <div className="absolute inset-0 z-0">
                <ColorBends
                    colors={['#8b5cf6', '#06b6d4', '#6366f1', '#d946ef']}
                    speed={0.12}
                    intensity={1.8}
                    noise={0.08}
                    warpStrength={1.2}
                    transparent={true}
                    scale={0.8}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-[#030014]/20 via-[#030014]/40 to-[#030014]/80" />
            </div>

            <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center relative z-10 py-12 lg:py-0 px-4 md:px-10">

                {/* Left Side: Brand & Value Prop */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="space-y-8 lg:space-y-12 text-center lg:text-left"
                >
                    <div className="space-y-6">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-[10px] lg:text-xs font-bold uppercase tracking-[0.2em]"
                        >
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500"></span>
                            </span>

                        </motion.div>
                        <h1 className="text-5xl sm:text-6xl lg:text-8xl font-black text-white tracking-tight leading-[1.05]">
                            Write <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400">Smarter</span>, <br />
                            Not Harder.
                        </h1>
                        <p className="text-slate-400 text-lg lg:text-xl max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">
                            The ultimate professional blog writing platform. Empower your digital presence with high-fidelity, AI-driven content tailored to your voice.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-x-8 gap-y-4 max-w-lg mx-auto lg:mx-0 text-left">
                        {[
                            { title: "AI Drafting", desc: "Instant high-quality drafts" },
                            { title: "Deep Research", desc: "Fact-checked content" },
                            { title: "SEO Optimized", desc: "Rank higher on search" },
                            { title: "Export Ready", desc: "One-click publishing" }
                        ].map((feature, i) => (
                            <div key={i} className="space-y-1">
                                <div className="flex items-center gap-2 text-white">
                                    <CheckCircle2 className="w-5 h-5 text-violet-500 shrink-0" />
                                    <span className="text-sm lg:text-base font-bold">{feature.title}</span>
                                </div>
                                <p className="text-[11px] lg:text-xs text-slate-500 pl-7">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Right Side: Auth Card */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="relative w-full max-w-[480px] mx-auto"
                >
                    {/* Glow effect behind card */}
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-600 to-cyan-600 rounded-[2.5rem] blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>

                    <div className="relative bg-[#0a0a1a]/60 backdrop-blur-3xl border border-white/10 rounded-[2rem] p-8 lg:p-12 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
                        <div className="flex flex-col gap-8">
                            <div className="space-y-2 text-center lg:text-left">
                                <h2 className="text-2xl font-bold text-white tracking-tight">
                                    {isLogin ? 'Welcome Back' : 'Get Started'}
                                </h2>
                                <p className="text-sm text-slate-500">
                                    {isLogin ? 'Enter your credentials to continue' : 'Create an account to start writing'}
                                </p>
                            </div>

                            <div className="flex items-center gap-1 p-1 bg-white/5 rounded-2xl w-full border border-white/5">
                                <button
                                    onClick={() => setIsLogin(true)}
                                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold transition-all duration-300 ${isLogin ? 'bg-white/10 text-white shadow-xl' : 'text-slate-500 hover:text-slate-300'}`}
                                >
                                    <LogIn className="w-4 h-4" /> Login
                                </button>
                                <button
                                    onClick={() => setIsLogin(false)}
                                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold transition-all duration-300 ${!isLogin ? 'bg-white/10 text-white shadow-xl' : 'text-slate-500 hover:text-slate-300'}`}
                                >
                                    <UserPlus className="w-4 h-4" /> Register
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <AnimatePresence mode="wait">
                                    {!isLogin && (
                                        <motion.div
                                            key="username"
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            className="space-y-2"
                                        >
                                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">Username</label>
                                            <div className="relative group">
                                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-violet-400 transition-colors">
                                                    <User className="w-5 h-5" />
                                                </div>
                                                <input
                                                    type="text"
                                                    name="username"
                                                    required={!isLogin}
                                                    placeholder="Your name"
                                                    value={formData.username}
                                                    onChange={handleChange}
                                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all placeholder:text-slate-600"
                                                />
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">Email Address</label>
                                    <div className="relative group">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-violet-400 transition-colors">
                                            <Mail className="w-5 h-5" />
                                        </div>
                                        <input
                                            type="email"
                                            name="email"
                                            required
                                            placeholder="name@company.com"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all placeholder:text-slate-600"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">Password</label>
                                    <div className="relative group">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-violet-400 transition-colors">
                                            <Lock className="w-5 h-5" />
                                        </div>
                                        <input
                                            type="password"
                                            name="password"
                                            required
                                            placeholder="••••••••"
                                            value={formData.password}
                                            onChange={handleChange}
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all placeholder:text-slate-600"
                                        />
                                    </div>
                                </div>

                                {error && (
                                    <motion.p
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="text-red-400 text-xs font-medium px-1 bg-red-400/5 py-2 rounded-lg border border-red-400/20 text-center"
                                    >
                                        {error}
                                    </motion.p>
                                )}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-600 hover:scale-[1.02] active:scale-[0.98] text-white font-bold py-4 rounded-2xl shadow-xl shadow-violet-500/20 flex items-center justify-center gap-3 group transition-all disabled:opacity-50 disabled:scale-100"
                                >
                                    {loading ? (
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            <span className="text-sm uppercase tracking-widest">{isLogin ? 'Sign In' : 'Create Account'}</span>
                                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default LandingPage;
