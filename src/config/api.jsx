import { BASE_URL } from './config.jsx';

// General function to handle API requests
const requestAPI = async (endpoint, method = 'GET', body = null) => {
    try {
        // Retrieve stored credentials
        const storedCredentials = localStorage.getItem('credentials');
        let authParams = {};

        if (storedCredentials) {
            const { user, pass } = JSON.parse(storedCredentials);
            authParams = { user, pass };
        }

        // Construct request options
        const options = {
            method,
            headers: {
                'Content-Type': 'application/json'
            }
        };

        let url = endpoint.startsWith("http") ? endpoint : `${BASE_URL}plugin/API/${endpoint}`;


        if (method === 'GET' || method === 'HEAD') {
            const urlObj = new URL(url);
            Object.entries(authParams).forEach(([key, value]) => {
                urlObj.searchParams.append(key, value);
            });
            url = urlObj.toString();
        } else {
            options.body = JSON.stringify({ ...body, ...authParams });
        }

        const response = await fetch(url, options);

        if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);

        return await response.json();
    } catch (error) {
        console.error(`API Request Failed: ${error.message}`);
        throw error;
    }
};

// Alias for AVideo API calls
const requestAVideoAPI = (endpoint, method = 'GET', body = null) => {
    return requestAPI(endpoint, method, body);
};

// Function to handle login
export const login = async (user, pass) => {
    try {
        const data = await requestAVideoAPI('get.json.php?APIName=signIn', 'POST', { user, pass });

        if (data.id !== 0) {
            // Save user details
            localStorage.setItem('user', JSON.stringify({
                id: data.id,
                username: data.user,
                email: data.email,
                photo: data.photo,
                backgroundURL: data.backgroundURL,
                isAdmin: data.isAdmin,
                canUpload: data.canUpload,
                canComment: data.canComment,
                canMeet: data.canMeet,
                canCreateCategory: data.canCreateCategory,
                canStream: data.canStream,
                theme: data.theme,
                redirectUri: data.redirectUri,
                embedChatUrl: data.embedChatUrl,
                embedChatUrlMobile: data.embedChatUrlMobile,
                streamServerURL: data.streamServerURL,
                streamKey: data.streamKey,
            }));

            // Store credentials
            localStorage.setItem('credentials', JSON.stringify({ user, pass }));

            return { success: true, data };
        } else {
            return { success: false, message: "Login failed. Invalid username or password." };
        }
    } catch (error) {
        console.error("Login error:", error);
        return { success: false, message: "An error occurred while logging in." };
    }
};

// Function to handle logout
export const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('credentials');
    window.location.reload();
};

// Function to request a new CAPTCHA challenge (JPEG image as base64 + its PHP session id)
export const getCaptcha = async () => {
    const response = await fetch(`${BASE_URL}objects/getCaptcha.json.php`);
    if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
    return response.json();
};

// Function to register a new user; requires the sessionId/captcha pair obtained from getCaptcha().
// Uses form-urlencoded + PHPSESSID query param since the API reads $_POST/$_REQUEST for signUp.
export const signUp = async ({ user, pass, email, name, captcha, sessionId }) => {
    const url = `${BASE_URL}plugin/API/set.json.php?APIName=signUp&PHPSESSID=${encodeURIComponent(sessionId)}`;
    const body = new URLSearchParams({ user, pass, email, name, captcha });

    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body
    });

    if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
    return response.json();
};

// Function to get stored user data
export const getUserData = () => {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
};

// Function to get stored credentials
export const getStoredCredentials = () => {
    const credentials = localStorage.getItem('credentials');
    return credentials ? JSON.parse(credentials) : null;
};

// Fetch function for the initial load
export const fetchVideos = async (url, setSections, setError, setLoading) => {
    setLoading(true);
    try {
        //await new Promise(resolve => setTimeout(resolve, 2000)); // Delay 2s artificially
        const data = await requestAPI(url);

        if (data.error || !data.response.sections.length) {
            throw new Error("No videos found.");
        }

        setSections(prevSections => {
            const existingSectionTitles = new Set(prevSections.map(section => section.title));

            const newSections = data.response.sections
                .filter(section => section.endpointResponse?.rows.length > 0 && !existingSectionTitles.has(section.title))
                .map(section => ({
                    ...section,
                    currentPage: 2
                }));

            return [...prevSections, ...newSections];
        });

        setError(null);
    } catch (error) {
        setError(`Error loading videos: ${error.message}`);
    } finally {
        setLoading(false);
    }
};


// Function to load more videos
export const loadMoreVideos = async (index, section, setSections) => {
    if (!section.nextEndpoint || section.loadingMore) return;

    setSections(prevSections => {
        const updatedSections = [...prevSections];
        updatedSections[index].loadingMore = true;
        return updatedSections;
    });

    try {
        const url = new URL(section.nextEndpoint);
        url.searchParams.set("current", section.currentPage);
        url.searchParams.set("rowCount", "12");

        const data = await requestAPI(url.toString());

        if (!data.response.rows || data.response.rows.length === 0) return;

        setSections(prevSections => {
            const updatedSections = [...prevSections];

            const existingVideoIds = new Set(updatedSections[index].endpointResponse.rows.map(v => v.id));
            const newVideos = data.response.rows.filter(v => !existingVideoIds.has(v.id));

            updatedSections[index] = {
                ...updatedSections[index],
                endpointResponse: {
                    ...updatedSections[index].endpointResponse,
                    rows: [...updatedSections[index].endpointResponse.rows, ...newVideos],
                    hasMore: data.response.hasMore ?? false
                },
                currentPage: updatedSections[index].currentPage + 1,
                loadingMore: false
            };

            return updatedSections;
        });
    } catch (error) {
        console.error("Error loading more videos:", error);
    }
};

// Function to handle likes/dislikes
export const handleReaction = async (videos_id, reactionType) => {
    const credentials = getStoredCredentials();
    if (!credentials) {
        return { error: true, message: "You need to be logged in to react to the video." };
    }

    let apiName = "";

    if (reactionType === "like") {
        apiName = "like";
    } else if (reactionType === "dislike") {
        apiName = "dislike";
    } else if (reactionType === "removelike") {
        apiName = "removelike";
    } else {
        console.error("Invalid reaction type.");
        return;
    }

    try {
        const response = await requestAVideoAPI(
            `set.json.php?APIName=${apiName}&videos_id=${videos_id}`,
            "POST"
        );

        return response;
    } catch (error) {
        console.error("Error connecting to API:", error);
    }
};

// Function to fetch comments for a video
export const getComments = async (videos_id) => {
    return requestAVideoAPI(`get.json.php?APIName=comment&videos_id=${videos_id}`);
};

// Function to post a new comment on a video (requires the user to be logged in)
export const postComment = async (videos_id, comment) => {
    try {
        return await requestAVideoAPI(
            `set.json.php?APIName=comment&videos_id=${videos_id}&comment=${encodeURIComponent(comment)}`,
            "POST"
        );
    } catch (error) {
        console.error("Error posting comment:", error);
        throw error;
    }
};

// Function to fetch all site categories (id, iconClass, name, clean_name, total/fullTotal video counts)
export const getCategories = async () => {
    const data = await requestAVideoAPI('get.json.php?APIName=categories');
    return data.response || [];
};

// Fetch the first page of videos belonging to a single category (identified by its clean_name)
// and adapt the response into the same "section" shape fetchVideos()/loadMoreVideos() expect,
// so VideoGallery/VideoSection can render it without any special-casing.
export const fetchVideosByCategory = async (catName, setSections, setError, setLoading) => {
    setLoading(true);
    try {
        const endpoint = `${BASE_URL}plugin/API/get.json.php?APIName=video&catName=${encodeURIComponent(catName)}&rowCount=12&current=1&noRelated=1`;
        const data = await requestAPI(endpoint);

        if (data.error || !data.response?.rows?.length) {
            throw new Error("No videos found in this category.");
        }

        setSections([{
            title: data.response.category?.name || catName,
            nextEndpoint: endpoint,
            currentPage: 2,
            endpointResponse: {
                rows: data.response.rows,
                hasMore: data.response.hasMore ?? false
            }
        }]);
        setError(null);
    } catch (error) {
        setSections([]);
        setError(`Error loading videos: ${error.message}`);
    } finally {
        setLoading(false);
    }
};

// Search videos by keyword (searchPhrase, supported directly by get_api_video) and adapt the
// response into the same "section" shape fetchVideos()/loadMoreVideos() expect.
export const searchVideos = async (query, setSections, setError, setLoading) => {
    setLoading(true);
    try {
        const endpoint = `${BASE_URL}plugin/API/get.json.php?APIName=video&searchPhrase=${encodeURIComponent(query)}&rowCount=12&current=1&noRelated=1`;
        const data = await requestAPI(endpoint);

        if (data.error || !data.response?.rows?.length) {
            throw new Error("No videos found.");
        }

        setSections([{
            title: `Results for "${query}"`,
            nextEndpoint: endpoint,
            currentPage: 2,
            endpointResponse: {
                rows: data.response.rows,
                hasMore: data.response.hasMore ?? false
            }
        }]);
        setError(null);
    } catch {
        setSections([]);
        setError(null);
    } finally {
        setLoading(false);
    }
};

// Function to add or remove a video from the user's favorites (requires the PlayLists plugin and login)
export const setFavorite = async (videos_id, add) => {
    const apiName = add ? "favorite" : "removeFavorite";

    try {
        return await requestAVideoAPI(`set.json.php?APIName=${apiName}&videos_id=${videos_id}`, "POST");
    } catch (error) {
        console.error("Error updating favorite:", error);
        throw error;
    }
};

// Function to fetch the logged-in user's playlists (Programs API), optionally only those with videos.
// Each playlist includes a `videos` array of { videos_id, ... } rows used to check membership.
export const getPlaylists = async (onlyWithVideos = false) => {
    const data = await requestAVideoAPI(`get.json.php?APIName=programs&onlyWithVideos=${onlyWithVideos ? 1 : 0}`);
    return data.response || [];
};

// Function to fetch a single playlist's videos. Rows share the same enriched shape as the
// main gallery (Poster, embedlink, duration, etc.) since both use Video::getAllVideos() server-side.
export const getPlaylistVideos = async (playlists_id) => {
    const data = await requestAVideoAPI(`get.json.php?APIName=program&playlists_id=${playlists_id}`);
    return data.response?.videos || [];
};

// Function to create a new playlist for the logged-in user
export const createPlaylist = async (name, status = "unlisted") => {
    return requestAVideoAPI(`set.json.php?APIName=create_programs&name=${encodeURIComponent(name)}&status=${status}`, "POST");
};

// Function to delete a playlist owned by the logged-in user
export const deletePlaylist = async (playlists_id) => {
    return requestAVideoAPI(`set.json.php?APIName=delete_programs&playlists_id=${playlists_id}`, "POST");
};

// Function to add (add=true) or remove (add=false) a video from a playlist
export const togglePlaylistVideo = async (videos_id, playlists_id, add) => {
    return requestAVideoAPI(`set.json.php?APIName=programs&videos_id=${videos_id}&playlists_id=${playlists_id}&add=${add ? 1 : 0}`, "POST");
};
