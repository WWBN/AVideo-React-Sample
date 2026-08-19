import { useState } from "react";
import { FaSearch, FaTimes } from "react-icons/fa";

// Search field wired to the AVideo API's searchPhrase parameter (get_api_video). Submits on
// Enter/icon click; the resulting "section" is rendered by the same VideoGallery/VideoSection
// pipeline used for categories, so no separate results UI is needed.
export default function SearchBar({ onSearch, onClear, className = "" }) {
    const [value, setValue] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        const trimmed = value.trim();
        if (trimmed) onSearch(trimmed);
    };

    const handleClear = () => {
        setValue("");
        onClear();
    };

    return (
        <form onSubmit={handleSubmit} role="search" className={`relative w-full ${className}`}>
            <FaSearch className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
            <input
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="Search videos..."
                aria-label="Search videos"
                className="w-full rounded-full border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 py-2 pl-10 pr-9 text-sm text-gray-900 dark:text-white outline-none transition-colors focus:border-blue-500 focus:bg-white dark:focus:bg-gray-900 focus:ring-2 focus:ring-blue-500/40"
            />
            {value && (
                <button
                    type="button"
                    onClick={handleClear}
                    aria-label="Clear search"
                    className="cursor-pointer absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                    <FaTimes size={12} />
                </button>
            )}
        </form>
    );
}
