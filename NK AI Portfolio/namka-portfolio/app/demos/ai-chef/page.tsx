"use client";

import { useState } from "react";
import { DemoHeader } from "@/components/DemoHeader";
import { motion, AnimatePresence } from "framer-motion";
import { ChefHat, Clock, Utensils, Flame, ArrowUpRight } from "lucide-react";

type RecipeResult = {
    dishName: string;
    cuisine: string;
    difficulty: "Easy" | "Medium" | "Hard";
    prepTime: string;
    cookTime: string;
    servings: number;
    story: string;
    ingredients: { item: string; amount: string; note: string }[];
    steps: { num: number; title: string; instruction: string; time: string }[];
    nutrition: { calories: string; protein: string; carbs: string; fat: string };
    plating: string;
    chefTip: string;
};

export default function AiChef() {
    const [ingredients, setIngredients] = useState("");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<RecipeResult | null>(null);

    async function handleCooking(e: React.FormEvent) {
        e.preventDefault();
        if (!ingredients) return;

        setLoading(true);
        setResult(null);

        try {
            const prompt = `You are a creative chef AI. The user has these ingredients: ${ingredients}

Generate a recipe. Return ONLY valid JSON:
{
  "dishName": "...",
  "cuisine": "...",
  "difficulty": "Easy|Medium|Hard",
  "prepTime": "X mins",
  "cookTime": "X mins",
  "servings": X,
  "story": "1 sentence about this dish",
  "ingredients": [{"item":"...","amount":"...","note":"..."}],
  "steps": [{"num":1,"title":"...","instruction":"...","time":"X mins"}],
  "nutrition": {"calories":"~X","protein":"Xg","carbs":"Xg","fat":"Xg"},
  "plating": "How to plate this beautifully",
  "chefTip": "One professional secret for this dish"
}`;

            const res = await fetch("/api/gemini", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt, maxTokens: 1500 })
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
                    alert("Gemini returned malformed data. Try again.");
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

    return (
        <main className="min-h-screen bg-bg pb-20">
            <DemoHeader title="AI Chef" />

            <div className="max-w-4xl mx-auto px-6 py-20">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-rust/10 text-rust mb-6">
                        <ChefHat size={32} />
                    </div>
                    <h1 className="text-5xl font-syne font-bold text-paper mb-4">AI Chef</h1>
                    <p className="font-mono text-sm text-muted max-w-xl mx-auto uppercase tracking-widest leading-relaxed">
                        Input what you have. Gemini devises a recipe you wouldn&apos;t have thought of.
                    </p>
                </div>

                <form onSubmit={handleCooking} className="flex flex-col gap-4 mb-20 max-w-2xl mx-auto">
                    <textarea
                        required
                        rows={3}
                        value={ingredients}
                        onChange={(e) => setIngredients(e.target.value)}
                        placeholder="E.g., Chicken breast, half an onion, some old carrots, soy sauce, rice..."
                        className="w-full bg-surface border border-border p-4 rounded-sm font-mono text-sm text-paper focus:outline-none focus:border-rust transition-colors resize-none"
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-rust text-paper px-8 py-4 rounded-sm font-syne font-bold hover:bg-amber transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {loading ? <span className="animate-spin text-xl">◌</span> : <><Utensils size={20} /> Generate Recipe</>}
                    </button>
                </form>

                <AnimatePresence>
                    {loading && !result && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="text-center py-20"
                        >
                            <div className="text-amber animate-pulse mb-8">
                                <ChefHat size={48} className="mx-auto" />
                            </div>
                            <p className="font-mono text-xs uppercase tracking-widest text-muted">Thinking like a Michelin Star Chef...</p>
                        </motion.div>
                    )}

                    {result && !loading && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-surface border border-border rounded-sm overflow-hidden"
                        >
                            {/* Recipe Header */}
                            <div className="p-8 md:p-12 border-b border-border relative">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-amber/5 rounded-bl-full pointer-events-none" />
                                <span className="font-mono text-xs uppercase tracking-widest text-rust mb-4 block">
                                    {result.cuisine} Cuisine
                                </span>
                                <h2 className="text-4xl font-syne font-bold text-paper mb-4">{result.dishName}</h2>
                                <p className="text-muted font-instrument italic text-xl mb-8">{result.story}</p>

                                <div className="flex flex-wrap gap-6 font-mono text-xs uppercase tracking-widest text-muted">
                                    <div className="flex items-center gap-2">
                                        <Clock size={16} className="text-amber" /> Prep: {result.prepTime}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Flame size={16} className="text-rust" /> Cook: {result.cookTime}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Utensils size={16} className="text-sage" /> Serves: {result.servings}
                                    </div>
                                    <div className="px-3 py-1 rounded-full border border-border">
                                        {result.difficulty}
                                    </div>
                                </div>
                            </div>

                            <div className="p-8 md:p-12 grid md:grid-cols-[1fr_2fr] gap-12">
                                {/* Ingredients & Nutrition Sidebar */}
                                <div className="space-y-12">
                                    <div>
                                        <h3 className="font-syne text-xl font-bold text-paper mb-6 flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full bg-rust" /> Ingredients
                                        </h3>
                                        <ul className="space-y-4">
                                            {result.ingredients.map((ing, i) => (
                                                <li key={i} className="flex justify-between items-end border-b border-border/50 pb-2">
                                                    <span className="font-syne text-paper">{ing.item} {ing.note && <span className="text-xs text-muted block">{ing.note}</span>}</span>
                                                    <span className="font-mono text-xs text-amber text-right shrink-0">{ing.amount}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div>
                                        <h3 className="font-syne text-xl font-bold text-paper mb-6 flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full bg-sage" /> Nutrition
                                        </h3>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="bg-bg p-4 rounded-sm border border-border/50 text-center">
                                                <span className="block font-syne text-2xl font-bold text-paper mb-1">{result.nutrition.calories}</span>
                                                <span className="font-mono text-[10px] uppercase text-muted tracking-widest">Calories</span>
                                            </div>
                                            <div className="bg-bg p-4 rounded-sm border border-border/50 text-center">
                                                <span className="block font-syne text-2xl font-bold text-paper mb-1">{result.nutrition.protein}</span>
                                                <span className="font-mono text-[10px] uppercase text-muted tracking-widest">Protein</span>
                                            </div>
                                            <div className="bg-bg p-4 rounded-sm border border-border/50 text-center">
                                                <span className="block font-syne text-2xl font-bold text-paper mb-1">{result.nutrition.carbs}</span>
                                                <span className="font-mono text-[10px] uppercase text-muted tracking-widest">Carbs</span>
                                            </div>
                                            <div className="bg-bg p-4 rounded-sm border border-border/50 text-center">
                                                <span className="block font-syne text-2xl font-bold text-paper mb-1">{result.nutrition.fat}</span>
                                                <span className="font-mono text-[10px] uppercase text-muted tracking-widest">Fat</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Steps */}
                                <div>
                                    <p className="font-syne text-sm text-muted leading-relaxed">
                                        You provided simple ingredients, and AI orchestrated a complete dish. This is how we approach development&mdash;taking basic constraints and engineering them into something exceptionally cohesive.
                                    </p>
                                    <p className="font-syne text-sm text-muted mt-4">
                                        &quot;Creativity isn&apos;t just about invention; it&apos;s about assembly.&quot;
                                    </p>
                                    <div className="space-y-8">
                                        {result.steps.map((step, i) => (
                                            <motion.div
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: i * 0.1 }}
                                                key={step.num}
                                                className="flex gap-6"
                                            >
                                                <div className="shrink-0 flex items-center justify-center w-8 h-8 rounded-full border border-border font-mono text-xs text-amber font-bold">
                                                    {step.num}
                                                </div>
                                                <div>
                                                    <h4 className="font-syne font-bold text-paper mb-2">{step.title} <span className="font-mono text-[10px] text-muted tracking-widest ml-2 uppercase">— {step.time}</span></h4>
                                                    <p className="text-muted leading-relaxed font-syne">{step.instruction}</p>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>

                                    <div className="mt-12 bg-amber/5 border border-amber/20 p-6 rounded-sm">
                                        <h4 className="font-mono text-xs uppercase tracking-widest text-amber mb-2">Chef&apos;s Secret</h4>
                                        <p className="font-syne text-md text-paper italic">&quot;{result.chefTip}&quot;</p>
                                    </div>

                                    <div className="mt-6 bg-border/20 border border-border p-6 rounded-sm">
                                        <h4 className="font-mono text-xs uppercase tracking-widest text-muted mb-2">Plating Suggestion</h4>
                                        <p className="font-syne text-md text-paper">{result.plating}</p>
                                    </div>

                                    <div className="flex flex-col sm:flex-row gap-4 items-center justify-end mt-12 pt-8 border-t border-border">
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
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </main>
    );
}
