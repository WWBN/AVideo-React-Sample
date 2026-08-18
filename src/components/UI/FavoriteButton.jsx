import { useState } from "react";
import { FaBookmark, FaRegBookmark } from "react-icons/fa";
import { setFavorite } from "../../config/api";
import Spinner from "./Spinner";
import Tooltip from "./Tooltip";

export default function FavoriteButton({ videoId, initialFavorite = false }) {
    const [isFavorite, setIsFavorite] = useState(initialFavorite);
    const [isLoading, setIsLoading] = useState(false);

    const toggleFavorite = async () => {
        if (isLoading) return;
        setIsLoading(true);

        try {
            const response = await setFavorite(videoId, !isFavorite);

            if (!response.error) {
                setIsFavorite(!isFavorite);
            } else {
                console.error("Error updating favorite:", response.message);
            }
        } catch (error) {
            console.error("Error connecting to API:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Tooltip content={isFavorite ? "Remove from favorites" : "Add to favorites"}>
            <button
                onClick={toggleFavorite}
                disabled={isLoading}
                aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
                className={`cursor-pointer flex items-center transition-transform transform hover:scale-115 disabled:cursor-not-allowed ${
                    isFavorite ? "text-yellow-500" : "text-gray-600 dark:text-gray-300"
                }`}
            >
                {isLoading ? <Spinner size={14} /> : isFavorite ? <FaBookmark /> : <FaRegBookmark />}
            </button>
        </Tooltip>
    );
}
