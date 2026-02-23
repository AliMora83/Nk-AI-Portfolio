"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { Menu, X } from "lucide-react";
import { ThemeToggle } from "./ui/ThemeToggle";

const navLinks = [
    { name: "Projects", href: "#projects" },
    { name: "AI Demos", href: "#demos" },
    { name: "Clients", href: "#work" },
];

export function Nav() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { scrollY } = useScroll();

    useMotionValueEvent(scrollY, "change", (latest) => {
        setIsScrolled(latest > 50);
    });

    return (
        <>
            <motion.nav
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className={`fixed top-0 left-0 right-0 z-40 transition-colors duration-300 ${isScrolled
                    ? "bg-bg/90 backdrop-blur-md border-b border-border/50 shadow-sm"
                    : "bg-transparent border-b border-transparent"
                    }`}
            >
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <Link href="/" className="group flex items-center gap-3">
                        <span className="w-6 h-[1px] bg-rust group-hover:w-8 transition-all duration-300" />
                        <span className="font-mono text-amber text-sm tracking-widest uppercase">
                            namka · portfolio
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-8">
                        <div className="flex items-center gap-6">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className="font-mono text-xs uppercase tracking-widest text-muted hover:text-paper transition-colors"
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </div>

                        <div className="w-[1px] h-4 bg-border" />

                        <div className="flex items-center gap-4">
                            <ThemeToggle />
                            <Link
                                href="#contact"
                                className="font-mono text-xs uppercase tracking-widest border border-border px-6 py-2 rounded-full hover:border-rust hover:text-rust hover:-translate-y-0.5 transition-all duration-300 shadow-sm"
                            >
                                Hire Ali
                            </Link>
                        </div>
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button
                        className="md:hidden p-2 text-paper hover:text-rust transition-colors"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </motion.nav>

            {/* Mobile Drawer */}
            <motion.div
                initial={false}
                animate={{
                    height: isMobileMenuOpen ? "auto" : 0,
                    opacity: isMobileMenuOpen ? 1 : 0,
                }}
                className="fixed top-20 left-0 right-0 z-30 bg-bg/95 backdrop-blur-md border-b border-border overflow-hidden md:hidden"
            >
                <div className="px-6 py-8 flex flex-col gap-6">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="font-syne text-2xl font-semibold tracking-tight hover:text-rust transition-colors"
                        >
                            {link.name}
                        </Link>
                    ))}
                    <div className="h-[1px] w-full bg-border my-2" />
                    <div className="flex items-center justify-between">
                        <ThemeToggle />
                        <Link
                            href="#contact"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="font-mono text-xs uppercase tracking-widest border border-border px-6 py-2 rounded-full hover:border-rust hover:text-rust transition-all duration-300"
                        >
                            Hire Ali
                        </Link>
                    </div>
                </div>
            </motion.div>
        </>
    );
}
