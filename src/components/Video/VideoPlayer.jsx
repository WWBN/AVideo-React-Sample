import { useState, useEffect } from "react";
import { FaTimes, FaExpand, FaComment } from "react-icons/fa";
import Comments from "./Comments";
import Tooltip from "../UI/Tooltip";

export default function VideoPlayer({ videoUrl, videosId, onClose }) {
    const [isMiniPlayer, setIsMiniPlayer] = useState(false);
    const [showComments, setShowComments] = useState(false);
    const [iframeLoaded, setIframeLoaded] = useState(false);
    const canShowComments = showComments && !isMiniPlayer && videosId;

    // The embedded AVideo player posts this message (see closeFullScreenOrHistoryBack
    // in the backend's script.js) when its own close button is clicked, since it can't
    // call the parent window directly across origins.
    useEffect(() => {
        const handleMessage = (event) => {
            try {
                if (new URL(videoUrl).origin !== event.origin) return;
            } catch {
                return;
            }
            if (event.data === "closeFullscreen") {
                onClose();
            }
        };

        window.addEventListener("message", handleMessage);
        return () => window.removeEventListener("message", handleMessage);
    }, [videoUrl, onClose]);

    return (
        <div className={`fixed ${isMiniPlayer ? "bottom-5 right-5 w-64 h-36" : "top-0 left-0 w-full h-full"} 
            bg-black bg-opacity-90 flex justify-center items-center z-50 transition-all duration-300`}>
            
            {!isMiniPlayer && (
                <Tooltip content="Close player">
                    <button 
                        onClick={onClose} 
                        aria-label="Close player"
                        className="cursor-pointer absolute top-4 right-4 z-10 text-white text-3xl font-bold bg-black bg-opacity-50 p-2 rounded-full hover:bg-opacity-80 transition-all duration-300">
                        <FaTimes />
                    </button>
                </Tooltip>
            )}

            {!isMiniPlayer && videosId && (
                <Tooltip content={showComments ? "Hide comments" : "Show comments"}>
                    <button
                        onClick={() => setShowComments(!showComments)}
                        aria-label={showComments ? "Hide comments" : "Show comments"}
                        className="cursor-pointer absolute top-4 left-4 z-10 text-white text-xl bg-black bg-opacity-50 p-2 rounded-full hover:bg-opacity-80 transition-all duration-300">
                        <FaComment />
                    </button>
                </Tooltip>
            )}

            <Tooltip content={isMiniPlayer ? "Expand player" : "Minimize player"}>
                <button 
                    onClick={() => setIsMiniPlayer(!isMiniPlayer)} 
                    aria-label={isMiniPlayer ? "Expand player" : "Minimize player"}
                    className="cursor-pointer absolute bottom-4 right-4 z-10 text-white text-xl bg-black bg-opacity-50 p-2 rounded-full hover:bg-opacity-80 transition-all duration-300">
                    <FaExpand />
                </button>
            </Tooltip>

            <div className="flex w-full h-full relative">
                {!iframeLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent border-solid rounded-full animate-spin"></div>
                    </div>
                )}

                <iframe 
                    src={videoUrl} 
                    onLoad={() => setIframeLoaded(true)}
                    className={`rounded-lg transition-opacity duration-300 ${iframeLoaded ? "opacity-100" : "opacity-0"} ${canShowComments ? "w-2/3 h-full" : "w-full h-full"}`}
                    allowFullScreen 
                    title="Playing video">
                </iframe>

                {canShowComments && (
                    <div className="w-1/3 h-full bg-white dark:bg-gray-900 p-4 overflow-hidden">
                        <Comments videosId={videosId} />
                    </div>
                )}
            </div>
        </div>
    );
}
