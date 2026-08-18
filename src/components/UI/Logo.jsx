import { BASE_URL } from "../../config/config";
import Tooltip from "./Tooltip";

export default function Logo() {
    return (
        <Tooltip content="Home">
            <img src={`${BASE_URL}logo.png`} alt="Logo" className="h-10" />
        </Tooltip>
    );
}
