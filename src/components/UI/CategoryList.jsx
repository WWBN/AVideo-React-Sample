import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getCategories } from "../../config/api";
import Spinner from "./Spinner";
import Tooltip from "./Tooltip";

// Shared layoutId lets the active pill's background glide smoothly to whichever pill is selected.
const ActivePillBackground = () => (
    <motion.span
        layoutId="category-pill-active"
        className="absolute inset-0 rounded-full bg-blue-600"
        transition={{ type: "spring", stiffness: 400, damping: 32 }}
    />
);

export default function CategoryList({ selectedCategory, onSelectCategory }) {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        getCategories()
            .then(setCategories)
            .catch(() => setError("Could not load categories."))
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div className="flex items-center gap-2 px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                <Spinner size={14} /> Loading categories...
            </div>
        );
    }

    if (error || categories.length === 0) return null;

    const pillClasses = (isActive) =>
        `relative cursor-pointer shrink-0 flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium transition-colors duration-200 ${
            isActive ? "text-white" : "text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700"
        }`;

    return (
        <div className="relative bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
            <div className="flex gap-2 overflow-x-auto px-4 py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                <Tooltip content="Show videos from every category">
                    <button
                        onClick={() => onSelectCategory(null)}
                        className={pillClasses(!selectedCategory)}
                    >
                        {!selectedCategory && <ActivePillBackground />}
                        <span className="relative z-10">All</span>
                    </button>
                </Tooltip>

                {categories.map((cat) => (
                    <Tooltip key={cat.id} content={`${cat.fullTotal ?? 0} video(s) in ${cat.name}`}>
                        <button
                            onClick={() => onSelectCategory(cat.clean_name)}
                            className={pillClasses(selectedCategory === cat.clean_name)}
                        >
                            {selectedCategory === cat.clean_name && <ActivePillBackground />}
                            <span className="relative z-10 flex items-center gap-1.5">
                                {cat.iconClass && <i className={cat.iconClass} aria-hidden="true"></i>}
                                {cat.name}
                            </span>
                        </button>
                    </Tooltip>
                ))}
            </div>

            {/* Edge fades hint that the pill row scrolls horizontally */}
            <div className="pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-white dark:from-gray-900 to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-white dark:from-gray-900 to-transparent" />
        </div>
    );
}

