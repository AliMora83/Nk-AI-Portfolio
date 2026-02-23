"use client";

import { motion, Variants } from "framer-motion";
import Link from "next/link";

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.15, delayChildren: 0.2 },
    },
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

export function Hero() {
    return (
        <section className="relative min-h-screen pt-32 pb-20 flex flex-col justify-center overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 z-0 opacity-30 pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-rust/20 rounded-full blur-[100px]" />
                <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-amber/20 rounded-full blur-[100px]" />
                <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-sage/20 rounded-full blur-[100px]" />
            </div>

            {/* Grid Pattern */}
            <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:72px_72px]" />

            {/* Email Watermark */}
            <div className="absolute right-8 top-1/2 -translate-y-1/2 hidden lg:flex items-center gap-4 rotate-90 origin-right text-muted opacity-50 z-10 pointer-events-none">
                <span className="w-12 h-[1px] bg-muted" />
                <span className="font-mono text-xs tracking-[0.2em] uppercase">
                    ali.mora@namka.cloud
                </span>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                    className="max-w-[900px] flex flex-col items-start gap-8"
                >
                    {/* Eyebrow */}
                    <motion.div variants={itemVariants} className="flex items-center gap-3">
                        <span className="w-8 h-[1px] bg-rust" />
                        <span className="font-mono text-xs uppercase tracking-[0.15em] text-amber">
                            Ali Mora · AI-Powered Studio · Bloemfontein, SA
                        </span>
                    </motion.div>

                    {/* Heading */}
                    <motion.h1
                        variants={itemVariants}
                        className="text-6xl md:text-8xl lg:text-[120px] font-syne font-extrabold leading-[0.9] tracking-tight text-paper"
                    >
                        Design.<br />
                        <span className="font-instrument italic text-amber font-normal">
                            React.
                        </span><br />
                        AI.
                    </motion.h1>

                    {/* Subheading */}
                    <motion.p
                        variants={itemVariants}
                        className="text-lg md:text-xl text-muted max-w-2xl font-syne font-medium mt-4 text-balance"
                    >
                        A decade of brand experience, now supercharged by Gemini & Kimi.
                        I build faster — so you launch sooner.
                    </motion.p>

                    {/* CTAs */}
                    <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-6 mt-8">
                        <Link
                            href="#demos"
                            className="bg-rust text-paper px-8 py-4 rounded-sm font-syne font-bold hover:bg-amber transition-colors duration-300 shadow-[0_0_20px_rgba(184,74,47,0.2)] hover:shadow-[0_0_30px_rgba(212,144,58,0.4)]"
                        >
                            Explore AI Demos
                        </Link>
                        <Link
                            href="#contact"
                            className="group flex items-center gap-3 px-8 py-4 rounded-sm border border-border hover:border-rust hover:text-rust transition-all duration-300 bg-transparent font-syne font-bold"
                        >
                            Start a Project
                            <span className="group-hover:translate-x-1 transition-transform duration-300">
                                →
                            </span>
                        </Link>
                    </motion.div>
                </motion.div>
            </div>

            {/* Scroll Hint */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2, duration: 1 }}
                className="absolute bottom-12 left-6 md:left-[9%] flex flex-col items-center gap-4 z-10"
            >
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] rotate-90 origin-left -translate-y-8 text-muted">
                    Scroll to explore
                </span>
                <div className="w-[1px] h-16 bg-border relative overflow-hidden">
                    <motion.div
                        className="absolute top-0 left-0 w-full h-1/2 bg-rust"
                        animate={{
                            y: ["-100%", "200%"],
                        }}
                        transition={{
                            repeat: Infinity,
                            duration: 2,
                            ease: "linear",
                        }}
                    />
                </div>
            </motion.div>
        </section>
    );
}
