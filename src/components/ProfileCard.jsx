import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
        const response = await fetch(`${BASE_URL}users/profile/2`,{
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
    // clear token or session here if needed
    navigate("/login", { replace: true });
  };

  return (
    <div
      className="
      bg-white shadow-lg rounded-xl p-6 w-full max-w-sm mx-auto 
      animate-[fadeSlide_0.5s_ease]
    "
    >
      {/* Animation Keyframes */}
      <style>{`
        @keyframes fadeSlide {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Profile Section */}
      <div className="flex flex-col items-center text-center">
        <img
          src="/assets/image/m.jpg"
          alt="Profile"
          className="w-24 h-24 rounded-full object-cover border shadow"
        />

        <h2 className="mt-4 text-lg font-semibold text-gray-800">
          {userProfile ? userProfile.fullName : USER_DATA.fullName}
        </h2>

        <p className="text-sm text-gray-500 capitalize">
          {userProfile
            ? `${userProfile.user_type} • ${userProfile.experience_level}`
            : `${USER_DATA.user_type} • ${USER_DATA.experience_level}`}
        </p>

        {/* Goal */}
        <p className="mt-2 text-xs text-gray-600 italic w-11/12">
          "{userProfile ? userProfile.goal : USER_DATA.goal}"
        </p>

        {/* Interest Areas */}
        <div className="mt-4 w-full">
          <h3 className="text-sm font-semibold text-gray-700">Interest Areas:</h3>
          <div className="flex flex-wrap gap-2 mt-3 justify-center">
            {(userProfile ? userProfile.interest_area : USER_DATA.interest_area)?.map(
              (item) => (
                <span
                  key={item}
                  className="px-3 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full"
                >
                  {item}
                </span>
              )
            )}
          </div>
        </div>

        {/* Skills */}
        <div className="mt-4 w-full">
          <h3 className="text-sm font-semibold text-gray-700">Skills:</h3>
          <div className="flex flex-wrap gap-2 mt-3 justify-center">
            {(userProfile ? userProfile.current_skills : USER_DATA.current_skills)?.map(
              (skill) => (
                <span
                  key={skill}
                  className="px-3 py-1 bg-blue-100 text-blue-600 text-xs rounded-full"
                >
                  {skill}
                </span>
              )
            )}
          </div>
        </div>

        {/* Preferred Platforms */}
        <div className="mt-4 w-full">
          <h3 className="text-sm font-semibold text-gray-700">Learning Platforms:</h3>
          <div className="flex flex-wrap gap-2 mt-3 justify-center">
            {(userProfile ? userProfile.preferred_platforms : USER_DATA.preferred_platforms)?.map(
              (p) => (
                <span
                  key={p}
                  className="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full"
                >
                  {p}
                </span>
              )
            )}
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="
            mt-8 w-full bg-red-500 text-white py-2 
            rounded-lg hover:bg-red-600 active:scale-[0.97] 
            transition font-medium
          "
        >
          Logout
        </button>

        {/* Link to Register Page */}
        <p className="text-sm mt-4 text-gray-600">
          Want to{" "}
          <Link
            to="/register"
            className="text-blue-600 font-semibold underline underline-offset-2"
          >
            update
          </Link>{" "}
          Profile ?
        </p>
      </div>
    </div>
  );
}
