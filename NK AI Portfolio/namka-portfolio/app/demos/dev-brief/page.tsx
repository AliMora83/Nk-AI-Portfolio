"use client";

import { useState } from "react";
import { DemoHeader } from "@/components/DemoHeader";
import { motion, AnimatePresence } from "framer-motion";
import { FileCode2, Copy, TerminalSquare, Database, Share2, Briefcase, ArrowUpRight } from "lucide-react";

type BriefResult = {
    projectName: string;
    oneLiner: string;
    architecture: string;
    stack: string[];
    dbSchema: { table: string; fields: string }[];
    apiRoutes: { method: string; route: string; desc: string }[];
    mvpScope: string[];
    estimatedTime: string;
};

export default function DevBriefGenerator() {
    const [idea, setIdea] = useState("");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<BriefResult | null>(null);
    const [copied, setCopied] = useState(false);

    async function handleGenerate(e: React.FormEvent) {
        e.preventDefault();
        if (!idea) return;

        setLoading(true);
        setResult(null);

        try {
            const prompt = `Act as a Staff Engineer. The user has this app idea: "${idea}"

Convert this rough idea into a structured technical development brief.
Return ONLY valid JSON:
{
  "projectName": "Catchy working title",
  "oneLiner": "1 sentence technical summary of what it does",
  "architecture": "Brief explanation of the system architecture",
  "stack": ["Next.js", "PostgreSQL", "etc"],
  "dbSchema": [{"table": "users", "fields": "id, email, password_hash"}],
  "apiRoutes": [{"method": "GET", "route": "/api/resource", "desc": "..."}],
  "mvpScope": ["feature 1", "feature 2", "feature 3"],
  "estimatedTime": "Realistic time for a solo dev (e.g., '2 Weeks')"
}`;

            const res = await fetch("/api/gemini", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt, maxTokens: 1500 })
            });

            const data = await res.json();
            if (data.text) {
                const jsonMatch = data.text.match(/\\{([\\s\\S]*)\\}/);
                const jsonStr = jsonMatch ? jsonMatch[0] : data.text;
                try {
                    const parsed = JSON.parse(jsonStr);
                    setResult(parsed);
                } catch (e) {
                    console.error("JSON Parse Error", e);
                    alert("Gemini returned malformed data.");
                }
            } else {
                alert(data.error);
            }
        } catch (err) {
            console.error(err);
            alert("Network error.");
        } finally {
            setLoading(false);
        }
    }

    function copyMarkdown() {
        if (!result) return;
        const md = `# ${result.projectName} - Technical Brief
> ${result.oneLiner}

## Architecture
${result.architecture}

## Tech Stack
${result.stack.map(s => `- ${s}`).join("\n")}

## DB Schema
${result.dbSchema.map(t => `- **${t.table}**: ${t.fields}`).join("\n")}

## MVP API Routes
${result.apiRoutes.map(r => `- \`${r.method}\` ${r.route}: ${r.desc}`).join("\n")}

## MVP Scope
${result.mvpScope.map(s => `- [ ] ${s}`).join("\n")}

**ETA:** ${result.estimatedTime}
`;

        navigator.clipboard.writeText(md);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }

    return (
        <main className="min-h-screen bg-bg pb-20">
            <DemoHeader title="AI Dev Brief Generator" />

            <div className="max-w-5xl mx-auto px-6 py-20">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-rust/10 text-rust mb-6">
                        <Briefcase size={32} />
                    </div>
                    <h1 className="text-5xl font-syne font-bold text-paper mb-4">Dev Brief Generator</h1>
                    <p className="font-mono text-sm text-muted max-w-xl mx-auto uppercase tracking-widest leading-relaxed">
                        Turn a raw feature idea into a structured technical spec instantly. Architecture, DB schema, API routes, and MVP scope.
                    </p>
                </div>

                <form onSubmit={handleGenerate} className="flex flex-col sm:flex-row gap-4 mb-16 max-w-3xl mx-auto">
                    <input
                        type="text"
                        required
                        value={idea}
                        onChange={(e) => setIdea(e.target.value)}
                        placeholder="E.g., A habit tracker but for your digital carbon footprint..."
                        className="flex-1 bg-surface border border-border p-4 rounded-sm font-syne text-paper focus:outline-none focus:border-rust transition-colors"
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-rust text-paper px-8 py-4 rounded-sm font-syne font-bold hover:bg-amber transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shrink-0"
                    >
                        {loading ? <span className="animate-spin text-xl">◌</span> : <><FileCode2 size={20} /> Generate Spec</>}
                    </button>
                </form>

                <AnimatePresence>
                    {loading && !result && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="text-center py-20"
                        >
                            <div className="text-amber animate-pulse mb-6 inline-block">
                                <TerminalSquare size={48} />
                            </div>
                            <p className="font-mono text-[10px] uppercase tracking-widest text-[#4A7A4A]">Drafting System Architecture...</p>
                        </motion.div>
                    )}

                    {result && !loading && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-[#111] border border-border rounded-sm overflow-hidden font-mono shadow-2xl"
                        >
                            {/* Terminal Header */}
                            <div className="bg-[#1a1a1a] border-b border-[#333] px-4 py-3 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-rust/80" />
                                    <div className="w-3 h-3 rounded-full bg-amber/80" />
                                    <div className="w-3 h-3 rounded-full bg-[#4A7A4A]" />
                                </div>
                                <div className="text-[10px] uppercase tracking-widest text-muted">brief.md</div>
                                <button onClick={copyMarkdown} className="text-muted hover:text-amber transition-colors flex items-center gap-2 text-[10px] uppercase tracking-widest">
                                    {copied ? "Copied!" : <><Copy size={12} /> Copy MD</>}
                                </button>
                            </div>

                            {/* Document Body */}
                            <div className="p-8 md:p-12 text-paper text-sm max-w-4xl mx-auto w-full">

                                <h2 className="text-4xl font-syne font-bold text-amber mb-2"># {result.projectName}</h2>
                                <p className="text-[#888] italic mb-12 border-l-2 border-[#333] pl-4">
                                    &gt; {result.oneLiner}
                                </p>

                                <div className="grid md:grid-cols-[1fr_250px] gap-12">
                                    <div className="space-y-12">

                                        <section>
                                            <h3 className="text-rust uppercase tracking-widest text-xs mb-4">## System Architecture</h3>
                                            <p className="leading-relaxed text-[#bbb] whitespace-pre-wrap">{result.architecture}</p>
                                        </section>

                                        <section>
                                            <h3 className="text-rust uppercase tracking-widest text-xs mb-4 flex items-center gap-2"><Database size={14} /> ## Database Schema</h3>
                                            <div className="space-y-4">
                                                {result.dbSchema.map((item, i) => (
                                                    <div key={i} className="bg-[#1a1a1a] border border-[#333] p-4 rounded-sm">
                                                        <span className="text-amber font-bold">{item.table}</span>
                                                        <div className="text-[#888] mt-2 block pl-4 border-l border-[#333]">{item.fields}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        </section>

                                        <section>
                                            <h3 className="text-rust uppercase tracking-widest text-xs mb-4 flex items-center gap-2"><Share2 size={14} /> ## API Routes</h3>
                                            <div className="overflow-x-auto">
                                                <table className="w-full text-left border-collapse">
                                                    <thead>
                                                        <tr className="border-b border-[#333] text-[#666]">
                                                            <th className="pb-2 font-normal">Method</th>
                                                            <th className="pb-2 font-normal">Endpoint</th>
                                                            <th className="pb-2 font-normal pr-4">Description</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="text-[#bbb]">
                                                        {result.apiRoutes.map((route, i) => (
                                                            <tr key={i} className="border-b border-[#222]">
                                                                <td className="py-3 pr-4">
                                                                    <span className={`px-2 py-1 text-[10px] rounded-sm ${route.method === 'GET' ? 'bg-[#4A7A4A]/20 text-[#4A7A4A]' : 'bg-amber/20 text-amber'
                                                                        }`}>
                                                                        {route.method}
                                                                    </span>
                                                                </td>
                                                                <td className="py-3 pr-4 text-paper">{route.route}</td>
                                                                <td className="py-3 pr-4 text-xs">{route.desc}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </section>

                                    </div>

                                    {/* Sidebar content in terminal */}
                                    <div className="space-y-8">
                                        <section>
                                            <h3 className="text-[#666] uppercase tracking-widest text-xs mb-4">## Tech Stack</h3>
                                            <div className="flex flex-wrap gap-2">
                                                {result.stack.map((tech, i) => (
                                                    <span key={i} className="bg-[#1a1a1a] border border-[#333] px-2 py-1 rounded-sm text-xs text-[#bbb]">
                                                        {tech}
                                                    </span>
                                                ))}
                                            </div>
                                        </section>

                                        <section>
                                            <h3 className="text-[#666] uppercase tracking-widest text-xs mb-4">## MVP Scope</h3>
                                            <ul className="space-y-2 text-[#bbb] text-xs">
                                                {result.mvpScope.map((scope, i) => (
                                                    <li key={i} className="flex gap-2">
                                                        <span className="text-[#4A7A4A]">[ ]</span> {scope}
                                                    </li>
                                                ))}
                                            </ul>
                                        </section>

                                        <div className="bg-[#1a1a1a] border border-[#333] p-4 text-center mt-8 rounded-sm">
                                            <div className="text-[10px] uppercase tracking-widest text-[#666] mb-1">Estimated Dev Time</div>
                                            <div className="text-amber font-bold">{result.estimatedTime}</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-4 items-center justify-end mt-12 pt-8 border-t border-[#333]">
                                    <a
                                        href="https://wa.me/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full sm:w-auto font-syne font-bold border border-[#333] text-paper px-6 py-3 rounded-sm flex items-center justify-center gap-2 hover:bg-[#1a1a1a] transition-colors shadow-sm"
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
