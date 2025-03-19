import { FaUser, FaSignOutAlt } from "react-icons/fa";

export default function AuthButton({ isLoggedIn, onLogin, onLogout }) {
    return isLoggedIn ? (
        <button
            onClick={onLogout}
            className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-transform transform hover:scale-105"
        >
            <FaSignOutAlt /> Logoff
        </button>
    ) : (
        <button
            onClick={onLogin}
            className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-transform transform hover:scale-105"
        >
            <FaUser /> Login
        </button>
    );
}
