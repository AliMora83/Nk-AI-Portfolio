"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return <div className="w-[84px] h-[34px]" />; // exact dimensions to prevent layout shift

    return (
        <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-surface hover:border-rust hover:-translate-y-[2px] hover:shadow-sm transition-all duration-300 mono-label text-[0.7rem]"
            aria-label="Toggle theme"
        >
            {theme === "dark" ? (
                <>
                    <Sun size={14} className="text-amber" /> Light
                </>
            ) : (
                <>
                    <Moon size={14} className="text-rust" /> Dark
                </>
            )}
        </button>
    );
}
