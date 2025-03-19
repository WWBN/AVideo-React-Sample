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
        alert("You need to be logged in to react to the video.");
        return;
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
