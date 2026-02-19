"use client";

import React, { useState } from "react";
import { Header } from "@/components/Header";
import { SystemStatus } from "@/components/SystemStatus";
import { ActiveAgents } from "@/components/ActiveAgents";
import { SECRegulatoryCountdown } from "@/components/SECRegulatoryCountdown";
import { DailyBurn } from "@/components/DailyBurn";
import { useFirestoreCollection } from "@/hooks/useFirestore";
import {
  ShieldAlert,
  Terminal,
  Zap,
  Activity,
  Box,
  Send,
  Skull,
} from "lucide-react";
import { doc, updateDoc, setDoc, addDoc, collection } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { OrangeProtocolModal } from "@/components/OrangeLevelModal";
import { useUI } from "@/context/UIContext";

export default function Dashboard() {
  const { openComingSoon } = useUI();
  const { data: statusData } = useFirestoreCollection("System_Status");
  const thermalDoc = statusData.find(d => d.id === "thermal");
  const controlDoc = statusData.find(d => d.id === "control");
  const rciaScrapeActive = controlDoc?.RCIA_SCRAPE === true;
  const currentTemp = Math.round(thermalDoc?.cpu_temp || 42);

  const handleForceScrape = async () => {
    try {
      await setDoc(doc(db, "System_Status", "control"), { RCIA_SCRAPE: true }, { merge: true });
      console.log("RCIA_SCRAPE set to TRUE");
    } catch (e) {
      console.error("Failed to force scrape:", e);
    }
  };

  const [consoleInput, setConsoleInput] = useState("");
  const handleConsoleSend = async () => {
    if (!consoleInput.trim()) return;

    if (consoleInput.toLowerCase().startsWith("push focus")) {
      const focusContent = consoleInput.replace("push focus", "").trim() || "Manual Directive: Focus initialized.";
      // Pushing to Firestore
      try {
        const timestamp = new Date().toISOString();
        const dateKey = timestamp.split("T")[0]; // YYYY-MM-DD
        // We'll store it in a 'directives' collection
        await addDoc(collection(db, "directives"), {
          type: "FOCUS_PUSH",
          content: focusContent,
          timestamp: timestamp,
          path: `19:30/${dateKey}`, // As requested: "19:30 temporal path"
          source: "console_manual"
        });
        console.log("Directive synced to ID: 19:30");
        setConsoleInput("✅ Directive Pushed.");
        setTimeout(() => setConsoleInput(""), 2000);
      } catch (e) {
        console.error("Sync failed:", e);
        setConsoleInput("❌ Sync Failed.");
      }
    } else {
      console.log("Command sent:", consoleInput);
      setConsoleInput("");
    }
  };

  const [orangeProtocol, setOrangeProtocol] = useState(false);

  const { data: ledgerData } = useFirestoreCollection("ledger");
  const dailyLimit = 10.00;
  const currentSpend = ledgerData.reduce((acc, curr) => acc + (curr.amount || 0), 0);
  const isBudgetCritical = currentSpend > dailyLimit * 0.8;

  return (
    <div className={`flex flex-col h-screen overflow-hidden transition-colors duration-500 ${rciaScrapeActive ? "bg-orange-950/30" : ""}`}>
      {rciaScrapeActive && (
        <div className="fixed inset-0 bg-orange-500/10 pointer-events-none z-0 backdrop-blur-[1px]" />
      )}
      <div className="relative z-10 flex flex-col h-full">
        <Header />

        <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
          {/* Welcome Section */}
          <section className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-white mb-1">
                DASHBOARD <span className="text-orange-500 italic">v1.0.5</span>
              </h1>
              <p className="text-slate-500 font-medium font-mono text-sm uppercase tracking-wide">
                Namka Mission Control Active. Lead Strategist: Kimi K2.5
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleForceScrape}
                className={`flex items-center gap-2 px-4 py-2 border rounded-lg text-sm font-bold transition-colors ${rciaScrapeActive ? "bg-orange-600 border-orange-500 text-white animate-pulse" : "bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800"}`}
              >
                <Skull className="w-4 h-4" />
                {rciaScrapeActive ? "SCRAPE ACTIVE" : "FORCE SCRAPE"}
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-sm font-bold text-slate-300 hover:bg-slate-800 transition-colors">
                <Terminal className="w-4 h-4" />
                VIEW LOGS
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 rounded-lg text-sm font-bold text-white hover:bg-blue-500 transition-all shadow-[0_0_15px_rgba(37,99,235,0.3)]">
                <Zap className="w-4 h-4" />
                EXECUTE COMMAND
              </button>
            </div>
          </section>

          {/* Vital Stats Header */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-blue-600/20 to-indigo-600/20 border border-blue-500/20 rounded-2xl p-6 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                <ShieldAlert className="w-16 h-16" />
              </div>
              <p className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-2">Security Status</p>
              <h3 className="text-2xl font-bold text-white mb-1 uppercase">LEVEL 7 ACTIVE</h3>
              <p className="text-xs text-slate-400 font-medium">End-to-end encryption verified</p>
            </div>

            <div className="bg-gradient-to-br from-orange-600/20 to-red-600/20 border border-orange-500/20 rounded-2xl p-6 relative overflow-hidden group transition-all hover:border-orange-500/40">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                <Activity className="w-16 h-16" />
              </div>
              <p className="text-xs font-bold text-orange-400 uppercase tracking-widest mb-2">Overheat Monitor</p>
              <h3 className="text-2xl font-bold text-white mb-1 uppercase">
                {thermalDoc ? "LIVE" : "NORMAL"} ({currentTemp}°C)
              </h3>
              <p className="text-xs text-slate-400 font-medium">Thermal ceiling at 85°C</p>
            </div>

            <div className="bg-gradient-to-br from-emerald-600/20 to-teal-600/20 border border-emerald-500/20 rounded-2xl p-6 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                <Box className="w-16 h-16" />
              </div>
              <p className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-2">Projects Active</p>
              <h3 className="text-2xl font-bold text-white mb-1 uppercase">12 IN FLIGHT</h3>
              <p className="text-xs text-slate-400 font-medium">Namka Mission Control priority</p>
            </div>
          </div>

          {/* System Status Grid */}
          <SystemStatus />

          {/* Bento Grid: Task Backlog & Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* 25% Width Column: SEC Regulatory Countdown */}
            <div className="lg:col-span-1 order-2 lg:order-1">
              <SECRegulatoryCountdown />
            </div>

            {/* 75% Width Area (3 Columns) */}
            <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-8 order-1 lg:order-2">
              <div className="space-y-8">
                <DailyBurn />
                <ActiveAgents />
              </div>

              <div className="space-y-6">
                <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
                  <h3 className="font-bold mb-4 flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-slate-400" />
                    COMMAND CONSOLE
                  </h3>
                  <div className="bg-slate-950 rounded-lg p-4 font-mono text-[11px] space-y-1 border border-slate-800 h-48 overflow-y-auto">
                    <p className="text-blue-500">[00:15:52] initializing session...</p>
                    <p className="text-green-500">[00:15:53] authorized as lead_engineer</p>
                    <p className="text-slate-400">[00:15:54] fetching system_status...</p>
                    <p className="text-orange-400">[11:52:40] switching to namka protocol</p>
                    <p className="text-slate-400">[11:52:41] kimi k2.5 strategist lead confirmed</p>
                    <p className="text-slate-200 animate-pulse underline select-none pointer-events-none">_</p>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <input
                      type="text"
                      value={consoleInput}
                      onChange={(e) => setConsoleInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleConsoleSend()}
                      placeholder="Enter command..."
                      className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-slate-300 focus:outline-none focus:border-blue-500/50"
                    />
                    <button
                      onClick={handleConsoleSend}
                      className="p-2 bg-blue-600 rounded-lg text-white hover:bg-blue-500 transition-colors"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className={`bg-orange-500/5 border rounded-2xl p-6 group transition-all duration-500 ${isBudgetCritical ? 'border-red-500/50 bg-red-500/5 shadow-[0_0_30px_rgba(220,38,38,0.1)]' : 'border-orange-500/20'}`}>
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className={`font-bold flex items-center gap-2 ${isBudgetCritical ? 'text-red-500' : 'text-orange-500'}`}>
                        <ShieldAlert className={`w-5 h-5 ${isBudgetCritical ? 'animate-bounce' : ''}`} />
                        {isBudgetCritical ? "ORANGE ACTIVE" : "ORANGE PROTOCOL"}
                      </h3>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">
                        {isBudgetCritical ? "Immediate Protocol Authorized" : "Standby Mode Active"}
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-400 mb-6 leading-relaxed">
                    {isBudgetCritical
                      ? "Daily burn threshold exceeded ($8.00). Kill-Switch protocol is now ARMED and ready for manual execution."
                      : "Advanced emergency protocol. Individual toggles for API, Firebase, and VPS systems."}
                  </p>
                  <button
                    onClick={() => setOrangeProtocol(true)}
                    className={`w-full py-3 font-bold rounded-xl transition-all shadow-lg group-hover:scale-[1.02] active:scale-[0.98] ${isBudgetCritical ? 'bg-red-600 hover:bg-red-500 text-white shadow-red-900/40' : 'bg-orange-600 hover:bg-orange-500 text-white shadow-orange-900/40'}`}
                  >
                    {isBudgetCritical ? "EXECUTE KILL-SWITCH" : "ACCESS PROTOCOL"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <OrangeProtocolModal
          isOpen={orangeProtocol}
          onClose={() => setOrangeProtocol(false)}
        />
      </div>
    </div>
  );
}
