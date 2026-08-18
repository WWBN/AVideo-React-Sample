import TagList from "../UI/TagList";
import LikeDislike from "../UI/LikeDislike";
import FavoriteButton from "../UI/FavoriteButton";

export default function VideoStats({ video }) {
    return (
        <>
            {/* Like/Dislike/Favorite Section */}
            <div className="flex items-center justify-between">
                <LikeDislike 
                    videoId={video.id}
                    initialLikes={video.likes}
                    initialDislikes={video.dislikes}
                    initialVote={video.myVote}
                />
                <FavoriteButton videoId={video.id} initialFavorite={video.isFavorite} />
            </div>

            {/* Video Category */}
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 bg-gray-200 dark:bg-gray-700 px-2 py-1 inline-block rounded-md">
                {video.category}
            </p>

            {/* Tags */}
            <TagList tags={video.tags} />
        </>
    );
}
