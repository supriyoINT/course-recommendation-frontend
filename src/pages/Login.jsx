// src/pages/Login.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from "../env";

function Spinner({ size = 18 }) {
    return (
        <svg className="animate-spin" width={size} height={size} viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.15" strokeWidth="4" />
            <path d="M22 12a10 10 0 00-10-10" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
        </svg>
    );
}

export default function LoginPage() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    function validate() {
        if (!email) return "Please enter your email.";
        // simple email regex
        const re = /\S+@\S+\.\S+/;
        if (!re.test(email)) return "Enter a valid email address.";
        if (!password) return "Please enter your password.";
        if (password.length < 6) return "Password must be at least 6 characters.";
        return "";
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        const v = validate();
        if (v) {
            setError(v);
            return;
        }
        setLoading(true);
        try {
            const result = await login({email:email})
            console.log("Login result:", result);
            if(result){
                localStorage.setItem("user",JSON.stringify(result))
                if(result.isNewUser){
                    navigate("/register");
                } else {
                    navigate("/dashboard");
                }
            }
        } catch (err) {
            setError(err.message || "Login failed. Please try again.");
        } finally {
            setLoading(false);
        }
    }
    
    async function login(data) {
        try {
            const response = await fetch(`${BASE_URL}users/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "ngrok-skip-browser-warning": "true"
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || "Login failed");
            }

            return result;
        } catch (error) {
            console.error("Login error:", error.message);
            throw error;
        }
    }

    async function getUserProfile(userId) {
        try {
            console.log("Fetching user profile for userId:", `${BASE_URL}users/profile/${userId}`);
            const response = await fetch(`${BASE_URL}users/profile/${userId}`, {
                method: "GET",
                headers: {"ngrok-skip-browser-warning": "true"},
            });

            const result = await response.json();
            console.log(response.ok)
            

            return result;
        } catch (error) {
            console.error("Login error:", error.message);
            throw error;
        }
    }


    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-6 relative overflow-hidden">
            {/* Decorative circles */}
            <div className="absolute top-10 left-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
            <div className="absolute bottom-10 right-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: "2s" }}></div>

            <div className="max-w-md w-full relative z-10">
                {/* Logo/Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-3xl mb-4 shadow-lg">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C6.5 6.253 3 9.756 3 14s3.5 7.747 9 7.747m0-13c5.5 0 9-3.503 9-7.747m0 0V5m0 9.247c5.5 0 9 3.503 9 7.747" />
                        </svg>
                    </div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                        Welcome Back
                    </h1>
                    <p className="text-gray-600 text-lg">Sign in to your learning journey</p>
                </div>

                {/* Card */}
                <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Email Input */}
                        <div>
                            <label className="block mb-2">
                                <span className="text-sm font-semibold text-gray-700">Email Address</span>
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full rounded-2xl border-2 border-gray-200 bg-white px-4 py-3
                                text-gray-900 placeholder-gray-400
                                focus:border-blue-500 focus:bg-blue-50 focus:ring-0
                                transition-all duration-300
                                disabled:opacity-50 disabled:cursor-not-allowed"
                                placeholder="you@example.com"
                                autoComplete="email"
                                disabled={loading}
                            />
                        </div>

                        {/* Password Input */}
                        <div>
                            <label className="block mb-2">
                                <span className="text-sm font-semibold text-gray-700">Password</span>
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full rounded-2xl border-2 border-gray-200 bg-white px-4 py-3
                                text-gray-900 placeholder-gray-400
                                focus:border-blue-500 focus:bg-blue-50 focus:ring-0
                                transition-all duration-300
                                disabled:opacity-50 disabled:cursor-not-allowed"
                                placeholder="Enter your password"
                                autoComplete="current-password"
                                disabled={loading}
                            />
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="p-4 bg-red-50 border-2 border-red-200 rounded-2xl">
                                <p className="text-sm text-red-700 font-semibold flex items-center gap-2">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                    {error}
                                </p>
                            </div>
                        )}

                        {/* Sign In Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full flex items-center justify-center gap-2 px-6 py-4 rounded-2xl font-bold text-lg transition-all duration-300 transform ${
                                loading
                                    ? "bg-gray-400 text-white cursor-wait"
                                    : "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg hover:scale-105 active:scale-95"
                            }`}
                        >
                            {loading ? <Spinner /> : null}
                            <span>{loading ? "Signing in..." : "Sign In"}</span>
                        </button>
                    </form>

                    {/* Divider */}
                    {/* <div className="flex items-center gap-4 my-6">
                        <div className="flex-1 h-px bg-gray-200"></div>
                        <span className="text-sm text-gray-500">New here?</span>
                        <div className="flex-1 h-px bg-gray-200"></div>
                    </div> */}

                    {/* Sign Up Link */}
                    {/* <Link
                        to="/"
                        className="w-full flex items-center justify-center py-4 px-6 rounded-2xl border-2 border-blue-500 text-blue-600 font-bold text-lg hover:bg-blue-50 transition-all duration-300 transform hover:scale-105"
                    >
                        📝 Create an Account
                    </Link> */}
                </div>

                {/* Footer */}
                <div className="mt-8 text-center">
                    <p className="text-sm text-gray-600">
                        Join thousands of learners advancing their skills
                    </p>
                    <div className="mt-4 text-xs text-gray-400">
                        Made with ❤️ by <span className="text-gray-600 font-semibold">Team RND-21</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
