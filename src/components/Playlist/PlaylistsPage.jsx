import { useEffect, useState } from "react";
import { FaTimes, FaPlay, FaTrash, FaArrowLeft, FaPlus, FaListUl } from "react-icons/fa";
import toast from "react-hot-toast";
import { getPlaylists, getPlaylistVideos, createPlaylist, deletePlaylist } from "../../config/api";
import VideoCard from "../Video/VideoCard";
import VideoPlayer from "../Video/VideoPlayer";
import Spinner from "../UI/Spinner";
import Tooltip from "../UI/Tooltip";
import EmptyState from "../UI/EmptyState";

// Modal for browsing the logged-in user's playlists and playing them back-to-back.
// Owns its own playback queue so "Play All"/"Next"/"Previous" work independently of the main gallery.
export default function PlaylistsPage({ onClose }) {
    const [playlists, setPlaylists] = useState(null);
    const [selectedPlaylist, setSelectedPlaylist] = useState(null);
    const [playlistVideos, setPlaylistVideos] = useState([]);
    const [videosLoading, setVideosLoading] = useState(false);
    const [newName, setNewName] = useState("");
    const [creating, setCreating] = useState(false);
    const [queue, setQueue] = useState(null);
    const [queueIndex, setQueueIndex] = useState(0);

    useEffect(() => {
        getPlaylists(false)
            .then(setPlaylists)
            .catch(() => toast.error("Error loading playlists."));
    }, []);

    const openPlaylist = async (playlist) => {
        setSelectedPlaylist(playlist);
        setVideosLoading(true);
        try {
            setPlaylistVideos(await getPlaylistVideos(playlist.id));
        } catch {
            toast.error("Error loading playlist videos.");
        } finally {
            setVideosLoading(false);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        if (!newName.trim() || creating) return;
        setCreating(true);
        try {
            const response = await createPlaylist(newName.trim());
            if (response.error) throw new Error();
            toast.success("Playlist created");
            setNewName("");
            setPlaylists(await getPlaylists(false));
        } catch {
            toast.error("Error creating playlist.");
        } finally {
            setCreating(false);
        }
    };

    const handleDelete = async (playlist) => {
        try {
            const response = await deletePlaylist(playlist.id);
            if (response.error) throw new Error();
            toast.success("Playlist deleted");
            setPlaylists((prev) => prev.filter((p) => p.id !== playlist.id));
        } catch {
            toast.error("Error deleting playlist.");
        }
    };

    const playFrom = (index) => {
        if (!playlistVideos.length) return;
        setQueue(playlistVideos);
        setQueueIndex(index);
    };

    const activeVideo = queue?.[queueIndex];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
            <div className="w-full max-w-4xl max-h-[85vh] flex flex-col rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-2xl overflow-hidden">
                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                        {selectedPlaylist && (
                            <Tooltip content="Back to playlists">
                                <button
                                    onClick={() => setSelectedPlaylist(null)}
                                    aria-label="Back to playlists"
                                    className="cursor-pointer text-gray-600 dark:text-gray-300 hover:text-blue-600"
                                >
                                    <FaArrowLeft />
                                </button>
                            </Tooltip>
                        )}
                        <h2 className="text-lg font-bold">{selectedPlaylist ? selectedPlaylist.name : "My Playlists"}</h2>
                    </div>
                    <Tooltip content="Close">
                        <button onClick={onClose} aria-label="Close" className="cursor-pointer text-gray-600 dark:text-gray-300 hover:text-red-500 text-xl">
                            <FaTimes />
                        </button>
                    </Tooltip>
                </div>

                <div className="flex-1 overflow-y-auto p-4">
                    {!selectedPlaylist && (
                        <>
                            <form onSubmit={handleCreate} className="flex items-center gap-2 mb-4">
                                <input
                                    value={newName}
                                    onChange={(e) => setNewName(e.target.value)}
                                    placeholder="New playlist name"
                                    className="min-w-0 flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500/40 outline-none"
                                />
                                <button
                                    type="submit"
                                    disabled={creating || !newName.trim()}
                                    className="cursor-pointer flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {creating ? <Spinner size={14} /> : <FaPlus />} Create
                                </button>
                            </form>

                            {playlists === null && (
                                <div className="space-y-2 animate-pulse">
                                    {Array.from({ length: 3 }).map((_, i) => (
                                        <div key={i} className="h-14 rounded-lg bg-gray-100 dark:bg-gray-800" />
                                    ))}
                                </div>
                            )}

                            {playlists?.length === 0 && (
                                <EmptyState icon={<FaListUl />} title="No playlists yet" message="Create one above to start saving videos." />
                            )}

                            {playlists?.length > 0 && (
                                <ul className="space-y-2">
                                    {playlists.map((playlist) => (
                                        <li
                                            key={playlist.id}
                                            className="flex items-center justify-between gap-3 p-3 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                                        >
                                            <button onClick={() => openPlaylist(playlist)} className="cursor-pointer flex-1 text-left min-w-0">
                                                <p className="font-semibold truncate">{playlist.name}</p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">{playlist.videos?.length ?? 0} video(s)</p>
                                            </button>
                                            <Tooltip content="Delete playlist">
                                                <button
                                                    onClick={() => handleDelete(playlist)}
                                                    aria-label={`Delete "${playlist.name}"`}
                                                    className="cursor-pointer text-gray-500 hover:text-red-500 shrink-0"
                                                >
                                                    <FaTrash />
                                                </button>
                                            </Tooltip>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </>
                    )}

                    {selectedPlaylist && (
                        <>
                            {videosLoading && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {Array.from({ length: 3 }).map((_, i) => (
                                        <div key={i} className="h-48 rounded-xl bg-gray-100 dark:bg-gray-800 animate-pulse" />
                                    ))}
                                </div>
                            )}

                            {!videosLoading && playlistVideos.length === 0 && (
                                <EmptyState icon={<FaPlay />} title="This playlist is empty" message="Add videos to it from any video card." />
                            )}

                            {!videosLoading && playlistVideos.length > 0 && (
                                <>
                                    <button
                                        onClick={() => playFrom(0)}
                                        className="cursor-pointer mb-4 flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold"
                                    >
                                        <FaPlay /> Play All
                                    </button>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {playlistVideos.map((video, index) => (
                                            <VideoCard key={video.id} video={video} onPlay={() => playFrom(index)} />
                                        ))}
                                    </div>
                                </>
                            )}
                        </>
                    )}
                </div>
            </div>

            {activeVideo && (
                <VideoPlayer
                    key={activeVideo.id}
                    videoUrl={activeVideo.embedlink}
                    videosId={activeVideo.id}
                    onClose={() => setQueue(null)}
                    onNext={() => setQueueIndex((i) => i + 1)}
                    onPrevious={() => setQueueIndex((i) => i - 1)}
                    hasNext={queueIndex < queue.length - 1}
                    hasPrevious={queueIndex > 0}
                />
            )}
        </div>
    );
}
