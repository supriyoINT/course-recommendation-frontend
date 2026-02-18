import { useState } from "react";
import { BASE_URL } from "../env";
import { useNavigate } from "react-router-dom";

/* JSON DATA */
const DATA = {
  user_type: ["Student", "Professional", "Job Seeker", "Career Switcher"],
  experience_level: ["Beginner", "Intermediate", "Advanced"],
  learning_purpose: ["Job", "Skill Upgrade", "College Support", "Hobby", "Certification", "Interest Exploration"],
  interest_area: ["Backend Development", "DevOps", "Finance", "Photography", "Music", "Marketing", "Frontend", "Data Science"],
};

/* MAIN COMPONENT */
export default function UserProfileForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;

  const [form, setForm] = useState({
    name: "",
    user_type: "",
    experience_level: "",
    learning_purpose: "",
    interest_area: []
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSelect = (field, value) => setForm((s) => ({ ...s, [field]: value }));

  const toggleInterest = (item) =>
    setForm((prev) => ({
      ...prev,
      interest_area: prev.interest_area.includes(item)
        ? prev.interest_area.filter((x) => x !== item)
        : [...prev.interest_area, item]
    }));

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return form.name.trim() !== "";
      case 2:
        return form.user_type !== "";
      case 3:
        return form.experience_level !== "";
      case 4:
        return form.learning_purpose !== "";
      case 5:
        return form.interest_area.length > 0;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (canProceed() && currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const submitForm = async (e) => {
    if (e) e.preventDefault();

    const user_id = JSON.parse(localStorage.getItem("user"))?.userId;
    if (!user_id) {
      alert("User not logged in");
      return;
    }

    if (!canProceed()) {
      alert("Please complete all fields");
      return;
    }

    setLoading(true);
    const formData = {
      name: form.name,
      user_type: form.user_type,
      experience_level: form.experience_level,
      learning_purpose: form.learning_purpose,
      interest_area: form.interest_area,
      user_id: user_id
    };

    try {
      const response = await fetch(`${BASE_URL}users/profile`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true"
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Profile creation failed");
      }

      navigate("/dashboard");
    } catch (error) {
      console.error("Error:", error);
      alert("Error saving profile. Please try again.");
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border border-gray-100">
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Complete Your Profile
            </h1>
            <p className="text-gray-600 text-lg">Set up your preferences in 4 simple steps</p>
          </div>

          {/* Progress Bar */}
          <div className="mb-10">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-semibold text-gray-700">Step {currentStep} of {totalSteps}</span>
              <span className="text-sm font-semibold text-gray-500">{Math.round((currentStep / totalSteps) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-full transition-all duration-500"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              />
            </div>
          </div>

          {/* Step Content */}
          <div className="mb-10 min-h-[300px]">
            {/* STEP 1: Name */}
            {currentStep === 1 && (
              <div className="animate-fadeIn">
                <div className="mb-8">
                  <span className="text-2xl font-bold text-gray-900 mb-1">What's your name?</span>
                  <p className="text-gray-600 text-base mt-2">Let us know what to call you</p>
                </div>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
                  placeholder="Enter your full name"
                  className="w-full rounded-2xl border-2 border-gray-200 bg-white px-5 py-4 text-gray-900 text-lg placeholder-gray-400 focus:border-blue-500 focus:bg-blue-50 focus:outline-none transition-all duration-300"
                  onKeyDown={(e) => { if (e.key === "Enter" && canProceed()) setCurrentStep(2); }}
                  autoFocus
                />
              </div>
            )}

            {/* STEP 2: User Type */}
            {currentStep === 2 && (
              <div className="animate-fadeIn">
                <div className="mb-8">
                  <label className="block mb-2">
                    <span className="text-2xl font-bold text-gray-900 mb-1">What's your user type?</span>
                    <p className="text-gray-600 text-base mt-2">Select the option that best describes you</p>
                  </label>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {DATA.user_type.map((type) => (
                    <button
                      key={type}
                      onClick={() => handleSelect("user_type", type)}
                      className={`p-5 rounded-2xl border-3 transition-all duration-300 font-semibold text-lg text-center ${
                        form.user_type === type
                          ? "bg-gradient-to-r from-blue-500 to-purple-500 border-blue-500 text-white shadow-lg scale-105"
                          : "bg-white border-gray-300 text-gray-900 hover:border-blue-400 hover:shadow-md"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 3: Experience Level */}
            {currentStep === 3 && (
              <div className="animate-fadeIn">
                <div className="mb-8">
                  <label className="block mb-2">
                    <span className="text-2xl font-bold text-gray-900 mb-1">What's your experience level?</span>
                    <p className="text-gray-600 text-base mt-2">Select your current skill level</p>
                  </label>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {DATA.experience_level.map((level) => (
                    <button
                      key={level}
                      onClick={() => handleSelect("experience_level", level)}
                      className={`p-6 rounded-2xl border-3 transition-all duration-300 font-semibold text-lg text-center ${
                        form.experience_level === level
                          ? "bg-gradient-to-r from-blue-500 to-purple-500 border-blue-500 text-white shadow-lg scale-105"
                          : "bg-white border-gray-300 text-gray-900 hover:border-blue-400 hover:shadow-md"
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 4: Learning Purpose */}
            {currentStep === 4 && (
              <div className="animate-fadeIn">
                <div className="mb-8">
                  <label className="block mb-2">
                    <span className="text-2xl font-bold text-gray-900 mb-1">What's your learning purpose?</span>
                    <p className="text-gray-600 text-base mt-2">Tell us why you want to learn</p>
                  </label>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {DATA.learning_purpose.map((purpose) => (
                    <button
                      key={purpose}
                      onClick={() => handleSelect("learning_purpose", purpose)}
                      className={`p-5 rounded-2xl border-3 transition-all duration-300 font-semibold text-lg text-center ${
                        form.learning_purpose === purpose
                          ? "bg-gradient-to-r from-blue-500 to-purple-500 border-blue-500 text-white shadow-lg scale-105"
                          : "bg-white border-gray-300 text-gray-900 hover:border-blue-400 hover:shadow-md"
                      }`}
                    >
                      {purpose}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 5: Interest Area */}
            {currentStep === 5 && (
              <div className="animate-fadeIn">
                <div className="mb-8">
                  <label className="block mb-2">
                    <span className="text-2xl font-bold text-gray-900 mb-1">What are your interests?</span>
                    <p className="text-gray-600 text-base mt-2">Select one or more areas you're interested in</p>
                  </label>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {DATA.interest_area.map((interest) => (
                    <button
                      key={interest}
                      onClick={() => toggleInterest(interest)}
                      className={`p-5 rounded-2xl border-3 transition-all duration-300 font-semibold text-lg text-center ${
                        form.interest_area.includes(interest)
                          ? "bg-gradient-to-r from-green-500 to-emerald-500 border-green-500 text-white shadow-lg scale-105"
                          : "bg-white border-gray-300 text-gray-900 hover:border-green-400 hover:shadow-md"
                      }`}
                    >
                      {interest}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            {currentStep < totalSteps && (
              <button
                onClick={handleNext}
                disabled={!canProceed()}
                className={`flex-1 py-4 px-6 rounded-2xl font-bold text-lg transition-all duration-300 ${
                  canProceed()
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg hover:scale-105"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                Next Step →
              </button>
            )}

            {currentStep === 5 && (
              <button
                onClick={submitForm}
                disabled={!canProceed() || loading}
                className={`flex-1 py-4 px-6 rounded-2xl font-bold text-lg transition-all duration-300 ${
                  loading
                    ? "bg-gray-400 text-white cursor-not-allowed"
                    : "bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:shadow-lg hover:scale-105"
                }`}
              >
                {loading ? "Completing Setup..." : "✓ Complete Profile"}
              </button>
            )}
          </div>
        </div>

        {/* Footer Info */}
        <p className="text-center mt-8 text-gray-600 text-sm">
          Your profile helps us recommend the best courses for you
        </p>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
}
