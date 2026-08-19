import VideoCard from "./VideoCard";

// Horizontal shelf of partially-watched videos, driven entirely by the `progress` field
// AVideo already returns per row for logged-in users - no dedicated backend endpoint needed.
export default function ContinueWatchingRow({ videos, onPlay }) {
    if (!videos.length) return null;

    return (
        <div className="mb-8">
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Continue Watching</h2>
            <div className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {videos.map((video) => (
                    <div key={video.id} className="w-64 sm:w-72 shrink-0 snap-start">
                        <VideoCard video={video} onPlay={onPlay} />
                    </div>
                ))}
            </div>
        </div>
    );
}
