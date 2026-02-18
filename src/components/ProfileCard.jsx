import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../env";

export default function ProfileCard() {
  const [userProfile, setUserProfile] = useState(null);
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const userId = JSON.parse(localStorage.getItem("user") || "{}")?.userId;
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchAll = async () => {
      try {
        const [profileRes, goalsRes] = await Promise.all([
          fetch(`${BASE_URL}users/profile/${userId}`, {
            headers: { "ngrok-skip-browser-warning": "true" },
          }),
          fetch(`${BASE_URL}user-goals/${userId}`, {
            headers: { "ngrok-skip-browser-warning": "true" },
          }),
        ]);

        const profileData = await profileRes.json();
        const goalsData = await goalsRes.json();

        if (profileRes.ok) setUserProfile(profileData.data);
        if (goalsRes.ok) setGoals(goalsData.data || []);
      } catch (error) {
        console.error("Error fetching profile data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("signupData");
    navigate("/login", { replace: true });
  };

  const userName = (() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const signupData = JSON.parse(localStorage.getItem("signupData") || "{}");
    return user.name || signupData.name || "User";
  })();

  if (loading) {
    return (
      <div className="bg-white rounded-3xl shadow-lg p-8 border border-gray-100 flex items-center justify-center min-h-[200px]">
        <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-all duration-300">
      {/* Profile Header */}
      <div className="flex flex-col items-center text-center mb-6">
        <div className="relative">
          <img
            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=0D8ABC&color=fff&size=120`}
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover border-4 border-blue-100 shadow-lg"
          />
          <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 rounded-full border-2 border-white"></div>
        </div>

        <h2 className="mt-4 text-2xl font-bold text-gray-900">{userName}</h2>

        <div className="flex items-center gap-2 mt-2 justify-center flex-wrap">
          {userProfile?.user_type && (
            <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full capitalize">
              {userProfile.user_type}
            </span>
          )}
          {userProfile?.experience_level && (
            <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full capitalize">
              {userProfile.experience_level}
            </span>
          )}
        </div>
      </div>

      <hr className="my-6 border-gray-200" />

      {/* Interest Areas */}
      {userProfile?.interest_area?.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
            <span className="text-lg">🎯</span> Interests
          </h3>
          <div className="flex flex-wrap gap-2">
            {userProfile.interest_area.slice(0, 3).map((item) => (
              <span
                key={item}
                className="px-3 py-2 bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 text-xs font-semibold rounded-full"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {userProfile?.current_skills?.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
            <span className="text-lg">⭐</span> Skills
          </h3>
          <div className="flex flex-wrap gap-2">
            {userProfile.current_skills.slice(0, 3).map((skill) => (
              <span
                key={skill}
                className="px-3 py-2 bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 text-xs font-semibold rounded-full"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Platforms */}
      {userProfile?.preferred_platforms?.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
            <span className="text-lg">📚</span> Platforms
          </h3>
          <div className="flex flex-wrap gap-2">
            {userProfile.preferred_platforms.slice(0, 2).map((p) => (
              <span
                key={p}
                className="px-3 py-2 bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 text-xs font-semibold rounded-full"
              >
                {p}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Goal */}
      {goals.length > 0 && (
        <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl border border-purple-200">
          <h3 className="text-xs font-bold text-gray-900 mb-2 uppercase tracking-wide">Your Goal</h3>
          <p className="text-sm text-gray-700 italic">"{goals[0].goal}"</p>
        </div>
      )}

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
