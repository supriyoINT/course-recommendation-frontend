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
    const response = await fetch(`${BASE_URL}user-recommendation/1`,{
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
      <div className="w-full bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Left: icon + text */}
        <div className="flex items-center gap-4 min-w-0">
          <div className="w-14 h-14 rounded-2xl bg-yellow-100 flex items-center justify-center flex-shrink-0">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6 text-yellow-600"
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
            <h2 className="text-xl font-semibold text-gray-900 truncate">Find Courses Faster</h2>
            <p className="text-sm text-gray-500 mt-1 truncate">
              Your AI-powered dashboard for smart course recommendations
            </p>
          </div>
        </div>

        {/* Right: toggle button */}
        <div className="w-full sm:w-auto">
          <button
            type="button"
            aria-expanded={open}
            onClick={handleSubmit}
            // onClick={() => setOpen((s) => !s)}
            className="w-full sm:w-auto px-6 py-2 rounded-lg bg-yellow-700 text-white hover:bg-yellow-800 transition flex items-center justify-between gap-2"
          >
            {/* Search */}
            {/* <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`w-4 h-4 transform transition-transform ${open ? "rotate-90" : "rotate-0"}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg> */}
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
      </div>

      {/* Slide-down search area */}
      <form
        onSubmit={handleSubmit}
        className={`w-full bg-white border border-gray-200 rounded-xl mt-2 px-4 transition-all duration-300 overflow-hidden mx-0
          ${open ? "max-h-40 py-4 opacity-100" : "max-h-0 py-0 opacity-0"}
        `}
        aria-hidden={!open}
      >
        <div className="relative max-w-4xl mx-auto">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            type="text"
            placeholder="Search courses..."
            className="w-full border border-transparent text-yellow-800 bg-yellow-100 rounded-xl px-4 pr-16 py-3 outline-none placeholder-yellow-700"
          />

          {/* Arrow button inside input (right side) */}
          <button
            type="submit"
            aria-label="Run search"
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg px-3 py-2 flex items-center justify-center"
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
      <div className={`max-w-4xl mx-auto mt-4 transition-all`}>
        {!showResults ? null : (
          <div className="bg-white rounded-xl border border-neutral-200 p-4 shadow-sm">
            {loadingResults ? (
              // skeleton loading
              <div>
                <SkeletonRow />
                <SkeletonRow />
                <SkeletonRow />
              </div>
            ) : results.length === 0 ? (
              <div className="py-12 text-center text-neutral-600">No results found for <strong className="text-neutral-800">{q || "all"}</strong></div>
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
