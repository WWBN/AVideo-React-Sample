export default function Spinner({ size = 16, className = "" }) {
    return (
        <span
            role="status"
            aria-label="Loading"
            className={`inline-block border-2 border-current border-t-transparent rounded-full animate-spin ${className}`}
            style={{ width: size, height: size }}
        />
    );
}
