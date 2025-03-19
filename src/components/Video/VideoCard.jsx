import { FaClock, FaPlay } from "react-icons/fa";
import UserInfo from "../User/UserInfo.jsx";
import VideoStats from "./VideoStats";
import { DEFAULT_IMAGE } from '../../config/config.jsx';

export default function VideoCard({ video, onPlay }) {
    return (
        <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg shadow-md dark:shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
            {/* Video Thumbnail */}
            <div className="relative">
                <img
                    src={video.Poster || DEFAULT_IMAGE}
                    alt={video.title || "Vídeo sem título"}
                    className="w-full h-48 object-cover rounded-t-lg"
                />
                <span className="absolute bottom-2 right-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded-md">
                    <FaClock className="inline-block mr-1" /> {video.duration || "??:??"}
                </span>
            </div>

            {/* Video Info */}
            <div className="p-4">
                <h2 className="text-lg font-bold truncate">{video.title}</h2>
                <UserInfo userPhoto={video.UserPhoto} channelName={video.channelName} />
                <VideoStats video={video} />

                {/* Play Button */}
                <button 
                    onClick={() => onPlay(video.embedlink)}
                    className="cursor-pointer mt-4 w-full bg-blue-500 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-900 text-white font-bold py-2 rounded-md flex items-center justify-center transition-all duration-300"
                >
                    <FaPlay className="mr-2" /> Play
                </button>
            </div>
        </div>
    );
}
