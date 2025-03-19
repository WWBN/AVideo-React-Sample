import React from 'react';
import { FaPlay, FaArrowDown } from 'react-icons/fa';
import VideoCard from "./VideoCard";

export default function VideoSection({ section, onPlay, onLoadMore }) {
    const { title, endpointResponse, loadingMore } = section;

    return (
        <div className="mb-8">
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
                {title}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-6 2xl:grid-cols-6 gap-6">
                {endpointResponse.rows.map(video => (
                    <VideoCard key={video.id} video={video} onPlay={onPlay} />
                ))}
            </div>

            {section.endpointResponse.hasMore && !loadingMore && (
                <button
                    onClick={onLoadMore}
                    className="cursor-pointer mt-4 w-full bg-blue-500 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-900 text-white font-bold py-2 rounded-md flex items-center justify-center transition-all duration-300"
                >
                    <FaArrowDown className="mr-2" /> Load More
                </button>
            )}

            {loadingMore && (
                <div className="mt-4 text-center text-gray-500 dark:text-gray-300 animate-pulse">
                    Loading more videos...
                </div>
            )}
        </div>
    );
}
