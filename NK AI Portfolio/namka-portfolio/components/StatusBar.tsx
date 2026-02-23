export function StatusBar() {
    const items = [
        "● Available for projects",
        "Stack: React · Next.js · AI",
        "Location: South Africa · Remote",
        "Email: ali.mora@namka.cloud",
        "Response: Within 24hrs",
    ];

    // Duplicate items for seamless continuous scrolling
    const scrollItems = [...items, ...items, ...items, ...items];

    return (
        <div className="w-full bg-surface border-y border-border overflow-hidden py-3 relative z-20">
            <div className="flex w-max animate-ticker">
                {scrollItems.map((item, index) => (
                    <div key={index} className="flex items-center">
                        <span className="font-mono text-xs uppercase tracking-widest text-amber whitespace-nowrap px-8">
                            {item}
                        </span>
                        {index !== scrollItems.length - 1 && (
                            <span className="w-1 h-1 rounded-full bg-border" />
                        )}
                    </div>
                ))}
            </div>
            <style dangerouslySetInnerHTML={{
                __html: `
        @keyframes ticker {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-50%, 0, 0); }
        }
        .animate-ticker {
          animation: ticker 25s linear infinite;
        }
      `}} />
        </div>
    );
}
