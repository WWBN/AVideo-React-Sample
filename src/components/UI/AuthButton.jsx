import { FaUser, FaSignOutAlt } from "react-icons/fa";
import Tooltip from "./Tooltip";

export default function AuthButton({ isLoggedIn, onLogin, onLogout }) {
    return isLoggedIn ? (
        <Tooltip content="Log out">
            <button
                onClick={onLogout}
                aria-label="Log out"
                className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-transform transform hover:scale-105"
            >
                <FaSignOutAlt /> Logoff
            </button>
        </Tooltip>
    ) : (
        <Tooltip content="Log in to your account">
            <button
                onClick={onLogin}
                aria-label="Log in"
                className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-transform transform hover:scale-105"
            >
                <FaUser /> Login
            </button>
        </Tooltip>
    );
}
