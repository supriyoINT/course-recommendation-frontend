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
        const result = await login({email:email})
        console.log("Login result:", result);
        if(result){
            localStorage.setItem("user",JSON.stringify(result))
            const profileDetails = await getUserProfile(result.userId)           
            if(!profileDetails.success){
                navigate("/register");
            }else{
                navigate("/dashboard");
            }
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
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 via-white to-gray-50 p-6">
            <div className="max-w-md w-full">
                <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl p-8 transform transition duration-500 hover:-translate-y-1">
                    <div className="flex items-center gap-4 mb-6">
                        <div>
                            <h1 className="text-2xl font-semibold text-gray-900">Welcome</h1>
                            <p className="text-sm text-gray-500">Sign in to continue to Course Recommendation</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <label className="block">
                            <span className="text-sm text-neutral-900">Email</span>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="mt-1 block w-full
    rounded-lg border border-neutral-300
    bg-white
    px-4 py-2
    text-neutral-900
    placeholder-neutral-400
    hover:text-black
    focus:text-black focus:bg-white
    active:text-black active:bg-neutral-800
    autofill:text-black
    transition"
                                placeholder="you@example.com"
                                autoComplete="email"
                                disabled={loading}
                            />
                        </label>

                        <label className="block">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">Password</span>
                                <Link to="/register" className="text-sm text-rose-500 hover:underline">Register new user</Link>
                            </div>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="
    mt-1 block w-full
    rounded-lg border border-neutral-300
    bg-white
    px-4 py-2
    text-neutral-900
    placeholder-neutral-400
    hover:text-black
    focus:text-black focus:bg-white
    active:text-black active:bg-neutral-800
    autofill:text-black
    transition
  "
                                placeholder="Enter your password"
                                autoComplete="current-password"
                                disabled={loading}
                            />
                        </label>

                        {error && <div className="text-sm text-rose-600">{error}</div>}

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full flex items-center justify-center gap-3 px-4 py-2 rounded-xl text-white font-medium transition transform
                ${loading ? "bg-rose-600/90 cursor-wait" : "bg-rose-500 hover:bg-rose-600 active:scale-95 shadow-md"}`}
                        >
                            {loading ? <Spinner /> : null}
                            <span>{loading ? "Signing in..." : "Sign In"}</span>
                        </button>
                    </form>
                </div>

                {/* subtle footer */}
                <div className="mt-6 text-center text-xs text-gray-400">
                    Created by <span className="text-gray-600">Team RND-21</span>
                </div>
            </div>
        </div>
    );
}
