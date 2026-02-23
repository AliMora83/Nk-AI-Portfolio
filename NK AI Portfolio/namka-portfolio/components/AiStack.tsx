"use client";

import { RevealWrapper } from "./ui/RevealWrapper";
import { SectionLabel } from "./ui/SectionLabel";

const tools = [
    { name: "Gemini API", desc: "For complex reasoning matching patterns, logic, and generation.", highlight: "Core AI Engine" },
    { name: "Gemini / Kimi", desc: "Long context processing and deep research digestion.", highlight: "Assistants" },
    { name: "OpenClaw", desc: "Automated agentic workflow processing.", highlight: "Automation" },
    { name: "React / Next.js", desc: "Component architecture and full-stack rendering.", highlight: "Frontend" },
    { name: "Tailwind CSS", desc: "Rapid atomic styling with custom design tokens.", highlight: "Styling" },
    { name: "namka.cloud", desc: "Self-managed Ubuntu VPS hosting running Nginx & Docker.", highlight: "Infra" }
];

export function AiStack() {
    return (
        <section className="py-32 px-6 max-w-7xl mx-auto border-t border-border">
            <div className="grid lg:grid-cols-[1fr_2fr] gap-16">

                {/* Left Col - Intro */}
                <div>
                    <SectionLabel text="The Technical Stack" />
                    <RevealWrapper delay={0.1}>
                        <h2 className="text-4xl md:text-5xl font-syne font-bold mb-6 text-paper leading-tight">
                            A studio backed by machines.
                        </h2>
                    </RevealWrapper>
                    <RevealWrapper delay={0.2}>
                        <p className="text-muted text-lg font-syne text-balance">
                            Building with React and Next.js is faster when LLMs write the boilerplate. I orchestrate AI agents to handle the repetitive tasks, leaving me to focus on architecture, UX, and pixel-perfect execution.
                        </p>
                    </RevealWrapper>
                </div>

                {/* Right Col - Tools Grid */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {tools.map((tool, i) => (
                        <RevealWrapper key={tool.name} delay={0.1 * (i % 3)}>
                            <div className="p-6 rounded-sm bg-surface border border-border h-full flex flex-col hover:border-rust transition-colors group">
                                <span className="font-mono text-[10px] uppercase tracking-widest text-rust mb-4">
                                    {tool.highlight}
                                </span>
                                <h3 className="font-syne text-lg font-bold text-paper mb-2 group-hover:text-amber transition-colors">
                                    {tool.name}
                                </h3>
                                <p className="text-sm text-muted">
                                    {tool.desc}
                                </p>
                            </div>
                        </RevealWrapper>
                    ))}
                </div>

            </div>
        </section>
    );
}
