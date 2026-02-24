"use client";

import { useState } from "react";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { RevealWrapper } from "@/components/ui/RevealWrapper";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Loader2, ArrowLeft, FileText, Download, Briefcase, Zap, Layers, Target, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function DevBriefGenerator() {
    const [description, setDescription] = useState("");
    const [budget, setBudget] = useState("$10k - $25k");
    const [timeline, setTimeline] = useState("1-3 Months");
    const [type, setType] = useState("Web App / SaaS");

    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [result, setResult] = useState<any>(null);

    const generateBrief = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!description) return;

        setStatus("loading");

        const prompt = `A client described this project: "${description}". Budget: ${budget}. Timeline: ${timeline}. Type: ${type}.

Generate a professional, structured development brief ready to be handed to a studio. Return ONLY valid JSON and absolutely no markdown wrapper or extra text. Schema:
{
  "projectName": "suggested project name",
  "tagline": "one-line description",
  "problemStatement": "the core problem being solved",
  "targetUsers": ["user type 1", "user type 2"],
  "coreFeatures": [{"feature":"...","priority":"Must Have|Should Have|Nice to Have","effort":"S|M|L"}],
  "suggestedStack": {"frontend":"...","backend":"...","database":"...","hosting":"...","extras":["..."]},
  "milestones": [{"phase":"Phase 1","name":"...","duration":"X weeks","deliverables":["..."]}],
  "budgetBreakdown": [{"item":"...","estimate":"$X-$Y"}],
  "risks": [{"risk":"...","mitigation":"..."}],
  "nextStep": "the single most important first action"
}`;

        try {
            const res = await fetch("/api/gemini", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt, maxTokens: 2000 })
            });

            const data = await res.json();
            if (data.error) throw new Error(data.error);

            const jsonMatch = data.text.match(/\{[\s\S]*\}/);
            if (!jsonMatch) throw new Error("Invalid format returned");

            setResult(JSON.parse(jsonMatch[0]));
            setStatus("success");
        } catch (error) {
            console.error(error);
            setStatus("error");
        }
    };

    const printDocument = () => {
        window.print();
    };

    return (
        <main className="min-h-screen bg-bg flex flex-col print:bg-white print:text-black">
            <div className="print:hidden"><Nav /></div>
            <div className="flex-1 w-full max-w-7xl mx-auto px-6 md:px-12 pt-12 md:pt-32 pb-24 print:p-0 print:max-w-none">

                <div className="print:hidden">
                    <Link href="/" className="inline-flex items-center gap-2 text-muted hover:text-rust font-mono text-xs uppercase tracking-widest mb-12 transition-colors">
                        <ArrowLeft size={14} /> Back to Portfolio
                    </Link>

                    <RevealWrapper>
                        <SectionLabel text="AI Prototype" />
                        <h1 className="text-5xl md:text-7xl font-syne font-bold text-paper mb-6 flex items-center gap-4">
                            Dev Brief Generator <FileText className="text-amber w-10 h-10 md:w-16 md:h-16" />
                        </h1>
                        <p className="font-mono text-muted max-w-2xl mb-12 leading-relaxed">
                            Clients describe their project in plain English. Gemini transforms it into a professional dev brief with scope, stack, milestones, and budget ranges.
                        </p>
                    </RevealWrapper>
                </div>

                {status === "idle" || status === "error" ? (
                    <RevealWrapper delay={0.1}>
                        <form onSubmit={generateBrief} className="max-w-4xl border border-border rounded-xl bg-surface p-8 md:p-12 mb-16 relative z-20 shadow-xl print:hidden">
                            <div className="flex flex-col gap-8">

                                <div className="flex flex-col gap-3">
                                    <label className="font-syne font-bold text-paper">Describe your project idea in plain English...</label>
                                    <textarea
                                        required
                                        rows={4}
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        placeholder="I want to build a platform where freelance musicians can upload stems and producers can buy licenses. Needs to handle audio streaming and stripe payouts..."
                                        className="w-full bg-bg border border-border rounded-lg px-4 py-3 text-paper font-syne focus:border-rust focus:outline-none transition-colors resize-none"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="flex flex-col gap-2">
                                        <label className="font-mono text-[0.65rem] text-muted uppercase tracking-widest">Project Type</label>
                                        <select value={type} onChange={(e) => setType(e.target.value)} className="w-full bg-bg border border-border rounded-lg px-4 py-3 text-paper font-syne focus:border-rust focus:outline-none appearance-none cursor-pointer">
                                            <option>Web App / SaaS</option>
                                            <option>Marketing Website</option>
                                            <option>E-Commerce</option>
                                            <option>Web3 / Crypto</option>
                                            <option>Mobile App</option>
                                            <option>Other</option>
                                        </select>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="font-mono text-[0.65rem] text-muted uppercase tracking-widest">Budget Range</label>
                                        <select value={budget} onChange={(e) => setBudget(e.target.value)} className="w-full bg-bg border border-border rounded-lg px-4 py-3 text-paper font-syne focus:border-rust focus:outline-none appearance-none cursor-pointer">
                                            <option>&lt; $5k</option>
                                            <option>$5k - $10k</option>
                                            <option>$10k - $25k</option>
                                            <option>$25k - $50k</option>
                                            <option>$50k+</option>
                                        </select>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="font-mono text-[0.65rem] text-muted uppercase tracking-widest">Timeline</label>
                                        <select value={timeline} onChange={(e) => setTimeline(e.target.value)} className="w-full bg-bg border border-border rounded-lg px-4 py-3 text-paper font-syne focus:border-rust focus:outline-none appearance-none cursor-pointer">
                                            <option>&lt; 1 Month</option>
                                            <option>1-3 Months</option>
                                            <option>3-6 Months</option>
                                            <option>6+ Months</option>
                                        </select>
                                    </div>
                                </div>

                                {status === "error" && (
                                    <div className="text-rust font-mono text-xs p-4 bg-rust/10 rounded">Failed to generate brief. Please try again or check your input.</div>
                                )}

                                <button
                                    type="submit"
                                    className="mt-4 self-end bg-rust border border-rust text-white font-syne font-bold px-8 py-4 rounded-lg hover:bg-rust/90 hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
                                >
                                    Generate Brief
                                </button>
                            </div>
                        </form>
                    </RevealWrapper>
                ) : null}

                <AnimatePresence mode="wait">
                    {status === "loading" && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="w-full max-w-4xl p-16 rounded-xl border border-border bg-surface flex flex-col items-center justify-center gap-6 print:hidden"
                        >
                            <FileText size={48} className="text-rust animate-pulse" />
                            <div className="flex flex-col items-center gap-2">
                                <p className="font-mono text-xs text-paper uppercase tracking-widest animate-pulse">
                                    Translating requirements to technical architecture...
                                </p>
                                <p className="font-mono text-[0.6rem] text-muted">Drafting scope, milestones, and stack recommendations</p>
                            </div>
                        </motion.div>
                    )}

                    {status === "success" && result && (
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="w-full relative z-10 print:m-0 print:block"
                        >
                            {/* Print Controls */}
                            <div className="print:hidden flex justify-between items-center mb-8 bg-surface p-4 rounded-xl border border-border">
                                <button onClick={() => setStatus("idle")} className="font-mono text-xs text-rust uppercase hover:underline ml-4">Start Over</button>
                                <div className="flex gap-4">
                                    <a href="https://openmindi.co.za" target="_blank" rel="noopener noreferrer" className="bg-transparent border border-rust text-rust font-syne font-bold px-6 py-2 rounded-lg hover:-translate-y-1 transition-all">
                                        Hire OpenMindi
                                    </a>
                                    <button onClick={printDocument} className="bg-rust text-white font-syne font-bold px-6 py-2 rounded-lg hover:-translate-y-1 hover:shadow-[0_10px_30px_-10px_rgba(184,74,47,0.5)] transition-all flex items-center gap-2">
                                        <Download size={16} /> Export PDF
                                    </button>
                                </div>
                            </div>

                            {/* THE BRIEF DOCUMENT */}
                            <div className="w-full max-w-[800px] mx-auto bg-card print:bg-white text-paper print:text-black border border-border print:border-none rounded-xl p-8 md:p-16 print:p-0 shadow-2xl print:shadow-none mb-16">
                                {/* Document Header */}
                                <div className="border-b-2 border-paper print:border-black pb-8 mb-12 flex justify-between items-end">
                                    <div>
                                        <p className="font-mono text-xs uppercase tracking-widest text-muted print:text-gray-500 mb-2">Technical Development Brief</p>
                                        <h2 className="text-4xl font-syne font-extrabold tracking-tight mb-2">{result.projectName}</h2>
                                        <p className="font-instrument italic text-xl text-paper/80 print:text-gray-700">{result.tagline}</p>
                                    </div>
                                    <div className="text-right font-mono text-[0.6rem] uppercase tracking-widest text-muted print:text-gray-500">
                                        <p>Date: {new Date().toLocaleDateString()}</p>
                                        <p>Generated by: OpenMindi AI</p>
                                    </div>
                                </div>

                                {/* Exec Summary */}
                                <div className="mb-12">
                                    <h3 className="flex items-center gap-2 font-syne font-bold text-xl uppercase tracking-wider mb-4">
                                        <Target className="text-rust print:text-black" size={20} /> Problem Statement
                                    </h3>
                                    <p className="font-syne text-paper/90 print:text-gray-800 leading-relaxed border-l-4 border-rust print:border-black pl-4 py-1">
                                        {result.problemStatement}
                                    </p>
                                </div>

                                {/* Target Users */}
                                <div className="mb-12">
                                    <h3 className="font-syne font-bold text-xl uppercase tracking-wider mb-4 border-b border-border print:border-gray-200 pb-2">Target Users</h3>
                                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {result.targetUsers.map((u: string, i: number) => (
                                            <li key={i} className="flex gap-3 text-sm font-syne font-semibold p-3 bg-surface print:bg-gray-50 rounded border border-border print:border-gray-200">
                                                <span className="text-rust print:text-black mt-0.5">●</span> {u}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Features */}
                                <div className="mb-16">
                                    <h3 className="flex items-center gap-2 font-syne font-bold text-xl uppercase tracking-wider mb-6 pb-2 border-b border-border print:border-gray-200">
                                        <Briefcase className="text-amber print:text-black" size={20} /> Scope & Features
                                    </h3>
                                    <div className="space-y-4">
                                        {result.coreFeatures.map((f: any, i: number) => (
                                            <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border border-border print:border-gray-300 rounded-lg">
                                                <div className="font-syne font-medium flex-1">{f.feature}</div>
                                                <div className="flex gap-3 font-mono text-[0.65rem] uppercase tracking-widest">
                                                    <span className={`px-2 py-1 rounded ${f.priority === 'Must Have' ? 'bg-rust/20 text-rust print:bg-black/10 print:text-black font-bold' : 'bg-surface text-muted print:bg-gray-100 print:text-gray-600'}`}>
                                                        {f.priority}
                                                    </span>
                                                    <span className="px-2 py-1 rounded bg-bg text-muted border border-border print:border-gray-300">
                                                        Effort: {f.effort}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Tech Architecture */}
                                <div className="mb-16 bg-surface print:bg-gray-50 border border-border print:border-gray-300 rounded-xl p-8">
                                    <h3 className="flex items-center gap-2 font-syne font-bold text-xl uppercase tracking-wider mb-6">
                                        <Layers className="text-sage print:text-black" size={20} /> Recommended Stack
                                    </h3>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 font-mono text-sm mb-6">
                                        <div><span className="block text-[0.65rem] text-muted uppercase tracking-widest mb-1">Frontend</span><span className="font-bold text-sage print:text-black">{result.suggestedStack.frontend}</span></div>
                                        <div><span className="block text-[0.65rem] text-muted uppercase tracking-widest mb-1">Backend</span><span className="font-bold text-sage print:text-black">{result.suggestedStack.backend}</span></div>
                                        <div><span className="block text-[0.65rem] text-muted uppercase tracking-widest mb-1">Database</span><span className="font-bold text-sage print:text-black">{result.suggestedStack.database}</span></div>
                                        <div><span className="block text-[0.65rem] text-muted uppercase tracking-widest mb-1">Hosting/Infra</span><span className="font-bold text-sage print:text-black">{result.suggestedStack.hosting}</span></div>
                                    </div>
                                    {result.suggestedStack.extras.length > 0 && (
                                        <div className="pt-4 border-t border-border print:border-gray-200">
                                            <span className="block text-[0.65rem] text-muted font-mono uppercase tracking-widest mb-2">Integrations / Extras</span>
                                            <div className="flex gap-3 flex-wrap font-mono text-xs">
                                                {result.suggestedStack.extras.map((ex: string, i: number) => (
                                                    <span key={i} className="px-3 py-1 bg-bg border border-border rounded-full">{ex}</span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
                                    {/* Milestones */}
                                    <div>
                                        <h3 className="font-syne font-bold text-xl uppercase tracking-wider mb-6 border-b border-border print:border-gray-200 pb-2">Timeline</h3>
                                        <div className="space-y-6">
                                            {result.milestones.map((m: any, i: number) => (
                                                <div key={i} className="relative pl-6 border-l-2 border-border print:border-gray-300">
                                                    <div className="absolute -left-[7px] top-0 w-3 h-3 bg-card print:bg-white border-2 border-rust print:border-black rounded-full" />
                                                    <div className="font-mono text-[0.6rem] text-muted uppercase tracking-widest mb-1">
                                                        {m.phase} · {m.duration}
                                                    </div>
                                                    <h4 className="font-syne font-bold mb-2">{m.name}</h4>
                                                    <ul className="font-syne text-xs text-paper/80 print:text-gray-600 list-disc pl-4 space-y-1">
                                                        {m.deliverables.map((d: string, j: number) => (
                                                            <li key={j}>{d}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Budget & Risks */}
                                    <div className="space-y-8 flex flex-col justify-between">
                                        <div>
                                            <h3 className="font-syne font-bold text-xl uppercase tracking-wider mb-6 border-b border-border print:border-gray-200 pb-2">Budget Estimate</h3>
                                            <div className="space-y-3 font-mono text-sm">
                                                {result.budgetBreakdown.map((b: any, i: number) => (
                                                    <div key={i} className="flex justify-between items-center bg-surface print:bg-gray-50 p-3 rounded">
                                                        <span>{b.item}</span>
                                                        <span className="font-bold">{b.estimate}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div>
                                            <h3 className="flex items-center gap-2 font-syne font-bold text-xl uppercase tracking-wider mb-6 border-b border-border print:border-gray-200 pb-2">
                                                <ShieldAlert size={18} className="text-amber print:text-black" /> Risks & Mitigations
                                            </h3>
                                            <div className="space-y-4">
                                                {result.risks.map((r: any, i: number) => (
                                                    <div key={i} className="text-sm">
                                                        <h4 className="font-syne font-bold mb-1 text-rust print:text-black">{r.risk}</h4>
                                                        <p className="font-syne text-muted italic">Mitigation: {r.mitigation}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Next Step */}
                                <div className="bg-rust print:border-2 print:border-black print:bg-white text-white print:text-black p-8 rounded-xl text-center">
                                    <h3 className="font-mono text-xs text-white/70 print:text-gray-500 uppercase tracking-widest mb-2 font-bold">Recommended Next Step</h3>
                                    <p className="font-syne text-xl md:text-2xl font-bold">{result.nextStep}</p>
                                </div>
                            </div>

                        </motion.div>
                    )}
                </AnimatePresence>

            </div>
            <div className="print:hidden"><Footer /></div>
        </main>
    );
}
