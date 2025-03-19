import { useState } from "react";
import { FaThumbsUp, FaThumbsDown } from "react-icons/fa";
import { handleReaction } from "../../config/api";

export default function LikeDislike({ videoId, initialLikes, initialDislikes, initialVote }) {
    const [likes, setLikes] = useState(initialLikes);
    const [dislikes, setDislikes] = useState(initialDislikes);
    const [userReaction, setUserReaction] = useState(initialVote); // -1 = dislike, 1 = like, 0 = no vote
    const [isLoading, setIsLoading] = useState(false);

    const processReaction = async (reactionType) => {
        if (isLoading) return;
        setIsLoading(true);

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
            setIsLoading(false);
        }
    };

    const onReactionClick = (reactionType) => {
        processReaction(reactionType);
    };

    return (
        <div className="flex items-center mt-2 space-x-4 text-gray-600 dark:text-gray-300">
            <button
                onClick={() => onReactionClick("like")}
                disabled={isLoading}
                className={`cursor-pointer flex items-center transition-transform transform hover:scale-115 ${
                    userReaction === 1 ? "text-green-500" : ""
                }`}
            >
                <FaThumbsUp className="mr-1" /> {likes}
            </button>

            <button
                onClick={() => onReactionClick("dislike")}
                disabled={isLoading}
                className={`cursor-pointer flex items-center transition-transform transform hover:scale-115 ${
                    userReaction === -1 ? "text-red-500" : ""
                }`}
            >
                <FaThumbsDown className="mr-1" /> {dislikes}
            </button>
        </div>
    );
}
