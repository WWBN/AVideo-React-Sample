// In dev, route calls through the Vite proxy (see vite.config.js) instead of hitting
// the AVideo server directly, since it doesn't send CORS headers for localhost origins.
export const BASE_URL = import.meta.env.DEV
    ? `${window.location.origin}/avideo-api/`
    : (import.meta.env.VITE_BASE_URL || "https://tutorials.avideo.com/");
export const DEFAULT_USER_PHOTO = `${BASE_URL}view/img/placeholders/user.png`;
export const DEFAULT_IMAGE = `${BASE_URL}view/img/video-placeholder-gray.webp`;
export const FIRSTPAGE_API_URL = `${BASE_URL}plugin/API/get.json.php?APIPlugin=Gallery&APIName=firstPage`;
