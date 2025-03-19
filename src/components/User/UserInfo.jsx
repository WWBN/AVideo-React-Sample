import { DEFAULT_USER_PHOTO } from '../../config/config.jsx';

export default function UserInfo({ userPhoto, channelName }) {
    return (
        <div className="flex items-center mt-2">
            <img
                src={userPhoto || DEFAULT_USER_PHOTO}
                alt={channelName}
                className="w-8 h-8 rounded-full mr-2 border border-gray-300 dark:border-gray-600"
            />
            <p className="text-sm text-gray-700 dark:text-gray-300 font-semibold">
                {channelName}
            </p>
        </div>
    );
}
