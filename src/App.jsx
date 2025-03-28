import { useState, useEffect } from "react";
import VideoGallery from "./components/Video/VideoGallery";
import TopBar from "./components/UI/TopBar";
import FullPageLoader from "./components/UI/FullPageLoader"; 

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(() => {
        return localStorage.getItem("isLoggedIn") === "true";
    });
    const [loading, setLoading] = useState(false); 

    const handleLogin = () => {
        setIsLoggedIn(true);
        localStorage.setItem("isLoggedIn", "true");
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        localStorage.removeItem("isLoggedIn");
    };

    useEffect(() => {
        const favicon = document.querySelector("link[rel~='icon']");
        if (favicon) {
          favicon.href = import.meta.env.VITE_BASE_URL + "videos/favicon.ico";
        }
      }, []);

    return (
        <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300">
            <FullPageLoader loading={loading} /> 
            <TopBar isLoggedIn={isLoggedIn} onLogin={handleLogin} onLogout={handleLogout} />
            <div className="container-fluid mx-auto p-4">
                <VideoGallery setLoading={setLoading} /> 
            </div>
        </div>
    );
}

export default App;
