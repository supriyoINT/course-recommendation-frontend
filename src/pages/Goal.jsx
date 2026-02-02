import { useEffect, useState } from "react";

export default function GoalLearningPath() {
  const [goalInput, setGoalInput] = useState("");
  const [goals, setGoals] = useState([]);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [activeQuizStep, setActiveQuizStep] = useState(null);
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [showCoursesModal, setShowCoursesModal] = useState(false);
  const [recommendedCourses, setRecommendedCourses] = useState([]);
  const [currentSkill, setCurrentSkill] = useState("");

  const handleAddGoal = () => {
    if (!goalInput.trim()) return;

    addGoal(goalInput.trim());
    setGoalInput("");
  };

  const fetchUserGoals = async () => {
    // Simulate API call
    const userDetails = localStorage.getItem("user");
    console.log("User Details:", userDetails);
    const userDetailsObj = JSON.parse(userDetails);
    const response = await fetch(`http://127.0.0.1:5000/user-goals/${userDetailsObj.userId}`);
    const data = await response.json();
    setGoals(data.data);
  }

  const addGoal = async (goalTitle) => {
    const userDetails = localStorage.getItem("user");
    console.log("User Details:", userDetails);
    const userDetailsObj = JSON.parse(userDetails);
    const response = await fetch(`http://127.0.0.1:5000/user-goals`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        goal: goalTitle,
        user_id: userDetailsObj.userId
      })
    });
    const data = await response.json();
    console.log("Added Goal:", data);
    if(data.status !== 'success'){
        alert("Failed to add goal. Please try again.");
        return;
    }
    loadStepsForGoal(data.data);
    fetchUserGoals();
  };



  useEffect(() => {
    fetchUserGoals();
  }, [goals.length]);

  const fetchLearningPathForGoal = async (goalId) => {
    const response = await fetch(`http://127.0.0.1:5000/user-goals-steps/${goalId}`);
    const data = await response.json();
    return data;
  };

  // Mock API response
  const loadStepsForGoal = async (goal) => {
    console.log("Loading steps for goal:", goal);
    if(!goal?.learning_path){
        const stepdRes = await fetchLearningPathForGoal(goal.id);
        console.log("Fetched learning path:", stepdRes);
        if(!stepdRes || stepdRes.status !== 'success' || !stepdRes.data || stepdRes.data.length === 0){
            alert("No learning path found for this goal.");
            return;
        }
        let apiSteps = stepdRes.data[0].steps.learning_path;
        apiSteps = apiSteps.map((step) => ({ ...step, completed: false }));
        const updatedGoal = { ...goal, learning_path: apiSteps };
        setGoals((prev) => prev.map((g) => (g.id === goal.id ? updatedGoal : g)));
        setSelectedGoal(updatedGoal);
        console.log("added...")
    }else{
        setSelectedGoal(goal);
        console.log("loaded...")
    }
    

  };

  const toggleStep = (stepNumber) => {
    const updatedGoal = {
      ...selectedGoal,
      learning_path: selectedGoal.learning_path.map((step) =>
        step.step_number === stepNumber
          ? { ...step, completed: !step.completed }
          : step
      )
    };

    setGoals((prev) => prev.map((g) => (g.id === updatedGoal.id ? updatedGoal : g)));
    setSelectedGoal(updatedGoal);
  };

  const openQuiz = async (stepNumber,skill) => {
    setActiveQuizStep(stepNumber);
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setQuizCompleted(false);
    
    try {
      const response = await fetch(`http://127.0.0.1:5000/generate-mcq`,{
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          topic: skill
        })
      });
      const data = await response.json();
      if (data.status === "success") {
        setQuizQuestions(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch quiz:", error);
      // Fallback to mock quiz data
      const mockQuiz = [
        {
          question: "What does SQL stand for?",
          options: {
            A: "Structured Query Language",
            B: "Sequential Query Language",
            C: "Structured Query Learning",
            D: "Sequential Query Learning"
          },
          correct_answer: "A",
          difficulty: "easy",
          explanation: "SQL stands for Structured Query Language."
        },
        {
          question: "Which SQL command is used to insert data into a database?",
          options: {
            A: "SELECT",
            B: "UPDATE",
            C: "INSERT INTO",
            D: "DELETE"
          },
          correct_answer: "C",
          difficulty: "easy",
          explanation: "INSERT INTO command is used to insert data into a database."
        },
        {
          question: "What does the SQL SELECT statement do?",
          options: {
            A: "Inserts data into a database",
            B: "Updates data in a database",
            C: "Deletes data from a database",
            D: "Fetches data from a database"
          },
          correct_answer: "D",
          difficulty: "easy",
          explanation: "The SQL SELECT statement fetches data from a database."
        }
      ];
      setQuizQuestions(mockQuiz);
    }
  };

  const handleAnswerSelect = (selectedOption) => {
    setUserAnswers((prev) => ({
      ...prev,
      [currentQuestionIndex]: selectedOption
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      setQuizCompleted(true);
    }
  };

  const calculateScore = () => {
    let totalCorrectWeight = 0;
    let totalWeight = 0;

    quizQuestions.forEach((q, idx) => {
      const weight = q.difficulty === "easy" ? 1 : q.difficulty === "medium" ? 2 : 3;
      totalWeight += weight;

      if (userAnswers[idx] === q.correct_answer) {
        totalCorrectWeight += weight;
      }
    });

    return totalWeight > 0 ? (totalCorrectWeight / totalWeight) * 100 : 0;
  };

  const getLevel = (percentage) => {
  if (percentage <= 35) return "Beginner";
  if (percentage <= 75) return "Intermediate";
  if (percentage <= 90) return "Advanced";
  return "Expert";
};


  const closeQuiz = () => {
    // Update step with level if quiz was completed
    if (quizCompleted && activeQuizStep && selectedGoal) {
      const percentage = calculateScore();
      const level = getLevel(percentage);
      
      const updatedGoal = {
        ...selectedGoal,
        learning_path: selectedGoal.learning_path.map((step) =>
          step.step_number === activeQuizStep
            ? { ...step, level: level }
            : step
        )
      };
      
      setGoals((prev) => prev.map((g) => (g.id === updatedGoal.id ? updatedGoal : g)));
      setSelectedGoal(updatedGoal);
    }
    
    setActiveQuizStep(null);
    setQuizQuestions([]);
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setQuizCompleted(false);
  };

  const openCoursesModal = async (step) => {
    setCurrentSkill(step.skill);
    setShowCoursesModal(true);
    console.log("Fetching courses for skill:", step.skill);
    const recommendePayload = { topic: step.skill, skill_level: step.level || "beginner" };
    try {
      const response = await fetch(`http://127.0.0.1:5000/recommended_course_based_on_skill`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(recommendePayload)
      });
      const data = await response.json();
      if (data.status === "success") {
        setRecommendedCourses(data.data.recommended_courses);
      }
    } catch (error) {
      console.error("Failed to fetch recommended courses:", error);
      
    }
  };

  const closeCoursesModal = () => {
    setShowCoursesModal(false);
    setRecommendedCourses([]);
    setCurrentSkill("");
  };

  const recommendedCourse = async(step) => {
    alert(`Recommended course for ${step.skill} coming soon!`);
    let payload = { topic: step.skill, skill_level: step.level || "beginner"};
    console.log("Course recommendation payload:", payload);
    try {
         const res =await fetch(`http://localhost:5000/recommended_course_based_on_skill`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
        })
        const data = await res.json();
        console.log("Recommended course response:", data);
    } catch (error) {
        console.error("Error fetching recommended course:", error);
    }
   
  }
  const completedCount = selectedGoal
    ? selectedGoal.learning_path.filter((s) => s.completed).length
    : 0;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Panel */}
        <div className="md:col-span-1 bg-white rounded-2xl shadow p-4">
          <h2 className="text-xl font-semibold mb-4">Add Your Goal</h2>
          <input
            type="text"
            value={goalInput}
            onChange={(e) => setGoalInput(e.target.value)}
            placeholder="e.g. Become a Doctor"
            className="w-full border rounded-xl px-3 py-2 mb-3"
          />
          <button
            onClick={handleAddGoal}
            className="w-full bg-black text-white rounded-xl py-2"
          >
            Add Goal
          </button>

          <div className="mt-6">
            <h3 className="text-lg font-medium mb-2">Your Goals</h3>
            <ul className="space-y-2">
              {goals.map((goal) => (
                <li
                  key={goal.id}
                  onClick={() => loadStepsForGoal(goal)}
                  className={`cursor-pointer rounded-xl px-3 py-2 border hover:bg-gray-100 ${
                    selectedGoal?.id === goal.id ? "bg-gray-100" : ""
                  }`}
                >
                  {goal.goal}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Panel */}
        <div className="md:col-span-2 bg-white rounded-2xl shadow p-6">
          {!selectedGoal ? (
            <p className="text-gray-500">Select a goal to view the learning steps.</p>
          ) : (
            <div>
              <h2 className="text-2xl font-semibold mb-1">{selectedGoal.title}</h2>
              <p className="text-sm text-gray-500 mb-4">
                Progress: {completedCount} / {selectedGoal.learning_path.length} steps completed
              </p>

              <div className="space-y-4">
                {selectedGoal.learning_path
                  .sort((a, b) => a.step_number - b.step_number)
                  .map((step) => (
                    <div key={step.step_number} className="border rounded-xl p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-medium">{step.step_number}. {step.skill}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <p className="text-xs text-gray-500">{step.type}</p>
                            {step.level && (
                              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-semibold">
                                {step.level}
                              </span>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() => toggleStep(step.step_number)}
                          className={`text-xs px-3 py-1 rounded-full ml-2 whitespace-nowrap ${
                            step.completed ? "bg-green-500 text-white" : "bg-gray-200"
                          }`}
                        >
                          {step.completed ? "Completed" : "Mark Done"}
                        </button>
                      </div>

                      {/* Course + Quiz */}
                      <div className="mt-3 flex gap-3">
                        <button 
                          className="text-sm px-3 py-1 rounded-lg border hover:bg-gray-50"
                          onClick={() => openCoursesModal(step)}
                        >
                          Recommended Course
                        </button>
                        <button
                          onClick={() => openQuiz(step.step_number, step.skill)}
                          className="text-sm px-3 py-1 rounded-lg border"
                        >
                          Take Skill Check Quiz
                        </button>
                      </div>

                      {/* Quiz Section */}
                      {activeQuizStep === step.step_number && quizQuestions.length > 0 && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4 max-h-96 overflow-y-auto">
                            {!quizCompleted ? (
                              <div>
                                <div className="flex justify-between items-center mb-4">
                                  <h3 className="text-lg font-semibold">
                                    Question {currentQuestionIndex + 1} of {quizQuestions.length}
                                  </h3>
                                  <button
                                    onClick={closeQuiz}
                                    className="text-gray-500 hover:text-gray-700 text-xl"
                                  >
                                    ×
                                  </button>
                                </div>

                                <div className="mb-6 bg-gray-50 p-4 rounded-lg">
                                  <p className="text-base font-medium mb-4">
                                    {quizQuestions[currentQuestionIndex].question}
                                  </p>
                                  <div className="text-xs text-gray-500 mb-3">
                                    Difficulty: <span className="capitalize">{quizQuestions[currentQuestionIndex].difficulty}</span>
                                  </div>
                                </div>

                                <div className="space-y-2 mb-6">
                                  {Object.entries(quizQuestions[currentQuestionIndex].options).map(([key, value]) => (
                                    <label
                                      key={key}
                                      className={`flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 ${
                                        userAnswers[currentQuestionIndex] === key
                                          ? "bg-blue-50 border-blue-500"
                                          : "border-gray-200"
                                      } ${userAnswers[currentQuestionIndex] ? "opacity-75" : ""}`}
                                    >
                                      <input
                                        type="radio"
                                        name="answer"
                                        value={key}
                                        checked={userAnswers[currentQuestionIndex] === key}
                                        onChange={() => handleAnswerSelect(key)}
                                        disabled={!!userAnswers[currentQuestionIndex]}
                                        className="mr-3 disabled:cursor-not-allowed"
                                      />
                                      <span className="font-medium text-sm mr-2">{key}:</span>
                                      <span className="text-sm">{value}</span>
                                    </label>
                                  ))}
                                </div>

                                {userAnswers[currentQuestionIndex] && (
                                  <div className={`p-3 rounded-lg mb-4 ${
                                    userAnswers[currentQuestionIndex] === quizQuestions[currentQuestionIndex].correct_answer
                                      ? "bg-green-50 border border-green-200"
                                      : "bg-red-50 border border-red-200"
                                  }`}>
                                    <p className="text-sm font-medium mb-1">
                                      {userAnswers[currentQuestionIndex] === quizQuestions[currentQuestionIndex].correct_answer
                                        ? "✓ Correct!"
                                        : "✗ Incorrect"}
                                    </p>
                                    <p className="text-xs">{quizQuestions[currentQuestionIndex].explanation}</p>
                                  </div>
                                )}

                                <button
                                  onClick={handleNextQuestion}
                                  disabled={!userAnswers[currentQuestionIndex]}
                                  className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700"
                                >
                                  {currentQuestionIndex === quizQuestions.length - 1 ? "Finish Quiz" : "Next Question"}
                                </button>
                              </div>
                            ) : (
                              <div className="text-center">
                                <h3 className="text-2xl font-semibold mb-4">Quiz Completed!</h3>
                                <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                                  <p className="text-4xl font-bold text-blue-600 mb-2">
                                    {Math.round(calculateScore())}%
                                  </p>
                                  <p className="text-gray-700 text-lg font-semibold mb-2">
                                    Level: {getLevel(calculateScore())}
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    Weighted Score
                                  </p>
                                </div>
                                <button
                                  onClick={closeQuiz}
                                  className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700"
                                >
                                  Close Quiz
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Recommended Courses Modal */}
      {showCoursesModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-4xl w-full mx-4 max-h-96 overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-semibold">Recommended Courses</h3>
              <button
                onClick={closeCoursesModal}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            {recommendedCourses.length === 0 ? (
              <p className="text-gray-500">Loading courses...</p>
            ) : (
              <div className="space-y-4">
                {recommendedCourses.map((course, idx) => (
                  <div key={idx} className="border rounded-lg p-4 hover:shadow-lg transition">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-lg font-semibold text-gray-800">{course.course_name}</h4>
                      <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-2 py-1 rounded">
                        ★ {course.rating}
                      </span>
                    </div>

                    <div className="flex gap-3 mb-3 flex-wrap">
                      <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                        {course.level}
                      </span>
                      <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                        {course.platform}
                      </span>
                    </div>

                    <p className="text-gray-600 text-sm mb-4">{course.why_recommended}</p>

                    <a
                      href={course.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block bg-blue-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                      View Course
                    </a>
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={closeCoursesModal}
              className="w-full bg-gray-600 text-white py-2 rounded-lg font-medium hover:bg-gray-700 mt-6"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
