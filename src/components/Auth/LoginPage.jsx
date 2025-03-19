import { useState } from "react";
import { FaUser, FaLock, FaTimes } from "react-icons/fa";
import { login } from "../../config/api";

export default function LoginPage({ onLogin, onClose }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!username || !password) {
            setError("Fill in all fields.");
            return;
        }

        try {
            const response = await login(username, password);

            if (response.success) {
                onLogin();
                onClose();
            } else {
                setError(response.message || "Invalid credentials.");
            }
        } catch (error) {
            setError("Error trying to log in. Please try again. " + error.message);
        }
    };

    return (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
            <div className="w-full max-w-md p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md relative">
                <button
                    onClick={onClose}
                    className="cursor-pointer absolute top-2 right-2 text-gray-700 dark:text-gray-300 hover:text-gray-900"
                >
                    <FaTimes size={20} />
                </button>

                <h2 className="text-2xl font-bold mb-4 text-center text-gray-900 dark:text-white">Login</h2>

                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex items-center border rounded-md p-2 bg-gray-200 dark:bg-gray-700">
                        <FaUser className="text-gray-500 dark:text-gray-300 mr-2" />
                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="bg-transparent outline-none w-full text-gray-900 dark:text-white"
                        />
                    </div>

                    <div className="flex items-center border rounded-md p-2 bg-gray-200 dark:bg-gray-700">
                        <FaLock className="text-gray-500 dark:text-gray-300 mr-2" />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="bg-transparent outline-none w-full text-gray-900 dark:text-white"
                        />
                    </div>

                    <button
                        type="submit"
                        className="cursor-pointer w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-md transition-transform transform hover:scale-105"
                    >
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
}
