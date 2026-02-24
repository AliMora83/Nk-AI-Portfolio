"use client";

import { RevealWrapper } from "./ui/RevealWrapper";
import { useState } from "react";
import { ArrowRight, Loader2, CheckCircle2 } from "lucide-react";

export function Contact() {
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setStatus("loading");

        const formData = new FormData(e.currentTarget);
        const data = {
            name: formData.get("name"),
            email: formData.get("email"),
            service: formData.get("service"),
            message: formData.get("message"),
        };

        try {
            const res = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (res.ok) {
                setStatus("success");
            } else {
                setStatus("error");
            }
        } catch {
            setStatus("error");
        }
    };

    return (
        <section id="contact" className="w-full bg-surface py-32">
            <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col lg:flex-row gap-16 lg:gap-24">

                {/* Left Col */}
                <div className="w-full lg:w-5/12 flex flex-col justify-between">
                    <RevealWrapper>
                        <h2 className="text-6xl md:text-8xl font-instrument italic text-paper mb-12 tracking-tight">
                            Got a project <br /> in mind?
                        </h2>
                    </RevealWrapper>

                    <RevealWrapper delay={0.2}>
                        <div className="flex flex-col gap-8 font-mono text-sm uppercase tracking-widest">
                            <div>
                                <span className="text-muted text-xs block mb-2">WhatsApp</span>
                                <a href="https://wa.me/27789658725" target="_blank" rel="noopener noreferrer" className="text-paper hover:text-rust transition-colors text-lg">+27 78 965 8725</a>
                            </div>
                            <div>
                                <span className="text-muted text-xs block mb-2">Email</span>
                                <a href="mailto:ali.mora@namka.cloud" className="text-paper hover:text-rust transition-colors text-lg">ali.mora@namka.cloud</a>
                            </div>
                            <div>
                                <span className="text-muted text-xs block mb-2">Studio</span>
                                <a href="https://openmindi.co.za" target="_blank" rel="noopener noreferrer" className="text-paper hover:text-rust transition-colors text-lg">openmindi.co.za</a>
                            </div>
                        </div>
                    </RevealWrapper>
                </div>

                {/* Right Col / Form */}
                <div className="w-full lg:w-7/12">
                    <RevealWrapper delay={0.3}>
                        {status === "success" ? (
                            <div className="h-full min-h-[400px] flex flex-col items-center justify-center p-12 border border-border rounded-xl bg-card text-center space-y-6">
                                <CheckCircle2 size={48} className="text-sage" />
                                <div>
                                    <h3 className="font-syne font-bold text-3xl text-paper mb-2">Message Received</h3>
                                    <p className="font-mono text-sm text-muted">I&apos;ll get back to you within 24 hours.</p>
                                </div>
                                <button
                                    onClick={() => setStatus("idle")}
                                    className="font-mono text-xs text-rust uppercase tracking-widest hover:underline mt-4"
                                >
                                    Send another message
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="flex flex-col gap-6 p-8 md:p-12 border border-border rounded-xl bg-card relative">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-rust opacity-5 blur-[50px] pointer-events-none rounded-full" />

                                <div className="flex flex-col md:flex-row gap-6">
                                    <div className="flex flex-col gap-2 flex-1">
                                        <label htmlFor="name" className="font-mono text-[0.65rem] text-muted uppercase tracking-widest">Name</label>
                                        <input required type="text" id="name" name="name" className="w-full bg-surface border border-border rounded-lg px-4 py-3 text-paper font-syne focus:border-rust focus:outline-none transition-colors" placeholder="Jane Doe" />
                                    </div>
                                    <div className="flex flex-col gap-2 flex-1">
                                        <label htmlFor="email" className="font-mono text-[0.65rem] text-muted uppercase tracking-widest">Email</label>
                                        <input required type="email" id="email" name="email" className="w-full bg-surface border border-border rounded-lg px-4 py-3 text-paper font-syne focus:border-rust focus:outline-none transition-colors" placeholder="jane@example.com" />
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label htmlFor="service" className="font-mono text-[0.65rem] text-muted uppercase tracking-widest">Service</label>
                                    <select required id="service" name="service" className="w-full bg-surface border border-border rounded-lg px-4 py-3 text-paper font-syne focus:border-rust focus:outline-none transition-colors appearance-none">
                                        <option value="" disabled selected>Select a service...</option>
                                        <option value="Web App Development">Web App Development</option>
                                        <option value="AI Integration & Prototypes">AI Integration & Prototypes</option>
                                        <option value="UI/UX Design">UI/UX Design</option>
                                        <option value="Consulting">Technical Consulting</option>
                                    </select>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label htmlFor="message" className="font-mono text-[0.65rem] text-muted uppercase tracking-widest">Project Details</label>
                                    <textarea required id="message" name="message" rows={5} className="w-full bg-surface border border-border rounded-lg px-4 py-3 text-paper font-syne focus:border-rust focus:outline-none transition-colors resize-none" placeholder="Tell me about your timeline, budget, and goals..."></textarea>
                                </div>

                                {status === "error" && (
                                    <p className="text-rust font-mono text-xs uppercase tracking-widest">Error sending message. Please try again or email directly.</p>
                                )}

                                <button
                                    type="submit"
                                    disabled={status === "loading"}
                                    className="mt-4 w-full md:w-auto self-end bg-rust border border-rust text-white font-syne font-bold px-8 py-4 rounded-lg hover:bg-rust/90 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70 disabled:hover:translate-y-0"
                                >
                                    {status === "loading" ? (
                                        <><Loader2 size={18} className="animate-spin" /> Sending...</>
                                    ) : (
                                        <>Send Request <ArrowRight size={18} /></>
                                    )}
                                </button>
                            </form>
                        )}
                    </RevealWrapper>
                </div>
            </div>
        </section>
    );
}
