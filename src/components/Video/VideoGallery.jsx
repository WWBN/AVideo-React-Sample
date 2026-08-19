import { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { FaFilm, FaSearch } from "react-icons/fa";
import VideoSection, { VIDEO_GRID_CLASSES } from "./VideoSection";
import VideoCardSkeleton from "./VideoCardSkeleton";
import HeroBanner from "./HeroBanner";
import ContinueWatchingRow from "./ContinueWatchingRow";
import VideoPlayer from "./VideoPlayer";
import EmptyState from "../UI/EmptyState";
import { fetchVideos, fetchVideosByCategory, searchVideos, loadMoreVideos } from "../../config/api.jsx";
import { FIRSTPAGE_API_URL } from '../../config/config.jsx';

export default function VideoGallery({ selectedCategory, searchQuery, isLoggedIn }) {
  const [sections, setSections] = useState([]);
  const [error, setError] = useState(null);
  const [activeVideo, setActiveVideo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (searchQuery) {
      searchVideos(searchQuery, setSections, setError, setIsLoading)
        .finally(() => {
          setIsLoading(false);
        });
    } else if (selectedCategory) {
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
  }, [selectedCategory, searchQuery]);

  const isHome = !selectedCategory && !searchQuery;
  const featuredVideo = isHome ? sections[0]?.endpointResponse?.rows?.[0] : null;

  // Every video row already carries a `progress` field (percent/lastVideoTime) for logged-in
  // users - derive "Continue Watching" from it locally instead of a dedicated endpoint.
  const continueWatching = useMemo(() => {
    if (!isHome || !isLoggedIn) return [];
    const seen = new Set();
    const list = [];
    sections.forEach((section) => {
      section.endpointResponse.rows.forEach((video) => {
        const percent = video.progress?.percent;
        if (percent > 0 && percent < 95 && !seen.has(video.id)) {
          seen.add(video.id);
          list.push(video);
        }
      });
    });
    return list;
  }, [sections, isHome, isLoggedIn]);

  return (
    <motion.div
      className="p-6 bg-white text-gray-900 dark:bg-gray-900 dark:text-white transition-colors duration-300"
      initial={prefersReducedMotion ? false : { opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: prefersReducedMotion ? 0 : 0.6, ease: "easeOut" }}
    >
      {isLoading ? (
        <div className={VIDEO_GRID_CLASSES}>
          {Array.from({ length: 12 }).map((_, i) => (
            <VideoCardSkeleton key={i} />
          ))}
        </div>
      ) : sections.length > 0 ? (
        <>
          {featuredVideo && <HeroBanner video={featuredVideo} onPlay={setActiveVideo} />}

          {continueWatching.length > 0 && (
            <ContinueWatchingRow videos={continueWatching} onPlay={setActiveVideo} />
          )}

          {sections.map((section, index) => (
            <motion.div
              key={index}
              className="mb-8 p-4 rounded-xl bg-gray-100 dark:bg-gray-800 shadow-md dark:shadow-lg"
              initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.5 }}
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
        <EmptyState
          icon={searchQuery ? <FaSearch /> : <FaFilm />}
          title={error ? "Something went wrong" : searchQuery ? "No results found" : "No videos available"}
          message={
            error
              ? error
              : searchQuery
              ? `We couldn't find anything for "${searchQuery}". Try a different search.`
              : "Check back later for new content."
          }
        />
      )}

      {activeVideo && (
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.3 }}
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

