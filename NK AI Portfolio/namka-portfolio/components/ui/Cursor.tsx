"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function Cursor() {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const updateMousePosition = (e: MouseEvent) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };

        window.addEventListener("mousemove", updateMousePosition);

        return () => {
            window.removeEventListener("mousemove", updateMousePosition);
        };
    }, []);

    return (
        <div id="cursor" className="pointer-events-none fixed inset-0 z-50">
            <motion.div
                className="fixed top-0 left-0 w-2 h-2 rounded-full bg-rust z-50 pointer-events-none"
                animate={{ x: mousePosition.x - 4, y: mousePosition.y - 4 }}
                transition={{ type: "tween", ease: "backOut", duration: 0.1 }}
            />
            <motion.div
                className="fixed top-0 left-0 w-8 h-8 rounded-full border border-rust opacity-50 z-40 pointer-events-none"
                animate={{ x: mousePosition.x - 16, y: mousePosition.y - 16 }}
                transition={{ type: "tween", ease: "backOut", duration: 0.2 }}
            />
        </div>
    );
}
