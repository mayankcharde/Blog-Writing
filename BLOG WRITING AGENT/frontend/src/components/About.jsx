import React from 'react';
import { motion } from 'framer-motion';
import { Cpu, Zap, Globe, Shield, Sparkles, Code, PenTool, Layout } from 'lucide-react';

const FeatureCard = ({ icon: Icon, title, desc, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay, duration: 0.6 }}
        className="flex flex-col items-center text-center p-8 rounded-[2.5rem] bg-white/5 border border-white/10 hover:border-violet-500/30 transition-all hover:bg-white/10"
    >
        <div className="w-16 h-16 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center mb-6">
            <Icon className="w-8 h-8 text-violet-400" />
        </div>
        <h3 className="text-xl font-black text-white mb-4 tracking-tight">{title}</h3>
        <p className="text-slate-500 text-sm leading-relaxed font-medium">{desc}</p>
    </motion.div>
);

const About = () => {
    return (
        <div className="w-full max-w-7xl mx-auto px-6 sm:px-10 pt-60 pb-32 lg:pt-80 lg:pb-48">
            {/* Centered Hero */}
            <div className="flex flex-col items-center text-center max-w-5xl mx-auto mb-32 lg:mb-48">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="px-6 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-[10px] lg:text-xs font-black uppercase tracking-[0.4em] mb-10"
                >
                    Revolutionizing Content
                </motion.div>

                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-5xl lg:text-8xl font-black text-white tracking-tighter leading-[1.1] mb-10"
                >
                    Intelligence Meets <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400">Creativity.</span>
                </motion.h2>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-slate-400 text-lg lg:text-2xl font-medium max-w-3xl leading-relaxed"
                >
                    IntelliBlog uses a sophisticated multi-agent system to turn complex topics into high-quality, research-backed technical blogs in seconds.
                </motion.p>
            </div>

            {/* Simple Centered Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-16 mb-40">
                <FeatureCard
                    icon={Sparkles}
                    title="AI-Powered"
                    desc="Advanced orchestration using specialized agents for planning, research, and writing."
                    delay={0.1}
                />
                <FeatureCard
                    icon={Globe}
                    title="Live Research"
                    desc="Integrated with real-time search tools to ensure your content is accurate and up-to-date."
                    delay={0.2}
                />
                <FeatureCard
                    icon={Layout}
                    title="SEO Optimized"
                    desc="Automatically structured for readability and search engines with high-quality metadata."
                    delay={0.3}
                />
            </div>

            {/* Simple Tech Footer */}
            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                className="pt-24 border-t border-white/5 text-center space-y-12"
            >
                {/* <p className="text-slate-600 text-[10px] font-black uppercase tracking-[0.5em]">Powered by Industry Standards</p>
                <div className="flex flex-wrap justify-center gap-x-16 gap-y-8 text-sm lg:text-base font-bold text-slate-500 tracking-tighter">
                    <span className="hover:text-violet-400 transition-colors cursor-default">LangGraph</span>
                    <span className="hover:text-violet-400 transition-colors cursor-default">Mistral AI</span>
                    <span className="hover:text-violet-400 transition-colors cursor-default">FastAPI</span>
                    <span className="hover:text-violet-400 transition-colors cursor-default">React.js</span>
                    <span className="hover:text-violet-400 transition-colors cursor-default">MongoDB</span>
                </div> */}
            </motion.div>
        </div>
    );
};

export default About;
