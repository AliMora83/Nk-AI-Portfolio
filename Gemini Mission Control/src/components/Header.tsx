"use client";

import React from "react";
import { Search, Bell, User, Clock } from "lucide-react";

export function Header() {
    const [time, setTime] = React.useState<Date | null>(null);

    React.useEffect(() => {
        setTime(new Date());
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <header className="h-16 border-b border-slate-800 bg-[--background]/50 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-10">
            <div className="flex items-center gap-4 flex-1">
                <div className="relative w-96 max-w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                        type="text"
                        placeholder="Search systems, agents, or logs..."
                        className="w-full bg-slate-900/50 border border-slate-800 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-slate-200 transition-all"
                    />
                </div>
            </div>

            <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 text-slate-400 font-mono text-sm border-r border-slate-800 pr-6">
                    <Clock className="w-4 h-4" />
                    <span suppressHydrationWarning>
                        {time ? time.toLocaleTimeString([], { hour12: false }) : "--:--:--"}
                    </span>
                </div>

                <div className="flex items-center gap-4">
                    <button className="relative p-2 text-slate-400 hover:text-white transition-colors">
                        <Bell className="w-5 h-5" />
                        <span className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full border-2 border-slate-950"></span>
                    </button>

                    <div className="flex items-center gap-3 pl-2 border-l border-slate-800">
                        <div className="text-right hidden sm:block">
                            <p className="text-xs font-bold text-white uppercase tracking-wider">Founder</p>
                            <p className="text-[10px] text-blue-400 font-mono">LEVEL 7 CLEARANCE</p>
                        </div>
                        <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold border border-blue-400/20">
                            <User className="w-5 h-5" />
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
