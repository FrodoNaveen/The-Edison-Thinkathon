import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ResetPasswordPage() {
    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const navigate = useNavigate();

    const handleReset = (e) => {
        e.preventDefault();

        const storedUser = JSON.parse(localStorage.getItem('user'));

        if (!storedUser || storedUser.email !== email) {
            alert('Email not found. Please sign up first.');
            return;
        }

        // Update the password and save back to localStorage
        const updatedUser = { ...storedUser, password: newPassword };
        localStorage.setItem('user', JSON.stringify(updatedUser));

        alert('Password reset successful! Please log in.');
        navigate('/');
    };

    return (
        <div className="w-screen h-screen flex items-center justify-center bg-gradient-to-br from-black via-zinc-900 to-blue-900 px-4">
            <div className="bg-zinc-950 bg-opacity-80 p-8 rounded-2xl shadow-2xl w-full max-w-md border border-blue-800 backdrop-blur-lg">
                <h2 className="text-2xl font-bold text-center text-blue-400 mb-6">Reset Password</h2>

                <form onSubmit={handleReset} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-blue-300 mb-1">Email address</label>
                        <input
                            type="email"
                            className="w-full px-4 py-2 bg-black border border-blue-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-blue-300 mb-1">New Password</label>
                        <input
                            type="password"
                            className="w-full px-4 py-2 bg-black border border-blue-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                            placeholder="New password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-black py-2 rounded-md transition duration-300 font-semibold"
                    >
                        Reset Password
                    </button>
                </form>
            </div>
        </div>
    );
}
