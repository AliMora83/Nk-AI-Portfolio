"use client";

import { RevealWrapper } from "./ui/RevealWrapper";
import { SectionLabel } from "./ui/SectionLabel";

const tools = [
    { name: "Gemini", desc: "AI reasoning & demos" },
    { name: "Kimi", desc: "Long Document Digestion" },
    { name: "OpenClaw", desc: "Workflow Automation" },
    { name: "React", desc: "Every Frontend Built" },
    { name: "namka.cloud", desc: "Raw VPS Hosting" },
];

export function AiStack() {
    return (
        <section className="w-full bg-bg py-32 border-b border-border text-paper">
            <div className="max-w-7xl mx-auto px-6 md:px-12">
                <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-center">
                    <div className="w-full lg:w-5/12">
                        <RevealWrapper>
                            <SectionLabel text="Tool Stack" />
                            <h2 className="text-4xl md:text-5xl font-syne font-bold mb-6 tracking-tight">
                                An unfair advantage.
                            </h2>
                            <p className="font-mono text-muted text-sm leading-relaxed mb-8 max-w-md">
                                I don&apos;t just use AI to write code. I use it to audit design, test UX assumptions, generate dynamic copy, and automate deployments. It&apos;s a full studio team in one terminal.
                            </p>
                        </RevealWrapper>
                    </div>

                    <div className="w-full lg:w-7/12">
                        <RevealWrapper delay={0.2}>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {tools.map((tool, i) => (
                                    <div
                                        key={tool.name}
                                        className="p-6 rounded-xl border border-border bg-surface hover:border-rust hover:bg-card transition-all duration-300 group"
                                    >
                                        <h3 className="font-syne font-bold text-xl mb-2 group-hover:text-rust transition-colors">
                                            {tool.name}
                                        </h3>
                                        <p className="font-mono text-[0.65rem] text-muted uppercase tracking-widest">
                                            {tool.desc}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </RevealWrapper>
                    </div>
                </div>
            </div>
        </section>
    );
}
