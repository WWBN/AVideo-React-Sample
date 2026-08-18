import TagList from "../UI/TagList";
import LikeDislike from "../UI/LikeDislike";
import FavoriteButton from "../UI/FavoriteButton";
import PlaylistButton from "../UI/PlaylistButton";

export default function VideoStats({ video }) {
    return (
        <>
            {/* Like/Dislike/Favorite/Playlist Section */}
            <div className="flex items-center justify-between">
                <LikeDislike 
                    videoId={video.id}
                    initialLikes={video.likes}
                    initialDislikes={video.dislikes}
                    initialVote={video.myVote}
                />
                <div className="flex items-center gap-3">
                    <PlaylistButton videoId={video.id} />
                    <FavoriteButton videoId={video.id} initialFavorite={video.isFavorite} />
                </div>
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
