"use client";

import { useState } from "react";
import { DemoHeader } from "@/components/DemoHeader";
import { motion, AnimatePresence } from "framer-motion";
import { Target, Lightbulb, BookOpen, UserCircle2, ArrowUpRight } from "lucide-react";

type MentorResult = {
    persona: string;
    greeting: string;
    focus: string;
    roadmap: { phase: string; description: string; duration: string }[];
    projects: { name: string; why: string }[];
    advice: string;
};

export default function MentorMatcher() {
    const [skill, setSkill] = useState("");
    const [level, setLevel] = useState("Beginner");
    const [goal, setGoal] = useState("");

    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<MentorResult | null>(null);

    async function handleMatch(e: React.FormEvent) {
        e.preventDefault();
        if (!skill || !goal) return;

        setLoading(true);
        setResult(null);

        try {
            const prompt = `Act as an expert matching AI. Provide a personalized AI mentor persona and learning path for a ${level} trying to learn ${skill}. Their end goal is: ${goal}.

Return ONLY valid JSON:
{
  "persona": "A brief name/title for the mentor (e.g., 'Senior Systems Architect AI', 'Creative Coding Sensei')",
  "greeting": "A welcoming, motivating 1-sentence quote from this mentor",
  "focus": "The core fundamental principle they need to grasp first",
  "roadmap": [
    {"phase": "Phase 1: Basics", "description": "...", "duration": "2 weeks"}
  ],
  "projects": [
    {"name": "...", "why": "..."}
  ],
  "advice": "Final piece of tough love or wisdom"
}`;

            const res = await fetch("/api/gemini", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt, maxTokens: 1000 })
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

    return (
        <main className="min-h-screen bg-bg pb-20">
            <DemoHeader title="AI Mentor Matcher" />

            <div className="max-w-4xl mx-auto px-6 py-20">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-rust/10 text-rust mb-6">
                        <UserCircle2 size={32} />
                    </div>
                    <h1 className="text-5xl font-syne font-bold text-paper mb-4">Mentor Matcher</h1>
                    <p className="font-mono text-sm text-muted max-w-xl mx-auto uppercase tracking-widest leading-relaxed">
                        Tell Gemini your goals, and it&apos;ll simulate the exact mentor persona you need.
                    </p>
                </div>

                <form onSubmit={handleMatch} className="bg-surface border border-border p-8 rounded-sm mb-20 max-w-2xl mx-auto flex flex-col gap-6">
                    <div className="flex flex-col gap-2">
                        <label className="font-mono text-xs uppercase tracking-widest text-muted">What do you want to learn?</label>
                        <input
                            type="text"
                            required
                            value={skill}
                            onChange={(e) => setSkill(e.target.value)}
                            placeholder="e.g., Rust programming, 3D Modeling, Next.js..."
                            className="bg-bg border border-border p-4 rounded-sm font-syne text-paper focus:outline-none focus:border-rust"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="font-mono text-xs uppercase tracking-widest text-muted">Current Level</label>
                        <select
                            value={level}
                            onChange={(e) => setLevel(e.target.value)}
                            className="bg-bg border border-border p-4 rounded-sm font-syne text-paper focus:outline-none focus:border-rust appearance-none"
                        >
                            <option>Total Beginner</option>
                            <option>Some Experience</option>
                            <option>Intermediate</option>
                            <option>Advanced</option>
                        </select>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="font-mono text-xs uppercase tracking-widest text-muted">What&apos;s the end goal?</label>
                        <input
                            type="text"
                            required
                            value={goal}
                            onChange={(e) => setGoal(e.target.value)}
                            placeholder="e.g., Build a specific app, get a job, hobby..."
                            className="bg-bg border border-border p-4 rounded-sm font-syne text-paper focus:outline-none focus:border-rust"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-rust mt-4 text-paper px-8 py-4 rounded-sm font-syne font-bold hover:bg-amber transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {loading ? <span className="animate-spin text-xl">◌</span> : <><Target size={20} /> Find My Mentor</>}
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
                            <div className="text-amber animate-pulse mb-6">
                                <UserCircle2 size={48} className="mx-auto" />
                            </div>
                            <p className="font-mono text-xs uppercase tracking-widest text-muted">Analyzing your profile & assembling curriculum...</p>
                        </motion.div>
                    )}

                    {result && !loading && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <div className="bg-surface border border-border p-8 md:p-12 rounded-sm mb-8 text-center relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-rust via-amber to-sage" />
                                <span className="font-mono text-xs uppercase tracking-widest text-rust border border-rust/30 px-3 py-1 rounded-full mb-6 inline-block">
                                    Your Custom AI Mentor
                                </span>
                                <h2 className="text-3xl md:text-5xl font-instrument italic text-paper mb-6">
                                    {result.persona}
                                </h2>
                                <p className="font-instrument italic text-3xl text-amber mb-8 border-l-4 border-amber pl-6 leading-tight">
                                    &quot;{result.greeting}&quot;
                                </p>
                            </div>

                            <div className="grid md:grid-cols-[2fr_1fr] gap-8">
                                <div className="space-y-8">
                                    <div className="bg-surface border border-border p-8 rounded-sm">
                                        <h3 className="font-mono text-xs uppercase tracking-widest text-sage mb-6 flex items-center gap-2">
                                            <BookOpen size={16} /> Learning Roadmap
                                        </h3>
                                        <div className="space-y-8 relative before:absolute before:inset-0 before:ml-[11px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
                                            {result.roadmap.map((phase, i) => (
                                                <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                                                    <div className="flex items-center justify-center w-6 h-6 rounded-full border border-border bg-bg text-amber shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 relative z-10 font-mono text-[10px]">
                                                        {i + 1}
                                                    </div>
                                                    <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2rem)] p-4 rounded-sm border border-border bg-bg">
                                                        <div className="flex justify-between items-center mb-2 font-mono text-[10px] uppercase tracking-widest text-muted">
                                                            <span>{phase.phase}</span>
                                                            <span>{phase.duration}</span>
                                                        </div>
                                                        <p className="font-syne text-paper text-sm">{phase.description}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-8">
                                    <div className="bg-surface border border-border p-6 rounded-sm">
                                        <h3 className="font-mono text-xs uppercase tracking-widest text-rust mb-6 flex items-center gap-2">
                                            <Target size={16} /> Core Focus First
                                        </h3>
                                        <p className="font-syne text-paper">{result.focus}</p>
                                    </div>

                                    <div className="bg-surface border border-border p-6 rounded-sm">
                                        <h3 className="font-mono text-xs uppercase tracking-widest text-amber mb-6 flex items-center gap-2">
                                            <Lightbulb size={16} /> Project Milestones
                                        </h3>
                                        <ul className="space-y-4">
                                            {result.projects.map((proj, i) => (
                                                <li key={i} className="border-l-2 border-border pl-4">
                                                    <h4 className="font-syne font-bold text-paper mb-1 text-sm">{proj.name}</h4>
                                                    <p className="font-syne text-xs text-muted">{proj.why}</p>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div className="bg-rust/5 border border-rust/20 p-6 rounded-sm">
                                        <h3 className="font-mono text-[10px] uppercase tracking-widest text-rust mb-2">Final Advice</h3>
                                        <p className="font-instrument italic text-lg text-paper">{result.advice}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-4 items-center justify-end mt-12 border-t border-border pt-8">
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

                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </main>
    );
}
