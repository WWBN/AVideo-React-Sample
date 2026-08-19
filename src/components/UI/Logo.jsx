import { BASE_URL } from "../../config/config";
import Tooltip from "./Tooltip";

export default function Logo({ onNavigateHome }) {
    const handleClick = () => {
        onNavigateHome?.();
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <Tooltip content="Go to homepage">
            <button onClick={handleClick} className="cursor-pointer shrink-0" aria-label="Go to homepage">
                <img src={`${BASE_URL}logo.png`} alt="Logo" className="h-10" />
            </button>
        </Tooltip>
    );
}
