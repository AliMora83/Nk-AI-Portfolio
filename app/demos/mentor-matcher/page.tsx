"use client";

import { useState } from "react";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { RevealWrapper } from "@/components/ui/RevealWrapper";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { ScoreRing } from "@/components/ui/ScoreRing";
import { Loader2, ArrowLeft, GraduationCap, CalendarDays, BookOpen, AlertCircle } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function MentorMatcher() {
    const [goal, setGoal] = useState("");
    const [level, setLevel] = useState("Beginner");
    const [hours, setHours] = useState("2-5");
    const [timeline, setTimeline] = useState("1 month");

    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [result, setResult] = useState<any>(null);

    const getMatch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!goal) return;

        setStatus("loading");

        const prompt = `A learner wants mentorship. Details: Goal: ${goal}, Level: ${level}, Hours/week: ${hours}, Timeline: ${timeline}.

Create a personalised mentor profile and learning plan. Return ONLY valid JSON schema:
{
  "mentorName": "a realistic mentor name",
  "mentorTitle": "their title/specialisation",
  "mentorBio": "2-sentence bio that feels real",
  "matchScore": 92,
  "matchReasons": ["reason 1", "reason 2", "reason 3"],
  "weeklySchedule": [{"day":"Monday","session":"...","duration":"1 hr"}],
  "milestones": [{"week":"Week 1-2","goal":"...","deliverable":"..."}],
  "resources": [{"type":"Book|Course|Video|Practice","title":"...","why":"..."}],
  "firstTask": "the very first thing they should do today",
  "warningSign": "the most common mistake people at this level make"
}`;

        try {
            const res = await fetch("/api/gemini", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt, maxTokens: 1500 })
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

    return (
        <main className="min-h-screen bg-bg flex flex-col">
            <Nav />
            <div className="flex-1 w-full max-w-7xl mx-auto px-6 md:px-12 pt-32 pb-24">

                <Link href="/" className="inline-flex items-center gap-2 text-muted hover:text-rust font-mono text-xs uppercase tracking-widest mb-12 transition-colors">
                    <ArrowLeft size={14} /> Back to Portfolio
                </Link>

                <RevealWrapper>
                    <SectionLabel text="AI Prototype" />
                    <h1 className="text-5xl md:text-7xl font-syne font-bold text-paper mb-6 flex items-center gap-4">
                        Mentor Matcher <GraduationCap className="text-amber w-10 h-10 md:w-16 md:h-16" />
                    </h1>
                    <p className="font-mono text-muted max-w-2xl mb-12 leading-relaxed">
                        Describe your learning goals and experience level. Gemini returns a personalised mentor profile, learning path, and weekly schedule.
                    </p>
                </RevealWrapper>

                {status === "idle" || status === "error" ? (
                    <RevealWrapper delay={0.1}>
                        <form onSubmit={getMatch} className="max-w-3xl border border-border rounded-xl bg-surface p-8 md:p-12 mb-16 relative z-20 shadow-xl">
                            <div className="flex flex-col gap-8">

                                <div className="flex flex-col gap-3">
                                    <label className="font-syne font-bold text-paper">What exactly do you want to learn?</label>
                                    <textarea
                                        required
                                        rows={3}
                                        value={goal}
                                        onChange={(e) => setGoal(e.target.value)}
                                        placeholder="e.g. I want to transition from vanilla React to Next.js App Router and understand server components."
                                        className="w-full bg-bg border border-border rounded-lg px-4 py-3 text-paper font-syne focus:border-amber focus:outline-none transition-colors resize-none"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="flex flex-col gap-2">
                                        <label className="font-mono text-[0.65rem] text-muted uppercase tracking-widest">Current Level</label>
                                        <select value={level} onChange={(e) => setLevel(e.target.value)} className="w-full bg-bg border border-border rounded-lg px-4 py-3 text-paper font-syne focus:border-amber focus:outline-none appearance-none cursor-pointer">
                                            <option>Beginner</option>
                                            <option>Intermediate</option>
                                            <option>Advanced</option>
                                        </select>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="font-mono text-[0.65rem] text-muted uppercase tracking-widest">Commitment</label>
                                        <select value={hours} onChange={(e) => setHours(e.target.value)} className="w-full bg-bg border border-border rounded-lg px-4 py-3 text-paper font-syne focus:border-amber focus:outline-none appearance-none cursor-pointer">
                                            <option>2-5 hrs/week</option>
                                            <option>5-10 hrs/week</option>
                                            <option>10-20 hrs/week</option>
                                        </select>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="font-mono text-[0.65rem] text-muted uppercase tracking-widest">Timeline</label>
                                        <select value={timeline} onChange={(e) => setTimeline(e.target.value)} className="w-full bg-bg border border-border rounded-lg px-4 py-3 text-paper font-syne focus:border-amber focus:outline-none appearance-none cursor-pointer">
                                            <option>1 month</option>
                                            <option>3 months</option>
                                            <option>6 months</option>
                                            <option>1 year</option>
                                        </select>
                                    </div>
                                </div>

                                {status === "error" && (
                                    <div className="text-rust font-mono text-xs p-4 bg-rust/10 rounded">Failed to generate match. Please try again.</div>
                                )}

                                <button
                                    type="submit"
                                    className="mt-4 self-start bg-amber border border-amber text-bg font-syne font-bold px-8 py-4 rounded-lg hover:bg-amber/90 hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
                                >
                                    Find My Mentor
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
                            className="w-full max-w-3xl p-16 rounded-xl border border-border bg-surface flex flex-col items-center justify-center gap-6"
                        >
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 rounded-full border-2 border-border border-t-amber animate-spin" />
                                <div className="w-12 h-12 rounded-full border-2 border-border border-t-sage animate-spin" style={{ animationDirection: 'reverse' }} />
                            </div>
                            <p className="font-mono text-xs text-paper uppercase tracking-widest animate-pulse">
                                Analyzing required skills & computing match vectors...
                            </p>
                        </motion.div>
                    )}

                    {status === "success" && result && (
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="w-full relative z-10 space-y-8"
                        >
                            <div className="flex items-center justify-between mb-8 pb-4 border-b border-border">
                                <h2 className="font-syne font-bold text-2xl text-paper">Your AI Mentor Profile</h2>
                                <button onClick={() => setStatus("idle")} className="font-mono text-xs text-amber uppercase hover:underline">Start Over</button>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                                {/* Left Col: Profile */}
                                <div className="lg:col-span-5 space-y-6">
                                    <div className="p-8 rounded-2xl border border-border bg-card flex flex-col items-center text-center relative overflow-hidden">
                                        <div className="absolute top-0 right-0 p-6">
                                            <ScoreRing score={result.matchScore} label="Match" />
                                        </div>
                                        <div className="w-24 h-24 rounded-full bg-surface border border-border mb-6 flex items-center justify-center text-3xl text-muted font-bold">
                                            {result.mentorName.charAt(0)}
                                        </div>
                                        <h3 className="font-syne font-bold text-2xl text-paper mb-2">{result.mentorName}</h3>
                                        <div className="font-mono text-xs text-amber uppercase tracking-widest mb-6 py-1 px-3 border border-amber/30 rounded-full bg-amber/5">
                                            {result.mentorTitle}
                                        </div>
                                        <p className="font-syne text-sm text-paper/80 leading-relaxed italic mb-8 border-t border-border pt-6">
                                            "{result.mentorBio}"
                                        </p>

                                        <div className="w-full text-left bg-bg p-4 rounded-lg border border-border">
                                            <h4 className="font-mono text-[0.65rem] text-muted uppercase tracking-widest mb-3">Why this match?</h4>
                                            <ul className="space-y-2">
                                                {result.matchReasons.map((r: string, i: number) => (
                                                    <li key={i} className="font-syne text-xs text-paper/70 flex gap-2"><span className="text-amber">✦</span> {r}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>

                                    <div className="p-6 rounded-xl border border-rust/30 bg-rust/5 flex gap-4 mt-8 group hover:border-rust/50 transition-colors">
                                        <AlertCircle className="text-rust shrink-0 mt-1" size={20} />
                                        <div>
                                            <h4 className="font-syne font-bold text-rust mb-2 group-hover:underline">Common Pitfall at {level} Level</h4>
                                            <p className="font-syne text-sm text-paper/90">{result.warningSign}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Col: Plan */}
                                <div className="lg:col-span-7 space-y-8">
                                    {/* Priority Task */}
                                    <div className="p-8 rounded-2xl bg-amber border border-amber">
                                        <h4 className="font-mono text-xs text-bg uppercase tracking-widest font-bold mb-2 opacity-70">Focus: First 24 Hours</h4>
                                        <p className="font-syne text-xl text-bg font-bold">{result.firstTask}</p>
                                    </div>

                                    {/* Milestones */}
                                    <div className="p-8 rounded-2xl border border-border bg-surface">
                                        <h3 className="font-syne font-bold text-xl text-paper mb-6 flex items-center gap-2">
                                            <CalendarDays className="text-muted" size={20} /> Journey Milestones
                                        </h3>
                                        <div className="space-y-6 border-l-2 border-border ml-2 pl-6">
                                            {result.milestones.map((ms: any, i: number) => (
                                                <div key={i} className="relative">
                                                    <div className="absolute -left-[31px] w-3 h-3 bg-surface border border-border rounded-full" />
                                                    <span className="font-mono text-[0.6rem] text-amber uppercase tracking-widest">{ms.week}</span>
                                                    <h4 className="font-syne font-bold text-paper mt-1 mb-2">{ms.goal}</h4>
                                                    <p className="font-mono text-xs text-muted uppercase tracking-widest flex items-center gap-2 before:content-[''] before:w-4 before:h-px before:bg-border">
                                                        {ms.deliverable}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Schedule */}
                                        <div className="p-6 rounded-2xl border border-border bg-card">
                                            <h4 className="font-syne font-bold text-paper mb-4 text-sm uppercase tracking-wider">Weekly Rhythm</h4>
                                            <ul className="space-y-3">
                                                {result.weeklySchedule.map((s: any, i: number) => (
                                                    <li key={i} className="flex flex-col gap-1 pb-3 border-b border-border/50 last:border-0">
                                                        <div className="flex justify-between font-mono text-xs">
                                                            <span className="text-muted uppercase">{s.day}</span>
                                                            <span className="text-paper">{s.duration}</span>
                                                        </div>
                                                        <span className="font-syne text-sm text-paper/90">{s.session}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                        {/* Resources */}
                                        <div className="p-6 rounded-2xl border border-border bg-card">
                                            <h4 className="font-syne font-bold text-paper mb-4 text-sm uppercase tracking-wider flex items-center gap-2">
                                                <BookOpen size={16} /> Stack
                                            </h4>
                                            <ul className="space-y-4">
                                                {result.resources.map((r: any, i: number) => (
                                                    <li key={i} className="group">
                                                        <div className="font-mono text-[0.6rem] text-amber/70 uppercase tracking-widest mb-1">{r.type}</div>
                                                        <h5 className="font-syne font-bold text-sm text-paper mb-1">{r.title}</h5>
                                                        <p className="font-syne text-xs text-muted leading-relaxed line-clamp-2">{r.why}</p>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

            </div>
            <Footer />
        </main>
    );
}
