// src/App.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "./pages/DashboardLayout";
import DashboardHome from "./pages/DashboardHome";
import QuizPage from "./pages/QuizPage";
import LoginPage from "./pages/Login";
import RegisterPage from "./pages/Register";
import SearchResults from "./components/SearchResult";
import CourseList from "./pages/CourseList";
import Goal from "./pages/Goal";

export default function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Dashboard Layout (Protected Part of App) */}
      <Route path="/dashboard" element={<DashboardLayout />}>
        <Route index element={<DashboardHome />} />
        {/* child routes must be relative (no leading slash) */}
        <Route path="quiz" element={<QuizPage />} />
        {/* add more nested routes here using relative paths */}
        <Route path="courses" element={<CourseList />} />
        <Route path="/dashboard/goal" element={<Goal />} />
      </Route>

      {/* Root-level search route (keeps it outside dashboard) */}
      <Route path="/search" element={<SearchResults />} />

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
