"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ThemeToggle } from "./ui/ThemeToggle";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function Nav() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const links = [
        { label: "Projects", href: "#projects" },
        { label: "AI Demos", href: "#demos" },
        { label: "Clients", href: "#work" },
    ];

    return (
        <>
            <header
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-transparent ${scrolled ? "bg-bg/90 backdrop-blur-md border-border py-4" : "bg-transparent py-6"
                    }`}
            >
                <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="w-5 h-[2px] bg-rust group-hover:w-8 transition-all duration-300" />
                        <span className="font-mono text-sm tracking-widest text-amber uppercase font-medium">namka · portfolio</span>
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center gap-8">
                        <ul className="flex items-center gap-6 text-sm font-medium">
                            {links.map((link) => (
                                <li key={link.label}>
                                    <Link href={link.href} className="hover:text-rust transition-colors hover:-translate-y-[1px] inline-block">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                        <div className="w-px h-4 bg-border" />
                        <Link
                            href="#contact"
                            className="px-5 py-2 text-sm border border-rust text-rust rounded-full hover:bg-rust hover:text-white transition-all hover:shadow-lg hover:-translate-y-[2px]"
                        >
                            Hire Ali
                        </Link>
                        <ThemeToggle />
                    </nav>

                    {/* Mobile Toggle */}
                    <div className="flex items-center gap-4 md:hidden">
                        <ThemeToggle />
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="text-paper hover:text-rust transition-colors"
                        >
                            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </header>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="fixed inset-0 z-40 bg-surface/95 backdrop-blur-lg pt-24 px-6 md:hidden"
                    >
                        <nav className="flex flex-col gap-6 text-xl">
                            {links.map((link) => (
                                <Link
                                    key={link.label}
                                    href={link.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="font-syne font-semibold border-b border-border pb-4 hover:text-rust"
                                >
                                    {link.label}
                                </Link>
                            ))}
                            <Link
                                href="#contact"
                                onClick={() => setMobileMenuOpen(false)}
                                className="font-syne font-semibold border-b border-border pb-4 text-rust"
                            >
                                Hire Ali
                            </Link>
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
