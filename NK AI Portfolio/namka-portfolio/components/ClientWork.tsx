"use client";

import { clients } from "@/lib/data";
import { RevealWrapper } from "./ui/RevealWrapper";
import { SectionLabel } from "./ui/SectionLabel";

export function ClientWork() {
    const heroClient = clients.find(c => c.hero);
    const regularClients = clients.filter(c => !c.hero);

    return (
        <section id="work" className="py-32 px-6 max-w-7xl mx-auto border-t border-border">
            <SectionLabel text="Client Work" />

            <RevealWrapper delay={0.1}>
                <h2 className="text-4xl md:text-5xl font-syne font-bold mb-16 text-paper leading-tight">
                    10 years of real partnerships.
                </h2>
            </RevealWrapper>

            <div className="grid lg:grid-cols-[1fr_1fr] gap-6">

                {/* Hero Card Container */}
                <RevealWrapper delay={0.2} className="h-full">
                    {heroClient && (
                        <div className="group h-full p-8 rounded-sm bg-surface border border-border hover:border-rust transition-colors flex flex-col justify-end min-h-[400px] relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-t from-bg/90 to-transparent z-10" />
                            {/* Optional: Add a subtle background image/pattern for the hero client here */}
                            <div className="relative z-20">
                                <div className="flex items-center gap-4 mb-4">
                                    <span className="font-mono text-xs uppercase tracking-widest text-rust">
                                        {heroClient.year}
                                    </span>
                                    <span className="w-4 h-[1px] bg-border" />
                                    <span className="font-mono text-xs uppercase tracking-widest text-muted">
                                        {heroClient.location}
                                    </span>
                                </div>
                                <h3 className="font-syne text-4xl font-bold text-paper mb-4 group-hover:text-amber transition-colors">
                                    {heroClient.name}
                                </h3>
                                <p className="font-mono text-sm tracking-widest uppercase text-muted mb-6">
                                    {heroClient.type}
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {heroClient.tags.map((tag: string) => (
                                        <span key={tag} className="font-mono text-[10px] tracking-widest text-paper border border-border px-3 py-1 rounded-full uppercase">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </RevealWrapper>

                {/* 2x2 Grid */}
                <div className="grid sm:grid-cols-2 gap-6">
                    {regularClients.map((client: { name: string, location: string, year: string, type: string, tags: string[], hero?: boolean }, i: number) => (
                        <RevealWrapper key={client.name} delay={0.3 + (0.1 * i)} className="h-full">
                            <div className="group h-full p-6 rounded-sm border border-border hover:border-border/80 hover:bg-surface transition-colors flex flex-col">
                                <div className="flex items-center justify-between mb-8">
                                    <span className="font-mono text-[10px] uppercase tracking-widest text-rust">
                                        {client.year}
                                    </span>
                                    <span className="w-1.5 h-1.5 rounded-full bg-border group-hover:bg-rust transition-colors" />
                                </div>

                                <h3 className="font-syne text-xl font-bold text-paper mb-2 group-hover:text-amber transition-colors">
                                    {client.name}
                                </h3>

                                <p className="font-mono text-[10px] uppercase tracking-widest text-muted mb-6">
                                    {client.location}
                                </p>

                                <div className="mt-auto flex flex-wrap gap-2">
                                    {client.tags.map((tag: string) => (
                                        <span key={tag} className="font-mono text-[10px] tracking-widest text-muted border border-border/50 px-2 py-1 rounded-sm uppercase">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </RevealWrapper>
                    ))}
                </div>

            </div>
        </section>
    );
}
