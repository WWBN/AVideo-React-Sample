export default function TagList({ tags }) {
    return (
        <div className="flex flex-wrap gap-1 mt-2">
            {tags
                .filter(tag => tag.text && tag.text !== "0")
                .map((tag, index) => (
                    <span 
                        key={index}
                        className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-2 py-1 rounded-md"
                        dangerouslySetInnerHTML={{ __html: `#${tag.text}` }}
                    >
                    </span>
                ))}
        </div>
    );
}
