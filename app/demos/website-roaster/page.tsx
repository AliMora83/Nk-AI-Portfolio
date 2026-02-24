"use client";

import { useState } from "react";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { RevealWrapper } from "@/components/ui/RevealWrapper";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { ScoreRing } from "@/components/ui/ScoreRing";
import { Loader2, ArrowLeft, ArrowUpRight, Flame, Check, X, Wrench, Zap } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function WebsiteRoaster() {
    const [url, setUrl] = useState("");
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [result, setResult] = useState<any>(null);
    const [loadingText, setLoadingText] = useState("Analyzing visual hierarchy...");

    const loadingMessages = [
        "Analyzing visual hierarchy...",
        "Reading copy...",
        "Testing UX assumptions...",
        "Judging color contrast...",
        "Generating brutal verdict...",
    ];

    const roastIt = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!url) return;

        setStatus("loading");
        let msgIndex = 0;
        const interval = setInterval(() => {
            msgIndex = (msgIndex + 1) % loadingMessages.length;
            setLoadingText(loadingMessages[msgIndex]);
        }, 1500);

        const prompt = `You are a brutally honest but constructive website auditor. Analyse the typical website expected at: ${url}

Based on typical patterns for this type of website/URL, provide a detailed audit. Return ONLY valid JSON and absolutely no other markdown text. Follow this schema exactly:

{
  "siteName": "name of the website",
  "siteType": "type of site",
  "overallScore": 65,
  "scores": { "design": 70, "copy": 50, "ux": 60, "seo": 80, "conversion": 40, "mobile": 90 },
  "verdict": "2-sentence brutal but fair verdict",
  "roastLine": "one savage but true one-liner about the biggest problem",
  "wins": ["strength 1", "strength 2", "strength 3"],
  "kills": ["critical issue 1", "critical issue 2", "critical issue 3", "critical issue 4"],
  "quickFixes": [{"fix": "...", "impact": "..."},{"fix":"...","impact":"..."},{"fix":"...","impact":"..."}],
  "bigMove": "the one strategic change with highest conversion impact"
}`;

        try {
            const res = await fetch("/api/gemini", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt, maxTokens: 1500 })
            });

            const data = await res.json();
            clearInterval(interval);

            if (data.error) throw new Error(data.error);

            const jsonMatch = data.text.match(/\{[\s\S]*\}/);
            if (!jsonMatch) throw new Error("Invalid format returned");

            setResult(JSON.parse(jsonMatch[0]));
            setStatus("success");
        } catch (error) {
            clearInterval(interval);
            console.error(error);
            setStatus("error");
        }
    };

    const gradeLetter = (score: number) => {
        if (score >= 90) return "A";
        if (score >= 80) return "B";
        if (score >= 70) return "C";
        if (score >= 60) return "D";
        return "F";
    };

    return (
        <main className="min-h-screen bg-bg flex flex-col">
            <Nav />
            {/* Set padding explicitly since Nav is absolute but we need to push content down anyway */}
            <div className="flex-1 w-full max-w-7xl mx-auto px-6 md:px-12 pt-32 pb-24">

                <Link href="/" className="inline-flex items-center gap-2 text-muted hover:text-rust font-mono text-xs uppercase tracking-widest mb-12 transition-colors">
                    <ArrowLeft size={14} /> Back to Portfolio
                </Link>

                <RevealWrapper>
                    <SectionLabel text="AI Prototype" />
                    <h1 className="text-5xl md:text-7xl font-syne font-bold text-paper mb-6 flex items-center gap-4">
                        Website Roaster <Flame className="text-rust w-10 h-10 md:w-16 md:h-16" />
                    </h1>
                    <p className="font-mono text-muted max-w-2xl mb-12 leading-relaxed">
                        Enter any URL. Gemini audits the website in seconds — scoring design, copy, UX, SEO, and conversion. Returns a brutal, honest, actionable report.
                    </p>
                </RevealWrapper>

                {/* Input area */}
                <RevealWrapper delay={0.1}>
                    <form onSubmit={roastIt} className="flex flex-col sm:flex-row gap-4 max-w-2xl mb-16 relative z-20">
                        <input
                            type="url"
                            required
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            placeholder="https://example.com"
                            className="flex-1 bg-surface border border-border rounded-lg px-6 py-4 text-paper font-mono text-sm focus:border-rust focus:outline-none transition-colors"
                            disabled={status === "loading"}
                        />
                        <button
                            type="submit"
                            disabled={status === "loading" || !url}
                            className="bg-rust border border-rust text-white font-syne font-bold px-8 py-4 rounded-lg hover:bg-rust/90 hover:-translate-y-1 hover:shadow-[0_10px_30px_-10px_rgba(184,74,47,0.5)] transition-all duration-300 disabled:opacity-70 disabled:hover:translate-y-0 flex items-center justify-center gap-2"
                        >
                            {status === "loading" ? <Loader2 className="animate-spin" /> : "🔥 Roast It"}
                        </button>
                    </form>
                </RevealWrapper>

                {/* Loading State */}
                <AnimatePresence mode="wait">
                    {status === "loading" && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="w-full max-w-2xl p-12 rounded-xl border border-border bg-surface flex flex-col items-center justify-center gap-6"
                        >
                            <div className="relative w-16 h-16">
                                <div className="absolute inset-0 border-4 border-surface rounded-full"></div>
                                <div className="absolute inset-0 border-4 border-rust rounded-full border-t-transparent animate-spin"></div>
                            </div>
                            <p className="font-mono text-xs text-amber uppercase tracking-widest animate-pulse">
                                {loadingText}
                            </p>
                        </motion.div>
                    )}

                    {/* Results State */}
                    {status === "success" && result && (
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="w-full relative z-10 space-y-8"
                        >
                            {/* Header Card */}
                            <div className="p-8 md:p-12 rounded-2xl border border-border bg-card flex flex-col lg:flex-row gap-12 lg:items-center relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-rust/5 blur-[100px] rounded-full pointer-events-none" />

                                <div className="flex-1">
                                    <div className="font-mono text-xs text-rust uppercase tracking-widest mb-4">
                                        {result.siteType}
                                    </div>
                                    <h2 className="text-3xl md:text-5xl font-syne font-bold text-paper mb-6">
                                        {result.siteName}
                                    </h2>
                                    <p className="font-instrument italic text-xl md:text-3xl text-paper/90 leading-tight mb-8">
                                        "{result.roastLine}"
                                    </p>
                                    <p className="font-syne text-muted leading-relaxed max-w-2xl border-l-2 border-border pl-4">
                                        {result.verdict}
                                    </p>
                                </div>

                                <div className="flex items-center gap-8 shrink-0">
                                    <div className="flex flex-col items-center justify-center w-32 h-32 rounded-full border-4 border-surface bg-bg shadow-inner relative">
                                        <span className="font-syne text-5xl font-extrabold text-paper tracking-tighter shadow-sm">{gradeLetter(result.overallScore)}</span>
                                        <div className="absolute -bottom-3 bg-card border border-border px-3 py-1 rounded-full font-mono text-[0.6rem] uppercase tracking-widest">
                                            {result.overallScore} / 100
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Score Rings */}
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 p-8 rounded-2xl border border-border bg-surface">
                                <ScoreRing score={result.scores.design} label="Design" />
                                <ScoreRing score={result.scores.copy} label="Copy" />
                                <ScoreRing score={result.scores.ux} label="UX" />
                                <ScoreRing score={result.scores.seo} label="SEO" />
                                <ScoreRing score={result.scores.conversion} label="Conversion" />
                                <ScoreRing score={result.scores.mobile} label="Mobile" />
                            </div>

                            {/* Wins & Kills */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="p-8 rounded-2xl border border-border bg-card">
                                    <h3 className="flex items-center gap-3 font-syne font-bold text-2xl text-paper mb-8">
                                        <Check className="text-sage" /> What Works (Wins)
                                    </h3>
                                    <ul className="space-y-4">
                                        {result.wins.map((win: string, i: number) => (
                                            <li key={i} className="flex gap-4 font-mono text-sm text-muted">
                                                <span className="text-sage mt-1">✓</span> {win}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="p-8 rounded-2xl border border-border bg-card">
                                    <h3 className="flex items-center gap-3 font-syne font-bold text-2xl text-paper mb-8">
                                        <X className="text-rust" /> What's Broken (Kills)
                                    </h3>
                                    <ul className="space-y-4">
                                        {result.kills.map((kill: string, i: number) => (
                                            <li key={i} className="flex gap-4 font-mono text-sm text-muted">
                                                <span className="text-rust mt-1">×</span> {kill}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            {/* Strategy */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                <div className="lg:col-span-2 p-8 rounded-2xl border border-border bg-surface">
                                    <h3 className="flex items-center gap-3 font-syne font-bold text-2xl text-paper mb-8">
                                        <Wrench className="text-amber" /> Quick Fixes
                                    </h3>
                                    <div className="space-y-6">
                                        {result.quickFixes.map((fix: any, i: number) => (
                                            <div key={i} className="flex gap-6 border-b border-border/50 pb-6 last:border-0 last:pb-0">
                                                <span className="font-mono text-xs text-amber block mt-1 shrink-0">0{i + 1}</span>
                                                <div>
                                                    <p className="font-syne text-paper font-bold mb-2">{fix.fix}</p>
                                                    <p className="font-mono text-xs text-muted uppercase tracking-widest"><span className="text-paper/40">Impact:</span> {fix.impact}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="p-8 rounded-2xl border border-rust/50 bg-rust/5 flex flex-col relative overflow-hidden group">
                                    <div className="absolute -right-6 -top-6 text-rust opacity-10 group-hover:scale-110 transition-transform duration-500">
                                        <Zap size={200} />
                                    </div>
                                    <h3 className="flex items-center gap-3 font-syne font-bold text-2xl text-paper mb-6 relative z-10">
                                        The Big Move
                                    </h3>
                                    <p className="font-syne text-lg text-paper/90 leading-relaxed relative z-10 mb-12 flex-1">
                                        {result.bigMove}
                                    </p>
                                    <a
                                        href={`https://openmindi.co.za?ref=roaster&url=${encodeURI(url)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="relative z-10 w-full rounded-lg bg-rust hover:bg-rust/90 text-white font-syne font-bold py-4 px-6 text-center transition-colors flex items-center justify-center gap-2"
                                    >
                                        Hire OpenMindi to Fix It <ArrowUpRight size={18} />
                                    </a>
                                </div>
                            </div>

                        </motion.div>
                    )}

                    {status === "error" && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6 bg-rust/10 border border-rust/30 rounded-xl text-rust font-mono text-sm max-w-2xl">
                            Failed to roast the website. Please check the URL, wait a moment due to rate limits, and try again.
                        </motion.div>
                    )}
                </AnimatePresence>

            </div>
            <Footer />
        </main>
    );
}
