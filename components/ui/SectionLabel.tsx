import React from "react";

interface SectionLabelProps {
    text: string;
}

export function SectionLabel({ text }: SectionLabelProps) {
    return (
        <div className="flex items-center gap-3 mb-6">
            <div className="w-6 h-px bg-rust" />
            <span className="mono-label text-xs text-amber">{text}</span>
        </div>
    );
}
