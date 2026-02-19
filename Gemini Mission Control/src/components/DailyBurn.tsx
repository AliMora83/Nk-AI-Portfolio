"use client";

import React from "react";
import { useFirestoreCollection } from "@/hooks/useFirestore";
import { DollarSign, TrendingUp, AlertCircle } from "lucide-react";

export function DailyBurn() {
    const { data: ledgerData } = useFirestoreCollection("ledger");

    // Calculate total spend for today (mock logic for now, summing all entries)
    const dailyLimit = 10.00;
    const currentSpend = ledgerData.reduce((acc, curr) => acc + (curr.amount || 0), 0);
    const percentage = Math.min((currentSpend / dailyLimit) * 100, 100);

    const isCritical = currentSpend > dailyLimit * 0.8;

    return (
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl py-3 px-5 flex flex-col justify-between">
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-emerald-500" />
                        DAILY BURN
                    </h3>
                    {isCritical && (
                        <div className="flex items-center gap-1 text-[10px] font-bold text-red-500 animate-pulse">
                            <AlertCircle className="w-3 h-3" />
                            APPROACHING LIMIT
                        </div>
                    )}
                </div>

                <div className="space-y-1">
                    <p className="text-3xl font-bold text-white font-mono">
                        ${currentSpend.toFixed(2)}
                        <span className="text-sm text-slate-500 font-normal ml-2">/ ${dailyLimit.toFixed(2)}</span>
                    </p>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                        Total Cloud & API Spend (Today)
                    </p>
                </div>
            </div>

            <div className="mt-6 space-y-2">
                <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wide">
                    <span className="text-slate-400">Budget Consumed</span>
                    <span className={isCritical ? "text-red-500" : "text-emerald-500"}>{percentage.toFixed(1)}%</span>
                </div>
                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div
                        className={`h-full transition-all duration-1000 ${isCritical ? "bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]" : "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"}`}
                        style={{ width: `${percentage}%` }}
                    ></div>
                </div>
                <div className="flex items-center gap-2 text-[9px] text-slate-500 font-medium">
                    <TrendingUp className="w-3 h-3" />
                    Resetting in 18h 24m
                </div>
            </div>
        </div>
    );
}
