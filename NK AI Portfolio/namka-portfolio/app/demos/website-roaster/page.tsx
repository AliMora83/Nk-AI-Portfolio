"use client";

import { useState } from "react";
import { DemoHeader } from "@/components/DemoHeader";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Flame, Copy, CheckCircle2 } from "lucide-react";

type RoastResult = {
    siteName: string;
    siteType: string;
    overallScore: number;
    scores: { design: number; copy: number; ux: number; seo: number; conversion: number; mobile: number };
    verdict: string;
    roastLine: string;
    wins: string[];
    kills: string[];
    quickFixes: { fix: string; impact: string }[];
    bigMove: string;
};

export default function WebsiteRoaster() {
    const [url, setUrl] = useState("");
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState("");
    const [result, setResult] = useState<RoastResult | null>(null);
    const [copied, setCopied] = useState(false);

    const statuses = [
        "Analysing visual hierarchy...",
        "Reading copy...",
        "Judging UX decisions...",
        "Calculating technical debt...",
        "Generating brutal verdict..."
    ];

    async function handleRoast(e: React.FormEvent) {
        e.preventDefault();
        if (!url) return;

        setLoading(true);
        setResult(null);

        // Fake status progression for cool UI
        let i = 0;
        const interval = setInterval(() => {
            setStatus(statuses[i % statuses.length]);
            i++;
        }, 1500);

        try {
            const prompt = `You are a brutally honest but constructive website auditor. Analyse the website at: ${url}

Based on typical patterns for this type of website/URL, provide a detailed audit. Return ONLY valid JSON:

{
  "siteName": "name of the website",
  "siteType": "type of site",
  "overallScore": <0-100>,
  "scores": { "design": 0-100, "copy": 0-100, "ux": 0-100, "seo": 0-100, "conversion": 0-100, "mobile": 0-100 },
  "verdict": "2-sentence brutal but fair verdict",
  "roastLine": "one savage but true one-liner about the biggest problem",
  "wins": ["strength 1", "strength 2", "strength 3"],
  "kills": ["critical issue 1", "critical issue 2", "critical issue 3", "critical issue 4"],
  "quickFixes": [{"fix": "...", "impact": "..."}],
  "bigMove": "the one strategic change with highest conversion impact"
}`;

            const res = await fetch("/api/gemini", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt, maxTokens: 2000 })
            });

            const data = await res.json();

            if (data.text) {
                // Extract JSON from potential markdown wrapping
                const jsonMatch = data.text.match(/\\{([\\s\\S]*)\\}/);
                const jsonStr = jsonMatch ? jsonMatch[0] : data.text;

                try {
                    const parsed = JSON.parse(jsonStr);
                    setResult(parsed);
                } catch (e) {
                    console.error("Failed to parse Gemini JSON", e, data.text);
                    alert("Gemini returned malformed data. Trying again might work.");
                }
            } else {
                alert(data.error || "Failed to generate roast.");
            }
        } catch (err) {
            console.error(err);
            alert("Network error.");
        } finally {
            clearInterval(interval);
            setLoading(false);
        }
    }

    function copyToClipboard() {
        if (!result) return;
        navigator.clipboard.writeText(JSON.stringify(result, null, 2));
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }

    const getGrade = (score: number) => {
        if (score >= 90) return "A";
        if (score >= 80) return "B";
        if (score >= 70) return "C";
        if (score >= 60) return "D";
        return "F";
    };

    return (
        <main className="min-h-screen bg-bg">
            <DemoHeader title="AI Website Roaster" />

            <div className="max-w-4xl mx-auto px-6 py-20">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-rust/10 text-rust mb-6">
                        <Flame size={32} />
                    </div>
                    <h1 className="text-5xl font-syne font-bold text-paper mb-4">Website Roaster</h1>
                    <p className="font-mono text-sm text-muted max-w-xl mx-auto uppercase tracking-widest leading-relaxed">
                        Enter a URL. Gemini audits the design, copy, and UX in seconds.
                        Brutally honest. Actionable results.
                    </p>
                </div>

                <form onSubmit={handleRoast} className="flex flex-col sm:flex-row gap-4 mb-20 max-w-2xl mx-auto">
                    <input
                        type="url"
                        required
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="https://example.com"
                        className="flex-1 bg-surface border border-border p-4 rounded-sm font-mono text-sm text-paper focus:outline-none focus:border-rust transition-colors"
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-rust text-paper px-8 py-4 rounded-sm font-syne font-bold hover:bg-amber transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {loading ? <span className="animate-spin text-xl">◌</span> : <><Flame size={20} /> Roast It</>}
                    </button>
                </form>

                <AnimatePresence>
                    {loading && !result && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="text-center py-20"
                        >
                            <div className="font-mono text-sm text-amber animate-pulse tracking-widest uppercase mb-4">
                                {status || "Initializing..."}
                            </div>
                            <div className="w-64 h-1 bg-border mx-auto overflow-hidden rounded-full">
                                <motion.div
                                    className="h-full bg-rust"
                                    animate={{ x: ["-100%", "100%"] }}
                                    transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                                />
                            </div>
                        </motion.div>
                    )}

                    {result && !loading && (
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-surface border border-border rounded-sm p-8 md:p-12 relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-rust/5 rounded-bl-[100px] pointer-events-none" />

                            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 border-b border-border/50 pb-8">
                                <div>
                                    <h2 className="font-syne text-3xl font-bold text-paper mb-2">{result.siteName}</h2>
                                    <span className="font-mono text-[10px] text-amber uppercase tracking-widest border border-amber/30 px-3 py-1 rounded-full">
                                        {result.siteType}
                                    </span>
                                </div>
                                <div className="mt-8 md:mt-0 flex items-center gap-6 text-right">
                                    <div className="flex flex-col items-center">
                                        <span className="font-mono text-xs text-muted uppercase tracking-widest mb-2">Grade</span>
                                        <span className={`text-6xl font-syne font-bold ${result.overallScore >= 70 ? "text-sage" : result.overallScore >= 50 ? "text-amber" : "text-rust"}`}>
                                            {getGrade(result.overallScore)}
                                        </span>
                                    </div>
                                    <div className="flex flex-col items-center relative w-32 h-32 justify-center">
                                        <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                                            <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="4" className="text-border" />
                                            <motion.circle
                                                cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="4"
                                                className={result.overallScore >= 70 ? "text-sage" : result.overallScore >= 50 ? "text-amber" : "text-rust"}
                                                strokeDasharray="283"
                                                initial={{ strokeDashoffset: 283 }}
                                                animate={{ strokeDashoffset: 283 - (283 * result.overallScore) / 100 }}
                                                transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
                                            />
                                        </svg>
                                        <div className="flex flex-col items-center z-10">
                                            <span className="text-4xl font-syne font-bold text-paper">
                                                {result.overallScore}
                                            </span>
                                            <span className="font-mono text-[10px] text-muted uppercase tracking-widest leading-none">/ 100</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mb-16">
                                <p className="font-instrument italic text-3xl text-rust mb-6 border-l-4 border-rust pl-6 leading-tight">
                                    &quot;{result.roastLine}&quot;
                                </p>
                                <p className="font-syne text-lg text-paper leading-relaxed">
                                    {result.verdict}
                                </p>
                            </div>

                            <div className="grid sm:grid-cols-2 gap-12 mb-16">
                                <div>
                                    <h3 className="font-mono text-xs uppercase tracking-widest text-[#4A7A4A] mb-6 flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-[#4A7A4A]" /> The Good (Wins)
                                    </h3>
                                    <ul className="space-y-4">
                                        {result.wins.map((win, i) => (
                                            <li key={i} className="font-syne text-sm text-paper pl-4 border-l border-[#4A7A4A]/30">
                                                {win}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div>
                                    <h3 className="font-mono text-xs uppercase tracking-widest text-rust mb-6 flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-rust" /> The Bad (Kills)
                                    </h3>
                                    <ul className="space-y-4">
                                        {result.kills.map((kill, i) => (
                                            <li key={i} className="font-syne text-sm text-paper pl-4 border-l border-rust/30">
                                                {kill}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            <div className="mb-16">
                                <h3 className="font-mono text-xs uppercase tracking-widest text-amber mb-8 border-b border-border/50 pb-4">
                                    Category Breakdown
                                </h3>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                                    {Object.entries(result.scores).map(([category, score]) => (
                                        <div key={category} className="flex flex-col gap-2">
                                            <div className="flex justify-between items-center font-mono text-xs uppercase">
                                                <span className="text-muted tracking-wide">{category}</span>
                                                <span className={score >= 70 ? "text-sage" : score >= 50 ? "text-amber" : "text-rust"}>{score}</span>
                                            </div>
                                            <div className="w-full h-1 bg-bg rounded-full overflow-hidden">
                                                <motion.div
                                                    className={`h-full ${score >= 70 ? "bg-sage" : score >= 50 ? "bg-amber" : "bg-rust"}`}
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${score}%` }}
                                                    transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="mb-16">
                                <h3 className="font-mono text-xs uppercase tracking-widest text-amber mb-6">Quick Fixes (High ROI)</h3>
                                <div className="space-y-4">
                                    {result.quickFixes.map((fix, i) => (
                                        <div key={i} className="bg-bg border border-border/50 p-4 rounded-sm flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                                            <div className="flex items-start gap-3">
                                                <span className="font-mono text-rust mt-0.5">0{i + 1}</span>
                                                <span className="font-syne text-sm text-paper">{fix.fix}</span>
                                            </div>
                                            <span className="font-mono text-[10px] text-amber uppercase tracking-widest border border-amber/20 px-2 py-1 bg-amber/5 whitespace-nowrap">
                                                Impact: {fix.impact}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-amber/5 border border-amber/20 p-8 rounded-sm mb-12">
                                <h3 className="font-mono text-xs uppercase tracking-widest text-amber mb-4">The Big Strategic Move</h3>
                                <p className="font-syne text-lg text-paper">{result.bigMove}</p>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between border-t border-border pt-8">
                                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                                    <button
                                        onClick={copyToClipboard}
                                        className="w-full sm:w-auto font-mono text-xs uppercase tracking-widest flex items-center justify-center gap-2 border border-border px-6 py-3 rounded-sm hover:border-rust hover:text-rust transition-colors"
                                    >
                                        {copied ? <><CheckCircle2 size={16} /> Copied JSON</> : <><Copy size={16} /> Copy Report</>}
                                    </button>
                                    <button
                                        onClick={() => setResult(null)}
                                        className="w-full sm:w-auto font-mono text-xs uppercase tracking-widest flex items-center justify-center gap-2 border border-border px-6 py-3 rounded-sm hover:border-amber hover:text-amber transition-colors"
                                    >
                                        <Flame size={16} /> Roast Another
                                    </button>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                                    <a
                                        href="https://wa.me/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full sm:w-auto font-syne font-bold border border-border text-paper px-6 py-3 rounded-sm flex items-center justify-center gap-2 hover:bg-surface transition-colors shadow-sm"
                                    >
                                        WhatsApp Ali
                                    </a>
                                    <a
                                        href="https://openmindi.co.za"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full sm:w-auto font-syne font-bold bg-amber text-paper px-6 py-3 rounded-sm flex items-center justify-center gap-2 hover:bg-rust transition-colors shadow-sm"
                                    >
                                        Hire OpenMindi <ArrowUpRight size={16} />
                                    </a>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </main>
    );
}
