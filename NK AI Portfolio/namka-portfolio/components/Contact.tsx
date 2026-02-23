"use client";

import { useState } from "react";
import { RevealWrapper } from "./ui/RevealWrapper";
import { SectionLabel } from "./ui/SectionLabel";
import { ArrowRight, CheckCircle2, AlertCircle } from "lucide-react";

export function Contact() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsSubmitting(true);
        setStatus("idle");

        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData);

        try {
            const res = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (res.ok) {
                setStatus("success");
                (e.target as HTMLFormElement).reset();
            } else {
                setStatus("error");
            }
        } catch {
            setStatus("error");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <section id="contact" className="py-32 px-6 max-w-7xl mx-auto border-t border-border">
            <SectionLabel text="Hire Ali" />

            <div className="grid lg:grid-cols-[1fr_1fr] gap-16">

                {/* Left Col - Info */}
                <div>
                    <RevealWrapper delay={0.1}>
                        <h2 className="text-5xl md:text-7xl font-instrument italic font-normal mb-8 text-amber leading-tight">
                            Got a project in mind?
                        </h2>
                    </RevealWrapper>

                    <RevealWrapper delay={0.2}>
                        <p className="text-muted text-lg max-w-md font-syne mb-12">
                            Whether it&apos;s a new web application, a brand redesign, or integrating an AI workflow — let&apos;s build it together.
                        </p>
                    </RevealWrapper>

                    <RevealWrapper delay={0.3} className="space-y-6">
                        <div className="flex flex-col gap-1 group">
                            <span className="font-mono text-[10px] uppercase tracking-widest text-muted">Email</span>
                            <a href="mailto:ali.mora@namka.cloud" className="font-syne text-xl font-bold text-paper group-hover:text-amber transition-colors">
                                ali.mora@namka.cloud
                            </a>
                        </div>
                        <div className="flex flex-col gap-1 group">
                            <span className="font-mono text-[10px] uppercase tracking-widest text-muted">WhatsApp</span>
                            <a href="https://wa.me/27789658725" target="_blank" rel="noopener noreferrer" className="font-syne text-xl font-bold text-paper group-hover:text-amber transition-colors">
                                +27 78 965 8725
                            </a>
                        </div>
                        <div className="flex flex-col gap-1 group">
                            <span className="font-mono text-[10px] uppercase tracking-widest text-muted">Studio</span>
                            <a href="https://openmindi.co.za" target="_blank" rel="noopener noreferrer" className="font-syne text-xl font-bold text-paper group-hover:text-amber transition-colors flex items-center gap-2">
                                openmindi.co.za <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                            </a>
                        </div>
                    </RevealWrapper>
                </div>

                {/* Right Col - Form */}
                <RevealWrapper delay={0.4}>
                    <form onSubmit={handleSubmit} className="p-8 md:p-12 rounded-sm bg-surface/50 border border-border flex flex-col gap-6">
                        <div className="flex flex-col gap-2">
                            <label htmlFor="name" className="font-mono text-xs uppercase tracking-widest text-muted">Name</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                required
                                className="bg-bg border border-border/50 rounded-sm p-4 font-syne text-paper focus:outline-none focus:border-rust transition-colors hover:border-border"
                                placeholder="John Doe"
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label htmlFor="email" className="font-mono text-xs uppercase tracking-widest text-muted">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                required
                                className="bg-bg border border-border/50 rounded-sm p-4 font-syne text-paper focus:outline-none focus:border-rust transition-colors hover:border-border"
                                placeholder="john@example.com"
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label htmlFor="service" className="font-mono text-xs uppercase tracking-widest text-muted">Service Required</label>
                            <select
                                id="service"
                                name="service"
                                required
                                className="bg-bg border border-border/50 rounded-sm p-4 font-syne text-paper focus:outline-none focus:border-rust transition-colors appearance-none hover:border-border cursor-pointer"
                            >
                                <option value="" disabled selected>Select an option...</option>
                                <option value="AI Integration & Automation">AI Integration & Automation</option>
                                <option value="React / Next.js Development">React / Next.js Development</option>
                                <option value="UI / UX Design">UI / UX Design</option>
                                <option value="Full-stack Application">Full-stack Application</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label htmlFor="message" className="font-mono text-xs uppercase tracking-widest text-muted">Project Details</label>
                            <textarea
                                id="message"
                                name="message"
                                required
                                rows={4}
                                className="bg-bg border border-border/50 rounded-sm p-4 font-syne text-paper focus:outline-none focus:border-rust transition-colors hover:border-border resize-none"
                                placeholder="Tell me about your project, timeline, and budget..."
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`mt-4 py-4 rounded-sm font-syne font-bold transition-all duration-300 flex items-center justify-center gap-2
                ${status === "success" ? "bg-sage text-paper shadow-[0_0_20px_rgba(74,122,74,0.3)]" :
                                    status === "error" ? "bg-rust/20 text-rust border border-rust" :
                                        "bg-amber text-paper hover:bg-rust shadow-[0_0_20px_rgba(212,144,58,0.2)] hover:shadow-[0_0_30px_rgba(184,74,47,0.4)]"
                                } disabled:opacity-70 disabled:cursor-not-allowed
              `}
                        >
                            {isSubmitting ? (
                                <span className="animate-pulse">Sending...</span>
                            ) : status === "success" ? (
                                <><CheckCircle2 size={20} /> Sent Successfully</>
                            ) : status === "error" ? (
                                <><AlertCircle size={20} /> Error Sending (Try Email)</>
                            ) : (
                                "Send Enquiry"
                            )}
                        </button>
                    </form>
                </RevealWrapper>
            </div>
        </section>
    );
}
