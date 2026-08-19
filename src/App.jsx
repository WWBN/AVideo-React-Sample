import { useState, useEffect } from "react";
import { Toaster, toast } from "react-hot-toast";
import VideoGallery from "./components/Video/VideoGallery";
import TopBar from "./components/UI/TopBar";
import CategoryList from "./components/UI/CategoryList";
import { TooltipProvider } from "./components/UI/Tooltip";

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(() => {
        return localStorage.getItem("isLoggedIn") === "true";
    });
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResetToken, setSearchResetToken] = useState(0);

    const handleLogin = () => {
        setIsLoggedIn(true);
        localStorage.setItem("isLoggedIn", "true");
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        localStorage.removeItem("isLoggedIn");
        toast.success("Logged out successfully");
    };

    const handleSelectCategory = (category) => {
        setSelectedCategory(category);
        setSearchQuery("");
    };

    const handleSearch = (query) => {
        setSearchQuery(query);
        setSelectedCategory(null);
    };

    const handleGoHome = () => {
        setSearchQuery("");
        setSelectedCategory(null);
        setSearchResetToken((token) => token + 1);
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
                <Toaster
                    position="top-right"
                    toastOptions={{
                        duration: 3500,
                        style: {
                            background: "#1f2937",
                            color: "#fff",
                            borderRadius: "0.75rem",
                            padding: "0.75rem 1rem",
                            boxShadow: "0 10px 25px rgba(0,0,0,0.35)",
                        },
                        success: { iconTheme: { primary: "#22c55e", secondary: "#1f2937" } },
                        error: { iconTheme: { primary: "#ef4444", secondary: "#1f2937" } },
                    }}
                />
                <TopBar
                    isLoggedIn={isLoggedIn}
                    onLogin={handleLogin}
                    onLogout={handleLogout}
                    onSearch={handleSearch}
                    onClearSearch={() => setSearchQuery("")}
                    onGoHome={handleGoHome}
                    searchResetKey={`${selectedCategory ?? "all"}:${searchResetToken}`}
                />
                {!searchQuery && (
                    <CategoryList selectedCategory={selectedCategory} onSelectCategory={handleSelectCategory} />
                )}
                <div className="container-fluid mx-auto p-4">
                    <VideoGallery
                        key={searchQuery ? `search:${searchQuery}` : (selectedCategory ?? "all")}
                        selectedCategory={selectedCategory}
                        searchQuery={searchQuery}
                        isLoggedIn={isLoggedIn}
                    />
                </div>
            </TooltipProvider>
        </div>
    );
}

export default App;
