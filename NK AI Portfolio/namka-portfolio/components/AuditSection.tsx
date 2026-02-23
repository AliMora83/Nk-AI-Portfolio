"use client";

import { auditData } from "@/lib/data";
import { RevealWrapper } from "./ui/RevealWrapper";
import { SectionLabel } from "./ui/SectionLabel";
import { ArrowUpRight } from "lucide-react";

export function AuditSection() {
    const keepers = auditData.filter(d => d.verdict === "upgrade").length;
    const replaced = auditData.filter(d => d.verdict === "replace").length;

    return (
        <section id="projects" className="py-32 px-6 max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-[1fr_2fr] gap-16 items-start">

                {/* Left Col - Sticky Intro */}
                <div className="lg:sticky lg:top-32">
                    <SectionLabel text="Project Audit" />
                    <RevealWrapper delay={0.1}>
                        <h2 className="text-4xl md:text-5xl font-syne font-bold mb-6 text-paper leading-tight">
                            What stays,<br />what gets upgraded.
                        </h2>
                    </RevealWrapper>
                    <RevealWrapper delay={0.2}>
                        <p className="text-muted text-lg max-w-md font-syne text-balance">
                            Every project reviewed against one question: does this demonstrate AI-powered studio capabilities to a USD-paying international client?
                        </p>
                    </RevealWrapper>

                    <RevealWrapper delay={0.3} className="hidden lg:flex gap-6 mt-16 text-sm font-mono tracking-widest text-amber">
                        <div className="flex flex-col gap-1">
                            <span className="text-3xl font-syne font-bold text-rust">{keepers}</span>
                            <span className="uppercase text-xs">Keep & Upgrade</span>
                        </div>
                        <div className="w-[1px] h-12 bg-border" />
                        <div className="flex flex-col gap-1">
                            <span className="text-3xl font-syne font-bold text-rust">{replaced}</span>
                            <span className="uppercase text-xs">Replace w/ AI</span>
                        </div>
                        <div className="w-[1px] h-12 bg-border" />
                        <div className="flex flex-col gap-1">
                            <span className="text-3xl font-syne font-bold text-rust">{auditData.length}</span>
                            <span className="uppercase text-xs">Total Audited</span>
                        </div>
                    </RevealWrapper>
                </div>

                {/* Right Col - Audit Cards */}
                <div className="flex flex-col gap-6">
                    {auditData.map((project: { num: string, name: string, type: string, verdict: string, action: string, link: string }, i: number) => (
                        <RevealWrapper key={project.name} delay={0.1 * i} className="h-full">
                            <div
                                className={`group p-8 rounded-sm border hover:-translate-y-1 transition-all duration-300 relative overflow-hidden bg-card 
                ${project.verdict === "upgrade"
                                        ? "border-border hover:border-amber hover:shadow-[0_4px_30px_rgba(212,144,58,0.1)]"
                                        : "border-border hover:border-rust hover:shadow-[0_4px_30px_rgba(184,74,47,0.1)]"
                                    }`}
                            >
                                <div className="flex items-center justify-between mb-8">
                                    <span className="font-mono text-xs text-muted">A{project.num}</span>
                                    <span
                                        className={`font-mono text-[10px] px-2 py-1 rounded-sm uppercase tracking-widest
                    ${project.verdict === "upgrade"
                                                ? "bg-amber/10 text-amber border border-amber/20"
                                                : "bg-rust/10 text-rust border border-rust/20"
                                            }`}
                                    >
                                        [ {project.verdict} ]
                                    </span>
                                </div>
                                <h3 className="text-2xl font-instrument mb-2 text-paper">{project.name}</h3>
                                <p className="font-syne text-sm text-muted mb-8 text-balance">
                                    Identified as a {project.type} requiring modern standards alignment and agentic workflow integration.
                                </p>
                                <div className="mt-auto space-y-4">
                                    <p className="font-mono text-xs text-paper border-l border-border pl-3">
                                        <span className="text-muted block mb-1">RECOMMENDED ACTION</span>
                                        {project.action}
                                    </p>
                                    <a
                                        href={project.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 font-syne text-xs uppercase tracking-widest text-muted hover:text-paper transition-colors group/link mt-4"
                                    >
                                        View report <ArrowUpRight size={12} className="group-hover/link:translate-x-1 transition-transform" />
                                    </a>
                                </div>
                            </div>
                        </RevealWrapper>
                    ))}
                </div>

                {/* Mobile Summary Row */}
                <RevealWrapper delay={0.3} className="flex lg:hidden gap-4 mt-8 justify-between border-t border-border pt-8 text-sm font-mono tracking-widest text-amber">
                    <div className="flex flex-col gap-1 text-center flex-1">
                        <span className="text-2xl font-syne font-bold text-rust">{keepers}</span>
                        <span className="uppercase text-[10px]">Upgrade</span>
                    </div>
                    <div className="w-[1px] h-10 bg-border" />
                    <div className="flex flex-col gap-1 text-center flex-1">
                        <span className="text-2xl font-syne font-bold text-rust">{replaced}</span>
                        <span className="uppercase text-[10px]">Replace</span>
                    </div>
                    <div className="w-[1px] h-10 bg-border" />
                    <div className="flex flex-col gap-1 text-center flex-1">
                        <span className="text-2xl font-syne font-bold text-rust">{auditData.length}</span>
                        <span className="uppercase text-[10px]">Total</span>
                    </div>
                </RevealWrapper>
            </div>
        </section>
    );
}
