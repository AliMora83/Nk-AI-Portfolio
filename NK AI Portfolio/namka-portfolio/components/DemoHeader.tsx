import Link from "next/link";
import { ThemeToggle } from "./ui/ThemeToggle";

export function DemoHeader({ title }: { title: string }) {
    return (
        <header className="w-full border-b border-border/50 bg-bg/90 backdrop-blur-md sticky top-0 z-40">
            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                <Link href="/" className="group flex items-center gap-3">
                    <span className="w-6 h-[1px] bg-rust group-hover:w-8 transition-all duration-300" />
                    <span className="font-mono text-amber text-sm tracking-widest uppercase hidden sm:block">
                        namka · portfolio
                    </span>
                    <span className="font-mono text-muted text-xs tracking-widest uppercase bg-surface px-2 py-1 rounded-sm ml-4">
                        {title}
                    </span>
                </Link>
                <ThemeToggle />
            </div>
        </header>
    );
}
