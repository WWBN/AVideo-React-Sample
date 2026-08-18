import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import VideoSection from "./VideoSection";
import VideoPlayer from "./VideoPlayer";
import { fetchVideos, fetchVideosByCategory, loadMoreVideos } from "../../config/api.jsx";
import { FIRSTPAGE_API_URL } from '../../config/config.jsx';

export default function VideoGallery({ setLoading, selectedCategory }) {
  const [sections, setSections] = useState([]);
  const [error, setError] = useState(null);
  const [activeVideo, setActiveVideo] = useState(null);

  useEffect(() => {
    setLoading(true);
    if (selectedCategory) {
      fetchVideosByCategory(selectedCategory, setSections, setError, setLoading)
        .finally(() => {
          setLoading(false);
        });
    } else {
      fetchVideos(FIRSTPAGE_API_URL, setSections, setError, setLoading)
        .finally(() => {
          setLoading(false);
        });
    }
  }, [selectedCategory, setLoading]);

  return (
    <motion.div
      className="p-6 bg-white text-gray-900 dark:bg-gray-900 dark:text-white transition-colors duration-300"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {error && (
        <motion.p
          className="text-center text-red-500 dark:text-red-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {error}
        </motion.p>
      )}

      {sections.length > 0 ? (
        sections.map((section, index) => (
          <motion.div
            key={index}
            className="mb-8 p-4 rounded-lg bg-gray-100 dark:bg-gray-800 shadow-md dark:shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2, duration: 0.5 }}
          >
            <VideoSection
              section={section}
              onPlay={setActiveVideo}
              onLoadMore={() => loadMoreVideos(index, section, setSections)}
            />
          </motion.div>
        ))
      ) : (
        <motion.p
          className="text-center text-gray-500 dark:text-gray-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          No videos available at the moment.
        </motion.p>
      )}

      {activeVideo && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <VideoPlayer
            videoUrl={activeVideo.embedlink}
            videosId={activeVideo.id}
            onClose={() => setActiveVideo(null)}
          />
        </motion.div>
      )}
    </motion.div>
  );
}
