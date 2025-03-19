import { useState, useEffect } from "react";
import { FaSun, FaMoon } from "react-icons/fa";

export default function DarkModeToggle() {
    const [darkMode, setDarkMode] = useState(() => {
        return localStorage.getItem("theme") === "dark";
    });

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add("dark");
            document.documentElement.setAttribute("data-theme", "dark");
            localStorage.setItem("theme", "dark");
        } else {
            document.documentElement.classList.remove("dark");
            document.documentElement.removeAttribute("data-theme");
            localStorage.setItem("theme", "light");
        }
    }, [darkMode]);

    return (
        <button
            onClick={() => setDarkMode(prevMode => !prevMode)}
            className="cursor-pointer p-2 rounded-full transition-all duration-300 hover:scale-110 bg-gray-200 dark:bg-gray-700"
        >
            {darkMode ? <FaSun className="text-yellow-400" /> : <FaMoon />}
        </button>
    );
}
