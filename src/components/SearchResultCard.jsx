import Reacta from "react";
// Fake JSON data
const fakeResults = [
  {
    course_name: "React — The Complete Guide",
    platform: "Udemy",
    url: "https://udemy.com/react-complete-guide",
    why_recommended: "Hands-on projects, great explanations, up-to-date with hooks and routing.",
    rating: 4.6,
    duration: "28h"
  },
  {
    course_name: "Machine Learning by Andrew Ng",
    platform: "Coursera",
    url: "https://coursera.org/learn/machine-learning",
    why_recommended: "Foundational ML concepts, excellent math intuition, university-level.",
    rating: 4.8,
    duration: "11 weeks"
  },
  {
    course_name: "Modern JavaScript (ES6+)",
    platform: "Pluralsight",
    url: "https://pluralsight.com/paths/javascript",
    why_recommended: "Deep dive into modern JS patterns and browser APIs.",
    rating: 4.4,
    duration: "6h"
  },
  {
    course_name: "Deep Learning Specialization",
    platform: "Coursera",
    url: "https://coursera.org/specializations/deep-learning",
    why_recommended: "Practical neural networks + assignments; great for career growth.",
    rating: 4.7,
    duration: "3 months"
  },
  {
    course_name: "Fullstack Web Development with Node.js",
    platform: "edX",
    url: "https://edx.org/course/fullstack-node",
    why_recommended: "Project-based backend + frontend stack with deployment labs.",
    rating: 4.5,
    duration: "45h"
  },
  {
    course_name: "Intro to Data Structures & Algorithms",
    platform: "InterviewBit",
    url: "https://interviewbit.com/dsa",
    why_recommended: "Optimal for interview prep with hands-on practice problems.",
    rating: 4.3,
    duration: "30h"
  }
];

// Small platform badge generator (initials + color)
const platformColor = (platform) => {
  switch ((platform || "").toLowerCase()) {
    case "udemy":
      return "bg-red-100 text-red-700";
    case "coursera":
      return "bg-blue-100 text-blue-700";
    case "pluralsight":
      return "bg-purple-100 text-purple-700";
    case "edx":
      return "bg-indigo-100 text-indigo-700";
    case "interviewbit":
      return "bg-green-100 text-green-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

// Single result card
function SearchResultCard({ course }) {
  return (
    <article className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition">
      <div className="flex items-start gap-4">
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${platformColor(course.platform)} shrink-0`}> 
          <span className="font-semibold text-sm">{course.platform.slice(0,2).toUpperCase()}</span>
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 truncate">{course.course_name}</h3>
          <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
            <span className="inline-flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-yellow-500" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 .587l3.668 7.431L24 9.748l-6 5.847L19.335 24 12 19.897 4.665 24 6 15.595 0 9.748l8.332-1.73z" />
              </svg>
              <strong className="text-gray-800">{course.rating}</strong>
            </span>
            <span>•</span>
            <span>{course.duration}</span>
            <span>•</span>
            <span className="text-sm text-gray-500">{course.platform}</span>
          </div>

          <p className="mt-3 text-sm text-gray-600 line-clamp-3">{course.why_recommended}</p>

          <div className="mt-4 flex items-center gap-3">
            <a
              href={course.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-yellow-600 text-white text-sm font-medium hover:bg-yellow-700 transition"
            >
              Visit Course
n              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </a>

            <button className="text-sm text-gray-600 hover:text-gray-800">Save</button>
          </div>
        </div>
      </div>
    </article>
  );
}