"use client";

import React from "react";
import { X, ShieldAlert, Wifi, Database, Server, Power } from "lucide-react";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

interface OrangeProtocolModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function OrangeProtocolModal({ isOpen, onClose }: OrangeProtocolModalProps) {
    const [states, setStates] = React.useState({
        api: true,
        firebase: true,
        vps: true
    });

    React.useEffect(() => {
        async function fetchProtocol() {
            const docRef = doc(db, "config", "orange_protocol");
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setStates(docSnap.data() as any);
            }
        }
        if (isOpen) fetchProtocol();
    }, [isOpen]);

    const toggle = async (key: keyof typeof states) => {
        const newState = { ...states, [key]: !states[key] };
        setStates(newState);
        await setDoc(doc(db, "config", "orange_protocol"), newState, { merge: true });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-orange-950/95 backdrop-blur-xl animate-in fade-in duration-500">
            <div className="w-full max-w-4xl p-12 space-y-12">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <div className="w-20 h-20 bg-orange-600 rounded-3xl flex items-center justify-center shadow-[0_0_50px_rgba(234,88,12,0.5)] animate-pulse">
                            <ShieldAlert className="w-10 h-10 text-white" />
                        </div>
                        <div>
                            <h1 className="text-5xl font-black text-white uppercase tracking-tighter">Orange Level</h1>
                            <p className="text-orange-400 font-mono font-bold tracking-[0.3em] uppercase mt-2">Emergency Protocol Standby</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-4 bg-orange-900/50 rounded-2xl text-orange-400 hover:text-white transition-all border border-orange-800/50"
                    >
                        <X className="w-8 h-8" />
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* API Toggle */}
                    <div className={`p-8 rounded-3xl border transition-all duration-500 ${states.api ? 'bg-orange-900/20 border-orange-500/30' : 'bg-red-600/20 border-red-500/50'}`}>
                        <Wifi className={`w-12 h-12 mb-6 ${states.api ? 'text-orange-400' : 'text-red-500'}`} />
                        <h3 className="text-2xl font-bold text-white mb-2">MAIN API</h3>
                        <p className="text-sm text-orange-200/50 mb-8">Access to primary gateway and data streams.</p>
                        <button
                            onClick={() => toggle('api')}
                            className={`w-full py-4 rounded-2xl font-black flex items-center justify-center gap-2 transition-all ${states.api ? 'bg-orange-500 text-white' : 'bg-red-600 text-white shadow-[0_0_30px_rgba(220,38,38,0.4)]'}`}
                        >
                            <Power className="w-5 h-5" />
                            {states.api ? 'ACTIVE' : 'SEVERED'}
                        </button>
                    </div>

                    {/* Firebase Toggle */}
                    <div className={`p-8 rounded-3xl border transition-all duration-500 ${states.firebase ? 'bg-orange-900/20 border-orange-500/30' : 'bg-red-600/20 border-red-500/50'}`}>
                        <Database className={`w-12 h-12 mb-6 ${states.firebase ? 'text-orange-400' : 'text-red-500'}`} />
                        <h3 className="text-2xl font-bold text-white mb-2">FIREBASE</h3>
                        <p className="text-sm text-orange-200/50 mb-8">Cloud database and authentication services.</p>
                        <button
                            onClick={() => toggle('firebase')}
                            className={`w-full py-4 rounded-2xl font-black flex items-center justify-center gap-2 transition-all ${states.firebase ? 'bg-orange-500 text-white' : 'bg-red-600 text-white shadow-[0_0_30px_rgba(220,38,38,0.4)]'}`}
                        >
                            <Power className="w-5 h-5" />
                            {states.firebase ? 'ACTIVE' : 'SEVERED'}
                        </button>
                    </div>

                    {/* VPS Toggle */}
                    <div className={`p-8 rounded-3xl border transition-all duration-500 ${states.vps ? 'bg-orange-900/20 border-orange-500/30' : 'bg-red-600/20 border-red-500/50'}`}>
                        <Server className={`w-12 h-12 mb-6 ${states.vps ? 'text-orange-400' : 'text-red-500'}`} />
                        <h3 className="text-2xl font-bold text-white mb-2">HOSTINGER</h3>
                        <p className="text-sm text-orange-200/50 mb-8">Virtual Private Server and compute resources.</p>
                        <button
                            onClick={() => toggle('vps')}
                            className={`w-full py-4 rounded-2xl font-black flex items-center justify-center gap-2 transition-all ${states.vps ? 'bg-orange-500 text-white' : 'bg-red-600 text-white shadow-[0_0_30px_rgba(220,38,38,0.4)]'}`}
                        >
                            <Power className="w-5 h-5" />
                            {states.vps ? 'ACTIVE' : 'SEVERED'}
                        </button>
                    </div>
                </div>

                <div className="text-center">
                    <p className="text-xs font-mono text-orange-500 uppercase tracking-[1em]">Authorized by Antigravity AG</p>
                </div>
            </div>
        </div>
    );
}
