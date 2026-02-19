"use client";

import React from "react";
import { useFirestoreCollection } from "@/hooks/useFirestore";
import { Users, Bot, MessageSquare, Zap } from "lucide-react";

export function ActiveAgents() {
    const { data: agentsData, loading } = useFirestoreCollection("Active_Agents");

    const defaultAgents = [
        { id: "ag-1", name: "Antigravity", role: "Lead Engineer", task: "Dashboard Init", status: "Working" },
        { id: "oc-1", name: "OpenClaw", role: "Strategist", task: "Planning Mission", status: "Optimizing" },
        { id: "bot-1", name: "SmartPress", role: "Content", task: "Indexing Logs", status: "Idle" }
    ];

    const agents = agentsData.length > 0 ? agentsData : defaultAgents;

    return (
        <div className="bg-slate-900/30 border border-slate-800 rounded-2xl overflow-hidden backdrop-blur-sm">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                <h3 className="font-bold flex items-center gap-2">
                    <Users className="w-5 h-5 text-indigo-400" />
                    ACTIVE AGENTS
                </h3>
                <span className="text-xs font-mono text-slate-500">{agents.length} Online</span>
            </div>

            <div className="divide-y divide-slate-800">
                {agents.map((agent: any) => (
                    <div key={agent.id} className="p-4 hover:bg-slate-800/30 transition-colors flex items-center justify-between group">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center border border-slate-700 group-hover:border-indigo-500/50 transition-colors">
                                {agent.name === "Antigravity" ? (
                                    <Zap className="w-5 h-5 text-blue-400" />
                                ) : agent.name === "OpenClaw" ? (
                                    <Bot className="w-5 h-5 text-indigo-400" />
                                ) : (
                                    <MessageSquare className="w-5 h-5 text-slate-400" />
                                )}
                            </div>
                            <div>
                                <h4 className="font-bold text-sm text-white">{agent.name}</h4>
                                <p className="text-xs text-slate-500 font-medium">{agent.role}</p>
                            </div>
                        </div>

                        <div className="flex-1 px-8 hidden md:block">
                            <div className="max-w-xs">
                                <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">Current Task</p>
                                <p className="text-sm text-slate-300 truncate">{agent.task}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="text-right">
                                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 text-[10px] font-bold uppercase tracking-wider border border-blue-500/20">
                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
                                    {agent.status}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="p-4 bg-slate-800/20 text-center">
                <button className="text-xs font-bold text-slate-400 hover:text-white transition-colors uppercase tracking-widest">
                    View All Agent Activities
                </button>
            </div>
        </div>
    );
}
