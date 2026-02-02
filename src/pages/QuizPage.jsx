import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

/* Demo 10 MCQ questions */
const DEMO_QUESTIONS = [
  {
    id: 1,
    q: "Which of the following is a React hook?",
    options: ["useState", "setState", "observe", "createHook"],
  },
  {
    id: 2,
    q: "Which HTTP status means 'Not Found'?",
    options: ["200", "301", "404", "500"],
  },
  {
    id: 3,
    q: "Which language is primarily used for styling web pages?",
    options: ["JavaScript", "HTML", "CSS", "Python"],
  },
  {
    id: 4,
    q: "Which of these is a NoSQL DB?",
    options: ["MySQL", "Postgres", "MongoDB", "SQLite"],
  },
  {
    id: 5,
    q: "Which command installs node packages with npm?",
    options: ["npm install", "node get", "npm add", "node install"],
  },
  {
    id: 6,
    q: "What does CSS stand for?",
    options: ["Cascading Style Sheets", "Computer Style Syntax", "Central Styling Service", "Color Style Sheets"],
  },
  {
    id: 7,
    q: "Which git command creates a new branch?",
    options: ["git new branch", "git branch <name>", "git create <name>", "git make <name>"],
  },
  {
    id: 8,
    q: "Which algorithm is commonly used for shortest path?",
    options: ["Dijkstra", "MergeSort", "QuickSort", "Prim"],
  },
  {
    id: 9,
    q: "Which HTTP method is used to update resources?",
    options: ["GET", "POST", "PUT/PATCH", "DELETE"],
  },
  {
    id: 10,
    q: "Which concept is core to functional programming?",
    options: ["Mutable state", "Pure functions", "Global variables", "Imperative loops"],
  },
];

export default function QuizPage() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true); // simulate skeleton loading
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({}); // {questionId: optionIndex}
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // simulate network fetch for quiz
    const t = setTimeout(() => {
      setQuestions(DEMO_QUESTIONS);
      setLoading(false);
    }, 700 + Math.random() * 400);
    return () => clearTimeout(t);
  }, []);

  function selectOption(qid, idx) {
    setAnswers((s) => ({ ...s, [qid]: idx }));
  }

  const answeredCount = Object.keys(answers).length;
  const total = questions.length || DEMO_QUESTIONS.length;
  const progress = Math.round((answeredCount / total) * 100);

  function handleSubmit(e) {
    e?.preventDefault();
    // optional: require at least one answer
    setSubmitting(true);

    // simulate "finding preferred courses" processing
    setTimeout(() => {
      // navigate to relative 'courses' route (works if nested under /dashboard)
      navigate("courses", { state: { answers, questions } });
    }, 900 + Math.random() * 700);
  }

  return (
    <div className="min-h-[60vh] bg-neutral-50 p-6">
      <style>{`
        @keyframes fadeUp { from {opacity:0; transform: translateY(8px);} to {opacity:1; transform: translateY(0);} }
        @keyframes pulseGlow { 0% { box-shadow: 0 0 0 rgba(250,180,50,0);} 50% { box-shadow: 0 10px 30px rgba(250,180,50,0.15);} 100% {box-shadow:0 0 0 rgba(250,180,50,0);} }
      `}</style>

      <div className="max-w-4xl mx-auto">
        <div className="mb-4">
          <h1 className="text-2xl font-semibold text-neutral-900">Quick Quiz — 10 MCQs</h1>
          <p className="text-sm text-neutral-600">Answer these to get tailored course recommendations.</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {/* header: progress */}
          <div className="px-6 py-4 border-b border-neutral-100 flex items-center justify-between gap-4">
            <div className="flex-1">
              <div className="text-sm text-neutral-600">Progress</div>
              <div className="w-full bg-neutral-100 rounded-full h-2 mt-2 overflow-hidden">
                <div className="h-2 bg-yellow-500" style={{ width: `${progress}%`, transition: "width .35s ease" }} />
              </div>
            </div>

            <div className="w-36 text-right text-sm text-neutral-700 font-medium">{answeredCount}/{total}</div>
          </div>

          {/* body: skeleton or questions */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {loading ? (
              // skeleton list
              <>
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="animate-pulse space-y-3">
                    <div className="h-4 bg-neutral-200 rounded w-3/4"></div>
                    <div className="flex gap-3">
                      <div className="h-8 w-20 bg-neutral-200 rounded" />
                      <div className="h-8 w-20 bg-neutral-200 rounded" />
                      <div className="h-8 w-20 bg-neutral-200 rounded" />
                    </div>
                  </div>
                ))}
              </>
            ) : (
              questions.map((q, idx) => (
                <div key={q.id} className="fade-in" style={{ animation: `fadeUp .36s ease ${idx * 40}ms both` }}>
                  <div className="flex items-start gap-3">
                    <div className="w-10 text-sm text-neutral-500">{idx + 1}</div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-neutral-900">{q.q}</div>

                      <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {q.options.map((opt, oi) => {
                          const selected = answers[q.id] === oi;
                          return (
                            <button
                              key={oi}
                              type="button"
                              onClick={() => selectOption(q.id, oi)}
                              className={`
                                text-left px-4 py-3 rounded-lg border transition flex items-center gap-3
                                ${selected ? "border-yellow-600 bg-yellow-50 shadow-sm" : "border-neutral-200 bg-white hover:shadow-sm"}
                              `}
                            >
                              <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${selected ? "bg-yellow-600 text-white" : "bg-neutral-100 text-neutral-600"}`}>
                                {selected ? "✓" : oi + 1}
                              </div>
                              <div className="text-sm text-neutral-800">{opt}</div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}

            {/* submit area */}
            <div className="pt-4 border-t border-neutral-100 flex items-center justify-between gap-4">
              <div className="text-sm text-neutral-600">Tip: you can change answers before submitting.</div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  className="px-4 py-2 rounded-lg bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-50"
                  onClick={() => {
                    setAnswers({});
                  }}
                >
                  Reset
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className={`
                    inline-flex items-center gap-3 px-4 py-2 rounded-lg text-white font-medium
                    ${submitting ? "bg-yellow-700 cursor-wait animate-[pulseGlow_1.6s_infinite]" : "bg-yellow-600 hover:bg-yellow-700"}
                  `}
                >
                  {submitting ? (
                    <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.2" strokeWidth="3" />
                      <path d="M22 12a10 10 0 00-10-10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                    </svg>
                  ) : null}
                  <span>{submitting ? "Finding courses..." : "Submit & Find Courses"}</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
