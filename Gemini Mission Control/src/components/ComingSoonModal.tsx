"use client";

import React from "react";
import { X, Lock } from "lucide-react";

interface ComingSoonModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
}

export function ComingSoonModal({ isOpen, onClose, title }: ComingSoonModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-300">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-8 relative overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-600/10 rounded-full blur-3xl"></div>

                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 text-slate-500 hover:text-white transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="text-center space-y-6">
                    <div className="w-16 h-16 bg-blue-600/10 rounded-2xl flex items-center justify-center mx-auto border border-blue-500/20">
                        <Lock className="w-8 h-8 text-blue-500" />
                    </div>

                    <div>
                        <h2 className="text-2xl font-bold text-white uppercase tracking-tight">{title}</h2>
                        <p className="text-xs font-bold text-blue-400 mt-2 uppercase tracking-[0.2em] font-mono">Coming Soon</p>
                    </div>

                    <p className="text-slate-400 text-sm leading-relaxed">
                        This module is currently being optimized for the V1.0.5 pivot. Kimi K2.5 strategy integration is in progress.
                    </p>

                    <button
                        onClick={onClose}
                        className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition-all"
                    >
                        DISMISS
                    </button>
                </div>
            </div>
        </div>
    );
}
