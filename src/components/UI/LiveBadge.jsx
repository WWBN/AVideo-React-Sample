// Compact "LIVE" pill with a subtle pinging dot (skipped under prefers-reduced-motion via motion-safe:).
export default function LiveBadge({ viewers, className = "" }) {
    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-full bg-red-600 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-white shadow-md shadow-red-600/30 ${className}`}
        >
            <span className="relative flex h-1.5 w-1.5">
                <span className="motion-safe:animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-white" />
            </span>
            Live
            {viewers != null && viewers !== "" && (
                <span className="font-normal normal-case opacity-90">· {viewers}</span>
            )}
        </span>
    );
}
