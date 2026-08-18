import { useEffect, useState } from "react";
import { getCategories } from "../../config/api";
import Spinner from "./Spinner";
import Tooltip from "./Tooltip";

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
        `cursor-pointer shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors duration-200 ${
            isActive
                ? "bg-blue-600 text-white"
                : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700"
        }`;

    return (
        <div className="flex gap-2 overflow-x-auto px-4 py-3 border-b border-gray-200 dark:border-gray-700">
            <Tooltip content="Show videos from every category">
                <button
                    onClick={() => onSelectCategory(null)}
                    className={pillClasses(!selectedCategory)}
                >
                    All
                </button>
            </Tooltip>

            {categories.map((cat) => (
                <Tooltip key={cat.id} content={`${cat.fullTotal ?? 0} video(s) in ${cat.name}`}>
                    <button
                        onClick={() => onSelectCategory(cat.clean_name)}
                        className={pillClasses(selectedCategory === cat.clean_name)}
                    >
                        {cat.iconClass && <i className={cat.iconClass} aria-hidden="true"></i>}
                        {cat.name}
                    </button>
                </Tooltip>
            ))}
        </div>
    );
}
