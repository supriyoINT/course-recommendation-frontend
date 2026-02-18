import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../env";

/* Example user data from JSON */
const USER_DATA = {
  fullName: "John Doe",
  user_type: "professional",
  experience_level: "advanced",
  interest_area: ["Backend Development", "Music"],
  preferred_platforms: ["Udemy", "Coursera"],
  current_skills: ["React", "Node.js", "TailwindCSS"],
  goal: "Become a full-stack architect",
};

export default function ProfileCard() {
  const [userProfile, setUserProfile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const userDetails = localStorage.getItem("user");
        const response = await fetch(`${BASE_URL}users/profile/${JSON.parse(userDetails)?.userId}`,{
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true"
          }
        });
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        console.log("Fetched user profile:", data);
        setUserProfile(data.data);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserProfile();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("signupData");
    navigate("/login", { replace: true });
  };

  return (
    <div className="bg-white rounded-3xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-all duration-300">
      {/* Profile Header */}
      <div className="flex flex-col items-center text-center mb-6">
        <div className="relative">
          <img
            src={`https://ui-avatars.com/api/?name=${userProfile?.fullName || USER_DATA.fullName}&background=0D8ABC&color=fff&size=120`}
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover border-4 border-blue-100 shadow-lg"
          />
          <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 rounded-full border-2 border-white"></div>
        </div>

        <h2 className="mt-4 text-2xl font-bold text-gray-900">
          {userProfile?.fullName || USER_DATA.fullName}
        </h2>

        <div className="flex items-center gap-2 mt-2 justify-center flex-wrap">
          <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full capitalize">
            {userProfile?.user_type || USER_DATA.user_type}
          </span>
          <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full capitalize">
            {userProfile?.experience_level || USER_DATA.experience_level}
          </span>
        </div>
      </div>

      <hr className="my-6 border-gray-200" />

      {/* Interest Areas */}
      <div className="mb-6">
        <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
          <span className="text-lg">🎯</span> Interests
        </h3>
        <div className="flex flex-wrap gap-2">
          {(userProfile?.interest_area || USER_DATA.interest_area)?.slice(0, 3).map(
            (item) => (
              <span
                key={item}
                className="px-3 py-2 bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 text-xs font-semibold rounded-full"
              >
                {item}
              </span>
            )
          )}
        </div>
      </div>

      {/* Skills */}
      <div className="mb-6">
        <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
          <span className="text-lg">⭐</span> Skills
        </h3>
        <div className="flex flex-wrap gap-2">
          {(userProfile?.current_skills || USER_DATA.current_skills)?.slice(0, 3).map(
            (skill) => (
              <span
                key={skill}
                className="px-3 py-2 bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 text-xs font-semibold rounded-full"
              >
                {skill}
              </span>
            )
          )}
        </div>
      </div>

      {/* Platforms */}
      <div className="mb-6">
        <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
          <span className="text-lg">📚</span> Platforms
        </h3>
        <div className="flex flex-wrap gap-2">
          {(userProfile?.preferred_platforms || USER_DATA.preferred_platforms)?.slice(0, 2).map(
            (p) => (
              <span
                key={p}
                className="px-3 py-2 bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 text-xs font-semibold rounded-full"
              >
                {p}
              </span>
            )
          )}
        </div>
      </div>

      {/* Goal */}
      <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl border border-purple-200">
        <h3 className="text-xs font-bold text-gray-900 mb-2 uppercase tracking-wide">Your Goal</h3>
        <p className="text-sm text-gray-700 italic">
          "{userProfile?.goal || USER_DATA.goal}"
        </p>
      </div>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold text-lg hover:shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95"
      >
        🚪 Logout
      </button>
    </div>
  );
}
