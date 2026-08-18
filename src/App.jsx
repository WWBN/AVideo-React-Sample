import { useState, useEffect } from "react";
import VideoGallery from "./components/Video/VideoGallery";
import TopBar from "./components/UI/TopBar";
import FullPageLoader from "./components/UI/FullPageLoader";
import CategoryList from "./components/UI/CategoryList";
import { TooltipProvider } from "./components/UI/Tooltip";

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(() => {
        return localStorage.getItem("isLoggedIn") === "true";
    });
    const [loading, setLoading] = useState(false); 
    const [selectedCategory, setSelectedCategory] = useState(null);

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
            <TooltipProvider>
                <FullPageLoader loading={loading} /> 
                <TopBar isLoggedIn={isLoggedIn} onLogin={handleLogin} onLogout={handleLogout} />
                <CategoryList selectedCategory={selectedCategory} onSelectCategory={setSelectedCategory} />
                <div className="container-fluid mx-auto p-4">
                    <VideoGallery key={selectedCategory ?? "all"} setLoading={setLoading} selectedCategory={selectedCategory} /> 
                </div>
            </TooltipProvider>
        </div>
    );
}

export default App;
