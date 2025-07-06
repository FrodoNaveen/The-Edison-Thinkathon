import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function NoInternetPage() {
    const navigate = useNavigate();

    useEffect(() => {
        const handleOnline = () => {
            navigate('/home');
        };
        window.addEventListener('online', handleOnline);
        return () => window.removeEventListener('online', handleOnline);
    }, [navigate]);

    return (
        <div className="min-h-screen w-screen bg-gradient-to-br from-zinc-900 to-black flex flex-col items-center justify-center text-white text-center p-6">
            <div className="text-7xl mb-6">📡🚫</div>
            <h1 className="text-3xl font-bold text-red-500 mb-2">You're Offline!</h1>
            <p className="text-lg text-gray-300 mb-6">Oops! It looks like you lost your internet connection.</p>
            <p className="text-sm text-gray-400">We'll bring you back once you're online! 🛰️✨</p>
        </div>
    );
}
