import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const SignUpPage = () => {

    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const { fullName, email, password, confirmPassword } = formData;

        if (!fullName || !email || !password || !confirmPassword) {
            setError('All fields are required');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        // Save to localStorage
        const userData = {
            fullName,
            email,
            password,
        };

        try {
            localStorage.setItem('user', JSON.stringify(userData));
        } catch (e) {
            alert("Error while saving the data")
        }

        // Clear input fields
        setFormData({
            fullName: '',
            email: '',
            password: '',
            confirmPassword: '',
        });

        setError('');
        alert('Account created successfully!');

        // Navigate to LoginPage ("/")
        navigate('/login');
    };


    return (
        <div className="w-screen h-screen bg-gradient-to-br from-black via-zinc-900 to-blue-900 flex items-center justify-center px-4">
            <div className="w-full max-w-md bg-zinc-950 bg-opacity-80 border border-blue-800 p-8 rounded-2xl shadow-2xl backdrop-blur-lg">
                <h2 className="text-3xl font-bold mb-6 text-center text-blue-600">Create Account</h2>
                {error && <p className="text-red-500 mb-4 text-sm text-center">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        name="fullName"
                        placeholder="Full Name"
                        value={formData.fullName}
                        onChange={handleChange}
                        className="w-full px-4 py-2 bg-black border border-blue-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Email Address"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-2 bg-black border border-blue-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full px-4 py-2 bg-black border border-blue-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                    <input
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm Password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="w-full px-4 py-2 bg-black border border-blue-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-black py-3 rounded-xl hover:bg-blue-700 transition font-semibold"
                    >
                        Sign Up
                    </button>
                </form>

                <p className="text-center text-sm mt-4 text-gray-600">
                    Already have an account?{' '}
                    <Link to="/" className="text-blue-600 hover:underline font-medium">Log In</Link>
                </p>
            </div>
        </div>
    );
};

export default SignUpPage;
