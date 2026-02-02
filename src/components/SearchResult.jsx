// src/pages/SearchResults.jsx
import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";

/* fake results for demo */
const FAKE_RESULTS = [
  { title: "React — The Complete Guide", platform: "Udemy", url: "https://udemy.com/react-complete-guide", rating: 4.6, duration: "28h" },
  { title: "Machine Learning by Andrew Ng", platform: "Coursera", url: "https://coursera.org/learn/machine-learning", rating: 4.8, duration: "11 weeks" },
  { title: "Modern JavaScript (ES6+)", platform: "Pluralsight", url: "https://pluralsight.com/paths/javascript", rating: 4.4, duration: "6h" },
  { title: "Deep Learning Specialization", platform: "Coursera", url: "https://coursera.org/specializations/deep-learning", rating: 4.7, duration: "3 months" },
  { title: "Intro to Data Structures & Algorithms", platform: "InterviewBit", url: "https://interviewbit.com/dsa", rating: 4.3, duration: "30h" }
];

/* small skeleton row */
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

export default function SearchResults({results: initialResults = []}) {
  console.log("Rendering SearchResults with results:", initialResults);
  const [searchParams] = useSearchParams();
  const q = searchParams.get("q") ?? "";
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(initialResults);


  useEffect(() => {
    console.log("Searching for:", q);
    //  setLoading(true);
    // const filtered = await getRecommendedCourses();
    //   setResults(filtered);
    //   setLoading(false);
    // setLoading(true);
    // simulate network latency and 'AI' work
    // const timer = setTimeout(() => {
    //   // simple filter: include results where title or platform contains query text
    //   const term = q.trim().toLowerCase();
    //   const filtered = term
    //     ? FAKE_RESULTS.filter(r => (r.title + " " + r.platform).toLowerCase().includes(term))
    //     : FAKE_RESULTS;
    //   setResults(filtered);
    //   setLoading(false);
    // }, 900 + Math.random() * 500);

    // return () => clearTimeout(timer);
  }, [q]);

  
  return (
    <div className="min-h-screen bg-neutral-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-semibold text-neutral-900">Search results</h1>
            <p className="text-sm text-neutral-600">Showing results for <span className="font-medium text-neutral-800">{q || "all"}</span></p>
          </div>

          <div>
            <Link to="/" className="text-sm text-yellow-700 hover:underline">Back</Link>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-neutral-200 p-4 shadow-sm">
          {loading ? (
            // skeleton list
            <div>
              <SkeletonRow />
              <SkeletonRow />
              <SkeletonRow />
              <div className="h-2" />
            </div>
          ) : results.courses.length === 0 ? (
            <div className="py-12 text-center text-neutral-600">
              No results found for <span className="font-medium text-neutral-800">{q}</span>
            </div>
          ) : (
            <ul className="space-y-3">
            {results.courses.map((r, i) => (
              <li
                key={i}
                className="p-3 rounded-md hover:bg-neutral-50 flex items-start gap-4"
              >
                <div className="w-12 h-12 rounded-lg bg-gradient-to-tr from-yellow-100 to-yellow-50 flex items-center justify-center text-yellow-700 font-semibold">
                  {r.platform.slice(0, 2).toUpperCase()}
                </div>

                <div className="flex-1 min-w-0">
                  <a
                    href={r.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-neutral-900 font-medium hover:underline"
                  >
                    {r.course_name}
                  </a>

                  {/* ✅ Description */}
                  {r.why_recommended && (
                    <p className="text-sm text-neutral-500 mt-1 line-clamp-2">
                      {r.why_recommended}
                    </p>
                  )}

                  <div className="text-sm text-neutral-600 mt-1">
                    {r.platform} • ⭐ {r.rating}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={r.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="
                      px-3 py-1 rounded-lg 
                      bg-yellow-600 text-white text-sm 
                      hover:bg-yellow-700 
                      transition-all duration-300 
                      hover:scale-105 
                      hover:shadow-[0_4px_12px_rgba(255,200,0,0.35)]
                    "
                  >
                    Open
                  </a>
                </div>
              </li>
            ))}
          </ul>

          )}
        </div>
      </div>
    </div>
  );
}
