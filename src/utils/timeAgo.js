// Converts a MySQL-style datetime string (e.g. video.videoCreation) into a short relative label.
export function timeAgo(dateString) {
    if (!dateString) return null;
    const date = new Date(dateString.replace(" ", "T"));
    if (Number.isNaN(date.getTime())) return null;

    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    if (seconds < 60) return "just now";

    const units = [
        ["year", 31536000],
        ["month", 2592000],
        ["week", 604800],
        ["day", 86400],
        ["hour", 3600],
        ["minute", 60],
    ];

    for (const [unit, secondsInUnit] of units) {
        const value = Math.floor(seconds / secondsInUnit);
        if (value >= 1) return `${value} ${unit}${value > 1 ? "s" : ""} ago`;
    }
    return "just now";
}
