"use client";

import { motion } from "framer-motion";

export function ScoreRing({ score, label }: { score: number; label: string }) {
    const radius = 30;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (score / 100) * circumference;

    // Decide color based on score
    const color = score >= 80 ? "stroke-sage" : score >= 50 ? "stroke-amber" : "stroke-rust";

    return (
        <div className="flex flex-col items-center gap-3">
            <div className="relative w-20 h-20 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    {/* Background Ring */}
                    <circle
                        className="stroke-border"
                        strokeWidth="8"
                        fill="transparent"
                        r={radius}
                        cx="50"
                        cy="50"
                    />
                    {/* Progress Ring */}
                    <motion.circle
                        className={color}
                        strokeWidth="8"
                        fill="transparent"
                        r={radius}
                        cx="50"
                        cy="50"
                        strokeLinecap="round"
                        initial={{ strokeDashoffset: circumference }}
                        animate={{ strokeDashoffset }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        style={{ strokeDasharray: circumference }}
                    />
                </svg>
                <div className="absolute font-syne font-bold text-xl text-paper">
                    {score}
                </div>
            </div>
            <span className="font-mono text-[0.6rem] text-muted uppercase tracking-widest text-center">
                {label}
            </span>
        </div>
    );
}
