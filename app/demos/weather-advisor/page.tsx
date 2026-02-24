"use client";

import { useState } from "react";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { RevealWrapper } from "@/components/ui/RevealWrapper";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Loader2, ArrowLeft, CloudRain, Sun, Wind, Umbrella, MapPin, Calendar, Check, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function WeatherAdvisor() {
    const [city, setCity] = useState("");
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [result, setResult] = useState<any>(null);
    const [weatherData, setWeatherData] = useState<any>(null);

    const getWeatherCodeText = (code: number) => {
        if (code === 0) return "Clear sky";
        if (code <= 3) return "Partly cloudy";
        if (code <= 48) return "Foggy";
        if (code <= 57) return "Drizzle";
        if (code <= 67) return "Rain";
        if (code <= 77) return "Snow";
        if (code <= 82) return "Showers";
        if (code <= 86) return "Snow showers";
        if (code >= 95) return "Thunderstorm";
        return "Unknown";
    };

    const getAdvice = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!city) return;

        setStatus("loading");

        try {
            // 1. Get Lat/Lng
            const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}`);
            const geoData = await geoRes.json();

            if (!geoData.results || geoData.results.length === 0) {
                throw new Error("City not found");
            }

            const location = geoData.results[0];
            const { latitude, longitude, name, country } = location;

            // 2. Get Weather
            const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&hourly=precipitation_probability,relative_humidity_2m`);
            const weatherRaw = await weatherRes.json();

            const current = weatherRaw.current_weather;
            // Approximate humidity and rain from first hourly record for demo simplicity
            const humidity = weatherRaw.hourly.relative_humidity_2m[0];
            const rainProb = weatherRaw.hourly.precipitation_probability[0];
            const condition = getWeatherCodeText(current.weathercode);

            const parsedWeather = {
                city: `${name}, ${country}`,
                temp: current.temperature,
                condition,
                wind: current.windspeed,
                humidity,
                rainProb
            };

            setWeatherData(parsedWeather);

            // 3. Get Gemini Advice
            const prompt = `Current weather data for ${parsedWeather.city}: Temperature: ${current.temperature}°C, Condition: ${condition}, Wind: ${current.windspeed}km/h, Humidity: ${humidity}%, Rain probability: ${rainProb}%

Give practical, highly contextual advice for someone spending the day in ${parsedWeather.city}. Return ONLY valid JSON schema:
{
  "summary": "2-sentence plain English weather summary",
  "feeling": "what it actually feels like (not just the number)",
  "outfit": ["item 1", "item 2", "item 3"],
  "bring": ["item 1", "item 2"],
  "activities": { "great": ["activity 1","activity 2"], "avoid": ["activity 1"] },
  "alerts": ["any weather warning if relevant, else empty array"],
  "bestTime": "best time of day to be outdoors",
  "mood": "one word describing today's weather vibe"
}`;

            const res = await fetch("/api/gemini", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt, maxTokens: 1000 })
            });

            const geminiData = await res.json();
            if (geminiData.error) throw new Error(geminiData.error);

            const jsonMatch = geminiData.text.match(/\{[\s\S]*\}/);
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
                        Weather Advisor <CloudRain className="text-sage w-10 h-10 md:w-16 md:h-16" />
                    </h1>
                    <p className="font-mono text-muted max-w-2xl mb-12 leading-relaxed">
                        Not just the temperature. Gemini interprets today's conditions for your plans — what to wear, whether to reschedule, what to expect.
                    </p>
                </RevealWrapper>

                <RevealWrapper delay={0.1}>
                    <form onSubmit={getAdvice} className="flex flex-col sm:flex-row gap-4 max-w-xl mb-16 relative z-20">
                        <input
                            type="text"
                            required
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            placeholder="Enter city (e.g. Cape Town)"
                            className="flex-1 bg-surface border border-border rounded-lg px-6 py-4 text-paper font-syne focus:border-sage focus:outline-none transition-colors"
                            disabled={status === "loading"}
                        />
                        <button
                            type="submit"
                            disabled={status === "loading" || !city}
                            className="bg-sage border border-sage text-bg font-syne font-bold px-8 py-4 rounded-lg hover:bg-sage/90 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 disabled:opacity-70 disabled:hover:translate-y-0 flex items-center justify-center gap-2"
                        >
                            {status === "loading" ? <Loader2 className="animate-spin" /> : "Get Advice"}
                        </button>
                    </form>
                </RevealWrapper>

                <AnimatePresence mode="wait">
                    {status === "loading" && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="w-full max-w-2xl p-12 rounded-xl border border-border bg-surface flex flex-col items-center justify-center gap-6"
                        >
                            <Sun size={48} className="text-amber animate-spin-slow" />
                            <p className="font-mono text-xs text-sage uppercase tracking-widest animate-pulse">
                                Analyzing meteorological context...
                            </p>
                        </motion.div>
                    )}

                    {status === "success" && result && weatherData && (
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="w-full relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8"
                        >
                            {/* Left Column: Raw Weather */}
                            <div className="lg:col-span-4 space-y-6">
                                <div className="p-8 rounded-2xl border border-sage/30 bg-sage/5 relative overflow-hidden">
                                    <div className="absolute -top-4 -right-4 text-sage opacity-20">
                                        <Sun size={120} />
                                    </div>

                                    <div className="flex items-center gap-2 font-mono text-xs text-muted uppercase tracking-widest mb-8">
                                        <MapPin size={14} className="text-sage" /> {weatherData.city}
                                    </div>

                                    <h2 className="text-6xl font-syne font-bold text-paper mb-2 tracking-tighter">
                                        {weatherData.temp}°C
                                    </h2>
                                    <p className="font-mono text-sm text-sage uppercase tracking-widest mb-8">
                                        {weatherData.condition}
                                    </p>

                                    <div className="space-y-4 pt-6 border-t border-border">
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="font-mono text-muted uppercase tracking-widest">Feels Like</span>
                                            <span className="font-syne text-paper font-bold">{result.feeling}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="font-mono text-muted uppercase tracking-widest flex items-center gap-1"><Wind size={14} /> Wind</span>
                                            <span className="font-syne text-paper font-bold">{weatherData.wind} km/h</span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="font-mono text-muted uppercase tracking-widest flex items-center gap-1"><Umbrella size={14} /> Rain</span>
                                            <span className="font-syne text-paper font-bold">{weatherData.rainProb}%</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-6 rounded-2xl border border-border bg-card">
                                    <h3 className="font-syne font-bold text-sm text-muted uppercase tracking-widest mb-2 flex items-center gap-2">
                                        <Calendar size={14} /> Best Time Outdoors
                                    </h3>
                                    <p className="font-syne text-paper text-lg border-l-2 border-sage pl-3">
                                        {result.bestTime}
                                    </p>
                                </div>
                            </div>

                            {/* Right Column: Gemini Advice */}
                            <div className="lg:col-span-8 flex flex-col gap-6">
                                {result.alerts?.length > 0 && result.alerts[0] !== "" && (
                                    <div className="p-6 rounded-2xl border border-rust/30 bg-rust/5 flex items-start gap-4">
                                        <AlertTriangle className="text-rust shrink-0 mt-1" />
                                        <div>
                                            <h4 className="font-syne font-bold text-rust mb-1">Weather Alert</h4>
                                            <ul className="list-disc pl-4 space-y-1">
                                                {result.alerts.map((a: string, i: number) => (
                                                    <li key={i} className="font-syne text-sm text-paper/90">{a}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                )}

                                <div className="p-8 md:p-10 rounded-2xl border border-border bg-surface flex flex-col gap-8">
                                    <div>
                                        <span className="inline-block px-3 py-1 bg-card border border-border rounded-full font-mono text-[0.6rem] uppercase tracking-widest text-muted mb-4">Vibe: {result.mood}</span>
                                        <p className="text-xl md:text-2xl font-syne text-paper leading-relaxed border-l-2 border-border pl-5">
                                            {result.summary}
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-border">
                                        <div>
                                            <h4 className="font-mono text-xs text-muted uppercase tracking-widest mb-6 border-b border-border/50 pb-2 flex items-center justify-between">
                                                Outfit <Check size={14} className="text-sage" />
                                            </h4>
                                            <ul className="space-y-4">
                                                {result.outfit.map((item: string, i: number) => (
                                                    <li key={i} className="flex gap-3 text-sm text-paper/80 font-syne"><span className="text-sage">•</span>{item}</li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div>
                                            <h4 className="font-mono text-xs text-muted uppercase tracking-widest mb-6 border-b border-border/50 pb-2 flex items-center justify-between">
                                                Must Bring <Umbrella size={14} className="text-sage" />
                                            </h4>
                                            <ul className="space-y-4">
                                                {result.bring.map((item: string, i: number) => (
                                                    <li key={i} className="flex gap-3 text-sm text-paper/80 font-syne"><span className="text-amber">•</span>{item}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="p-8 rounded-2xl border border-border bg-card">
                                        <h4 className="font-syne font-bold text-paper mb-4 flex justify-between items-center">
                                            Great Activities <span className="w-2 h-2 rounded-full bg-sage shadow-[0_0_10px_rgba(74,122,74,0.8)]" />
                                        </h4>
                                        <ul className="space-y-3">
                                            {result.activities.great.map((act: string, i: number) => (
                                                <li key={i} className="font-mono text-xs text-muted bg-surface rounded p-3 border border-border/50">{act}</li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="p-8 rounded-2xl border border-border bg-card">
                                        <h4 className="font-syne font-bold text-paper mb-4 flex justify-between items-center">
                                            Avoid Today <span className="w-2 h-2 rounded-full bg-rust shadow-[0_0_10px_rgba(184,74,47,0.8)]" />
                                        </h4>
                                        <ul className="space-y-3">
                                            {result.activities.avoid.map((act: string, i: number) => (
                                                <li key={i} className="font-mono text-xs text-muted bg-surface rounded p-3 border border-border/50">{act}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {status === "error" && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6 bg-rust/10 border border-rust/30 rounded-xl text-rust font-mono text-sm max-w-xl">
                            Failed to get weather advice. Please check the city name and try again.
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
            <Footer />
        </main>
    );
}
