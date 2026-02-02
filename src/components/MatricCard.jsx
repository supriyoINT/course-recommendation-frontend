
import React from "react";

/**
 * MetricCards.jsx
 * Requires Tailwind CSS + the custom CSS provided below in index.css
 *
 * Usage: <MetricCards />
 */

export default function MetricCards() {
  return (
    <div className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Card 1 - Purchase orders */}
        <div className="metric-card metric-card--yellow p-5 rounded-xl relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              {/* Cart icon */}
              <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center shadow-sm">
                <svg className="w-6 h-6 text-yellow-600" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M7 4h-2l-1 2h2l3.6 7.59-1.35 2.45A1 1 0 0011 18h8v-2h-7.42a.25.25 0 01-.23-.14L12.1 13h6.45a1 1 0 00.92-.62l1.9-4.5A1 1 0 0019.4 6H6.21L5.27 4H3V2h3a1 1 0 01.92.62L7 4z" />
                </svg>
              </div>

              <div>
                <div className="text-sm text-yellow-800 font-medium">Find Course by Search</div>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <div className="text-2xl sm:text-3xl font-bold text-yellow-900">1.72m</div>
          </div>

          <div className="mt-4 flex items-center">
            <button class="bg-yellow-800 text-white">Search</button>
          </div>

          {/* decorative dotted background */}
          <div className="dot-group" aria-hidden />
        </div>

        {/* Card 2 - Messages */}
        <div className="metric-card metric-card--pink p-5 rounded-xl relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              {/* Message icon */}
              <div className="w-10 h-10 rounded-lg bg-pink-100 flex items-center justify-center shadow-sm">
                <svg className="w-6 h-6 text-pink-600" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M20 2H4a2 2 0 00-2 2v14l4-2h14a2 2 0 002-2V4a2 2 0 00-2-2z" />
                </svg>
              </div>

              <div>
                <div className="text-sm text-pink-800 font-medium">Quick Evaluation Quize</div>
              </div>
            </div>

            <div className="text-sm text-pink-800 font-medium flex items-center gap-2">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M3 12l6-6 4 8 8-8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="text-xs">+3.6%</span>
            </div>
          </div>

          <div className="mt-6">
            <div className="text-2xl sm:text-3xl font-bold text-pink-900">234</div>
          </div>

          <div className="mt-4 flex items-center">
            <svg className="ml-auto sparkline" viewBox="0 0 100 30" preserveAspectRatio="none" aria-hidden>
              <polyline points="0,18 18,22 36,14 54,18 72,12 100,16" fill="none" stroke="#9F1239" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>

          <div className="dot-group" aria-hidden />
        </div>
      </div>
    </div>
  );
}
