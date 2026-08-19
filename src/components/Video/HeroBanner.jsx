import { motion, useReducedMotion } from "framer-motion";
import DOMPurify from "dompurify";
import { FaPlay, FaInfoCircle } from "react-icons/fa";
import { DEFAULT_IMAGE } from "../../config/config.jsx";
import { timeAgo } from "../../utils/timeAgo.js";
import LiveBadge from "../UI/LiveBadge";

// Netflix/YouTube-style featured banner for the top of the gallery, built from
// the first video of the first loaded section - no extra API call needed.
export default function HeroBanner({ video, onPlay }) {
    const prefersReducedMotion = useReducedMotion();
    if (!video) return null;

    const isLive = video.type === "live";
    const viewsLabel = video.views_count_short ?? (video.views_count != null ? String(video.views_count) : null);
    const uploadedLabel = timeAgo(video.videoCreation || video.created);
    const meta = isLive
        ? null
        : [viewsLabel ? `${viewsLabel} views` : null, uploadedLabel].filter(Boolean).join(" · ") || null;

    // video.description is rich-text HTML from the backend editor - strip tags for the teaser line.
    const plainDescription = video.description
        ? DOMPurify.sanitize(video.description, { ALLOWED_TAGS: [] }).trim()
        : "";

    return (
        <motion.div
            className={`relative mb-8 h-[60vh] min-h-[320px] max-h-[480px] w-full overflow-hidden rounded-2xl shadow-2xl ${
                isLive ? "ring-2 ring-red-500/70 shadow-[0_0_35px_-5px_rgb(239_68_68_/_0.45)]" : ""
            }`}
            initial={prefersReducedMotion ? false : { opacity: 0, scale: 1.03 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.7, ease: "easeOut" }}
        >
            <img
                src={video.Poster || DEFAULT_IMAGE}
                alt=""
                aria-hidden="true"
                className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/10 to-transparent" />

            <div className="relative z-10 flex h-full flex-col justify-end gap-3 p-6 sm:p-10 max-w-2xl">
                <div className="flex items-center gap-2">
                    {isLive && <LiveBadge viewers={viewsLabel} />}
                    {video.category && (
                        <span className="w-fit rounded-full bg-blue-600/90 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
                            {video.category}
                        </span>
                    )}
                </div>
                <h1 className="text-3xl sm:text-5xl font-extrabold text-white drop-shadow-lg leading-tight">
                    {video.title}
                </h1>
                {meta && <p className="text-sm text-gray-300">{meta}</p>}
                {plainDescription && (
                    <p className="hidden sm:block text-sm text-gray-200 line-clamp-2 max-w-xl">
                        {plainDescription}
                    </p>
                )}

                <div className="flex items-center gap-3 mt-2">
                    <button
                        onClick={() => onPlay(video)}
                        className="cursor-pointer flex items-center gap-2 bg-white hover:bg-gray-200 text-gray-900 font-bold px-5 py-2.5 rounded-lg transition-transform transform hover:scale-105 motion-reduce:transform-none"
                    >
                        <FaPlay /> Play
                    </button>
                    <span className="flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-4 py-2.5 rounded-lg text-sm">
                        <FaInfoCircle /> {video.channelName}
                    </span>
                </div>
            </div>
        </motion.div>
    );
}
