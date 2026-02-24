"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface RevealWrapperProps {
    children: ReactNode;
    delay?: number;
    className?: string;
}

export function RevealWrapper({ children, delay = 0, className = "" }: RevealWrapperProps) {
    return (
        <motion.div
            initial={{ y: 24, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{
                duration: 0.6,
                ease: [0.22, 1, 0.36, 1], // Custom easing for premium feel
                delay: delay,
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
}
