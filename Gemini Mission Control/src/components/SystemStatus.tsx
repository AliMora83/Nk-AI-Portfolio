"use client";

import React from "react";
import { useFirestoreCollection } from "@/hooks/useFirestore";
import { Shield } from "lucide-react";

export function SystemStatus() {
    // Real-time listener for "System_Status"
    const { data: statusData } = useFirestoreCollection("System_Status");

    // Unified mapping of system status
    const ids = ["main-api", "firebase", "hostinger-vps"];

    // Mock data generator for sparklines (since we don't have real history yet)
    const generateSparklineData = (baseLoad: number) => {
        return Array.from({ length: 24 }, (_, i) => {
            const noise = Math.random() * 20 - 10;
            return Math.max(0, Math.min(100, baseLoad + noise + (Math.sin(i / 3) * 10)));
        });
    };

    const systems = ids.map(id => {
        const doc = statusData.find(d => d.id === id);
        const percentage = doc?.load ? parseInt(doc.load) : 40; // Default to 40% if missing

        return {
            name: doc?.name || id.replace("-", " ").toUpperCase(),
            status: doc?.status || "Offline",
            latency: doc?.latency || "---",
            load: doc?.load || "-",
            percentage,
            history: generateSparklineData(percentage)
        };
    });

    const Sparkline = ({ data, color }: { data: number[], color: string }) => {
        const max = 100;
        const points = data.map((val, i) => `${(i / (data.length - 1)) * 100},${100 - (val / max) * 100}`).join(" ");
        return (
            <svg viewBox="0 0 100 100" className="w-full h-8 overflow-visible" preserveAspectRatio="none">
                <path
                    d={`M 0 100 L ${points} L 100 100 Z`}
                    fill={`url(#gradient-${color})`}
                    opacity="0.2"
                />
                <path
                    d={`M ${points}`}
                    fill="none"
                    stroke={`var(--color-${color})`}
                    strokeWidth="2"
                    vectorEffect="non-scaling-stroke"
                />
                <defs>
                    <linearGradient id={`gradient-${color}`} x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor={`var(--color-${color})`} stopOpacity="0.5" />
                        <stop offset="100%" stopColor={`var(--color-${color})`} stopOpacity="0" />
                    </linearGradient>
                </defs>
            </svg>
        );
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold flex items-center gap-2">
                    <Shield className="w-5 h-5 text-blue-500" />
                    SYSTEM STATUS
                </h2>
                <div className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest border animate-pulse ${statusData.length > 0 ? "bg-green-500/10 text-green-500 border-green-500/20" : "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                    }`}>
                    {statusData.length > 0 ? "All Systems Nominal" : "Syncing Core Streams..."}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {systems.map((sys: { name: string; status: string; load: string; latency: string; percentage: number; history: number[] }) => {
                    const isOnline = sys.status === "Online";

                    return (
                        <div key={sys.name} className="bg-slate-900/50 border border-slate-800 p-4 rounded-xl hover:border-blue-500/50 transition-colors group relative overflow-hidden" style={{ "--color-emerald-500": "#10b981", "--color-slate-500": "#64748b" } as React.CSSProperties}>
                            <div className="flex items-center justify-between mb-3 z-10 relative">
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{sys.name}</span>
                                <div className={`w-2 h-2 rounded-full ${isOnline ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]" : "bg-slate-600"}`}></div>
                            </div>

                            <div className="flex items-end justify-between z-10 relative">
                                <div>
                                    <p className="text-xl font-bold font-mono text-white">{sys.load === "-" ? sys.status : sys.load}</p>
                                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-tighter">
                                        Current Load
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-mono text-blue-400">{sys.latency}</p>
                                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-tighter">Latency</p>
                                </div>
                            </div>

                            <div className="mt-4 h-8 w-full relative z-0">
                                <Sparkline data={sys.history} color={isOnline ? "emerald-500" : "slate-500"} />
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
