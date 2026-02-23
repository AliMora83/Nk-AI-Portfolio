"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <button className="font-mono text-xs uppercase tracking-widest border border-border px-4 py-2 rounded-full opacity-50 cursor-default">
                &nbsp;
            </button>
        );
    }

    return (
        <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="font-mono text-xs uppercase tracking-widest border border-border px-4 py-2 rounded-full hover:border-rust hover:text-rust transition-colors duration-300"
        >
            {theme === "dark" ? "☀ Light" : "☾ Dark"}
        </button>
    );
}
