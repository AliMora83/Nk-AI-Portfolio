"use client";

export function StatusBar() {
    const items = [
        { label: "● Available for projects", value: "" },
        { label: "Stack:", value: "React · Next.js · AI" },
        { label: "Location:", value: "South Africa · Remote" },
        { label: "Email:", value: "ali.mora@namka.cloud" },
        { label: "Response:", value: "Within 24hrs" },
    ];

    return (
        <div className="w-full bg-surface border-y border-border py-3 overflow-hidden flex whitespace-nowrap">
            {/* 
        We duplicate the items to create a seamless infinite scroll effect.
        A pure CSS animation on a wrapper container will translate it continuously.
      */}
            <div className="flex animate-[scroll_20s_linear_infinite] shrink-0">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex items-center">
                        {items.map((item, idx) => (
                            <div key={`${i}-${idx}`} className="flex items-center text-[0.7rem] font-mono tracking-widest uppercase mr-12">
                                <span className="text-muted mr-2">{item.label}</span>
                                {item.value && <span className="text-amber">{item.value}</span>}
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}
