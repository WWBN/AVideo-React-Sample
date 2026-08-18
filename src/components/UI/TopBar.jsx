import { useState } from "react";
import { FaListUl } from "react-icons/fa";
import LoginPage from "../Auth/LoginPage";
import SignUpPage from "../Auth/SignUpPage";
import PlaylistsPage from "../Playlist/PlaylistsPage";
import Logo from "./Logo";
import DarkModeToggle from "./DarkModeToggle";
import AuthButton from "./AuthButton";
import Tooltip from "./Tooltip";

export default function TopBar({ isLoggedIn, onLogin, onLogout }) {
    const [authMode, setAuthMode] = useState(null); // null | 'login' | 'signup'
    const [showPlaylists, setShowPlaylists] = useState(false);

    return (
        <>
            <nav className="sticky top-0 z-40 p-4 shadow-md flex justify-between items-center transition-colors duration-300 bg-white/80 text-gray-900 dark:bg-gray-900/70 dark:text-white backdrop-blur-md border-b border-gray-200/60 dark:border-gray-700/60">
                {/* Logo Component */}
                <Logo />

                <div className="flex items-center gap-4">
                    {isLoggedIn && (
                        <Tooltip content="My Playlists">
                            <button
                                onClick={() => setShowPlaylists(true)}
                                aria-label="My Playlists"
                                className="cursor-pointer text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 text-lg"
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
