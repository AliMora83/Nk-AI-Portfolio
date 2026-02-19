"use client";

import React, { useEffect, useState } from "react";
import { useFirestoreCollection } from "@/hooks/useFirestore";
import { ShieldAlert, Lock, Zap } from "lucide-react";

export function FreezeGuard({ children }: { children: React.ReactNode }) {
    const { data: systemData } = useFirestoreCollection("System_Status");
    const [isFrozen, setIsFrozen] = useState(false);

    useEffect(() => {
        const coreStatus = systemData.find(d => d.id === "core");
        if (coreStatus?.freeze === true) {
            setIsFrozen(true);
        }
    }, [systemData]);

    if (isFrozen) {
        return (
            <div className="fixed inset-0 z-[100] bg-slate-950 flex items-center justify-center p-6 text-center">
                <div className="max-w-md w-full space-y-8 animate-in fade-in zoom-in duration-500">
                    <div className="relative inline-block">
                        <div className="absolute inset-0 bg-red-600 blur-3xl opacity-20 animate-pulse"></div>
                        <div className="w-24 h-24 bg-red-600/10 border border-red-500/50 rounded-3xl flex items-center justify-center relative">
                            <ShieldAlert className="w-12 h-12 text-red-500" />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h1 className="text-4xl font-black text-white tracking-tight uppercase">System Frozen</h1>
                        <div className="h-1 w-20 bg-red-600 mx-auto rounded-full"></div>
                        <p className="text-slate-400 font-medium leading-relaxed">
                            The Mission Control "Hard Break" has been triggered. All local sessions have been wiped and infrastructure access is currently locked.
                        </p>
                    </div>

                    <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl space-y-4 text-left">
                        <div className="flex items-center gap-3 text-red-400">
                            <Lock className="w-4 h-4" />
                            <span className="text-[10px] font-bold uppercase tracking-widest">Security Protocol 404-X</span>
                        </div>
                        <p className="text-xs text-slate-500 font-mono">
                            [00:41:39] API keys: REVOKED<br />
                            [00:41:40] Databases: LOCKED<br />
                            [00:41:41] Session Cache: WIPED
                        </p>
                    </div>

                    <button
                        onClick={() => window.location.reload()}
                        className="group flex items-center gap-2 mx-auto text-slate-500 hover:text-white transition-colors"
                    >
                        <Zap className="w-4 h-4 group-hover:animate-bounce" />
                        <span className="text-xs font-bold uppercase tracking-widest">Re-authenticate System</span>
                    </button>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}
