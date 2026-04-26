import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Trash2, ChevronRight, FileText, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const History = ({ onSelectBlog }) => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const { token } = useAuth();

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/blogs', {
                headers: { 'x-auth-token': token }
            });
            setBlogs(res.data);
        } catch (err) {
            console.error('Failed to fetch history', err);
        } finally {
            setLoading(false);
        }
    };

    const deleteBlog = async (id, e) => {
        e.stopPropagation();
        if (!window.confirm('Are you sure you want to delete this blog?')) return;
        try {
            // Backend delete logic would go here
            setBlogs(blogs.filter(b => b._id !== id));
        } catch (err) {
            console.error('Failed to delete blog');
        }
    };

    const filteredBlogs = blogs.filter(blog => 
        blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (blog.topic && blog.topic.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
                <div className="relative">
                    <div className="w-16 h-16 border-4 border-violet-500/20 border-t-violet-500 rounded-full animate-spin" />
                    <Loader2 className="absolute inset-0 m-auto w-6 h-6 text-violet-500 animate-pulse" />
                </div>
                <p className="text-slate-500 text-sm font-bold uppercase tracking-widest animate-pulse">Synchronizing Library...</p>
            </div>
        );
    }

    return (
        <div className="w-full max-w-7xl mx-auto px-6 sm:px-10 pt-44 pb-20 lg:pt-60 lg:pb-32">
            {/* Header Section */}
            <div className="flex flex-col lg:flex-row items-center lg:items-end justify-between gap-12 mb-20 lg:mb-24">
                <div className="space-y-6 text-center lg:text-left">
                    <div className="space-y-3">
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-6xl lg:text-8xl font-black text-white tracking-tighter leading-[0.9]"
                        >
                            Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400">Archive</span>
                        </motion.h2>
                        <p className="text-slate-400 text-lg lg:text-2xl font-medium max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                            Manage and revisit your AI-powered content masterpieces.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
                        <div className="px-5 py-2 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{blogs.length} Total Blogs</span>
                        </div>
                        <div className="px-5 py-2 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3">
                            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Storage Active</span>
                        </div>
                    </div>
                </div>

                {/* Search Bar */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full max-w-md relative group"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-violet-500/20 to-cyan-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative bg-white/5 border border-white/10 rounded-2xl flex items-center px-6 py-4 focus-within:border-violet-500/50 transition-all">
                        <FileText className="w-5 h-5 text-slate-500 mr-4" />
                        <input 
                            type="text"
                            placeholder="Search your archive..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-transparent border-none outline-none text-white text-sm w-full placeholder:text-slate-600 font-medium"
                        />
                    </div>
                </motion.div>
            </div>

            {/* Content Grid */}
            {filteredBlogs.length === 0 ? (
                <div className="text-center py-32 bg-white/5 rounded-[3rem] border border-dashed border-white/10 backdrop-blur-3xl">
                    <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mx-auto mb-8">
                        <FileText className="w-10 h-10 text-slate-700" />
                    </div>
                    <p className="text-slate-400 font-black text-2xl tracking-tight">No results found.</p>
                    <p className="text-slate-600 text-sm mt-2 font-medium">Try a different search term or write a new blog.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
                    {filteredBlogs.map((blog, i) => (
                        <motion.div
                            key={blog._id}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05, duration: 0.5 }}
                            onClick={() => onSelectBlog(blog)}
                            className="group relative bg-[#0f0c1d]/30 backdrop-blur-3xl border border-white/5 hover:border-violet-500/40 rounded-[2rem] p-8 cursor-pointer transition-all hover:scale-[1.02] hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] flex flex-col justify-between min-h-[280px]"
                        >
                            <div className="space-y-6">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="w-14 h-14 shrink-0 rounded-2xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 border border-violet-500/20 flex items-center justify-center group-hover:rotate-6 transition-transform">
                                        <FileText className="w-7 h-7 text-violet-400" />
                                    </div>
                                    <button 
                                        onClick={(e) => deleteBlog(blog._id, e)}
                                        className="p-3 rounded-2xl border border-white/5 bg-white/5 text-slate-600 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20 transition-all active:scale-90"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                                
                                <div className="space-y-3">
                                    <h3 className="text-2xl font-black text-white group-hover:text-violet-400 transition-colors leading-tight line-clamp-2 tracking-tight">
                                        {blog.title}
                                    </h3>
                                    <div className="flex flex-wrap items-center gap-3">
                                        <div className="px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-[10px] font-black text-violet-400 uppercase tracking-widest">
                                            {blog.topic || 'General'}
                                        </div>
                                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                            <Calendar className="w-3.5 h-3.5" />
                                            {new Date(blog.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-8 flex items-center justify-between text-slate-500 group-hover:text-violet-400 transition-colors">
                                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Read Mastersheet</span>
                                <ChevronRight className="w-5 h-5 translate-x-[-10px] group-hover:translate-x-0 opacity-0 group-hover:opacity-100 transition-all" />
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default History;
