// Shimmer placeholder matching VideoCard's layout, shown while a video grid is loading.
export default function VideoCardSkeleton() {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md dark:shadow-lg overflow-hidden animate-pulse">
            <div className="h-48 bg-gray-200 dark:bg-gray-700" />
            <div className="p-4 space-y-3">
                <div className="h-4 w-4/5 rounded bg-gray-200 dark:bg-gray-700" />
                <div className="h-3 w-2/5 rounded bg-gray-200 dark:bg-gray-700" />
                <div className="h-3 w-3/5 rounded bg-gray-200 dark:bg-gray-700" />
                <div className="h-9 w-full rounded-lg bg-gray-200 dark:bg-gray-700 mt-4" />
            </div>
        </div>
    );
}
