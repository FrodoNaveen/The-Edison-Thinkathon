import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();

        const storedUser = JSON.parse(localStorage.getItem('user'))
        if (storedUser == null) {
            alert(`User email doesn't exist Please create an account to use the app.`);
            setEmail("")
            setPassword("")
        } else if (storedUser != null) {
            if (storedUser.email === email && storedUser.password != password) {
                alert("The entered password is wrong try again")
                setPassword("")

            } else if (
                storedUser.email == email && storedUser.password == password
            ) {
                localStorage.setItem('isLoggedIn', 'true');
                navigate('/home');
            }
        }
    };

    return (
        <div className="w-screen h-screen bg-gradient-to-br from-black via-zinc-900 to-blue-900 flex items-center justify-center px-4">
            <div className="w-full max-w-md bg-zinc-950 bg-opacity-80 border border-blue-800 p-8 rounded-2xl shadow-2xl backdrop-blur-lg">
                <h2 className="text-3xl font-bold text-blue-400 text-center mb-8">
                    Welcome Back
                </h2>

                <form className="space-y-6" onSubmit={handleLogin}>
                    <div>
                        <label className="block text-sm font-medium text-blue-300 mb-1" htmlFor="email">
                            Email address
                        </label>
                        <input
                            type="email"
                            id="email"
                            className="w-full px-4 py-2 bg-black border border-blue-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-blue-300 mb-1" htmlFor="password">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            className="w-full px-4 py-2 bg-black border border-blue-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <div className="flex justify-between items-center text-sm text-blue-400">
                        <label className="flex items-center gap-2">
                            <input type="checkbox" className="accent-blue-600" />
                            Remember me
                        </label>
                        <Link to="/resetpassword"><p className="hover:underline text-blue-500">Forgot password?</p></Link>

                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-black py-2 rounded-md transition duration-300 font-semibold"
                    >
                        Sign In
                    </button>
                </form>

                <div className="mt-6">
                    <center>
                        <GoogleLogin
                            auto_select={false}
                            allowed_parent_origin={false}
                            use_fedcm_for_prompt={false}
                            onSuccess={(credentialResponse) => {
                                const credential = jwtDecode(credentialResponse.credential);
                                const googleEmail = credential.email;

                                const existingUser = JSON.parse(localStorage.getItem('user'));

                                if (!existingUser) {
                                    const newUser = {
                                        fullName: credential.name,
                                        email: googleEmail,
                                        password: "", // Not needed for Google sign-in
                                    };
                                    localStorage.setItem('user', JSON.stringify(newUser));
                                    localStorage.setItem('isLoggedIn', 'true');
                                    navigate('/home');
                                } else {
                                    if (existingUser.email === googleEmail) {
                                        localStorage.setItem('isLoggedIn', 'true');
                                        navigate('/home');
                                    } else {
                                        alert("User doesn't exist. Please create an account.");
                                    }
                                }
                            }}
                            width={"100%"}
                        />
                    </center>



                </div>
                <p className="mt-6 text-center text-sm text-blue-300">
                    Don’t have an account?{' '}
                    <Link to='/signup' className="text-blue-500 hover:underline">Sing Up</Link>
                </p>
            </div>
        </div>
    );
}
