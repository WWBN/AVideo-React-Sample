import { useState } from "react";
import * as Popover from "@radix-ui/react-popover";
import { FaListUl, FaPlus, FaCheck } from "react-icons/fa";
import toast from "react-hot-toast";
import { getPlaylists, createPlaylist, togglePlaylistVideo, getStoredCredentials } from "../../config/api";
import Spinner from "./Spinner";
import Tooltip from "./Tooltip";

// Popover (portal-based, so it isn't clipped by VideoCard's overflow-hidden) letting a
// logged-in user add/remove this video from any of their playlists, or create a new one.
export default function PlaylistButton({ videoId }) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [playlists, setPlaylists] = useState(null);
    const [pendingId, setPendingId] = useState(null);
    const [newName, setNewName] = useState("");
    const [creating, setCreating] = useState(false);

    const loadPlaylists = async () => {
        setLoading(true);
        try {
            setPlaylists(await getPlaylists(false));
        } catch {
            toast.error("Error loading playlists.");
        } finally {
            setLoading(false);
        }
    };

    const handleOpenChange = (nextOpen) => {
        if (nextOpen && !getStoredCredentials()) {
            toast.error("You need to be logged in to use playlists.");
            return;
        }
        setOpen(nextOpen);
        if (nextOpen && playlists === null) loadPlaylists();
    };

    const isInPlaylist = (playlist) => playlist.videos?.some((v) => Number(v.videos_id) === Number(videoId));

    const handleToggle = async (playlist) => {
        if (pendingId) return;
        const add = !isInPlaylist(playlist);
        setPendingId(playlist.id);
        try {
            const response = await togglePlaylistVideo(videoId, playlist.id, add);
            if (response.error) throw new Error(response.message);

            setPlaylists((prev) =>
                prev.map((p) =>
                    p.id !== playlist.id
                        ? p
                        : {
                              ...p,
                              videos: add
                                  ? [...(p.videos || []), { videos_id: videoId }]
                                  : (p.videos || []).filter((v) => Number(v.videos_id) !== Number(videoId)),
                          }
                )
            );
            toast.success(add ? `Added to "${playlist.name}"` : `Removed from "${playlist.name}"`);
        } catch {
            toast.error("Error updating playlist.");
        } finally {
            setPendingId(null);
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
            await loadPlaylists();
        } catch {
            toast.error("Error creating playlist.");
        } finally {
            setCreating(false);
        }
    };

    return (
        <Popover.Root open={open} onOpenChange={handleOpenChange}>
            <Tooltip content="Add to playlist">
                <Popover.Trigger asChild>
                    <button
                        aria-label="Add to playlist"
                        className="cursor-pointer flex items-center text-gray-600 dark:text-gray-300 transition-transform transform hover:scale-115"
                    >
                        <FaListUl />
                    </button>
                </Popover.Trigger>
            </Tooltip>

            <Popover.Portal>
                <Popover.Content
                    align="end"
                    sideOffset={8}
                    className="z-50 w-64 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-2xl border border-gray-200 dark:border-gray-700 p-3"
                >
                    <p className="text-sm font-semibold mb-2">Save to playlist</p>

                    {loading && (
                        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 py-2">
                            <Spinner size={14} /> Loading playlists...
                        </div>
                    )}

                    {!loading && playlists?.length === 0 && (
                        <p className="text-sm text-gray-500 dark:text-gray-400 py-1">No playlists yet.</p>
                    )}

                    {!loading && playlists?.length > 0 && (
                        <ul className="max-h-48 overflow-y-auto space-y-1 mb-2">
                            {playlists.map((playlist) => {
                                const checked = isInPlaylist(playlist);
                                return (
                                    <li key={playlist.id}>
                                        <button
                                            onClick={() => handleToggle(playlist)}
                                            disabled={pendingId === playlist.id}
                                            className="cursor-pointer w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm hover:bg-gray-100 dark:hover:bg-gray-700 disabled:cursor-not-allowed text-left"
                                        >
                                            <span
                                                className={`flex items-center justify-center w-4 h-4 rounded border shrink-0 ${
                                                    checked ? "bg-blue-600 border-blue-600 text-white" : "border-gray-400 dark:border-gray-500"
                                                }`}
                                            >
                                                {pendingId === playlist.id ? <Spinner size={10} /> : checked && <FaCheck size={10} />}
                                            </span>
                                            <span className="truncate">{playlist.name}</span>
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                    )}

                    <form onSubmit={handleCreate} className="flex items-center gap-1.5 pt-2 border-t border-gray-200 dark:border-gray-700">
                        <input
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            placeholder="New playlist name"
                            className="min-w-0 flex-1 text-sm px-2 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900"
                        />
                        <button
                            type="submit"
                            disabled={creating || !newName.trim()}
                            aria-label="Create playlist"
                            className="cursor-pointer shrink-0 flex items-center justify-center w-8 h-8 rounded-lg bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {creating ? <Spinner size={12} /> : <FaPlus size={12} />}
                        </button>
                    </form>

                    <Popover.Arrow className="fill-white dark:fill-gray-800" />
                </Popover.Content>
            </Popover.Portal>
        </Popover.Root>
    );
}
