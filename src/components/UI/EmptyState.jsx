// Shared empty/error placeholder: icon + short message + optional action, used across
// the gallery, playlists and comments instead of ad-hoc one-off "no data" strings.
export default function EmptyState({ icon, title, message, action }) {
    return (
        <div className="flex flex-col items-center justify-center gap-3 py-16 px-4 text-center">
            {icon && <div className="text-4xl text-gray-300 dark:text-gray-600">{icon}</div>}
            <p className="text-base font-semibold text-gray-700 dark:text-gray-200">{title}</p>
            {message && <p className="text-sm max-w-sm text-gray-500 dark:text-gray-400">{message}</p>}
            {action}
        </div>
    );
}
