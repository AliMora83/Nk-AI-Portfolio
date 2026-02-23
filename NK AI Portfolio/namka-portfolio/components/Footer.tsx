import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export function Footer() {
    return (
        <footer className="w-full border-t border-border/50 py-12 bg-bg mt-12">
            <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex items-center gap-3">
                    <span className="font-mono text-amber text-sm tracking-widest uppercase">
                        namka · portfolio
                    </span>
                </div>

                <div className="flex items-center gap-6 font-mono text-xs uppercase tracking-widest text-muted">
                    <Link href="/#demos" className="hover:text-paper transition-colors">AI Demos</Link>
                    <Link href="/#work" className="hover:text-paper transition-colors">Clients</Link>
                    <a href="https://openmindi.co.za" target="_blank" rel="noopener noreferrer" className="hover:text-amber transition-colors flex items-center gap-1">
                        openmindi.co.za <ArrowUpRight size={12} />
                    </a>
                </div>
            </div>
        </footer>
    );
}
