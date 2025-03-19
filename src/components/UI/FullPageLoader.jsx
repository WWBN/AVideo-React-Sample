export default function FullPageLoader({ loading }) {
    if (!loading) return null;

    return (
        <div className="fixed inset-0 flex justify-center items-center bg-[rgba(0,0,0,0.5)] backdrop-blur-md z-50">
            {/* Fancy Ring Spinner */}
            <div className="w-14 h-14 border-4 border-blue-500 border-t-transparent border-solid rounded-full animate-spin"></div>
        </div>
    );
}
