import { RevealWrapper } from "./RevealWrapper";

export function SectionLabel({ text }: { text: string }) {
    return (
        <RevealWrapper className="flex items-center gap-4 mb-8">
            <div className="w-12 h-[1px] bg-rust" />
            <span className="font-eyebrow text-xs text-rust">
                {text}
            </span>
        </RevealWrapper>
    );
}
