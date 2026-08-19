import React from 'react';
import { FaArrowDown } from 'react-icons/fa';
import VideoCard from "./VideoCard";
import Tooltip from "../UI/Tooltip";

// Shared with VideoGallery's loading skeleton so the placeholder grid always matches the real one.
export const VIDEO_GRID_CLASSES = "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 sm:gap-6";

// Sections whose title suggests a "browse sideways" feel (Trending/Popular/Live/Suggested,
// as returned by the Gallery firstPage endpoint) render as a horizontal shelf instead of a grid.
const CAROUSEL_TITLE_PATTERN = /trending|popular|live|suggested/i;

export default function VideoSection({ section, onPlay, onLoadMore }) {
    const { title, endpointResponse, loadingMore } = section;
    const isCarousel = CAROUSEL_TITLE_PATTERN.test(title || "");

    return (
        <div className="mb-8">
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
                {title}
            </h2>

            {isCarousel ? (
                <div className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    {endpointResponse.rows.map(video => (
                        <div key={video.id} className="w-64 sm:w-72 shrink-0 snap-start">
                            <VideoCard video={video} onPlay={onPlay} />
                        </div>
                    ))}
                </div>
            ) : (
                <div className={VIDEO_GRID_CLASSES}>
                    {endpointResponse.rows.map(video => (
                        <VideoCard key={video.id} video={video} onPlay={onPlay} />
                    ))}
                </div>
            )}

            {section.endpointResponse.hasMore && !loadingMore && (
                <Tooltip content="Load more videos">
                    <button
                        onClick={onLoadMore}
                        className="cursor-pointer mt-4 w-full bg-blue-500 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-900 text-white font-bold py-2 rounded-lg flex items-center justify-center transition-all duration-300"
                    >
                        <FaArrowDown className="mr-2" /> Load More
                    </button>
                </Tooltip>
            )}

            {loadingMore && (
                <div className="mt-4 flex items-center justify-center gap-2 text-gray-500 dark:text-gray-300">
                    <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    Loading more videos...
                </div>
            )}
        </div>
    );
}
