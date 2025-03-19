import { useState } from "react";
import { FaTimes, FaExpand } from "react-icons/fa";

export default function VideoPlayer({ videoUrl, onClose }) {
    const [isMiniPlayer, setIsMiniPlayer] = useState(false);

    return (
        <div className={`fixed ${isMiniPlayer ? "bottom-5 right-5 w-64 h-36" : "top-0 left-0 w-full h-full"} 
            bg-black bg-opacity-90 flex justify-center items-center z-50 transition-all duration-300`}>
            
            {!isMiniPlayer && (
                <button 
                    onClick={onClose} 
                    className="cursor-pointer absolute top-4 right-4 text-white text-3xl font-bold bg-black bg-opacity-50 p-2 rounded-full hover:bg-opacity-80 transition-all duration-300">
                    <FaTimes />
                </button>
            )}

            <button 
                onClick={() => setIsMiniPlayer(!isMiniPlayer)} 
                className="cursor-pointer absolute bottom-4 right-4 text-white text-xl bg-black bg-opacity-50 p-2 rounded-full hover:bg-opacity-80 transition-all duration-300">
                <FaExpand />
            </button>

            <iframe 
                src={videoUrl} 
                className="w-full h-full rounded-lg" 
                allowFullScreen 
                title="Playing video">
            </iframe>
        </div>
    );
}
