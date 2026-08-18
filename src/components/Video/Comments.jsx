import { useState, useEffect } from "react";
import { FaPaperPlane } from "react-icons/fa";
import { getComments, postComment, getStoredCredentials } from "../../config/api";
import { DEFAULT_USER_PHOTO } from "../../config/config";
import Spinner from "../UI/Spinner";
import Tooltip from "../UI/Tooltip";

export default function Comments({ videosId }) {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [error, setError] = useState(null);
    const isLoggedIn = !!getStoredCredentials();

    const loadComments = () => {
        return getComments(videosId)
            .then((data) => setComments(Array.isArray(data.response) ? data.response : []))
            .catch(() => setError("Error loading comments."))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        if (!videosId) return;

        getComments(videosId)
            .then((data) => setComments(Array.isArray(data.response) ? data.response : []))
            .catch(() => setError("Error loading comments."))
            .finally(() => setLoading(false));
    }, [videosId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newComment.trim() || sending) return;

        setSending(true);
        setError(null);
        try {
            const response = await postComment(videosId, newComment.trim());
            if (response.error) {
                setError(response.message || "Error posting comment.");
            } else {
                setNewComment("");
                await loadComments();
            }
        } catch {
            setError("Error posting comment.");
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="flex flex-col h-full text-gray-900 dark:text-white">
            <h3 className="text-lg font-bold mb-3">Comments</h3>

            {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                {loading ? (
                    <p className="text-sm text-gray-500 dark:text-gray-400">Loading comments...</p>
                ) : comments.length === 0 ? (
                    <p className="text-sm text-gray-500 dark:text-gray-400">No comments yet. Be the first to comment!</p>
                ) : (
                    comments.map((comment) => (
                        <div key={comment.id} className="flex items-start gap-2">
                            <img
                                src={comment.userPhotoURL || DEFAULT_USER_PHOTO}
                                alt={comment.userName || "User"}
                                className="w-8 h-8 rounded-full object-cover"
                            />
                            <div className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-md p-2 min-w-0">
                                <div className="flex items-center justify-between gap-2">
                                    <span className="text-sm font-semibold truncate">{comment.userName || "User"}</span>
                                    <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">{comment.humanTiming}</span>
                                </div>
                                <p className="text-sm whitespace-pre-wrap break-words">{comment.commentPlain}</p>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {isLoggedIn ? (
                <form onSubmit={handleSubmit} className="mt-3 flex items-center gap-2">
                    <input
                        type="text"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Add a comment..."
                        disabled={sending}
                        className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-md px-3 py-2 outline-none text-sm disabled:opacity-60"
                    />
                    <Tooltip content="Send comment">
                        <button
                            type="submit"
                            disabled={sending}
                            aria-label="Send comment"
                            className="cursor-pointer bg-blue-500 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-900 text-white p-2 rounded-md transition-all duration-300 disabled:opacity-70"
                        >
                            {sending ? <Spinner size={14} /> : <FaPaperPlane />}
                        </button>
                    </Tooltip>
                </form>
            ) : (
                <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">Log in to leave a comment.</p>
            )}
        </div>
    );
}
