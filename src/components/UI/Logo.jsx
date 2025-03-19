import { BASE_URL } from "../../config/config";

export default function Logo() {
    return (
        <img src={`${BASE_URL}logo.png`} alt="Logo" className="h-10" />
    );
}
