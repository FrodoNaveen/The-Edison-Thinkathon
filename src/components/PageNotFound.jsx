import { useNavigate } from 'react-router-dom';

export default function NotFound() {
    const navigate = useNavigate();

    return (
        <div className="w-screen h-screen bg-gradient-to-br from-black via-zinc-900 to-blue-900 text-white flex flex-col items-center justify-center p-6 text-center">
            <h1 className="text-6xl font-bold text-red-500 mb-4">404</h1>
            <p className="text-2xl font-semibold text-gray-200 mb-2">Page Not Found</p>
            <p className="text-sm text-gray-400 mb-6">
                Oops! The page you're looking for doesn't exist or has been moved.
            </p>
            <button
                onClick={() => navigate('/home')}
                className="bg-blue-600 hover:bg-blue-700 text-black px-6 py-2 rounded-lg font-bold transition"
            >
                Go to Home
            </button>
        </div>
    );
}
