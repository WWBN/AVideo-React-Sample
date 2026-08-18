import { useState, useEffect } from "react";
import { FaUser, FaLock, FaEnvelope, FaIdCard, FaTimes, FaSyncAlt, FaEye, FaEyeSlash } from "react-icons/fa";
import { getCaptcha, signUp } from "../../config/api";
import Spinner from "../UI/Spinner";
import Tooltip from "../UI/Tooltip";

export default function SignUpPage({ onClose, onSwitchToLogin }) {
    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [captchaCode, setCaptchaCode] = useState("");
    const [captcha, setCaptcha] = useState(null);
    const [captchaLoading, setCaptchaLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const loadCaptcha = () => {
        setCaptcha(null);
        setCaptchaLoading(true);
        return getCaptcha()
            .then((data) => setCaptcha({ sessionId: data.session_id, image: data.base64String }))
            .catch(() => setError("Could not load the CAPTCHA image. Please try again."))
            .finally(() => setCaptchaLoading(false));
    };

    useEffect(() => {
        getCaptcha()
            .then((data) => setCaptcha({ sessionId: data.session_id, image: data.base64String }))
            .catch(() => setError("Could not load the CAPTCHA image. Please try again."))
            .finally(() => setCaptchaLoading(false));
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!name || !username || !email || !password || !captchaCode) {
            setError("Fill in all fields.");
            return;
        }
        if (!captcha) {
            setError("CAPTCHA not loaded yet.");
            return;
        }

        setSubmitting(true);
        try {
            const response = await signUp({
                user: username,
                pass: password,
                email,
                name,
                captcha: captchaCode,
                sessionId: captcha.sessionId
            });

            if (response.error) {
                setError(response.msg || response.message || "Could not create the account.");
                // the CAPTCHA is consumed/invalidated after every attempt, so fetch a new one
                setCaptchaCode("");
                loadCaptcha();
            } else {
                setSuccess(true);
            }
        } catch (error) {
            setError("Error trying to sign up. Please try again. " + error.message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
            <div className="w-full max-w-md p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md relative">
                <Tooltip content="Close">
                    <button
                        onClick={onClose}
                        aria-label="Close sign up form"
                        className="cursor-pointer absolute top-2 right-2 text-gray-700 dark:text-gray-300 hover:text-gray-900"
                    >
                        <FaTimes size={20} />
                    </button>
                </Tooltip>

                <h2 className="text-2xl font-bold mb-4 text-center text-gray-900 dark:text-white">Sign Up</h2>

                {success ? (
                    <div className="text-center space-y-4">
                        <p className="text-green-600 dark:text-green-400">Your account has been created! You can now log in.</p>
                        <button
                            onClick={onSwitchToLogin}
                            className="cursor-pointer w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-md transition-transform transform hover:scale-105"
                        >
                            Go to Login
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && <p className="text-red-500 text-sm">{error}</p>}

                        <div className="flex items-center border rounded-md p-2 bg-gray-200 dark:bg-gray-700">
                            <FaIdCard className="text-gray-500 dark:text-gray-300 mr-2" />
                            <input
                                type="text"
                                placeholder="Full name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                autoFocus
                                disabled={submitting}
                                className="bg-transparent outline-none w-full text-gray-900 dark:text-white disabled:opacity-60"
                            />
                        </div>

                        <div className="flex items-center border rounded-md p-2 bg-gray-200 dark:bg-gray-700">
                            <FaUser className="text-gray-500 dark:text-gray-300 mr-2" />
                            <input
                                type="text"
                                placeholder="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                disabled={submitting}
                                className="bg-transparent outline-none w-full text-gray-900 dark:text-white disabled:opacity-60"
                            />
                        </div>

                        <div className="flex items-center border rounded-md p-2 bg-gray-200 dark:bg-gray-700">
                            <FaEnvelope className="text-gray-500 dark:text-gray-300 mr-2" />
                            <input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={submitting}
                                className="bg-transparent outline-none w-full text-gray-900 dark:text-white disabled:opacity-60"
                            />
                        </div>

                        <div className="flex items-center border rounded-md p-2 bg-gray-200 dark:bg-gray-700">
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

                        <div className="flex items-center gap-3">
                            {captchaLoading ? (
                                <div className="h-12 w-32 flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                                    <Spinner size={14} /> Loading...
                                </div>
                            ) : captcha ? (
                                <img
                                    src={`data:image/jpeg;base64,${captcha.image}`}
                                    alt="CAPTCHA challenge"
                                    className="h-12 rounded-md border border-gray-300 dark:border-gray-600"
                                />
                            ) : (
                                <div className="h-12 w-32 flex items-center justify-center text-xs text-gray-500 dark:text-gray-400">
                                    Unavailable
                                </div>
                            )}
                            <Tooltip content="Reload CAPTCHA">
                                <button
                                    type="button"
                                    onClick={loadCaptcha}
                                    disabled={captchaLoading}
                                    aria-label="Reload CAPTCHA image"
                                    className="cursor-pointer text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white disabled:opacity-50"
                                >
                                    <FaSyncAlt className={captchaLoading ? "animate-spin" : ""} />
                                </button>
                            </Tooltip>
                        </div>

                        <div className="flex items-center border rounded-md p-2 bg-gray-200 dark:bg-gray-700">
                            <input
                                type="text"
                                placeholder="Enter the code shown above"
                                value={captchaCode}
                                onChange={(e) => setCaptchaCode(e.target.value)}
                                className="bg-transparent outline-none w-full text-gray-900 dark:text-white"
                            />
                        </div>

                        <Tooltip content="Create your account">
                            <button
                                type="submit"
                                disabled={submitting}
                                className="cursor-pointer w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-md transition-transform transform hover:scale-105 disabled:opacity-70 disabled:hover:scale-100 flex items-center justify-center gap-2"
                            >
                                {submitting && <Spinner size={16} />}
                                {submitting ? "Creating account..." : "Sign Up"}
                            </button>
                        </Tooltip>

                        {onSwitchToLogin && (
                            <p className="text-center text-sm text-gray-600 dark:text-gray-300">
                                Already have an account?{" "}
                                <Tooltip content="Switch to the login form">
                                    <button
                                        type="button"
                                        onClick={onSwitchToLogin}
                                        className="cursor-pointer text-blue-600 dark:text-blue-400 hover:underline"
                                    >
                                        Log in
                                    </button>
                                </Tooltip>
                            </p>
                        )}
                    </form>
                )}
            </div>
        </div>
    );
}
