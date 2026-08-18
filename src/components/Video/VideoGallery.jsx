import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import VideoSection from "./VideoSection";
import VideoCardSkeleton from "./VideoCardSkeleton";
import HeroBanner from "./HeroBanner";
import VideoPlayer from "./VideoPlayer";
import { fetchVideos, fetchVideosByCategory, loadMoreVideos } from "../../config/api.jsx";
import { FIRSTPAGE_API_URL } from '../../config/config.jsx';

const SKELETON_GRID_CLASSES = "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-6 2xl:grid-cols-6 gap-6";

export default function VideoGallery({ selectedCategory }) {
  const [sections, setSections] = useState([]);
  const [error, setError] = useState(null);
  const [activeVideo, setActiveVideo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (selectedCategory) {
      fetchVideosByCategory(selectedCategory, setSections, setError, setIsLoading)
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      fetchVideos(FIRSTPAGE_API_URL, setSections, setError, setIsLoading)
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [selectedCategory]);

  const featuredVideo = !selectedCategory ? sections[0]?.endpointResponse?.rows?.[0] : null;

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

      {isLoading ? (
        <div className={SKELETON_GRID_CLASSES}>
          {Array.from({ length: 12 }).map((_, i) => (
            <VideoCardSkeleton key={i} />
          ))}
        </div>
      ) : sections.length > 0 ? (
        <>
          {featuredVideo && <HeroBanner video={featuredVideo} onPlay={setActiveVideo} />}

          {sections.map((section, index) => (
            <motion.div
              key={index}
              className="mb-8 p-4 rounded-lg bg-gray-100 dark:bg-gray-800 shadow-md dark:shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.5 }}
            >
              <VideoSection
                section={section}
                onPlay={setActiveVideo}
                onLoadMore={() => loadMoreVideos(index, section, setSections)}
              />
            </motion.div>
          ))}
        </>
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

