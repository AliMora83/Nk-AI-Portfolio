"use client";

import { useState } from "react";
import { DemoHeader } from "@/components/DemoHeader";
import { motion, AnimatePresence } from "framer-motion";
import { CloudSun, Navigation, Shirt, ShieldAlert, Sparkles, ArrowUpRight } from "lucide-react";

type WeatherResult = {
    summary: string;
    feeling: string;
    outfit: string[];
    bring: string[];
    activities: { great: string[]; avoid: string[] };
    alerts: string[];
    bestTime: string;
    mood: string;
};

export default function WeatherAdvisor() {
    const [city, setCity] = useState("");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<WeatherResult | null>(null);
    const [weatherData, setWeatherData] = useState<{ temp: number, loc: string } | null>(null);
    const [status, setStatus] = useState("");

    async function handleWeather(e: React.FormEvent) {
        e.preventDefault();
        if (!city) return;

        setLoading(true);
        setResult(null);
        setStatus("Finding city coordinates...");

        try {
            // 1. Get Lat/Lng
            const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}`);
            const geoData = await geoRes.json();

            if (!geoData.results || geoData.results.length === 0) {
                alert("City not found.");
                setLoading(false);
                return;
            }

            const { latitude, longitude, name, country } = geoData.results[0];
            setStatus("Fetching weather constraints...");

            // 2. Get Weather Data
            const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&hourly=temperature_2m,precipitation_probability,windspeed_10m`);
            const weatherRaw = await weatherRes.json();

            const temp = weatherRaw.current_weather.temperature;
            const wind = weatherRaw.current_weather.windspeed;
            const conditionCode = weatherRaw.current_weather.weathercode; // Need a map to text ideally, but we'll let Gemini interpret it broadly or just pass the code if simple.
            // We will just pass the numbers and let Gemini evaluate the impact. 
            const highestRainProb = Math.max(...(weatherRaw.hourly?.precipitation_probability?.slice(0, 24) || [0]));

            setWeatherData({ temp, loc: `${name}, ${country}` });
            setStatus("Gemini interpreting conditions...");

            // 3. Ask Gemini
            const prompt = `Current weather data for ${name}, ${country}: Temperature: ${temp}°C, Wind: ${wind}km/h, Max rain probability today: ${highestRainProb}%. Weather code (WMO): ${conditionCode}.

Give practical advice for someone spending the day in ${name}. Return ONLY valid JSON:
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

    return (
        <main className="min-h-screen bg-bg pb-20">
            <DemoHeader title="AI Weather Advisor" />

            <div className="max-w-5xl mx-auto px-6 py-20">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-rust/10 text-rust mb-6">
                        <CloudSun size={32} />
                    </div>
                    <h1 className="text-5xl font-syne font-bold text-paper mb-4">Weather Advisor</h1>
                    <p className="font-mono text-sm text-muted max-w-xl mx-auto uppercase tracking-widest leading-relaxed">
                        Not just the temperature. Gemini interprets today&apos;s conditions to tell you what to wear, bring, and plan.
                    </p>
                </div>

                <form onSubmit={handleWeather} className="flex flex-col sm:flex-row gap-4 mb-20 max-w-xl mx-auto">
                    <input
                        type="text"
                        required
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="E.g., Cape Town, London, Tokyo..."
                        className="flex-1 bg-surface border border-border p-4 rounded-sm font-syne text-lg text-paper focus:outline-none focus:border-rust transition-colors"
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-rust text-paper px-8 py-4 rounded-sm font-syne font-bold hover:bg-amber transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {loading ? <span className="animate-spin text-xl">◌</span> : <><Navigation size={20} /> Analyze</>}
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
                            <div className="text-amber animate-spin-slow mb-6 inline-block">
                                <CloudSun size={48} />
                            </div>
                            <p className="font-mono text-xs uppercase tracking-widest text-muted">{status}</p>
                        </motion.div>
                    )}

                    {result && weatherData && !loading && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <div className="text-center mb-12">
                                <span className="font-mono text-[10px] uppercase tracking-widest text-rust px-3 py-1 bg-rust/10 rounded-full mb-4 inline-block">
                                    {weatherData.loc}
                                </span>
                                <div className="text-[120px] font-syne font-black leading-none text-paper tracking-tighter mb-4">
                                    {weatherData.temp}°
                                </div>
                                <div className="text-2xl font-instrument italic text-amber">{result.feeling}</div>
                            </div>

                            {result.alerts.length > 0 && result.alerts[0] !== "" && (
                                <div className="bg-rust/10 border border-rust/30 p-4 rounded-sm mb-12 flex items-start gap-3 max-w-2xl mx-auto">
                                    <ShieldAlert className="text-rust shrink-0 mt-1" size={20} />
                                    <div>
                                        <h4 className="font-mono text-[10px] uppercase tracking-widest text-rust mb-1">Weather Alert</h4>
                                        <p className="font-syne text-sm text-paper">{result.alerts[0]}</p>
                                    </div>
                                </div>
                            )}

                            <div className="grid md:grid-cols-[1fr_2fr] gap-8">
                                {/* Visual Cards */}
                                <div className="space-y-6">
                                    <div className="bg-surface border border-border p-6 rounded-sm">
                                        <h3 className="font-mono text-xs uppercase tracking-widest text-amber mb-4 flex items-center gap-2">
                                            <Shirt size={16} /> Outfit Protocol
                                        </h3>
                                        <ul className="space-y-3">
                                            {result.outfit.map((item, i) => (
                                                <li key={i} className="font-syne text-paper flex items-center gap-3 text-sm">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-border" /> {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div className="bg-surface border border-border p-6 rounded-sm">
                                        <h3 className="font-mono text-xs uppercase tracking-widest text-amber mb-4 flex items-center gap-2">
                                            <Sparkles size={16} /> Bring With You
                                        </h3>
                                        <div className="flex flex-wrap gap-2">
                                            {result.bring.map((item, i) => (
                                                <span key={i} className="bg-bg border border-border px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest text-muted rounded-sm">
                                                    {item}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Advice Cards */}
                                <div className="space-y-6">
                                    <div className="bg-surface border border-border p-8 rounded-sm h-full flex flex-col justify-center">
                                        <p className="font-syne text-xl text-paper leading-relaxed border-l-2 border-rust pl-6 mb-8">
                                            {result.summary}
                                        </p>
                                        <div className="grid sm:grid-cols-2 gap-8 pt-8 border-t border-border/50">
                                            <div>
                                                <h4 className="font-mono text-[10px] uppercase tracking-widest text-sage mb-3">Great For</h4>
                                                <ul className="space-y-2">
                                                    {result.activities.great.map((act, i) => (
                                                        <li key={i} className="font-syne text-sm text-muted line-clamp-1">{act}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                            <div>
                                                <h4 className="font-mono text-[10px] uppercase tracking-widest text-rust mb-3">Avoid</h4>
                                                <ul className="space-y-2">
                                                    {result.activities.avoid.map((act, i) => (
                                                        <li key={i} className="font-syne text-sm text-muted line-clamp-1">{act}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
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
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </main>
    );
}
