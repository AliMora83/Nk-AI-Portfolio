"use client";

import { RevealWrapper } from "./ui/RevealWrapper";
import { ArrowUpRight } from "lucide-react";
import { SectionLabel } from "./ui/SectionLabel";

const auditData = [
    {
        num: "01",
        name: "NAMKA NFT Marketplace",
        type: "Web3 · React · ThirdWeb",
        verdict: "upgrade" as const,
        action: "Keep the Web3 positioning. Add AI-generated product descriptions, AI image tagging, and a Gemini-powered search. Transform it from a demo into a live AI-enhanced marketplace.",
        link: "https://namka-marketplace.netlify.app/",
    },
    {
        num: "02",
        name: "DevelopMe Mentorship",
        type: "Platform · UI Design · Behance",
        verdict: "replace" as const,
        action: "Lives on Behance only — no live demo, no interactivity. Replaced with an AI Mentor Matching demo: describe your goals, Gemini suggests the right mentor profile.",
        link: "https://www.behance.net/gallery/173247639/Develop-Me",
    },
    {
        num: "03",
        name: "DevConnect Platform",
        type: "SaaS · React · Matching",
        verdict: "upgrade" as const,
        action: "Good concept, but rendered blank in production. Fixed, then upgraded with AI Dev Brief Generator: clients describe their project, Gemini writes a structured brief.",
        link: "https://devconnect-v2.netlify.app/",
    },
    {
        num: "04",
        name: "Weather App",
        type: "API · Vanilla JavaScript",
        verdict: "replace" as const,
        action: "Basic JS from 2022, not competitive. Replaced with AI Weather Advisor: same data, but Gemini interprets conditions and tells you what to wear, bring, and plan.",
        link: "https://namka-weather-app.netlify.app/",
    },
    {
        num: "05",
        name: "Food Recipes API",
        type: "API · React · MealDB",
        verdict: "replace" as const,
        action: "Tutorial-level project. Replaced with AI Chef: describe what's in your fridge, Gemini generates a full recipe with steps, nutrition, and plating suggestions.",
        link: "https://foodrecipes-api.netlify.app/",
    },
];

export function AuditSection() {
    return (
        <section id="projects" className="w-full bg-paper py-32 border-b border-border">
            <div className="max-w-7xl mx-auto px-6 md:px-12">
                <RevealWrapper>
                    <SectionLabel text="Project Audit" />
                    <h2 className="text-4xl md:text-5xl font-syne font-bold text-bg mb-6 tracking-tight">
                        What stays, what gets upgraded.
                    </h2>
                    <p className="font-mono text-muted max-w-2xl mb-16 text-sm leading-relaxed">
                        Every project reviewed against one question: does this demonstrate AI-powered studio capabilities to a USD-paying international client?
                    </p>
                </RevealWrapper>

                <div className="flex flex-col gap-6">
                    {auditData.map((item, i) => (
                        <RevealWrapper key={item.num} delay={i * 0.1}>
                            <div
                                className="group relative flex flex-col md:flex-row items-start md:items-stretch gap-6 md:gap-8 p-6 md:p-8 rounded-xl border border-border bg-card hover:border-rust hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                            >
                                <div className="hidden md:flex flex-col justify-between w-16 shrink-0">
                                    <span className="font-mono text-muted text-sm">{item.num}</span>
                                    <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-rust opacity-0 group-hover:opacity-100 transition-opacity">
                                        <ArrowUpRight size={24} />
                                    </a>
                                </div>

                                <div className="flex-1 flex flex-col justify-center">
                                    <div className="flex flex-wrap items-center gap-3 mb-2">
                                        <h3 className="font-syne font-bold text-2xl text-paper">{item.name}</h3>
                                        <div
                                            className={`px-3 py-1 rounded-full border border-current font-mono text-[0.6rem] uppercase tracking-widest ${item.verdict === "upgrade" ? "text-amber" : "text-rust"
                                                }`}
                                        >
                                            {item.verdict}
                                        </div>
                                    </div>
                                    <p className="font-mono text-xs text-muted mb-4 tracking-widest uppercase">{item.type}</p>
                                    <p className="font-syne text-sm text-paper/80 leading-relaxed border-l-2 border-border pl-4 group-hover:border-rust transition-colors">
                                        {item.action}
                                    </p>
                                </div>

                                <div className="md:hidden flex items-center justify-end w-full mt-4 border-t border-border/50 pt-4">
                                    <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-rust flex items-center gap-2 text-sm font-mono uppercase tracking-widest">
                                        View Original <ArrowUpRight size={16} />
                                    </a>
                                </div>
                            </div>
                        </RevealWrapper>
                    ))}
                </div>

                <RevealWrapper delay={0.6}>
                    <div className="mt-16 pt-8 border-t border-border grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
                        <div className="flex flex-col gap-1 text-amber">
                            <span className="font-syne text-4xl font-bold">2</span>
                            <span className="font-mono text-[0.6rem] uppercase tracking-widest">Keep & Upgrade</span>
                        </div>
                        <div className="flex flex-col gap-1 text-rust">
                            <span className="font-syne text-4xl font-bold">3</span>
                            <span className="font-mono text-[0.6rem] uppercase tracking-widest">Replace with AI Demos</span>
                        </div>
                        <div className="flex flex-col gap-1 text-paper">
                            <span className="font-syne text-4xl font-bold">5</span>
                            <span className="font-mono text-[0.6rem] uppercase tracking-widest">Total Demos</span>
                        </div>
                    </div>
                </RevealWrapper>
            </div>
        </section>
    );
}
