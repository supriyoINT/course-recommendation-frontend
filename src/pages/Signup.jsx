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

export default function SignupPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1 for features, 2 for form
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    designation: "",
    password: ""
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.email.trim()) return "Email is required";
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(formData.email)) return "Please enter a valid email";
    if (!formData.name.trim()) return "Name is required";
    if (!formData.designation.trim()) return "Designation is required";
    if (!formData.password) return "Password is required";
    if (formData.password.length < 6) return "Password must be at least 6 characters";
    if (formData.password !== confirmPassword) return "Passwords do not match";
    return "";
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}users/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true"
        },
        body: JSON.stringify({
          email: formData.email,
          name: formData.name,
          designation: formData.designation,
          password: formData.password
        })
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || "Signup failed");
      }

      // Store user data in localStorage
      localStorage.setItem("user", JSON.stringify(result));
      localStorage.setItem("signupData", JSON.stringify(formData));

      // Redirect to register page
      navigate("/register");
    } catch (err) {
      setError(err.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col relative overflow-hidden">
      {/* Decorative circles */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: "2s" }}></div>

      {/* Navbar */}
      <nav className="relative z-20 border-b border-gray-200 bg-white/80 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 text-2xl font-bold">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-md">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C6.5 6.253 3 9.756 3 14s3.5 7.747 9 7.747m0-13c5.5 0 9-3.503 9-7.747m0 0V5m0 9.247c5.5 0 9 3.503 9 7.747" />
              </svg>
            </div>
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hidden sm:inline">
              LearnHub
            </span>
          </Link>

          {/* Nav Buttons */}
          <div className="flex gap-3">
            {step === 1 ? (
              <>
                <button
                  onClick={() => setStep(2)}
                  className="px-6 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95"
                >
                  📝 Sign Up
                </button>
                <Link
                  to="/login"
                  className="px-6 py-2 rounded-xl border-2 border-blue-600 text-blue-600 font-semibold hover:bg-blue-50 transition-all duration-300"
                >
                  Sign In
                </Link>
              </>
            ) : (
              <>
                <button
                  onClick={() => setStep(1)}
                  className="px-6 py-2 rounded-xl text-gray-700 font-semibold hover:bg-gray-100 transition-all duration-300"
                >
                  ← Back
                </button>
                <Link
                  to="/login"
                  className="px-6 py-2 rounded-xl border-2 border-blue-600 text-blue-600 font-semibold hover:bg-blue-50 transition-all duration-300"
                >
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-6 relative z-10">
        <div className="max-w-3xl w-full">
          {step === 1 ? (
            <>
              {/* Header */}
              <div className="text-center mb-16">
                <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
                  Learn Smart,<br />Advance Fast
                </h1>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                  Get personalized course recommendations tailored to your goals and learning style
                </p>
              </div>

              {/* Features Grid */}
              <div className="grid md:grid-cols-3 gap-6 mb-12">
                {/* Feature 1 */}
                <div className="bg-white rounded-3xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-4 shadow-md">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">AI-Powered Recommendations</h3>
                  <p className="text-gray-600 text-base leading-relaxed">
                    Get course suggestions powered by advanced AI that understands your learning style
                  </p>
                </div>

                {/* Feature 2 */}
                <div className="bg-white rounded-3xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                  <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4 shadow-md">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Personalized Learning Paths</h3>
                  <p className="text-gray-600 text-base leading-relaxed">
                    Create and track custom learning goals with step-by-step guidance
                  </p>
                </div>

                {/* Feature 3 */}
                <div className="bg-white rounded-3xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                  <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl flex items-center justify-center mb-4 shadow-md">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Skill Check Tests</h3>
                  <p className="text-gray-600 text-base leading-relaxed">
                    Assess your knowledge with AI-generated quizzes and track progress
                  </p>
                </div>
              </div>

              {/* Stats Section */}
              <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100 mb-12">
                <div className="grid md:grid-cols-3 gap-8 text-center">
                  <div>
                    <p className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                      1000+
                    </p>
                    <p className="text-gray-600 font-semibold">Courses Available</p>
                  </div>
                  <div>
                    <p className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                      50+
                    </p>
                    <p className="text-gray-600 font-semibold">Skills to Master</p>
                  </div>
                  <div>
                    <p className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                      100%
                    </p>
                    <p className="text-gray-600 font-semibold">Free to Use</p>
                  </div>
                </div>
              </div>

              {/* CTA Section */}
              <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
                <div className="text-center mb-8">
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                    Ready to Transform Your Career?
                  </h2>
                  <p className="text-xl text-gray-600">
                    Join thousands of learners already advancing their skills with personalized recommendations
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Get Started Button */}
                  <button
                    onClick={() => setStep(2)}
                    className="flex-1 flex items-center justify-center py-4 px-6 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-lg hover:shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95"
                  >
                    🚀 Get Started
                  </button>

                  {/* Sign In Link */}
                  <Link
                    to="/login"
                    className="flex-1 flex items-center justify-center py-4 px-6 rounded-2xl border-2 border-gray-300 text-gray-700 font-bold text-lg hover:bg-gray-50 transition-all duration-300 transform hover:scale-105"
                  >
                    Already have an account? Sign In
                  </Link>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-12 text-center">
                <p className="text-sm text-gray-600 mb-2">
                  By signing up, you agree to our Terms of Service and Privacy Policy
                </p>
                <div className="text-xs text-gray-400">
                  Made with ❤️ by <span className="text-gray-600 font-semibold">Team RND-21</span>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Sign Up Form */}
              <div className="max-w-xl mx-auto">
                {/* Header */}
                <div className="text-center mb-10">
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
                    Create Your Account
                  </h1>
                  <p className="text-gray-600 text-lg">Fill in your details to get started</p>
                </div>

                {/* Form Card */}
                <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
                  <form onSubmit={handleSignup} className="space-y-6">
                    {/* Email */}
                    <div>
                      <label className="block mb-2">
                        <span className="text-sm font-semibold text-gray-700">📧 Email Address</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full rounded-2xl border-2 border-gray-200 bg-white px-4 py-3
                        text-gray-900 placeholder-gray-400
                        focus:border-blue-500 focus:bg-blue-50 focus:ring-0
                        transition-all duration-300
                        disabled:opacity-50 disabled:cursor-not-allowed"
                        placeholder="you@example.com"
                        disabled={loading}
                      />
                    </div>

                    {/* Name */}
                    <div>
                      <label className="block mb-2">
                        <span className="text-sm font-semibold text-gray-700">👤 Full Name</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full rounded-2xl border-2 border-gray-200 bg-white px-4 py-3
                        text-gray-900 placeholder-gray-400
                        focus:border-blue-500 focus:bg-blue-50 focus:ring-0
                        transition-all duration-300
                        disabled:opacity-50 disabled:cursor-not-allowed"
                        placeholder="John Doe"
                        disabled={loading}
                      />
                    </div>

                    {/* Designation */}
                    <div>
                      <label className="block mb-2">
                        <span className="text-sm font-semibold text-gray-700">💼 Designation</span>
                      </label>
                      <input
                        type="text"
                        name="designation"
                        value={formData.designation}
                        onChange={handleInputChange}
                        className="w-full rounded-2xl border-2 border-gray-200 bg-white px-4 py-3
                        text-gray-900 placeholder-gray-400
                        focus:border-blue-500 focus:bg-blue-50 focus:ring-0
                        transition-all duration-300
                        disabled:opacity-50 disabled:cursor-not-allowed"
                        placeholder="Software Engineer, Student, etc."
                        disabled={loading}
                      />
                    </div>

                    {/* Password */}
                    <div>
                      <label className="block mb-2">
                        <span className="text-sm font-semibold text-gray-700">🔒 Create Password</span>
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          className="w-full rounded-2xl border-2 border-gray-200 bg-white px-4 py-3 pr-12
                          text-gray-900 placeholder-gray-400
                          focus:border-blue-500 focus:bg-blue-50 focus:ring-0
                          transition-all duration-300
                          disabled:opacity-50 disabled:cursor-not-allowed"
                          placeholder="At least 6 characters"
                          disabled={loading}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                          {showPassword ? "👁️" : "👁️‍🗨️"}
                        </button>
                      </div>
                    </div>

                    {/* Confirm Password */}
                    <div>
                      <label className="block mb-2">
                        <span className="text-sm font-semibold text-gray-700">🔐 Confirm Password</span>
                      </label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="w-full rounded-2xl border-2 border-gray-200 bg-white px-4 py-3 pr-12
                          text-gray-900 placeholder-gray-400
                          focus:border-blue-500 focus:bg-blue-50 focus:ring-0
                          transition-all duration-300
                          disabled:opacity-50 disabled:cursor-not-allowed"
                          placeholder="Re-enter your password"
                          disabled={loading}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                          {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
                        </button>
                      </div>
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

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={loading}
                      className={`w-full flex items-center justify-center gap-2 py-4 px-6 rounded-2xl font-bold text-lg transition-all duration-300 transform ${
                        loading
                          ? "bg-gray-400 text-white cursor-wait"
                          : "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg hover:scale-105 active:scale-95"
                      }`}
                    >
                      {loading ? (
                        <>
                          <Spinner />
                          <span>Creating Account...</span>
                        </>
                      ) : (
                        <>
                          <span>✓ Create Account</span>
                        </>
                      )}
                    </button>

                    {/* Already have account */}
                    <p className="text-center text-gray-600">
                      Already have an account?{" "}
                      <Link to="/login" className="text-blue-600 font-semibold hover:text-blue-700">
                        Sign In
                      </Link>
                    </p>
                  </form>
                </div>

                {/* Footer */}
                <div className="mt-8 text-center text-xs text-gray-400">
                  Made with ❤️ by <span className="text-gray-600 font-semibold">Team RND-21</span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
