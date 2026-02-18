// src/components/SearchBanner.jsx
import React, { useState } from "react";
import SearchResultsDemo from "./SearchResult"; // make sure this path matches your project
import { BASE_URL } from "../env";

// small skeleton row used during loading
function SkeletonRow() {
  return (
    <div className="animate-pulse flex items-center gap-4 py-3">
      <div className="w-12 h-12 bg-gray-200 rounded-lg" />
      <div className="flex-1">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
        <div className="h-3 bg-gray-200 rounded w-2/4" />
      </div>
    </div>
  );
}


export default function SearchBanner() {
  // new states to control in-place results area
  const [showResults, setShowResults] = useState(false);
  const [loadingResults, setLoadingResults] = useState(false);
  const [results, setResults] = useState([]);

  const handleExplore = async () => {
    setShowResults(true);
    setLoadingResults(true);
    const resuponse = await getRecommendedCourses();
    if(resuponse.status === 'success'){
      setResults(resuponse.data);
      setLoadingResults(false);
      return;
    }
    setLoadingResults(false);
  };

  const getRecommendedCourses = async () => {
    // In a real application, this function would fetch data from an API
    // based on the user's search query and return the results.
    // Here, we are using FAKE_RESULTS for demonstration purposes.
    const userDetails = localStorage.getItem("user");
    const response = await fetch(`${BASE_URL}user-recommendation/${JSON.parse(userDetails)?.userId}`,{
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true"
      }
    });
    const data = await response.json();
    console.log("Fetched recommended courses:", data);
    return data;
  };

  return (
    <>
      {/* Card */}
      <div className="w-full bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 rounded-3xl shadow-lg p-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 text-white border border-blue-300">
        {/* Left: icon + text */}
        <div className="flex items-center gap-4 min-w-0">
          <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-lg flex items-center justify-center flex-shrink-0 border border-white/30">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-8 h-8 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="7" />
              <line x1="16.65" y1="16.65" x2="21" y2="21" />
            </svg>
          </div>

          <div className="min-w-0">
            <h2 className="text-2xl font-bold text-white truncate">🔍 Discover Courses</h2>
            <p className="text-sm text-blue-100 mt-1 truncate">
              Get AI-powered personalized recommendations
            </p>
          </div>
        </div>

        {/* Right: explore button */}
        <div className="w-full sm:w-auto">
          <button
            type="button"
            onClick={handleExplore}
            className="w-full sm:w-auto px-8 py-3 rounded-2xl bg-white text-blue-600 hover:bg-blue-50 transition-all font-bold text-lg flex items-center justify-center gap-2 shadow-lg transform hover:scale-105 active:scale-95"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
            Explore
          </button>
        </div>
      </div>

      {/* Results area */}
      <div className="w-full mt-6">
        {!showResults ? null : (
          <div className="bg-white rounded-3xl border-2 border-gray-200 p-6 shadow-xl">
            {loadingResults ? (
              <div>
                <SkeletonRow />
                <SkeletonRow />
                <SkeletonRow />
              </div>
            ) : results.length === 0 ? (
              <div className="py-16 text-center">
                <p className="text-lg text-gray-600">No courses found</p>
                <p className="text-sm text-gray-500 mt-2">Try again later</p>
              </div>
            ) : (
              <SearchResultsDemo results={results} />
            )}
          </div>
        )}
      </div>
    </>
  );
}
