import { useState } from "react";
import { FaClock, FaPlay } from "react-icons/fa";
import UserInfo from "../User/UserInfo.jsx";
import VideoStats from "./VideoStats";
import { DEFAULT_IMAGE } from '../../config/config.jsx';
import { timeAgo } from '../../utils/timeAgo.js';
import LiveBadge from "../UI/LiveBadge";
import Tooltip from "../UI/Tooltip";

export default function VideoCard({ video, onPlay }) {
    const [imageLoaded, setImageLoaded] = useState(false);
    const isLive = video.type === "live";
    const progressPercent = video.progress?.percent;
    const hasProgress = typeof progressPercent === "number" && progressPercent > 0;

    const viewsLabel = video.views_count_short ?? (video.views_count != null ? String(video.views_count) : null);
    const uploadedLabel = timeAgo(video.videoCreation || video.created);
    const meta = isLive
        ? null
        : [viewsLabel ? `${viewsLabel} views` : null, uploadedLabel].filter(Boolean).join(" · ") || null;

    return (
        <div
            className={`group bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl shadow-md dark:shadow-lg overflow-hidden transform transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl motion-reduce:transform-none motion-reduce:transition-none ${
                isLive ? "ring-1 ring-red-500/40 hover:ring-2 hover:ring-red-500/70" : "hover:ring-2 hover:ring-blue-500/60"
            }`}
        >
            {/* Video Thumbnail */}
            <div className="relative h-48 bg-gray-200 dark:bg-gray-700 overflow-hidden">
                {!imageLoaded && (
                    <div className="absolute inset-0 animate-pulse bg-gray-300 dark:bg-gray-600" />
                )}
                <img
                    src={video.Poster || DEFAULT_IMAGE}
                    alt={video.title || "Untitled video"}
                    loading="lazy"
                    onLoad={() => setImageLoaded(true)}
                    className={`w-full h-48 object-cover transition-all duration-500 group-hover:scale-110 motion-reduce:group-hover:scale-100 ${imageLoaded ? "opacity-100" : "opacity-0"}`}
                />
                {/* Netflix-style hover overlay with a quick-play button */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/40 transition-colors duration-300">
                    <button
                        onClick={() => onPlay(video)}
                        aria-label={`Play "${video.title}"`}
                        className="cursor-pointer flex items-center justify-center w-14 h-14 rounded-full bg-white/90 text-blue-600 text-xl opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 motion-reduce:transition-none hover:bg-white"
                    >
                        <FaPlay className="ml-1" />
                    </button>
                </div>

                {isLive ? (
                    <div className="absolute top-2 left-2">
                        <LiveBadge viewers={viewsLabel} />
                    </div>
                ) : (
                    video.duration && (
                        <span className="absolute bottom-2 right-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded-md">
                            <FaClock className="inline-block mr-1" /> {video.duration}
                        </span>
                    )
                )}

                {hasProgress && (
                    <div className="absolute inset-x-0 bottom-0 h-1 bg-white/30">
                        <div className="h-full bg-red-600" style={{ width: `${Math.min(progressPercent, 100)}%` }} />
                    </div>
                )}
            </div>


            {/* Video Info */}
            <div className="p-4">
                <h2 className="text-lg font-bold truncate">{video.title}</h2>
                <UserInfo userPhoto={video.UserPhoto} channelName={video.channelName} meta={meta} />
                <VideoStats video={video} />

                {/* Play Button */}
                <Tooltip content={`Play "${video.title}"`}>
                    <button 
                        onClick={() => onPlay(video)}
                        className="cursor-pointer mt-4 w-full bg-blue-500 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-900 text-white font-bold py-2 rounded-lg flex items-center justify-center transition-all duration-300"
                    >
                        <FaPlay className="mr-2" /> Play
                    </button>
                </Tooltip>
            </div>
        </div>
    );
}
