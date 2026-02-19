"use client";

import React, { createContext, useContext, useState } from "react";
import { ComingSoonModal } from "@/components/ComingSoonModal";

interface UIContextType {
    openComingSoon: (title: string) => void;
    closeComingSoon: () => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export function UIProvider({ children }: { children: React.ReactNode }) {
    const [comingSoon, setComingSoon] = useState<{ open: boolean; title: string }>({
        open: false,
        title: "",
    });

    const openComingSoon = (title: string) => {
        setComingSoon({ open: true, title });
    };

    const closeComingSoon = () => {
        setComingSoon((prev) => ({ ...prev, open: false }));
    };

    return (
        <UIContext.Provider value={{ openComingSoon, closeComingSoon }}>
            {children}
            <ComingSoonModal
                isOpen={comingSoon.open}
                onClose={closeComingSoon}
                title={comingSoon.title}
            />
        </UIContext.Provider>
    );
}

export function useUI() {
    const context = useContext(UIContext);
    if (context === undefined) {
        throw new Error("useUI must be used within a UIProvider");
    }
    return context;
}
