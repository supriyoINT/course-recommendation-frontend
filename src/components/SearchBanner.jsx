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

/* Fake results used for local filtering (same shape as your SearchResult demo) */
const FAKE_RESULTS = [
  { course_name: "React — The Complete Guide", platform: "Udemy", url: "https://udemy.com/react-complete-guide", why_recommended: "Hands-on projects", rating: 4.6, duration: "28h" },
  { course_name: "Machine Learning by Andrew Ng", platform: "Coursera", url: "https://coursera.org/learn/machine-learning", why_recommended: "Foundational ML concepts", rating: 4.8, duration: "11 weeks" },
  { course_name: "Modern JavaScript (ES6+)", platform: "Pluralsight", url: "https://pluralsight.com/paths/javascript", why_recommended: "Deep dive into modern JS", rating: 4.4, duration: "6h" },
  { course_name: "Deep Learning Specialization", platform: "Coursera", url: "https://coursera.org/specializations/deep-learning", why_recommended: "Practical neural networks", rating: 4.7, duration: "3 months" },
  { course_name: "Intro to Data Structures & Algorithms", platform: "InterviewBit", url: "https://interviewbit.com/dsa", why_recommended: "Interview prep", rating: 4.3, duration: "30h" }
];

export default function SearchBanner() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");

  // new states to control in-place results area
  const [showResults, setShowResults] = useState(false);
  const [loadingResults, setLoadingResults] = useState(false);
  const [results, setResults] = useState([]);

  const handleSubmit = async (e) => {
    e?.preventDefault();

    // show results area and start fake loading
    setShowResults(true);
    setLoadingResults(true);
    const resuponse = await getRecommendedCourses();
    if(resuponse.status === 'success'){
      setResults(resuponse.data);
      setLoadingResults(false);
      return;
    }
    
    // simulate request latency
    // setTimeout(() => {
    //   const filtered = term
    //     ? FAKE_RESULTS.filter((r) =>
    //         (r.course_name + " " + r.platform + " " + (r.why_recommended || ""))
    //           .toLowerCase()
    //           .includes(term)
    //       )
    //     : FAKE_RESULTS;

    //   setResults(filtered);
    //   setLoadingResults(false);
    //   // keep the search panel open if you want:
    //   // setOpen(false);
    // }, 900 + Math.random() * 400);
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

        {/* Right: toggle button */}
        <div className="w-full sm:w-auto">
          <button
            type="button"
            aria-expanded={open}
            onClick={() => setOpen((s) => !s)}
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

      {/* Slide-down search area */}
      <form
        onSubmit={handleSubmit}
        className={`w-full bg-white rounded-2xl border-2 border-gray-200 mt-3 px-6 py-4 transition-all duration-300 overflow-hidden shadow-lg
          ${open ? "max-h-40 opacity-100" : "max-h-0 opacity-0 hidden"}
        `}
        aria-hidden={!open}
      >
        <div className="relative">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            type="text"
            placeholder="Search for courses..."
            className="w-full border-2 border-gray-300 text-gray-900 bg-white rounded-xl px-4 pr-16 py-3 outline-none placeholder-gray-500 focus:border-blue-500 focus:bg-blue-50 transition-all"
          />

          {/* Arrow button inside input (right side) */}
          <button
            type="submit"
            aria-label="Run search"
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg text-white rounded-lg px-4 py-2 flex items-center justify-center transition-all"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </form>

      {/* Results area (hidden initially) */}
      <div className={`w-full mt-6 transition-all`}>
        {!showResults ? null : (
          <div className="bg-white rounded-3xl border-2 border-gray-200 p-6 shadow-xl">
            {loadingResults ? (
              // skeleton loading
              <div>
                <SkeletonRow />
                <SkeletonRow />
                <SkeletonRow />
              </div>
            ) : results.length === 0 ? (
              <div className="py-16 text-center">
                <p className="text-lg text-gray-600">No courses found for <strong className="text-gray-900">{q || "all"}</strong></p>
                <p className="text-sm text-gray-500 mt-2">Try a different search term</p>
              </div>
            ) : (
              // render the existing SearchResultsDemo component with filtered results
              <SearchResultsDemo results={results} />
            )}
          </div>
        )}
      </div>
    </>
  );
}
