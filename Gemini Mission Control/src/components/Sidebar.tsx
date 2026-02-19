"use client";

import React, { useState } from "react";
import {
    LayoutDashboard,
    Users,
    Settings,
    Zap,
    ShieldAlert,
    Thermometer,
    Cpu,
    X
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useFirestoreCollection } from "@/hooks/useFirestore";
import { OrangeProtocolModal } from "./OrangeLevelModal";
import { useUI } from "@/context/UIContext";

const navItems = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Agents", href: "/agents", icon: Users },
    { name: "Projects", href: "/infrastructure", icon: Cpu },
    { name: "Settings", href: "/settings", icon: Settings },
];

const standbyItems = [
    { name: "Kill-Switch", href: "/kill-switch", icon: ShieldAlert, variant: "danger" },
];

export function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const { openComingSoon } = useUI();
    const [orangeProtocolOpen, setOrangeProtocolOpen] = useState(false);

    const { data: systemData } = useFirestoreCollection("System_Status");

    // Removed unused thermalData
    // Removed unused temp and tempPercentage

    const { data: ledgerData } = useFirestoreCollection("ledger");
    const dailyLimit = 10.00;
    const currentSpend = ledgerData.reduce((acc, curr) => acc + (curr.amount || 0), 0);
    const isBudgetCritical = currentSpend > dailyLimit * 0.8;

    return (
        <aside className="w-64 bg-[--background] border-r border-slate-800 flex flex-col h-screen sticky top-0 font-mono z-20">
            <div className="p-6 border-b border-slate-800">
                <div className="flex items-center gap-3 mb-1">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                        <Zap className="w-5 h-5 text-white" />
                    </div>
                    <h1 className="font-bold text-lg leading-tight tracking-tight text-white">
                        NAMKA MISSION<br />CONTROL
                    </h1>
                </div>
            </div>

            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                <div className="mb-6">
                    <p className="px-4 text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">Main Navigation</p>
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        const isComingSoon = ["/agents", "/infrastructure", "/settings"].includes(item.href);

                        return (
                            <button
                                key={item.name}
                                onClick={() => {
                                    if (isComingSoon) {
                                        openComingSoon(item.name);
                                    } else {
                                        router.push(item.href);
                                    }
                                }}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive
                                    ? "bg-blue-600/10 text-blue-400 border border-blue-600/20 shadow-[0_0_15px_-3px_rgba(37,99,235,0.3)]"
                                    : "text-slate-400 hover:bg-slate-800/50 hover:text-white border border-transparent"
                                    }`}
                            >
                                <item.icon className={`w-5 h-5 ${isActive ? "text-blue-400" : "text-slate-500 group-hover:text-white"}`} />
                                <span className="font-medium">{item.name}</span>
                            </button>
                        );
                    })}
                </div>

                <div>
                    <p className="px-4 text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">Standby Mode</p>
                    {standbyItems.map((item) => {
                        // Removed unused isActive
                        return (
                            <button
                                key={item.name}
                                onClick={() => setOrangeProtocolOpen(true)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isBudgetCritical ? (
                                    "bg-red-900/20 text-red-500 border border-red-500/30 animate-pulse shadow-[0_0_15px_-3px_rgba(239,68,68,0.3)]"
                                ) : (
                                    "text-slate-500 hover:bg-slate-800/50 hover:text-slate-300 border border-transparent"
                                )
                                    }`}
                            >
                                <item.icon className={`w-5 h-5 ${isBudgetCritical ? "text-red-500 animate-pulse" : "text-slate-600 group-hover:text-slate-400"}`} />
                                <span className="font-medium">
                                    {isBudgetCritical ? "ORANGE ACTIVE" : item.name}
                                </span>
                            </button>
                        );
                    })}
                </div>

                <div className="mt-8 pt-4 border-t border-slate-800/50">
                    {/* TaskBacklog removed in V1.0.27 */}
                </div>
            </nav>

            <div className="p-4 border-t border-slate-800 bg-slate-900/30">
                <div className="bg-slate-950 rounded-lg p-3 border border-slate-800">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2 text-orange-400">
                            <Thermometer className="w-4 h-4" />
                            <span className="text-xs font-bold">CPU TEMP</span>
                        </div>
                        <span className="text-xs font-mono text-orange-400">{Math.round(49)}°C</span>
                    </div>
                    <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                        <div
                            className="bg-gradient-to-r from-orange-500 to-red-500 h-full rounded-full transition-all duration-500"
                            style={{ width: `${(49 / 85) * 100}%` }}
                        />
                    </div>
                    {49 > 80 && (
                        <div className="mt-2 text-[10px] text-red-400 flex items-center gap-1 bg-red-950/30 px-2 py-1 rounded border border-red-900/50">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                            CRITICAL THERMAL LEVEL
                        </div>
                    )}
                    <div className="mt-2 flex items-center justify-between">
                        <div className="flex items-center gap-2 bg-red-500/10 px-2 py-1 rounded border border-red-500/20 hover:bg-red-500/20 cursor-pointer transition-colors">
                            <div className="w-4 h-4 rounded-full bg-red-500 flex items-center justify-center text-[10px] font-bold text-white shadow-lg animate-pulse">!</div>
                            <span className="text-[10px] font-medium text-red-200">1 Issue</span>
                            <X className="w-3 h-3 text-red-400 ml-1 hover:text-red-200" />
                        </div>
                    </div>
                </div>
            </div>

            <OrangeProtocolModal
                isOpen={orangeProtocolOpen}
                onClose={() => setOrangeProtocolOpen(false)}
            />
        </aside>
    );
}
