"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export function Cursor() {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);
    const [isDesktop, setIsDesktop] = useState(false);

    useEffect(() => {
        // Only show custom cursor on devices that support hover
        if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
            setIsDesktop(true);
        }

        const updateMousePosition = (e: MouseEvent) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };

        const handleMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (
                target.tagName === "A" ||
                target.tagName === "BUTTON" ||
                target.closest("a") ||
                target.closest("button") ||
                window.getComputedStyle(target).cursor === "pointer"
            ) {
                setIsHovering(true);
            } else {
                setIsHovering(false);
            }
        };

        window.addEventListener("mousemove", updateMousePosition);
        window.addEventListener("mouseover", handleMouseOver);

        return () => {
            window.removeEventListener("mousemove", updateMousePosition);
            window.removeEventListener("mouseover", handleMouseOver);
        };
    }, []);

    if (!isDesktop) return null;

    return (
        <>
            <motion.div
                className="fixed top-0 left-0 w-2 h-2 bg-rust rounded-full pointer-events-none z-[100] transform -translate-x-1/2 -translate-y-1/2"
                animate={{
                    x: mousePosition.x - 4,
                    y: mousePosition.y - 4,
                    scale: isHovering ? 2 : 1,
                }}
                transition={{ type: "tween", ease: "backOut", duration: 0.05 }}
            />
            <motion.div
                className="fixed top-0 left-0 w-8 h-8 border border-rust rounded-full pointer-events-none z-[90] transform -translate-x-1/2 -translate-y-1/2"
                animate={{
                    x: mousePosition.x - 16,
                    y: mousePosition.y - 16,
                    scale: isHovering ? 1.3 : 1,
                }}
                transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.5 }}
            />
        </>
    );
}
