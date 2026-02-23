"use client";

import { demos } from "@/lib/data";
import { RevealWrapper } from "./ui/RevealWrapper";
import { SectionLabel } from "./ui/SectionLabel";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function DemoGallery() {
    return (
        <section id="demos" className="py-32 px-6 max-w-7xl mx-auto border-t border-border">
            <SectionLabel text="AI Demos" />

            <div className="mb-16">
                <RevealWrapper delay={0.1}>
                    <h2 className="text-4xl md:text-5xl font-syne font-bold mb-6 text-paper leading-tight">
                        Not just code —<br />thinking tools.
                    </h2>
                </RevealWrapper>
                <RevealWrapper delay={0.2}>
                    <p className="text-muted text-lg max-w-md font-syne text-balance">
                        Each demo is a live, working AI-powered app — built in React, powered by Gemini API, hosted on namka.cloud.
                    </p>
                </RevealWrapper>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {demos.map((demo: { slug: string, tag: string, icon: React.ReactNode, name: string, desc: string, pills: string[], featured?: boolean }, i: number) => (
                    <RevealWrapper
                        key={demo.slug}
                        delay={0.1 * (i % 3)}
                        className={demo.featured ? "md:col-span-2 lg:col-span-2" : ""}
                    >
                        <div className={`group h-full flex flex-col p-8 rounded-sm bg-surface border border-border hover:border-rust transition-all duration-500 overflow-hidden relative cursor-pointer ${demo.featured ? "lg:flex-row gap-8" : ""}`}>

                            {/* Corner Accent */}
                            <div className="absolute top-0 right-0 w-8 h-8 overflow-hidden pointer-events-none">
                                <div className="absolute top-[-16px] right-[-16px] w-8 h-8 bg-rust rotate-45 transform origin-center transition-transform group-hover:scale-150" />
                            </div>

                            <div className="flex-1 flex flex-col items-start relative z-10">
                                <span className="font-mono text-xs uppercase tracking-widest text-rust mb-6 bg-rust/10 px-3 py-1 rounded-sm">
                                    {demo.tag}
                                </span>

                                <div className="text-4xl mb-4">{demo.icon}</div>

                                <h3 className="font-syne text-2xl font-bold text-paper mb-4 group-hover:text-amber transition-colors">
                                    {demo.name}
                                </h3>

                                <p className="text-muted text-sm leading-relaxed mb-6 font-syne">
                                    {demo.desc}
                                </p>

                                <div className="mt-auto">
                                    <div className="flex flex-wrap gap-2 mb-8">
                                        {demo.pills.map((pill: string) => (
                                            <span key={pill} className="font-mono text-[10px] tracking-widest text-gold border border-gold/30 px-2 py-1 rounded-full uppercase">
                                                {pill}
                                            </span>
                                        ))}
                                    </div>

                                    <Link
                                        href={`/demos/${demo.slug}`}
                                        className="inline-flex items-center gap-2 font-syne font-bold text-paper group-hover:text-rust transition-colors"
                                    >
                                        Launch Demo
                                        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                </div>
                            </div>

                            {/* Mock output for featured demo */}
                            {demo.featured && (
                                <div className="hidden lg:flex flex-1 border border-border/50 bg-card rounded-sm overflow-hidden flex-col">
                                    <div className="h-8 border-b border-border/50 bg-surface/50 flex items-center px-4 gap-2">
                                        <div className="w-2 h-2 rounded-full bg-rust" />
                                        <div className="w-2 h-2 rounded-full bg-amber" />
                                        <div className="w-2 h-2 rounded-full bg-sage" />
                                    </div>
                                    <div className="p-6 font-mono text-xs text-muted space-y-3 relative h-full">
                                        <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent pointer-events-none z-10" />
                                        <p className="text-green-500/80">✔ ANALYSING VISUAL HIERARCHY...</p>
                                        <p className="text-amber/80">⚠ COPY DENSITY TOO HIGH IN HERO...</p>
                                        <p className="text-green-500/80">✔ MOBILE RESPONSIVENESS PASSED...</p>
                                        <p className="animate-pulse">_ GENERATING SCORE...</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </RevealWrapper>
                ))}
            </div>
        </section>
    );
}
