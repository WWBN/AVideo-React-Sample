import { useState } from "react";
import { FaUser, FaLock, FaTimes, FaEye, FaEyeSlash } from "react-icons/fa";
import toast from "react-hot-toast";
import { login } from "../../config/api";
import Spinner from "../UI/Spinner";
import Tooltip from "../UI/Tooltip";

export default function LoginPage({ onLogin, onClose, onSwitchToSignUp }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!username || !password) {
            setError("Fill in all fields.");
            return;
        }

        setSubmitting(true);
        setError("");
        try {
            const response = await login(username, password);

            if (response.success) {
                toast.success(`Welcome back, ${response.data.username}!`);
                onLogin();
                onClose();
            } else {
                setError(response.message || "Invalid credentials.");
            }
        } catch (error) {
            setError("Error trying to log in. Please try again. " + error.message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
            <div className="w-full max-w-md p-6 bg-white dark:bg-gray-800 rounded-xl shadow-xl relative">
                <Tooltip content="Close">
                    <button
                        onClick={onClose}
                        aria-label="Close login form"
                        className="cursor-pointer absolute top-2 right-2 text-gray-700 dark:text-gray-300 hover:text-gray-900"
                    >
                        <FaTimes size={20} />
                    </button>
                </Tooltip>

                <h2 className="text-2xl font-bold mb-4 text-center text-gray-900 dark:text-white">Login</h2>

                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex items-center border rounded-lg p-2 bg-gray-200 dark:bg-gray-700">
                        <FaUser className="text-gray-500 dark:text-gray-300 mr-2" />
                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            autoFocus
                            disabled={submitting}
                            className="bg-transparent outline-none w-full text-gray-900 dark:text-white disabled:opacity-60"
                        />
                    </div>

                    <div className="flex items-center border rounded-lg p-2 bg-gray-200 dark:bg-gray-700">
                        <FaLock className="text-gray-500 dark:text-gray-300 mr-2" />
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={submitting}
                            className="bg-transparent outline-none w-full text-gray-900 dark:text-white disabled:opacity-60"
                        />
                        <Tooltip content={showPassword ? "Hide password" : "Show password"}>
                            <button
                                type="button"
                                onClick={() => setShowPassword((prev) => !prev)}
                                aria-label={showPassword ? "Hide password" : "Show password"}
                                className="cursor-pointer text-gray-500 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white ml-2"
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </Tooltip>
                    </div>

                    <Tooltip content="Log in to your account">
                        <button
                            type="submit"
                            disabled={submitting}
                            className="cursor-pointer w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg transition-transform transform hover:scale-105 disabled:opacity-70 disabled:hover:scale-100 flex items-center justify-center gap-2"
                        >
                            {submitting && <Spinner size={16} />}
                            {submitting ? "Logging in..." : "Login"}
                        </button>
                    </Tooltip>

                    {onSwitchToSignUp && (
                        <p className="text-center text-sm text-gray-600 dark:text-gray-300">
                            New here?{" "}
                            <Tooltip content="Create a new account">
                                <button
                                    type="button"
                                    onClick={onSwitchToSignUp}
                                    className="cursor-pointer text-blue-600 dark:text-blue-400 hover:underline"
                                >
                                    Create an account
                                </button>
                            </Tooltip>
                        </p>
                    )}
                </form>
            </div>
        </div>
    );
}
