"use client";

import React, { useState, useEffect } from "react";
import { useFirestoreCollection } from "@/hooks/useFirestore";
import { Clock, Lock } from "lucide-react";

export function SECRegulatoryCountdown() {
    const { data: controlData } = useFirestoreCollection("System_Status");
    const controlDoc = controlData.find(d => d.id === "control");

    // Default to 15 minutes from now if no update time is found in Kimi's payload
    // In a real scenario, this would parse 'next_expected_update' from the RCIA payload
    const targetTime = React.useMemo(() => {
        if (controlDoc?.next_expected_update) {
            try {
                const nextUpdate = new Date(controlDoc.next_expected_update).getTime();
                if (!isNaN(nextUpdate)) {
                    return nextUpdate;
                }
            } catch (e) {
                console.warn("Invalid next_expected_update format", e);
            }
        }

        // Fallback: Set a theoretical "Regulatory Cycle" aimed at :00, :15, :30, :45
        const now = new Date();
        const minutes = now.getMinutes();
        const nextQuarter = Math.ceil((minutes + 1) / 15) * 15;
        const target = new Date(now);
        target.setMinutes(nextQuarter);
        target.setSeconds(0);
        target.setMilliseconds(0);

        if (target.getTime() <= now.getTime()) {
            target.setMinutes(nextQuarter + 15);
        }
        return target.getTime();
    }, [controlDoc]);
    const [timeLeft, setTimeLeft] = useState<string>("CALCULATING...");

    useEffect(() => {
        if (!targetTime) return;

        const interval = setInterval(() => {
            const now = Date.now();
            const diff = targetTime - now;

            if (diff <= 0) {
                setTimeLeft("00:00:00");
                // Re-calculate or trigger payload fetch?
            } else {
                const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
                const minutes = Math.floor((diff / (1000 * 60)) % 60);
                const seconds = Math.floor((diff / 1000) % 60);

                const timeString = `${hours > 0 ? hours.toString().padStart(2, '0') + ':' : ''}${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
                setTimeLeft(timeString);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [targetTime]);

    return (
        <div className="bg-orange-950/20 border border-orange-500/20 rounded-2xl overflow-hidden backdrop-blur-sm flex flex-col h-full shadow-[0_0_15px_rgba(249,115,22,0.05)] relative group min-h-[220px]">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent opacity-50 pointer-events-none" />

            <div className="p-4 border-b border-orange-500/10 flex items-center justify-between relative z-10">
                <h3 className="font-bold flex items-center gap-2 uppercase tracking-wider text-sm text-orange-400">
                    <Lock className="w-4 h-4" />
                    SEC FILING WINDOW
                </h3>
                <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse shadow-[0_0_8px_rgba(249,115,22,0.8)]" />
            </div>

            <div className="flex-1 flex flex-col items-center justify-center p-6 relative z-10 space-y-4">
                <div className="text-center">
                    <p className="text-[10px] font-bold text-orange-500/60 uppercase tracking-[0.2em] mb-2">
                        NEXT REGULATORY CYCLE
                    </p>
                    <div className="font-mono text-4xl lg:text-5xl font-bold text-orange-100 tabular-nums tracking-tighter drop-shadow-[0_0_10px_rgba(249,115,22,0.3)]">
                        {timeLeft}
                    </div>
                </div>

                <div className="flex items-center gap-2 text-[10px] font-medium text-orange-400/80 bg-orange-500/10 px-3 py-1.5 rounded-full border border-orange-500/20">
                    <Clock className="w-3 h-3" />
                    <span>AWAITING KIMI PAYLOAD</span>
                </div>
            </div>
        </div>
    );
}
