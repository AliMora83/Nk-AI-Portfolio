"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function Hero() {
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.15, delayChildren: 0.2 },
        },
    };

    const item = {
        hidden: { opacity: 0, y: 30 },
        show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 20 } },
    };

    return (
        <section className="relative w-full min-h-screen flex items-center bg-bg overflow-hidden pt-24">
            {/* Background Decor */}
            <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
                {/* Fine Grid */}
                <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage: "linear-gradient(var(--paper) 1px, transparent 1px), linear-gradient(90deg, var(--paper) 1px, transparent 1px)",
                        backgroundSize: "72px 72px",
                    }}
                />
                {/* Orbs */}
                <div className="absolute top-1/4 -right-1/4 w-[600px] h-[600px] bg-rust opacity-10 blur-[120px] rounded-full mix-blend-screen" />
                <div className="absolute bottom-1/4 -left-1/4 w-[500px] h-[500px] bg-sage opacity-10 blur-[100px] rounded-full mix-blend-screen" />
                <div className="absolute top-1/2 left-1/4 w-[400px] h-[400px] bg-amber opacity-5 blur-[90px] rounded-full mix-blend-screen" />
            </div>

            {/* Watermark Right */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 origin-right rotate-90 mono-label text-[0.6rem] text-muted hidden lg:block tracking-[0.3em]">
                ali.mora@namka.cloud
            </div>

            {/* Scroll Hint Bottom Left */}
            <div className="absolute bottom-12 left-6 md:left-12 flex items-center gap-4 hidden sm:flex">
                <motion.div
                    animate={{ height: ["0px", "40px", "0px"], y: ["0px", "0px", "40px"] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="w-px bg-rust"
                />
                <span className="mono-label text-[0.6rem] text-muted">Scroll to explore</span>
            </div>

            <div className="w-full max-w-7xl mx-auto px-6 md:px-12 relative z-10">
                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="max-w-[900px]"
                >
                    {/* Eyebrow */}
                    <motion.div variants={item} className="flex items-center gap-4 mb-8">
                        <div className="w-8 h-[2px] bg-rust" />
                        <span className="mono-label text-xs sm:text-sm text-paper max-w-[280px] sm:max-w-none">
                            Ali Mora · AI-Powered Studio · Bloemfontein, SA
                        </span>
                    </motion.div>

                    {/* H1 */}
                    <motion.h1 variants={item} className="text-6xl sm:text-7xl md:text-[7.5rem] leading-[0.95] font-syne font-extrabold text-paper mb-6 tracking-tight">
                        Design.<br />
                        <span className="font-instrument italic font-normal text-amber pr-4">React.</span><br />
                        AI.
                    </motion.h1>

                    {/* Sub */}
                    <motion.p variants={item} className="text-lg sm:text-2xl text-muted font-mono max-w-[600px] mb-12 leading-relaxed">
                        A decade of brand experience, now supercharged by Gemini & Kimi. I build faster — so you launch sooner.
                    </motion.p>

                    {/* CTAs */}
                    <motion.div variants={item} className="flex gap-4 sm:gap-6 flex-wrap">
                        <Link
                            href="#demos"
                            className="flex items-center gap-2 bg-rust border border-rust text-white font-syne font-bold px-8 py-4 rounded-lg hover:bg-rust/90 hover:-translate-y-1 hover:shadow-[0_10px_30px_-10px_rgba(184,74,47,0.5)] transition-all duration-300"
                        >
                            Explore AI Demos <ArrowRight size={18} />
                        </Link>
                        <Link
                            href="#contact"
                            className="flex items-center gap-2 border border-border text-paper font-syne font-bold px-8 py-4 rounded-lg hover:border-rust hover:-translate-y-1 transition-all duration-300"
                        >
                            Start a Project
                        </Link>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}
