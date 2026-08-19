import { useState } from "react";
import { FaListUl } from "react-icons/fa";
import LoginPage from "../Auth/LoginPage";
import SignUpPage from "../Auth/SignUpPage";
import PlaylistsPage from "../Playlist/PlaylistsPage";
import Logo from "./Logo";
import DarkModeToggle from "./DarkModeToggle";
import AuthButton from "./AuthButton";
import SearchBar from "./SearchBar";
import Tooltip from "./Tooltip";

export default function TopBar({ isLoggedIn, onLogin, onLogout, onSearch, onClearSearch, onGoHome, searchResetKey }) {
    const [authMode, setAuthMode] = useState(null); // null | 'login' | 'signup'
    const [showPlaylists, setShowPlaylists] = useState(false);

    return (
        <>
            <nav className="sticky top-0 z-40 px-4 py-3 shadow-md flex flex-wrap items-center gap-3 transition-colors duration-300 bg-white/80 text-gray-900 dark:bg-gray-900/70 dark:text-white backdrop-blur-md border-b border-gray-200/60 dark:border-gray-700/60">
                {/* Logo Component - also acts as "back to home" (clears any active search/category) */}
                <Logo onNavigateHome={onGoHome} />

                <div className="order-3 w-full sm:order-none sm:flex sm:flex-1 sm:justify-center">
                    <SearchBar
                        key={searchResetKey}
                        onSearch={onSearch}
                        onClear={onClearSearch}
                        className="sm:max-w-xl"
                    />
                </div>

                <div className="flex items-center gap-2 ml-auto sm:ml-0 shrink-0">
                    {isLoggedIn && (
                        <Tooltip content="My Playlists">
                            <button
                                onClick={() => setShowPlaylists(true)}
                                aria-label="My Playlists"
                                className="cursor-pointer flex items-center justify-center w-10 h-10 rounded-full text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                            >
                                <FaListUl />
                            </button>
                        </Tooltip>
                    )}

                    {/* Dark Mode Toggle Component */}
                    <DarkModeToggle />

                    {/* Login/Logout Button Component */}
                    <AuthButton isLoggedIn={isLoggedIn} onLogin={() => setAuthMode("login")} onLogout={onLogout} />
                </div>
            </nav>

            {authMode === "login" && (
                <LoginPage
                    onClose={() => setAuthMode(null)}
                    onLogin={onLogin}
                    onSwitchToSignUp={() => setAuthMode("signup")}
                />
            )}

            {authMode === "signup" && (
                <SignUpPage
                    onClose={() => setAuthMode(null)}
                    onSwitchToLogin={() => setAuthMode("login")}
                />
            )}

            {showPlaylists && <PlaylistsPage onClose={() => setShowPlaylists(false)} />}
        </>
    );
}
