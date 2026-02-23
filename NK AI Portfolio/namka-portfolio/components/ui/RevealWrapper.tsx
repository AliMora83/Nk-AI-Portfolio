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
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut", delay }}
            className={className}
        >
            {children}
        </motion.div>
    );
}
