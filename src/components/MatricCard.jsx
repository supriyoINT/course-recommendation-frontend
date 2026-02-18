
import React from "react";

/**
 * MetricCards.jsx
 * Requires Tailwind CSS
 *
 * Usage: <MetricCards />
 */

export default function MetricCards() {
  return (
    <div className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Card 1 - Search Courses */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-300 p-8 rounded-3xl relative overflow-hidden hover:shadow-lg transition-all duration-300">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-200 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-pulse"></div>
          
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-lg">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7M9 5l-3 3M9 12h12" />
                  </svg>
                </div>
                <div>
                  <div className="text-sm text-blue-800 font-bold">Find Courses</div>
                  <div className="text-xs text-blue-600">Smart Search</div>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <div className="text-4xl font-bold text-blue-900">1000+</div>
              <div className="text-sm text-blue-700 mt-2">Personalized Recommendations</div>
            </div>

            <button className="mt-6 w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold py-3 rounded-xl hover:shadow-lg transition-all transform hover:scale-105 active:scale-95">
              🔍 Search
            </button>
          </div>
        </div>

        {/* Card 2 - Skill Check Quiz */}
        <div className="bg-gradient-to-br from-purple-50 to-pink-100 border-2 border-purple-300 p-8 rounded-3xl relative overflow-hidden hover:shadow-lg transition-all duration-300">
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-pink-200 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-pulse" style={{ animationDelay: "1s" }}></div>
          
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-400 to-pink-600 flex items-center justify-center shadow-lg">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <div className="text-sm text-purple-800 font-bold">Skill Check</div>
                  <div className="text-xs text-purple-600">AI-Generated Quizzes</div>
                </div>
              </div>
              <div className="text-sm text-purple-700 font-bold flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M12 2a10 10 0 110 20 10 10 0 010-20z" />
                </svg>
                +24%
              </div>
            </div>

            <div className="mt-4">
              <div className="text-4xl font-bold text-purple-900">234</div>
              <div className="text-sm text-purple-700 mt-2">Quizzes Completed</div>
            </div>

            <button className="mt-6 w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-3 rounded-xl hover:shadow-lg transition-all transform hover:scale-105 active:scale-95">
              ❓ Take Quiz
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
