import { useEffect, useState, useRef } from "react";
import VideoSection from "./VideoSection";
import VideoPlayer from "./VideoPlayer";
import { fetchVideos, loadMoreVideos } from "../../config/api.jsx"; 
import { FIRSTPAGE_API_URL } from '../../config/config.jsx';

export default function VideoGallery({ setLoading }) { // Accept setLoading prop
    const [sections, setSections] = useState([]);
    const [error, setError] = useState(null);
    const [activeVideo, setActiveVideo] = useState(null);
    const isFirstLoad = useRef(true);

    useEffect(() => {
        if (isFirstLoad.current) {
            console.log("Setting loading to true...");
            setLoading(true);
            fetchVideos(FIRSTPAGE_API_URL, setSections, setError, setLoading)
              .finally(() => {
                  console.log("Setting loading to false...");
                  setLoading(false);
              });
            isFirstLoad.current = false;
        }
    }, [setLoading]);
    

    return (
        <div className="p-6 bg-white text-gray-900 dark:bg-gray-900 dark:text-white transition-colors duration-300">
            {error && <p className="text-center text-red-500 dark:text-red-400">{error}</p>}

            {sections.length > 0 ? (
                sections.map((section, index) => (
                    <div key={index} className="mb-8 p-4 rounded-lg bg-gray-100 dark:bg-gray-800 shadow-md dark:shadow-lg">
                        <VideoSection 
                            section={section} 
                            onPlay={setActiveVideo} 
                            onLoadMore={() => loadMoreVideos(index, section, setSections)}
                        />
                    </div>
                ))
            ) : (
                <p className="text-center text-gray-500 dark:text-gray-400">No videos available at the moment.</p>
            )}

            {activeVideo && <VideoPlayer videoUrl={activeVideo} onClose={() => setActiveVideo(null)} />}
        </div>
    );
}
