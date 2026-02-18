// src/pages/DashboardHome.jsx
import React from "react";
import MainComp from "../components/MainComp"; 

export default function DashboardHome() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 rounded-3xl p-8 text-white shadow-lg border border-blue-300">
        <h1 className="text-4xl font-bold mb-2">Welcome back, {user?.name || "Learner"}! 👋</h1>
        <p className="text-blue-100 text-lg">Ready to continue your learning journey? Explore personalized courses and track your progress.</p>
      </div>

      {/* Main Dashboard Component */}
      <MainComp />
    </div>
  );
}
