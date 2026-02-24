"use client";

import { useState } from "react";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { RevealWrapper } from "@/components/ui/RevealWrapper";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Loader2, ArrowLeft, ChefHat, Clock, Flame, Utensils } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function AiChef() {
    const [ingredients, setIngredients] = useState("");
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [result, setResult] = useState<any>(null);

    const cookIt = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!ingredients) return;

        setStatus("loading");

        const prompt = `You are a creative chef AI. The user has these ingredients in their fridge/pantry: ${ingredients}. You can assume they have basic pantry staples like salt, pepper, oil, water.

Generate a creative recipe using primarily these items. Return ONLY valid JSON and absolutely no other text. Schema:
{
  "dishName": "...",
  "cuisine": "...",
  "difficulty": "Easy|Medium|Hard",
  "prepTime": "X mins",
  "cookTime": "X mins",
  "servings": 2,
  "story": "1 sentence romanticizing this dish",
  "ingredients": [{"item":"...","amount":"...","note":"..."}],
  "steps": [{"num":1,"title":"...","instruction":"...","time":"X mins"}],
  "nutrition": {"calories":"~X","protein":"Xg","carbs":"Xg","fat":"Xg"},
  "plating": "How to plate this beautifully",
  "chefTip": "One professional secret for this dish"
}`;

        try {
            const res = await fetch("/api/gemini", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt, maxTokens: 1500 })
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
                        AI Chef <ChefHat className="text-amber w-10 h-10 md:w-16 md:h-16" />
                    </h1>
                    <p className="font-mono text-muted max-w-2xl mb-12 leading-relaxed">
                        Describe what's in your fridge. Gemini generates a full recipe with steps, timing, nutrition, and plating suggestions.
                    </p>
                </RevealWrapper>

                <RevealWrapper delay={0.1}>
                    <form onSubmit={cookIt} className="flex flex-col gap-4 max-w-3xl mb-16 relative z-20">
                        <textarea
                            required
                            rows={3}
                            value={ingredients}
                            onChange={(e) => setIngredients(e.target.value)}
                            placeholder="E.g., 2 eggs, leftover rice, frozen peas, some slightly wilted spinach, soy sauce..."
                            className="w-full bg-surface border border-border rounded-lg px-6 py-4 text-paper font-syne focus:border-amber focus:outline-none transition-colors resize-none"
                            disabled={status === "loading"}
                        />
                        <button
                            type="submit"
                            disabled={status === "loading" || !ingredients}
                            className="self-end bg-amber border border-amber text-bg font-syne font-bold px-8 py-3 rounded-lg hover:bg-amber/90 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 disabled:opacity-70 disabled:hover:translate-y-0 flex items-center gap-2"
                        >
                            {status === "loading" ? <Loader2 className="animate-spin" /> : "Generate Recipe"}
                        </button>
                    </form>
                </RevealWrapper>

                <AnimatePresence mode="wait">
                    {status === "loading" && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="w-full max-w-3xl p-12 rounded-xl border border-border bg-surface flex flex-col items-center justify-center gap-6"
                        >
                            <ChefHat size={48} className="text-amber animate-bounce" />
                            <p className="font-mono text-xs text-amber uppercase tracking-widest animate-pulse">
                                Conceptualizing dish based on ingredients...
                            </p>
                        </motion.div>
                    )}

                    {status === "success" && result && (
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="w-full max-w-4xl relative z-10 space-y-8"
                        >
                            <div className="p-8 md:p-12 rounded-2xl border border-amber/30 bg-surface relative overflow-hidden">
                                <div className="font-mono text-xs text-amber uppercase tracking-widest mb-4">
                                    {result.cuisine} · {result.difficulty}
                                </div>
                                <h2 className="text-4xl md:text-6xl font-syne font-bold text-paper mb-6">
                                    {result.dishName}
                                </h2>
                                <p className="font-instrument italic text-xl md:text-2xl text-paper/90 mb-8 border-l-2 border-amber pl-4">
                                    {result.story}
                                </p>

                                <div className="flex flex-wrap gap-8 pt-8 border-t border-border">
                                    <div className="flex items-center gap-3 font-mono text-sm text-muted">
                                        <Clock className="text-amber" size={18} /> Prep: {result.prepTime}
                                    </div>
                                    <div className="flex items-center gap-3 font-mono text-sm text-muted">
                                        <Flame className="text-rust" size={18} /> Cook: {result.cookTime}
                                    </div>
                                    <div className="flex items-center gap-3 font-mono text-sm text-muted">
                                        <Utensils className="text-sage" size={18} /> Serves: {result.servings}
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                <div className="md:col-span-1 space-y-8">
                                    <div className="p-8 rounded-2xl border border-border bg-card">
                                        <h3 className="font-syne font-bold text-xl text-paper mb-6">Ingredients</h3>
                                        <ul className="space-y-4">
                                            {result.ingredients.map((ing: any, i: number) => (
                                                <li key={i} className="font-mono text-sm flex justify-between border-b border-border/50 pb-2">
                                                    <span className="text-paper">{ing.item}</span>
                                                    <span className="text-muted text-right">{ing.amount}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="p-6 rounded-2xl border border-border bg-surface">
                                        <h3 className="font-syne text-sm font-bold text-muted uppercase tracking-widest mb-4">Nutrition</h3>
                                        <div className="grid grid-cols-2 gap-4">
                                            {Object.entries(result.nutrition).map(([key, value]) => (
                                                <div key={key}>
                                                    <span className="block text-xs uppercase text-muted font-mono mb-1">{key}</span>
                                                    <span className="font-syne font-bold text-paper">{value as string}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="md:col-span-2 space-y-6">
                                    {result.steps.map((step: any, i: number) => (
                                        <RevealWrapper key={i} delay={i * 0.1}>
                                            <div className="flex gap-6 p-6 rounded-xl border border-border bg-card group hover:border-amber transition-colors">
                                                <div className="w-10 h-10 rounded-full bg-surface border border-border shrink-0 flex items-center justify-center font-mono text-amber font-bold">
                                                    {step.num}
                                                </div>
                                                <div>
                                                    <h4 className="font-syne font-bold text-lg text-paper mb-2">{step.title}</h4>
                                                    <p className="font-syne text-sm text-muted leading-relaxed mb-3">{step.instruction}</p>
                                                    <span className="font-mono text-[0.65rem] uppercase tracking-widest text-amber/70 bg-surface px-2 py-1 rounded">
                                                        {step.time}
                                                    </span>
                                                </div>
                                            </div>
                                        </RevealWrapper>
                                    ))}

                                    <RevealWrapper delay={0.6}>
                                        <div className="p-8 rounded-xl bg-sage/10 border border-sage/30 mt-8">
                                            <h4 className="font-syne font-bold text-sage mb-2">Plating & Presentation</h4>
                                            <p className="font-instrument italic text-paper/80">{result.plating}</p>
                                        </div>
                                        <div className="p-8 rounded-xl bg-rust/10 border border-rust/30 mt-4">
                                            <h4 className="font-syne font-bold text-rust mb-2">Chef's Secret</h4>
                                            <p className="font-syne text-sm text-paper/80">{result.chefTip}</p>
                                        </div>
                                    </RevealWrapper>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {status === "error" && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6 bg-rust/10 border border-rust/30 rounded-xl text-rust font-mono text-sm max-w-3xl">
                            Failed to generate recipe. Please ensure you provided valid ingredients and try again.
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
            <Footer />
        </main>
    );
}
