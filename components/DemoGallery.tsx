"use client";

import { RevealWrapper } from "./ui/RevealWrapper";
import { SectionLabel } from "./ui/SectionLabel";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const demos = [
    {
        slug: "website-roaster",
        tag: "⭐ Featured Demo · New Build",
        icon: "🔥",
        name: "AI Website Roaster",
        desc: "Enter any URL. Gemini audits the website in seconds — scoring design, copy, UX, SEO, and conversion potential. Returns a brutal, honest, actionable report with a score out of 100.",
        pills: ["Gemini API", "Next.js", "Tailwind"],
        featured: true,
    },
    {
        slug: "ai-chef",
        tag: "Replaces: Food Recipes API",
        icon: "👨‍🍳",
        name: "AI Chef",
        desc: "Describe what's in your fridge. Gemini generates a full recipe with steps, timing, nutrition, and plating suggestions.",
        pills: ["Gemini API", "React"],
    },
    {
        slug: "weather-advisor",
        tag: "Replaces: Weather App",
        icon: "🌤️",
        name: "AI Weather Advisor",
        desc: "Not just the temperature. Gemini interprets today's conditions for your plans — what to wear, whether to reschedule, what to expect.",
        pills: ["Gemini API", "Weather API", "React"],
    },
    {
        slug: "mentor-matcher",
        tag: "Replaces: DevelopMe",
        icon: "🎓",
        name: "AI Mentor Matcher",
        desc: "Describe your learning goals and experience level. Gemini returns a personalised mentor profile, learning path, and weekly schedule.",
        pills: ["Gemini API", "React", "Next.js"],
    },
    {
        slug: "dev-brief",
        tag: "Upgrades: DevConnect",
        icon: "📋",
        name: "AI Dev Brief Generator",
        desc: "Clients describe their project in plain English. Gemini transforms it into a professional dev brief with scope, stack, milestones, and budget ranges.",
        pills: ["Gemini API", "React", "PDF Export"],
    },
    {
        slug: "nft-describer",
        tag: "Upgrades: NAMKA Marketplace",
        icon: "🎨",
        name: "AI NFT Describer",
        desc: "Upload an NFT image. Gemini generates a compelling collector description, rarity analysis, and suggested listing price.",
        pills: ["Gemini Vision", "ThirdWeb", "React"],
    },
];

export function DemoGallery() {
    return (
        <section id="demos" className="w-full bg-bg py-32 border-b border-border">
            <div className="max-w-7xl mx-auto px-6 md:px-12">
                <RevealWrapper>
                    <SectionLabel text="Live AI Prototypes" />
                    <h2 className="text-4xl md:text-5xl font-syne font-bold text-paper mb-6 tracking-tight">
                        Not just code — thinking tools.
                    </h2>
                    <p className="font-mono text-muted max-w-2xl mb-16 text-sm leading-relaxed">
                        Each demo is a live, working AI-powered app — built in React, powered by Gemini API, hosted on namka.cloud.
                    </p>
                </RevealWrapper>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {demos.map((demo, i) => (
                        <RevealWrapper
                            key={demo.slug}
                            delay={i * 0.1}
                            className={demo.featured ? "xl:col-span-2" : ""}
                        >
                            <Link
                                href={`/demos/${demo.slug}`}
                                className={`group relative block h-full p-8 rounded-xl border border-border bg-surface hover:border-rust hover:shadow-[0_8px_30px_-10px_rgba(184,74,47,0.3)] hover:-translate-y-1 transition-all duration-300 overflow-hidden ${demo.featured ? "flex flex-col md:flex-row gap-8 items-center" : "flex flex-col"
                                    }`}
                            >
                                {/* Corner accent */}
                                <div className="absolute top-0 right-0 w-0 h-0 border-t-[30px] border-t-card border-l-[30px] border-l-transparent group-hover:border-t-rust transition-colors duration-300 z-10" />

                                <div className={`flex flex-col ${demo.featured ? "md:w-1/2" : "flex-1"}`}>
                                    <span className="font-mono text-xs text-rust uppercase tracking-widest mb-4">
                                        {demo.tag}
                                    </span>

                                    <div className="text-4xl mb-4">{demo.icon}</div>

                                    <h3 className="font-syne font-bold text-2xl text-paper mb-3">
                                        {demo.name}
                                    </h3>

                                    <p className="font-syne text-sm text-paper/70 mb-8 leading-relaxed flex-1">
                                        {demo.desc}
                                    </p>

                                    <div className="flex flex-wrap gap-2 mt-auto mb-8">
                                        {demo.pills.map((pill) => (
                                            <span
                                                key={pill}
                                                className="px-3 py-1 bg-gold/10 border border-gold/20 text-gold font-mono text-[0.6rem] uppercase tracking-widest rounded-full"
                                            >
                                                {pill}
                                            </span>
                                        ))}
                                    </div>

                                    <div className="flex items-center gap-2 text-rust font-syne font-bold text-sm group-hover:gap-3 transition-all">
                                        Launch Demo <ArrowRight size={16} />
                                    </div>
                                </div>

                                {/* Featured Mock Panel */}
                                {demo.featured && (
                                    <div className="hidden md:flex flex-col w-1/2 h-full bg-card rounded-lg border border-border p-4 shadow-inner relative overflow-hidden">
                                        <div className="flex gap-1.5 mb-4">
                                            <div className="w-2.5 h-2.5 rounded-full bg-border" />
                                            <div className="w-2.5 h-2.5 rounded-full bg-border" />
                                            <div className="w-2.5 h-2.5 rounded-full bg-border" />
                                        </div>
                                        <div className="font-mono text-[0.65rem] text-muted space-y-2">
                                            <p className="text-paper">{'// GEMINI ANALYSIS START'}</p>
                                            <p>{'> Analyzing visual hierarchy...'}</p>
                                            <p>{'> Checking CTA contrast...'}</p>
                                            <p>{'> Evaluating copy sentiment...'}</p>
                                            <br />
                                            <p className="text-rust">{"\"Your hero section reads like a corporate memo. Needs more kinetic energy.\""}</p>
                                            <br />
                                            <p className="text-gold">{'Overall Score: 42/100'}</p>
                                        </div>
                                        {/* Glowing fade effect at bottom */}
                                        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-card to-transparent pointer-events-none" />
                                    </div>
                                )}
                            </Link>
                        </RevealWrapper>
                    ))}
                </div>
            </div>
        </section>
    );
}
