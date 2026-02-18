// src/pages/DashboardLayout.jsx
import React, { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import DashboardIcon from "../components/icons/DashboardIcon";
import GoalIcon from "../components/icons/GoalIcon";
import QuizIcon from "../components/icons/QuizIcon";

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("signupData");
    navigate("/login");
  };

  const nav = [
    { to: "/dashboard", label: "Dashboard", icon: DashboardIcon, end: true },
    { to: "/dashboard/goal", label: "Learning Path", icon: GoalIcon, end: false },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col">
      {/* Decorative circles */}
      <div className="fixed top-0 left-0 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse pointer-events-none"></div>
      <div className="fixed bottom-0 right-0 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse pointer-events-none" style={{ animationDelay: "2s" }}></div>

      {/* Top navbar */}
      <header className="relative z-30 border-b border-gray-200 bg-white/80 backdrop-blur-lg sticky top-0 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen((s) => !s)}
                className="md:hidden p-2 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                aria-label="Toggle menu"
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-md">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C6.5 6.253 3 9.756 3 14s3.5 7.747 9 7.747m0-13c5.5 0 9-3.503 9-7.747m0 0V5m0 9.247c5.5 0 9 3.503 9 7.747" />
                  </svg>
                </div>
                <span className="hidden sm:block text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  LearnHub
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-3 px-4 py-2 bg-blue-50 rounded-xl border border-blue-200">
                <img className="w-8 h-8 rounded-full" src={`https://ui-avatars.com/api/?name=${user?.name || "User"}&background=0D8ABC&color=fff`} alt="avatar" />
                <div className="flex flex-col">
                  <div className="text-sm font-semibold text-gray-900">{user?.name || "User"}</div>
                  <div className="text-xs text-gray-600">{user?.email}</div>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-xl text-gray-700 hover:bg-red-100 hover:text-red-700 font-semibold transition-all duration-300"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden relative z-10">
        {/* Desktop sidebar */}
        <aside className="hidden md:block w-64 bg-white/80 backdrop-blur-lg border-r border-gray-200 p-4 overflow-auto">
          <nav className="space-y-2">
            {nav.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                end={n.end}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                    isActive 
                      ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg" 
                      : "text-gray-700 hover:bg-gray-100"
                  }`
                }
              >
                <n.icon className="w-5 h-5" />
                <span className="font-semibold">{n.label}</span>
              </NavLink>
            ))}
          </nav>
        </aside>

        {/* Mobile overlay sidebar */}
        {sidebarOpen && (
          <div className="md:hidden fixed inset-0 z-40">
            <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
            <div className="absolute left-0 top-0 bottom-0 w-72 bg-white p-4 overflow-auto shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C6.5 6.253 3 9.756 3 14s3.5 7.747 9 7.747m0-13c5.5 0 9-3.503 9-7.747m0 0V5m0 9.247c5.5 0 9 3.503 9 7.747" />
                    </svg>
                  </div>
                  <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">LearnHub</span>
                </div>
                <button onClick={() => setSidebarOpen(false)} className="p-2 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <nav className="space-y-2">
                {nav.map((n) => (
                  <NavLink
                    key={n.to}
                    to={n.to}
                    end={n.end}
                    onClick={() => setSidebarOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                        isActive 
                          ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg" 
                          : "text-gray-700 hover:bg-gray-100"
                      }`
                    }
                  >
                    <n.icon className="w-5 h-5" />
                    <span className="font-semibold">{n.label}</span>
                  </NavLink>
                ))}
              </nav>
            </div>
          </div>
        )}

        {/* Main content area */}
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
