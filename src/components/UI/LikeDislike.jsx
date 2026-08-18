import { useState } from "react";
import { FaThumbsUp, FaThumbsDown } from "react-icons/fa";
import { handleReaction } from "../../config/api";
import Spinner from "./Spinner";
import Tooltip from "./Tooltip";

export default function LikeDislike({ videoId, initialLikes, initialDislikes, initialVote }) {
    const [likes, setLikes] = useState(initialLikes);
    const [dislikes, setDislikes] = useState(initialDislikes);
    const [userReaction, setUserReaction] = useState(initialVote); // -1 = dislike, 1 = like, 0 = no vote
    const [pendingReaction, setPendingReaction] = useState(null); // "like" | "dislike" | null

    const processReaction = async (reactionType) => {
        if (pendingReaction) return;
        setPendingReaction(reactionType);

        const apiName = 
            reactionType === "like"
                ? userReaction === 1 
                    ? "removelike" 
                    : "like"
                : userReaction === -1
                ? "removelike"
                : "dislike";

        try {
            const response = await handleReaction(videoId, apiName);

            if (!response.error && response.response) {
                setLikes(response.response.likes);
                setDislikes(response.response.dislikes);
                setUserReaction(response.response.myVote);
            } else {
                console.error("Error sending reaction:", response.message);
            }
        } catch (error) {
            console.error("Error connecting to API:", error);
        } finally {
            setPendingReaction(null);
        }
    };

    const onReactionClick = (reactionType) => {
        processReaction(reactionType);
    };

    return (
        <div className="flex items-center mt-2 space-x-4 text-gray-600 dark:text-gray-300">
            <Tooltip content={userReaction === 1 ? "Remove like" : "Like this video"}>
                <button
                    onClick={() => onReactionClick("like")}
                    disabled={!!pendingReaction}
                    aria-label={userReaction === 1 ? "Remove like" : "Like this video"}
                    className={`cursor-pointer flex items-center gap-1 transition-transform transform hover:scale-115 disabled:cursor-not-allowed ${
                        userReaction === 1 ? "text-green-500" : ""
                    }`}
                >
                    {pendingReaction === "like" ? <Spinner size={14} /> : <FaThumbsUp />} {likes}
                </button>
            </Tooltip>

            <Tooltip content={userReaction === -1 ? "Remove dislike" : "Dislike this video"}>
                <button
                    onClick={() => onReactionClick("dislike")}
                    disabled={!!pendingReaction}
                    aria-label={userReaction === -1 ? "Remove dislike" : "Dislike this video"}
                    className={`cursor-pointer flex items-center gap-1 transition-transform transform hover:scale-115 disabled:cursor-not-allowed ${
                        userReaction === -1 ? "text-red-500" : ""
                    }`}
                >
                    {pendingReaction === "dislike" ? <Spinner size={14} /> : <FaThumbsDown />} {dislikes}
                </button>
            </Tooltip>
        </div>
    );
}
