import { useEffect, useState } from "react";
import { BASE_URL } from "../env";

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
  const [isLoadingCourses, setIsLoadingCourses] = useState(false);
  const [isAddingGoal, setIsAddingGoal] = useState(false);
  const [expandedGoals, setExpandedGoals] = useState(false);
  const [isLoadingQuiz, setIsLoadingQuiz] = useState(false);

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
    const response = await fetch(`${BASE_URL}user-goals/${userDetailsObj.userId}`,{
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true"
      }
    });
    const data = await response.json();
    setGoals(data.data);
  }

  const addGoal = async (goalTitle) => {
    setIsAddingGoal(true);
    const userDetails = localStorage.getItem("user");
    console.log("User Details:", userDetails);
    const userDetailsObj = JSON.parse(userDetails);
    try {
      const response = await fetch(`${BASE_URL}user-goals`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true"
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
    } catch (error) {
      console.error("Error adding goal:", error);
      alert("Error adding goal. Please try again.");
    } finally {
      setIsAddingGoal(false);
    }
  };



  useEffect(() => {
    fetchUserGoals();
  }, [goals.length]);

  const fetchLearningPathForGoal = async (goalId) => {
    const response = await fetch(`${BASE_URL}user-goals-steps/${goalId}`,{
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true"
      }
    });
    const data = await response.json();
    return data;
  };

  // Mock API response
  const loadStepsForGoal = async (goal) => {
    console.log("Loading steps for goal:", goal);
    if(!goal?.learning_path){
        const stepdRes = await fetchLearningPathForGoal(goal.goal_id);
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
    setIsLoadingQuiz(true);
    
    try {
      const response = await fetch(`${BASE_URL}generate-mcq`,{
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true"
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
    } finally {
      setIsLoadingQuiz(false);
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
    setIsLoadingCourses(true);
    console.log("Fetching courses for skill:", step.skill);
    const recommendePayload = { topic: step.skill, skill_level: step.level || "beginner" };
    try {
      const response = await fetch(`${BASE_URL}recommended_course_based_on_skill`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true"
        },
        body: JSON.stringify(recommendePayload)
      });
      const data = await response.json();
      if (data.status === "success") {
        setRecommendedCourses(data.data.recommended_courses);
      }
    } catch (error) {
      console.error("Failed to fetch recommended courses:", error);
      
    } finally {
      setIsLoadingCourses(false);
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
         const res =await fetch(`${BASE_URL}recommended_course_based_on_skill`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true"
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Learning Path
          </h1>
          <p className="text-gray-600 text-lg">Track your goals and master new skills</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Panel - Goals Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 sticky top-6">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Create New Goal</h2>
                <input
                  type="text"
                  value={goalInput}
                  onChange={(e) => setGoalInput(e.target.value)}
                  placeholder="e.g., Master React"
                  disabled={isAddingGoal}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <button
                  onClick={handleAddGoal}
                  disabled={isAddingGoal}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl py-3 font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isAddingGoal ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Adding Goal...
                    </>
                  ) : (
                    "+ Add Goal"
                  )}
                </button>
              </div>

              <div className="border-t pt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Your Goals</h3>
                  {goals.length > 0 && (
                    <button
                      onClick={() => setGoals([])}
                      className="text-xs text-red-600 hover:text-red-700 font-semibold hover:underline"
                      title="Clear all goals"
                    >
                      Clear
                    </button>
                  )}
                </div>
                {goals.length === 0 ? (
                  <p className="text-gray-500 text-sm">No goals yet. Create one to get started!</p>
                ) : (
                  <>
                    <ul className="space-y-2">
                      {(expandedGoals ? [...goals].reverse() : [...goals].reverse().slice(0, 3)).map((goal) => (
                        <li
                          key={goal.id}
                          onClick={() => loadStepsForGoal(goal.id)}
                          className={`cursor-pointer rounded-xl px-4 py-3 border-2 transition-all duration-300 ${
                            selectedGoal?.id === goal.id 
                              ? "bg-gradient-to-r from-blue-50 to-purple-50 border-blue-500 shadow-md" 
                              : "bg-white border-gray-200 hover:border-blue-300"
                          }`}
                        >
                          <p className="font-medium text-gray-900 truncate">{goal.goal}</p>
                        </li>
                      ))}
                    </ul>
                    {goals.length > 3 && (
                      <button
                        onClick={() => setExpandedGoals(!expandedGoals)}
                        className="w-full mt-3 text-sm text-blue-600 hover:text-blue-700 font-semibold py-2 rounded-lg hover:bg-blue-50 transition-all duration-300"
                      >
                        {expandedGoals ? "Show Less" : `See More (${goals.length - 3})`}
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Right Panel - Learning Path */}
          <div className="lg:col-span-2">
            {!selectedGoal ? (
              <div className="bg-white rounded-2xl shadow-lg p-12 border border-gray-100 text-center">
                <div className="mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Goal Selected</h3>
                <p className="text-gray-600">Select a goal from the left panel to view your learning path</p>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                {/* Goal Header */}
                <div className="mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">{selectedGoal.goal}</h2>
                  <div className="flex items-center gap-4">
                    <div className="flex-1 bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-full transition-all duration-500"
                        style={{ width: `${(completedCount / selectedGoal.learning_path.length) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-semibold text-gray-700 whitespace-nowrap">
                      {completedCount}/{selectedGoal.learning_path.length}
                    </span>
                  </div>
                </div>

                {/* Steps */}
                <div className="space-y-4">
                  {selectedGoal.learning_path
                    .sort((a, b) => a.step_number - b.step_number)
                    .map((step, index) => (
                      <div 
                        key={step.step_number} 
                        className={`border-2 rounded-xl p-5 transition-all duration-300 ${
                          step.completed 
                            ? "bg-gradient-to-r from-green-50 to-emerald-50 border-green-300" 
                            : "bg-gradient-to-r from-blue-50 to-transparent border-gray-300 hover:border-blue-400"
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-4 flex-1">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0 ${
                              step.completed 
                                ? "bg-green-500 text-white" 
                                : "bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                            }`}>
                              {step.completed ? "✓" : index + 1}
                            </div>
                            <div className="flex-1">
                              <h3 className="text-lg font-semibold text-gray-900">{step.skill}</h3>
                              <div className="flex items-center gap-3 mt-2 flex-wrap">
                                <span className="text-xs bg-gray-200 text-gray-700 px-3 py-1 rounded-full font-medium">
                                  {step.type}
                                </span>
                                {step.level && (
                                  <span className="text-xs bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-semibold">
                                    Level: {step.level}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={() => toggleStep(step.step_number)}
                            className={`text-xs font-semibold px-4 py-2 rounded-full ml-4 whitespace-nowrap transition-all duration-300 ${
                              step.completed 
                                ? "bg-green-500 text-white hover:bg-green-600" 
                                : "bg-gray-300 text-gray-800 hover:bg-gray-400"
                            }`}
                          >
                            {step.completed ? "✓ Completed" : "Mark Done"}
                          </button>
                        </div>

                        {/* Action Buttons */}
                        <div className="mt-5 flex gap-3 flex-wrap">
                          <button 
                            className="text-sm px-4 py-2 rounded-lg border-2 border-blue-500 text-blue-600 font-semibold hover:bg-blue-50 transition-all duration-300"
                            onClick={() => openCoursesModal(step)}
                          >
                            📚 Recommended Courses
                          </button>
                          <button
                            onClick={() => openQuiz(step.step_number, step.skill)}
                            className="text-sm px-4 py-2 rounded-lg border-2 border-purple-500 text-purple-600 font-semibold hover:bg-purple-50 transition-all duration-300"
                          >
                            ❓ Skill Check Quiz
                          </button>
                        </div>

                        {/* Quiz Section */}
                        {activeQuizStep === step.step_number && (isLoadingQuiz || quizQuestions.length > 0) && (
                          <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black bg-opacity-80 flex items-center justify-center z-50 p-4">
                            <div className="bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 rounded-3xl p-12 w-full lg:w-11/12 h-5/6 shadow-2xl border-2 border-indigo-700 overflow-y-auto">
                              {isLoadingQuiz ? (
                                <div className="flex flex-col items-center justify-center h-full">
                                  <div className="mb-8">
                                    <div className="w-24 h-24 border-4 border-indigo-400 border-t-yellow-400 rounded-full animate-spin mx-auto"></div>
                                  </div>
                                  <h3 className="text-4xl font-black mb-4 bg-gradient-to-r from-indigo-300 via-purple-300 to-yellow-300 bg-clip-text text-transparent">Preparing Your Quiz</h3>
                                  <p className="text-lg text-indigo-200 font-semibold">Generating premium questions for <span className="text-yellow-300 font-black">{step.skill}</span>...</p>
                                  <div className="mt-8 flex gap-3 justify-center">
                                    <div className="w-4 h-4 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full animate-bounce shadow-lg shadow-indigo-500/50"></div>
                                    <div className="w-4 h-4 bg-gradient-to-r from-purple-400 to-yellow-400 rounded-full animate-bounce shadow-lg shadow-purple-500/50" style={{ animationDelay: "0.1s" }}></div>
                                    <div className="w-4 h-4 bg-gradient-to-r from-yellow-400 to-indigo-400 rounded-full animate-bounce shadow-lg shadow-yellow-500/50" style={{ animationDelay: "0.2s" }}></div>
                                  </div>
                                </div>
                              ) : !quizCompleted ? (
                                <div>
                                  {/* Quiz Header */}
                                  <div className="flex justify-between items-center mb-8 pb-6 border-b-2 border-indigo-600">
                                    <div>
                                      <h2 className="text-4xl font-black bg-gradient-to-r from-yellow-300 to-indigo-300 bg-clip-text text-transparent mb-2">
                                        Question {currentQuestionIndex + 1}
                                      </h2>
                                      <p className="text-indigo-300 text-lg font-bold">
                                        {currentQuestionIndex + 1} of {quizQuestions.length}
                                      </p>
                                    </div>
                                    <button
                                      onClick={closeQuiz}
                                      className="text-indigo-400 hover:text-yellow-300 text-5xl font-light leading-none hover:bg-indigo-800/50 w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 border-2 border-indigo-600 hover:border-yellow-400"
                                    >
                                      ×
                                    </button>
                                  </div>

                                  {/* Question Card */}
                                  <div className="mb-10 bg-gradient-to-br from-indigo-800 to-purple-800 p-8 rounded-2xl border-2 border-yellow-400 shadow-2xl shadow-indigo-500/50">
                                    <p className="text-2xl font-black text-white mb-6 leading-relaxed">
                                      {quizQuestions[currentQuestionIndex].question}
                                    </p>
                                    <div className="flex items-center gap-3">
                                      <span className="text-sm font-bold px-4 py-2 rounded-full bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900">
                                        Difficulty
                                      </span>
                                      <span className="text-lg font-black text-yellow-300 capitalize">
                                        {quizQuestions[currentQuestionIndex].difficulty}
                                      </span>
                                    </div>
                                  </div>

                                  {/* Options */}
                                  <div className="space-y-3 mb-8">
                                    {Object.entries(quizQuestions[currentQuestionIndex].options).map(([key, value]) => (
                                      <label
                                        key={key}
                                        className={`flex items-center p-5 border-3 rounded-2xl cursor-pointer transition-all duration-300 font-semibold text-lg ${
                                          userAnswers[currentQuestionIndex] === key
                                            ? "bg-gradient-to-r from-yellow-400 to-orange-400 border-yellow-300 text-gray-900 shadow-2xl shadow-yellow-500/50"
                                            : "bg-gradient-to-r from-indigo-800 to-purple-800 border-indigo-600 text-indigo-100 hover:border-yellow-400 hover:from-indigo-700 hover:to-purple-700"
                                        } ${userAnswers[currentQuestionIndex] ? "opacity-60" : ""}`}
                                      >
                                        <input
                                          type="radio"
                                          name="answer"
                                          value={key}
                                          checked={userAnswers[currentQuestionIndex] === key}
                                          onChange={() => handleAnswerSelect(key)}
                                          disabled={!!userAnswers[currentQuestionIndex]}
                                          className="mr-4 disabled:cursor-not-allowed w-5 h-5 accent-yellow-400"
                                        />
                                        <span className="font-black text-lg mr-3 w-10">{key}</span>
                                        <span>{value}</span>
                                      </label>
                                    ))}
                                  </div>

                                  {/* Feedback */}
                                  {userAnswers[currentQuestionIndex] && (
                                    <div className={`p-6 rounded-2xl mb-8 border-3 font-semibold text-lg ${
                                      userAnswers[currentQuestionIndex] === quizQuestions[currentQuestionIndex].correct_answer
                                        ? "bg-gradient-to-r from-green-900 to-emerald-900 border-green-400 text-green-100"
                                        : "bg-gradient-to-r from-red-900 to-pink-900 border-red-400 text-red-100"
                                    }`}>
                                      <p className="text-xl font-black mb-3">
                                        {userAnswers[currentQuestionIndex] === quizQuestions[currentQuestionIndex].correct_answer
                                          ? "✓ Correct!"
                                          : "✗ Incorrect"}
                                      </p>
                                      <p className="text-base leading-relaxed">{quizQuestions[currentQuestionIndex].explanation}</p>
                                    </div>
                                  )}

                                  {/* Next Button */}
                                  <button
                                    onClick={handleNextQuestion}
                                    disabled={!userAnswers[currentQuestionIndex]}
                                    className="w-full bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 py-4 rounded-2xl font-black text-xl disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-2xl hover:shadow-yellow-500/50 transition-all duration-300 transform disabled:scale-100 hover:scale-105 border-2 border-yellow-300"
                                  >
                                    {currentQuestionIndex === quizQuestions.length - 1 ? "🏁 Finish Quiz" : "➜ Next Question"}
                                  </button>
                                </div>
                              ) : (
                                <div className="flex flex-col items-center justify-center h-full text-center">
                                  <h2 className="text-5xl font-black mb-8 bg-gradient-to-r from-yellow-300 to-indigo-300 bg-clip-text text-transparent">
                                    🎉 Quiz Completed!
                                  </h2>
                                  <div className="mb-10 p-10 bg-gradient-to-br from-yellow-600 via-orange-600 to-red-600 rounded-3xl border-4 border-yellow-300 shadow-2xl shadow-yellow-500/50">
                                    <p className="text-7xl font-black text-white mb-4">
                                      {Math.round(calculateScore())}%
                                    </p>
                                    <p className="text-3xl font-black text-yellow-200 mb-2">
                                      Level: {getLevel(calculateScore())}
                                    </p>
                                    <p className="text-lg text-yellow-100 font-semibold">
                                      Weighted Score
                                    </p>
                                  </div>
                                  <button
                                    onClick={closeQuiz}
                                    className="w-full max-w-md bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-4 rounded-2xl font-black text-xl hover:shadow-2xl hover:shadow-indigo-500/50 transition-all duration-300 border-2 border-indigo-400"
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
      </div>

      {/* Recommended Courses Modal */}
      {showCoursesModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-8 w-full h-full md:w-11/12 md:h-5/6 md:rounded-3xl shadow-2xl overflow-y-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-8 sticky top-0 bg-white pb-4 border-b-2 border-gray-200">
              <div>
                <h3 className="text-4xl font-black text-gray-900">🎓 Recommended Courses</h3>
                <p className="text-lg text-gray-600 mt-1">for <span className="font-bold text-blue-600">{currentSkill}</span></p>
              </div>
              <button
                onClick={closeCoursesModal}
                className="text-gray-500 hover:text-gray-700 text-5xl font-light leading-none hover:bg-gray-100 w-12 h-12 rounded-full flex items-center justify-center transition-all"
              >
                ×
              </button>
            </div>

            {isLoadingCourses ? (
              <div className="flex items-center justify-center py-24">
                <div className="text-center">
                  <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
                  </div>
                  <p className="text-xl text-gray-600 font-semibold">Finding the best courses for <span className="text-blue-600">{currentSkill}</span>...</p>
                </div>
              </div>
            ) : recommendedCourses.length === 0 ? (
              <div className="text-center py-24">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-20 h-20 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-lg text-gray-500">No courses found at the moment. Try again later.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {recommendedCourses.map((course, idx) => (
                  <div 
                    key={idx} 
                    className="border-3 border-gray-300 rounded-2xl p-6 hover:shadow-2xl hover:border-blue-500 transition-all duration-300 bg-gradient-to-br from-blue-50 via-white to-purple-50 group cursor-pointer transform hover:-translate-y-2"
                  >
                    {/* Course Header */}
                    <div className="flex justify-between items-start mb-4 gap-3">
                      <h4 className="text-2xl font-black text-gray-900 leading-tight flex-1 group-hover:text-blue-600 transition-colors">
                        {course.course_name}
                      </h4>
                      <span className="bg-gradient-to-r from-yellow-400 to-yellow-300 text-yellow-900 text-lg font-black px-4 py-2 rounded-full ml-4 whitespace-nowrap shadow-md">
                        ⭐ {course.rating}
                      </span>
                    </div>

                    {/* Badges */}
                    <div className="flex gap-3 mb-5 flex-wrap">
                      <span className="inline-block bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm px-4 py-2 rounded-full font-bold shadow-md">
                        📊 {course.level}
                      </span>
                      <span className="inline-block bg-gradient-to-r from-purple-500 to-purple-600 text-white text-sm px-4 py-2 rounded-full font-bold shadow-md">
                        🎯 {course.platform}
                      </span>
                    </div>

                    {/* Description */}
                    <p className="text-gray-700 text-base mb-6 leading-relaxed font-medium">
                      {course.why_recommended}
                    </p>

                    {/* CTA Button */}
                    <a
                      href={course.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white text-base px-6 py-3 rounded-xl font-bold hover:shadow-lg transition-all duration-300 hover:from-blue-700 hover:to-purple-700 transform group-hover:scale-105"
                    >
                      🚀 View Course
                    </a>
                  </div>
                ))}
              </div>
            )}

            {/* Footer Close Button */}
            {!isLoadingCourses && recommendedCourses.length > 0 && (
              <button
                onClick={closeCoursesModal}
                className="w-full bg-gradient-to-r from-gray-300 to-gray-400 text-gray-900 py-4 rounded-xl font-bold text-lg hover:from-gray-400 hover:to-gray-500 transition-all duration-300 shadow-md"
              >
                ✕ Close
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
