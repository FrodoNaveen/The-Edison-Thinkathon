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
                    {/* <button
                        onClick={googleLogin}
                        className="w-full flex items-center justify-center gap-3 bg-white text-black font-semibold py-2 rounded-md hover:bg-gray-200 transition duration-300"
                    >
                        <img src="https://developers.google.com/identity/images/g-logo.png" alt="Google" className="w-5 h-5" />
                        Sign in with Google
                    </button> */}

                    {/* <div className="google-login-container">
                        <GoogleLogin
                            onSuccess={(credentialResponse) => {
                                console.log(credentialResponse)
                                console.log(jwtDecode(credentialResponse.credential))

                                const credential = jwtDecode(credentialResponse.credential)

                                const userData = {
                                    fullName: credential.name,
                                    email: credential.email,
                                    password: "",
                                };
                                console.log(`pppp ${JSON.stringify(userData)}`)
                                try {
                                    localStorage.setItem('user', JSON.stringify(userData));
                                    localStorage.setItem('isLoggedIn', 'true');
                                    navigate('/home');
                                } catch (e) {
                                    alert("Error while saving the data")
                                }

                            }}

                        // may work in some cases
                        />
                    </div> */}


                    <div style={{ width: '100%' }}>
                        <GoogleLogin
                            onSuccess={(credentialResponse) => {
                                const credential = jwtDecode(credentialResponse.credential);
                                const userData = {
                                    fullName: credential.name,
                                    email: credential.email,
                                    password: "",
                                };

                                try {
                                    localStorage.setItem('user', JSON.stringify(userData));
                                    localStorage.setItem('isLoggedIn', 'true');
                                    navigate('/home');
                                } catch (e) {
                                    alert("Error while saving the data");
                                }
                            }}
                            onError={() => {
                                alert("Google Sign In Failed");
                            }}
                            useOneTap={false}

                            shape="rectangular"
                            size="large"
                        />
                    </div>



                </div>
                <p className="mt-6 text-center text-sm text-blue-300">
                    Don’t have an account?{' '}
                    <Link to='/signup' className="text-blue-500 hover:underline">Sing Up</Link>
                </p>
            </div>
        </div>
    );
}
