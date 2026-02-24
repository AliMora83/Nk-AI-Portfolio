"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="w-full border-t border-border bg-surface py-12">
            <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex flex-col items-center md:items-start gap-2">
                    <Link href="/" className="flex items-center gap-3">
                        <div className="w-5 h-[2px] bg-rust text-amber" />
                        <span className="font-mono text-xs tracking-widest text-amber uppercase font-medium">namka · portfolio</span>
                    </Link>
                    <p className="text-xs text-muted font-mono mt-2">© {currentYear} Ali Mora. All rights reserved.</p>
                </div>

                <div className="flex items-center gap-6">
                    <Link href="https://openmindi.co.za" target="_blank" className="text-xs text-paper hover:text-rust font-mono uppercase tracking-wider flex items-center gap-1 transition-colors">
                        OpenMindi Studio <ArrowUpRight size={12} />
                    </Link>
                    <Link href="#contact" className="text-xs text-paper hover:text-rust font-mono uppercase tracking-wider flex items-center gap-1 transition-colors">
                        Hire Me <ArrowUpRight size={12} />
                    </Link>
                </div>
            </div>
        </footer>
    );
}
