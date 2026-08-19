import { DEFAULT_USER_PHOTO } from '../../config/config.jsx';

export default function UserInfo({ userPhoto, channelName, meta }) {
    return (
        <div className="flex items-center gap-2 mt-2 min-w-0">
            <img
                src={userPhoto || DEFAULT_USER_PHOTO}
                alt={channelName}
                className="w-8 h-8 rounded-full border border-gray-300 dark:border-gray-600 shrink-0"
            />
            <div className="min-w-0">
                <p className="text-sm text-gray-700 dark:text-gray-300 font-semibold truncate">
                    {channelName}
                </p>
                {meta && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{meta}</p>
                )}
            </div>
        </div>
    );
}
