import { useState } from "react";
import LoginPage from "../Auth/LoginPage";
import Logo from "./Logo";
import DarkModeToggle from "./DarkModeToggle";
import AuthButton from "./AuthButton";

export default function TopBar({ isLoggedIn, onLogin, onLogout }) {
    const [showLogin, setShowLogin] = useState(false); // Control login modal visibility

    return (
        <>
            <nav className="p-4 shadow-md flex justify-between items-center transition-colors duration-300 bg-white text-gray-900 dark:bg-gray-900 dark:text-white">
                {/* Logo Component */}
                <Logo />

                <div className="flex items-center gap-4">
                    {/* Dark Mode Toggle Component */}
                    <DarkModeToggle />

                    {/* Login/Logout Button Component */}
                    <AuthButton isLoggedIn={isLoggedIn} onLogin={() => setShowLogin(true)} onLogout={onLogout} />
                </div>
            </nav>

            {/* Show Login Page as a Modal */}
            {showLogin && <LoginPage onClose={() => setShowLogin(false)} onLogin={onLogin} />}
        </>
    );
}
