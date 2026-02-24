"use client";

import { useState, useRef } from "react";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { RevealWrapper } from "@/components/ui/RevealWrapper";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Loader2, ArrowLeft, Image as ImageIcon, Sparkles, UploadCloud, Diamond, Copy, Check } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function NFTDescriber() {
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [base64Image, setBase64Image] = useState<string | null>(null);
    const [mediaType, setMediaType] = useState<string | null>(null);
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [result, setResult] = useState<any>(null);
    const [copied, setCopied] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 4 * 1024 * 1024) {
            alert("Image must be smaller than 4MB");
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            if (event.target?.result && typeof event.target.result === "string") {
                setImagePreview(event.target.result);
                const dataPrefix = event.target.result.substring(0, event.target.result.indexOf(","));
                const base64Str = event.target.result.split(",")[1];
                const mt = dataPrefix.match(/:(.*?);/)?.[1] || "image/jpeg";

                setBase64Image(base64Str);
                setMediaType(mt);
                setStatus("idle");
                setResult(null);
            }
        };
        reader.readAsDataURL(file);
    };

    const describeNFT = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!base64Image || !mediaType) return;

        setStatus("loading");

        const prompt = `Analyse this NFT artwork image. Extract visual traits, conceptual meaning, and emotional tone.

Return ONLY valid JSON schema without markdown wrappers:
{
  "title": "suggested NFT title",
  "artistStyle": "art style description",
  "description": "compelling 3-sentence collector description",
  "traits": [{"trait":"...","value":"...","rarity":"Common|Uncommon|Rare|Legendary"}],
  "mood": "emotional tone of the piece",
  "colorPalette": ["color 1", "color 2", "color 3"],
  "suggestedPrice": {"eth":"X.XX ETH","usd":"~$X,XXX","reasoning":"..."},
  "targetCollector": "who would love this piece",
  "listingTitle": "optimised marketplace listing title",
  "listingDesc": "full marketplace listing description ready to copy-paste"
}`;

        try {
            const res = await fetch("/api/gemini", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                // Important: sending imageData so route uses Vision API
                body: JSON.stringify({ prompt, maxTokens: 1000, imageData: base64Image, mediaType: mediaType })
            });

            const data = await res.json();
            if (data.error) throw new Error(data.error);

            const jsonMatch = data.text.match(/\{[\s\S]*\}/);
            if (!jsonMatch) throw new Error("Invalid format returned");

            setResult(JSON.parse(jsonMatch[0]));
            setStatus("success");
        } catch (error) {
            console.error(error);
            setStatus("error");
        }
    };

    const copyListing = () => {
        if (!result) return;
        navigator.clipboard.writeText(`${result.listingTitle}\n\n${result.listingDesc}`);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const getRarityColor = (rarity: string) => {
        switch (rarity) {
            case "Legendary": return "bg-gold border-gold text-bg font-bold shadow-[0_0_10px_rgba(201,168,76,0.5)]";
            case "Rare": return "bg-sage/10 border-sage text-sage";
            case "Uncommon": return "bg-amber/10 border-amber text-amber";
            default: return "bg-surface border-border text-muted";
        }
    };

    return (
        <main className="min-h-screen bg-bg flex flex-col">
            <Nav />
            <div className="flex-1 w-full max-w-7xl mx-auto px-6 md:px-12 pt-32 pb-24">

                <Link href="/" className="inline-flex items-center gap-2 text-muted hover:text-rust font-mono text-xs uppercase tracking-widest mb-12 transition-colors">
                    <ArrowLeft size={14} /> Back to Portfolio
                </Link>

                <RevealWrapper>
                    <SectionLabel text="AI Prototype" />
                    <h1 className="text-5xl md:text-7xl font-syne font-bold text-paper mb-6 flex items-center gap-4">
                        NFT Describer <ImageIcon className="text-gold w-10 h-10 md:w-16 md:h-16" />
                    </h1>
                    <p className="font-mono text-muted max-w-2xl mb-12 leading-relaxed">
                        Upload an NFT image. Gemini generates a compelling collector description, visual traits analysis, and ready-to-use marketplace metadata.
                    </p>
                </RevealWrapper>

                {status === "idle" || status === "error" ? (
                    <RevealWrapper delay={0.1}>
                        <form onSubmit={describeNFT} className="max-w-2xl border border-border rounded-xl bg-surface p-8 mb-16 relative z-20">
                            <div className="flex flex-col gap-6">

                                {/* Drag & Drop Area pseudo-implementation */}
                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    className="w-full flex-1 min-h-[300px] border-2 border-dashed border-border hover:border-gold/50 rounded-xl flex flex-col items-center justify-center gap-4 cursor-pointer hover:bg-bg transition-colors relative overflow-hidden group"
                                >
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleImageChange}
                                        accept="image/png, image/jpeg, image/webp"
                                        className="hidden"
                                    />

                                    {imagePreview ? (
                                        <img src={imagePreview} alt="Preview" className="absolute inset-0 w-full h-full object-contain p-4 mix-blend-lighten" />
                                    ) : (
                                        <>
                                            <UploadCloud size={48} className="text-muted group-hover:text-gold transition-colors" />
                                            <div className="text-center font-mono">
                                                <p className="text-paper text-sm">Click to upload NFT image</p>
                                                <p className="text-muted text-[0.65rem] uppercase tracking-widest mt-2">PNG, JPG up to 4MB</p>
                                            </div>
                                        </>
                                    )}
                                </div>

                                {status === "error" && (
                                    <div className="text-rust font-mono text-xs p-4 bg-rust/10 rounded">Failed to analyze image. Please ensure it's a valid image and try again.</div>
                                )}

                                <button
                                    type="submit"
                                    disabled={!base64Image}
                                    className="w-full bg-gold border border-gold text-bg font-syne font-bold px-8 py-4 rounded-lg hover:bg-gold/90 hover:shadow-[0_0_20px_-5px_var(--gold)] transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    <Sparkles size={18} /> Analyze & Generate Metadata
                                </button>
                            </div>
                        </form>
                    </RevealWrapper>
                ) : null}

                <AnimatePresence mode="wait">
                    {status === "loading" && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="w-full max-w-2xl p-16 rounded-xl border border-border bg-surface flex flex-col items-center justify-center gap-6"
                        >
                            {imagePreview && (
                                <div className="relative w-32 h-32 rounded-lg overflow-hidden border border-border opacity-50 mb-4">
                                    <img src={imagePreview} className="w-full h-full object-cover" alt="analyzing" />
                                    <div className="absolute inset-x-0 top-0 h-1 bg-gold animate-pulse shadow-[0_0_10px_var(--gold)] pointer-events-none" style={{ animation: "scan 2s infinite linear alternate" }} />
                                </div>
                            )}
                            <Loader2 size={32} className="text-gold animate-spin mb-2" />
                            <div className="flex flex-col items-center gap-2 text-center">
                                <p className="font-mono text-xs text-paper uppercase tracking-widest animate-pulse">
                                    Extracting semantic metadata from latent space...
                                </p>
                            </div>
                            <style jsx>{`
                @keyframes scan {
                  0% { transform: translateY(0); }
                  100% { transform: translateY(128px); }
                }
              `}</style>
                        </motion.div>
                    )}

                    {status === "success" && result && (
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="w-full relative z-10"
                        >
                            <div className="mb-8 pb-4 border-b border-border flex justify-end">
                                <button onClick={() => setStatus("idle")} className="font-mono text-xs text-gold uppercase hover:underline">Scan Another</button>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 pl-0">
                                {/* Left Col: Image */}
                                <div className="lg:col-span-5 flex flex-col gap-6">
                                    <div className="border border-border/50 rounded-2xl overflow-hidden bg-card p-4 relative shadow-2xl">
                                        {imagePreview && <img src={imagePreview} alt="NFT" className="w-full h-auto rounded-lg" />}

                                        {/* Color Palette Display */}
                                        <div className="flex h-3 w-[calc(100%-2rem)] mx-auto mt-4 rounded overflow-hidden opacity-80">
                                            {result.colorPalette.map((color: string, i: number) => (
                                                <div key={i} className="flex-1" style={{ backgroundColor: color }} title={color} />
                                            ))}
                                        </div>
                                    </div>

                                    <div className="p-6 rounded-xl border border-border bg-surface grid grid-cols-2 gap-4">
                                        <div>
                                            <span className="block font-mono text-[0.6rem] text-muted uppercase tracking-widest mb-1">Target Collector</span>
                                            <span className="font-syne text-sm text-paper font-bold">{result.targetCollector}</span>
                                        </div>
                                        <div>
                                            <span className="block font-mono text-[0.6rem] text-muted uppercase tracking-widest mb-1">Mood</span>
                                            <span className="font-syne text-sm text-paper font-bold">{result.mood}</span>
                                        </div>
                                    </div>

                                    <div className="p-6 rounded-xl border border-gold/30 bg-gold/5">
                                        <h4 className="flex items-center gap-2 font-syne font-bold text-gold mb-3">
                                            <Diamond size={18} /> Estimated Value
                                        </h4>
                                        <div className="flex items-end gap-3 mb-2">
                                            <span className="font-mono text-2xl font-bold text-paper">{result.suggestedPrice.eth}</span>
                                            <span className="font-mono text-sm text-muted mb-1">{result.suggestedPrice.usd}</span>
                                        </div>
                                        <p className="font-syne text-xs text-paper/80 italic border-l-2 border-gold/50 pl-2">
                                            {result.suggestedPrice.reasoning}
                                        </p>
                                    </div>
                                </div>

                                {/* Right Col: Metadata */}
                                <div className="lg:col-span-7 space-y-10">
                                    <div>
                                        <p className="font-mono text-xs text-gold uppercase tracking-widest mb-2 border border-gold/20 inline-block px-3 py-1 rounded-full bg-gold/5">
                                            Style: {result.artistStyle}
                                        </p>
                                        <h2 className="text-4xl md:text-5xl font-syne font-extrabold text-paper mb-6">
                                            {result.title}
                                        </h2>
                                        <p className="font-syne text-lg text-paper/90 leading-relaxed border-l-4 border-gold pl-4 -ml-[2px]">
                                            {result.description}
                                        </p>
                                    </div>

                                    <div>
                                        <h3 className="font-syne font-bold text-xl uppercase tracking-wider mb-6 border-b border-border pb-2 flex items-center justify-between">
                                            Traits Analysis
                                        </h3>
                                        <div className="flex flex-wrap gap-3">
                                            {result.traits.map((t: any, i: number) => (
                                                <div key={i} className={`flex flex-col py-2 px-4 rounded-lg border min-w-[120px] ${getRarityColor(t.rarity)}`}>
                                                    <span className="font-mono text-[0.6rem] uppercase tracking-widest opacity-80 mb-1">{t.trait}</span>
                                                    <span className="font-syne font-bold text-sm tracking-tight">{t.value}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="bg-card border border-border rounded-xl overflow-hidden shadow-inner">
                                        <div className="bg-surface border-b border-border px-6 py-3 flex justify-between items-center">
                                            <span className="font-mono text-xs text-muted uppercase tracking-widest">Marketplace Listing (Ready to Copy)</span>
                                            <button
                                                onClick={copyListing}
                                                className="font-mono text-xs text-gold hover:text-gold/80 flex items-center gap-1 bg-gold/10 px-3 py-1.5 rounded transition-all"
                                            >
                                                {copied ? <><Check size={14} /> Copied!</> : <><Copy size={14} /> Copy Metadata</>}
                                            </button>
                                        </div>
                                        <div className="p-6 font-mono text-sm text-paper/80 whitespace-pre-wrap leading-relaxed max-h-[300px] overflow-y-auto">
                                            <span className="font-bold text-white text-base block mb-4">{result.listingTitle}</span>
                                            {result.listingDesc}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

            </div>
            <Footer />
        </main>
    );
}
