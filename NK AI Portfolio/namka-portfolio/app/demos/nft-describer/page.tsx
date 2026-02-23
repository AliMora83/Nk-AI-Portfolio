"use client";

import { useState, useRef } from "react";
import { DemoHeader } from "@/components/DemoHeader";
import { motion, AnimatePresence } from "framer-motion";
import { ImagePlus, Sparkles, Fingerprint, Palette, Tag, ArrowUpRight } from "lucide-react";

type NFTResult = {
    title: string;
    vibeCheck: string;
    traits: { name: string; value: string; rarity: "Common" | "Rare" | "Legendary" | "Mythic" }[];
    marketAppeal: string;
    artCritique: string;
    suggestedFloor: string;
};

export default function NftDescriber() {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<NFTResult | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Create preview
        const objectUrl = URL.createObjectURL(file);
        setPreviewUrl(objectUrl);
        setResult(null);

        // Convert to base64 for Gemini
        const reader = new FileReader();
        reader.onloadend = async () => {
            const base64String = (reader.result as string).split(',')[1];
            const mediaType = file.type;
            analyzeImage(base64String, mediaType);
        };
        reader.readAsDataURL(file);
    };

    async function analyzeImage(base64: string, mediaType: string) {
        setLoading(true);

        try {
            const prompt = `You are a high-end NFT art appraiser and critic. Look at this uploaded image.

Generate a profile for this artwork as if it were an NFT. Return ONLY valid JSON:
{
  "title": "A creative, edgy title for this piece",
  "vibeCheck": "A 1-sentence cultural/aesthetic vibe check",
  "traits": [
    {"name": "Background", "value": "...", "rarity": "Common|Rare|Legendary|Mythic"}
  ],
  "marketAppeal": "Who would buy this?",
  "artCritique": "A brief, mildly pretentious art critique",
  "suggestedFloor": "e.g., 0.5 ETH, 10 SOL, etc."
}`;

            const res = await fetch("/api/gemini", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    prompt,
                    maxTokens: 1000,
                    imageData: base64,
                    mediaType: mediaType
                })
            });

            const data = await res.json();
            if (data.text) {
                const jsonMatch = data.text.match(/\\{([\\s\\S]*)\\}/);
                const jsonStr = jsonMatch ? jsonMatch[0] : data.text;
                try {
                    const parsed = JSON.parse(jsonStr);
                    setResult(parsed);
                } catch (e) {
                    console.error("JSON Parse Error", e);
                    alert("Gemini returned malformed data.");
                }
            } else {
                alert(data.error);
            }
        } catch (err) {
            console.error(err);
            alert("Network error.");
        } finally {
            setLoading(false);
        }
    }

    const getRarityColor = (rarity: string) => {
        switch (rarity) {
            case 'Common': return 'text-muted border-border';
            case 'Rare': return 'text-sage border-sage/50 bg-sage/5';
            case 'Legendary': return 'text-amber border-amber/50 bg-amber/5';
            case 'Mythic': return 'text-[#9d4edd] border-[#9d4edd]/50 bg-[#9d4edd]/5';
            default: return 'text-muted border-border';
        }
    };

    return (
        <main className="min-h-screen bg-bg pb-20">
            <DemoHeader title="AI NFT Describer" />

            <div className="max-w-5xl mx-auto px-6 py-20">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-rust/10 text-rust mb-6">
                        <Sparkles size={32} />
                    </div>
                    <h1 className="text-5xl font-syne font-bold text-paper mb-4">NFT Appraiser</h1>
                    <p className="font-mono text-sm text-muted max-w-xl mx-auto uppercase tracking-widest leading-relaxed">
                        Upload an image. Gemini Vision analyzes the aesthetics, generates rarity traits, and acts like a pretentious Web3 art critic.
                    </p>
                </div>

                <div className="max-w-xl mx-auto mb-20">
                    <input
                        type="file"
                        accept="image/jpeg, image/png, image/webp"
                        className="hidden"
                        ref={fileInputRef}
                        onChange={handleImageUpload}
                    />
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full border-2 border-dashed border-border/50 hover:border-rust transition-colors bg-surface/50 rounded-lg p-12 flex flex-col items-center justify-center gap-4 group"
                    >
                        <div className="w-16 h-16 rounded-full bg-bg border border-border flex items-center justify-center group-hover:scale-110 transition-transform">
                            <ImagePlus size={24} className="text-muted group-hover:text-rust transition-colors" />
                        </div>
                        <div className="text-center">
                            <p className="font-syne font-bold text-paper text-lg mb-1">Click to upload image</p>
                            <p className="font-mono text-[10px] uppercase tracking-widest text-muted">JPEG, PNG, WEBP up to 5MB</p>
                        </div>
                    </button>
                </div>

                <AnimatePresence>
                    {(loading || result) && (
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="grid md:grid-cols-[1fr_1.5fr] gap-12 items-start"
                        >
                            {/* Image Preview Side */}
                            <div className="relative rounded-lg overflow-hidden border border-border bg-surface p-2">
                                <div className="aspect-square relative rounded bg-bg overflow-hidden flex items-center justify-center">
                                    {previewUrl && (
                                        /* eslint-disable-next-line @next/next/no-img-element */
                                        <img
                                            src={previewUrl}
                                            alt="Uploaded preview"
                                            className="w-full h-full object-contain"
                                        />
                                    )}
                                    {loading && (
                                        <div className="absolute inset-0 bg-bg/80 backdrop-blur-sm flex items-center justify-center">
                                            <div className="text-center flex flex-col items-center gap-4">
                                                <Sparkles size={32} className="text-amber animate-pulse" />
                                                <span className="font-mono text-[10px] uppercase tracking-widest text-amber">
                                                    Analyzing Pixels...
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Data Side */}
                            <div className="space-y-8">
                                {loading && !result ? (
                                    <div className="h-full flex flex-col justify-center space-y-6 opacity-50">
                                        <div className="h-10 bg-surface rounded w-3/4 animate-pulse" />
                                        <div className="h-4 bg-surface rounded w-full animate-pulse" />
                                        <div className="h-32 bg-surface rounded w-full animate-pulse" />
                                    </div>
                                ) : result ? (
                                    <>
                                        <div>
                                            <h2 className="text-4xl font-syne font-bold text-paper mb-4">{result.title}</h2>
                                            <p className="font-instrument italic text-xl text-amber border-l-2 border-amber pl-4">
                                                &quot;{result.vibeCheck}&quot;
                                            </p>
                                        </div>

                                        <div className="bg-surface border border-border p-6 rounded-sm">
                                            <h3 className="font-mono text-xs uppercase tracking-widest text-muted mb-6 flex items-center gap-2">
                                                <Fingerprint size={16} /> Generated Traits
                                            </h3>
                                            <div className="grid grid-cols-2 gap-4">
                                                {result.traits.map((trait, i) => (
                                                    <div key={i} className={`p-3 rounded-sm border ${getRarityColor(trait.rarity)}`}>
                                                        <div className="font-mono text-[10px] uppercase tracking-widest opacity-70 mb-1 flex justify-between">
                                                            {trait.name} <span>{trait.rarity}</span>
                                                        </div>
                                                        <div className="font-syne font-bold text-sm truncate">{trait.value}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="grid sm:grid-cols-2 gap-6">
                                            <div className="bg-bg border border-border/50 p-6 rounded-sm">
                                                <h3 className="font-mono text-[10px] uppercase tracking-widest text-muted mb-3 flex items-center gap-2">
                                                    <Palette size={14} /> Art Critique
                                                </h3>
                                                <p className="font-syne text-sm text-paper italic">
                                                    &quot;{result.artCritique}&quot;
                                                </p>
                                            </div>

                                            <div className="bg-bg border border-border/50 p-6 rounded-sm">
                                                <h3 className="font-mono text-[10px] uppercase tracking-widest text-muted mb-3 flex items-center gap-2">
                                                    <Tag size={14} /> Market & Floor
                                                </h3>
                                                <div className="font-syne text-2xl font-bold text-sage mb-2">
                                                    {result.suggestedFloor}
                                                </div>
                                                <p className="font-syne text-xs text-muted">
                                                    <strong>Target Buyer:</strong> {result.marketAppeal}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex flex-col sm:flex-row gap-4 items-center justify-end mt-12 border-t border-border pt-8">
                                            <a
                                                href="https://wa.me/"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="w-full sm:w-auto font-syne font-bold border border-border text-paper px-6 py-3 rounded-sm flex items-center justify-center gap-2 hover:bg-surface transition-colors shadow-sm"
                                            >
                                                WhatsApp Ali
                                            </a>
                                            <a
                                                href="https://openmindi.co.za"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="w-full sm:w-auto font-syne font-bold bg-amber text-paper px-6 py-3 rounded-sm flex items-center justify-center gap-2 hover:bg-rust transition-colors shadow-sm"
                                            >
                                                Hire OpenMindi <ArrowUpRight size={16} />
                                            </a>
                                        </div>
                                    </>
                                ) : null}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </main>
    );
}
