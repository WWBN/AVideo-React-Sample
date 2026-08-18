import { motion } from "framer-motion";
import DOMPurify from "dompurify";
import { FaPlay, FaInfoCircle } from "react-icons/fa";
import { DEFAULT_IMAGE } from "../../config/config.jsx";

// Netflix/YouTube-style featured banner for the top of the gallery, built from
// the first video of the first loaded section - no extra API call needed.
export default function HeroBanner({ video, onPlay }) {
    if (!video) return null;

    // video.description is rich-text HTML from the backend editor - strip tags for the teaser line.
    const plainDescription = video.description
        ? DOMPurify.sanitize(video.description, { ALLOWED_TAGS: [] }).trim()
        : "";

    return (
        <motion.div
            className="relative mb-8 h-[60vh] min-h-[320px] max-h-[480px] w-full overflow-hidden rounded-2xl shadow-2xl"
            initial={{ opacity: 0, scale: 1.03 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
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
                {video.category && (
                    <span className="w-fit rounded-full bg-blue-600/90 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
                        {video.category}
                    </span>
                )}
                <h1 className="text-3xl sm:text-5xl font-extrabold text-white drop-shadow-lg leading-tight">
                    {video.title}
                </h1>
                {plainDescription && (
                    <p className="hidden sm:block text-sm text-gray-200 line-clamp-2 max-w-xl">
                        {plainDescription}
                    </p>
                )}

                <div className="flex items-center gap-3 mt-2">
                    <button
                        onClick={() => onPlay(video)}
                        className="cursor-pointer flex items-center gap-2 bg-white hover:bg-gray-200 text-gray-900 font-bold px-5 py-2.5 rounded-md transition-transform transform hover:scale-105"
                    >
                        <FaPlay /> Play
                    </button>
                    <span className="flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-4 py-2.5 rounded-md text-sm">
                        <FaInfoCircle /> {video.channelName}
                    </span>
                </div>
            </div>
        </motion.div>
    );
}
