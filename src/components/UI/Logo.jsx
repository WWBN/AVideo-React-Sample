import { BASE_URL } from "../../config/config";

export default function Logo() {
    return (
        <img src={`${BASE_URL}logo.png`} alt="Logo" title="Home" className="h-10" />
    );
}
