"use client";

import { RevealWrapper } from "./ui/RevealWrapper";
import { SectionLabel } from "./ui/SectionLabel";
import { ArrowUpRight } from "lucide-react";

const clients = [
    { name: "Micassa Suites", location: "Kampala, Uganda", year: "2024", type: "Full-stack · Brand · SEO", tags: ["Web Dev", "Brand/CI", "Cyber Security"], hero: true },
    { name: "Sifinet Connect", location: "Bloemfontein · National", year: "2022", type: "Full-stack · Brand", tags: ["Web Dev", "Design"] },
    { name: "IDBS Online Learning", location: "Cape Town · International", year: "2020", type: "Web3 · Education", tags: ["Web3", "Platform"] },
    { name: "Digital Info Systems", location: "Cape Town · National", year: "2021", type: "Full-stack · Design", tags: ["Dev", "Graphic Design"] },
    { name: "UDYNET Wi-Fi", location: "Bloemfontein · National", year: "2019", type: "Video · Web · Brand", tags: ["Video", "Web"] },
];

export function ClientWork() {
    const heroClient = clients.find(c => c.hero);
    const gridClients = clients.filter(c => !c.hero);

    return (
        <section id="work" className="w-full bg-surface py-32 border-b border-border">
            <div className="max-w-7xl mx-auto px-6 md:px-12">
                <RevealWrapper>
                    <SectionLabel text="Client Portfolio" />
                    <h2 className="text-4xl md:text-5xl font-syne font-bold text-paper mb-16 tracking-tight">
                        10 years of real partnerships.
                    </h2>
                </RevealWrapper>

                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Hero Card (Left) */}
                    {heroClient && (
                        <RevealWrapper delay={0.1} className="w-full lg:w-5/12">
                            <div className="group relative flex flex-col h-full min-h-[400px] p-8 rounded-xl border border-border bg-card hover:border-rust hover:-translate-y-1 transition-all duration-300 overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-rust to-amber opacity-0 group-hover:opacity-100 transition-opacity" />

                                <div className="flex justify-between items-start mb-auto">
                                    <span className="font-mono text-xs text-muted">/{heroClient.year}</span>
                                    <div className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-muted group-hover:text-rust group-hover:border-rust transition-colors">
                                        <ArrowUpRight size={14} />
                                    </div>
                                </div>

                                <div>
                                    <h3 className="font-syne font-bold text-3xl md:text-4xl text-paper mb-4 mt-12 group-hover:text-rust transition-colors">
                                        {heroClient.name}
                                    </h3>
                                    <div className="font-mono text-xs text-muted uppercase tracking-widest mb-6 flex flex-col gap-1">
                                        <span>{heroClient.type}</span>
                                        <span>{heroClient.location}</span>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {heroClient.tags.map(tag => (
                                            <span key={tag} className="px-3 py-1 border border-border rounded-full text-[0.65rem] font-mono text-paper uppercase tracking-widest">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </RevealWrapper>
                    )}

                    {/* 2x2 Grid (Right) */}
                    <div className="w-full lg:w-7/12 grid grid-cols-1 md:grid-cols-2 gap-6">
                        {gridClients.map((client, i) => (
                            <RevealWrapper key={client.name} delay={0.2 + (i * 0.1)}>
                                <div className="group relative flex flex-col justify-between h-full min-h-[220px] p-6 rounded-xl border border-border bg-card hover:border-rust transition-all duration-300 hover:shadow-lg">
                                    <div className="flex justify-between items-start">
                                        <span className="font-mono text-xs text-muted">/{client.year}</span>
                                        <ArrowUpRight size={16} className="text-muted group-hover:text-rust opacity-0 group-hover:opacity-100 transition-all -translate-x-2 translate-y-2 group-hover:translate-x-0 group-hover:translate-y-0" />
                                    </div>

                                    <div>
                                        <h3 className="font-syne font-bold text-xl text-paper mb-2 transition-colors">
                                            {client.name}
                                        </h3>
                                        <p className="font-mono text-[0.65rem] text-muted uppercase tracking-widest mb-4">
                                            {client.location}
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                            {client.tags.map(tag => (
                                                <span key={tag} className="px-2 py-1 bg-surface border border-border rounded text-[0.6rem] font-mono text-paper/80 uppercase tracking-widest">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </RevealWrapper>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
