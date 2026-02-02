
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

/* Fake course suggestions (could be generated from answers) */
const SAMPLE_COURSES = [
  { id: 1, title: "React — The Complete Guide", platform: "Udemy", url: "#", rating: 4.6, duration: "28h" },
  { id: 2, title: "Machine Learning by Andrew Ng", platform: "Coursera", url: "#", rating: 4.8, duration: "11 weeks" },
  { id: 3, title: "Modern JavaScript (ES6+)", platform: "Pluralsight", url: "#", rating: 4.4, duration: "6h" },
  { id: 4, title: "Fullstack Web Development with Node.js", platform: "edX", url: "#", rating: 4.5, duration: "45h" },
  { id: 5, title: "Intro to Data Structures & Algorithms", platform: "InterviewBit", url: "#", rating: 4.3, duration: "30h" },
];

export default function CourseList() {
  const loc = useLocation();
  const navigate = useNavigate();
  const { state } = loc;
  const answers = state?.answers ?? {};
  const questions = state?.questions ?? [];

  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    // simulate "matching" computation based on answers
    setLoading(true);
    const t = setTimeout(() => {
      // naive: pick courses and shuffle a bit
      const picks = SAMPLE_COURSES
        .map((c, i) => ({ ...c, score: Math.round(Math.random() * 20 + (i * 5)) }))
        .sort((a, b) => b.score - a.score);
      setCourses(picks);
      setLoading(false);
    }, 900 + Math.random() * 900);

    return () => clearTimeout(t);
  }, [answers]);

  return (
    <div className="min-h-screen bg-neutral-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-neutral-900">Recommended Courses</h1>
            <p className="text-sm text-neutral-600">Based on your quiz answers ({Object.keys(answers).length}/{questions.length})</p>
          </div>

          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="px-3 py-2 rounded-lg border border-neutral-200 bg-white">Back to Quiz</button>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-neutral-200 p-4 shadow-sm">
          {loading ? (
            // skeletons
            <div>
              {[...Array(4)].map((_, i) => (
                <div key={i} className="animate-pulse flex items-center gap-4 py-3">
                  <div className="w-12 h-12 bg-gray-200 rounded-lg" />
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                    <div className="h-3 bg-gray-200 rounded w-2/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <ul className="space-y-3">
              {courses.map((c) => (
                <li key={c.id} className="p-3 rounded-md border border-neutral-100 flex items-start gap-4 hover:shadow-sm transition">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-tr from-yellow-100 to-yellow-50 flex items-center justify-center text-yellow-700 font-semibold">
                    {c.platform.slice(0,2).toUpperCase()}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="font-medium text-neutral-900">{c.title}</div>
                        <div className="text-sm text-neutral-600 mt-1">{c.platform} • {c.duration}</div>
                      </div>

                      <div className="text-right">
                        <div className="text-sm text-yellow-600 font-semibold">{c.score}</div>
                        <div className="text-xs text-neutral-500">match score</div>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center gap-2">
                      <button className="px-3 py-1 rounded-lg border border-neutral-200 text-sm text-neutral-700 hover:bg-neutral-50">Save</button>
                      <a href={c.url} target="_blank" rel="noopener noreferrer" className="px-3 py-1 rounded-lg bg-yellow-600 text-white text-sm hover:bg-yellow-700 transition transform hover:scale-105">Open</a>
                    </div>
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
