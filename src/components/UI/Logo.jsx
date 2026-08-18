import { BASE_URL } from "../../config/config";
import Tooltip from "./Tooltip";

export default function Logo() {
    const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

    return (
        <Tooltip content="Back to top">
            <button onClick={scrollToTop} className="cursor-pointer" aria-label="Back to top">
                <img src={`${BASE_URL}logo.png`} alt="Logo" className="h-10" />
            </button>
        </Tooltip>
    );
}
