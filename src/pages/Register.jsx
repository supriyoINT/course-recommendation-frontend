import React, { useState } from "react";
import { Link } from "react-router-dom";
import { BASE_URL } from "../env";

/* JSON DATA */
const DATA = {
  user_type: ["Student", "Professonal",  "Job Seeker", "Career Switcher"],
  experience_level: ["Beginner", "Intermediate", "Advanced"],
  learning_purpose: ["Job", "Skill Upgrade", "Collage Support", "Hobby", "Certification", "Interest Exploration"],
  preferred_learning_style: ["Project Based", "Theory", "Short Courses", "Long Programs"],
  interest_area: ["Backend Development", "DevOps", "Finance", "Photography", "Music", "Marketing"],
  preferred_platforms: ["Udemy", "Coursera", "FreeCodeCamp", "LinkedIn Learning"],
  budget: ["Free", "Low Cost", "Premium"],
  time_available_per_week: ["5 hours", "Weekends", "Full Time"],
  timeline: ["1 month", "3 months", "Flexible"],

  current_skills: ["Python", "Excel", "Communication", "Drawing"]
};

/* INPUT STYLE (matches Sign In UI) */
const InputWrapper = ({ label, children }) => (
  <label className="block mb-3">
    <div className="text-sm text-neutral-700 mb-1">{label}</div>
    {children}
  </label>
);

/* SELECT BOX STYLE */
const StyledSelect = ({ value, onChange, options }) => (
  <select
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className="
      w-full rounded-lg border border-neutral-200 bg-white px-4 py-3
      text-neutral-900 placeholder-neutral-400
      focus:bg-white focus:text-black focus:ring-2 focus:ring-neutral-300
    "
  >
    <option value="">Select</option>
    {options.map((o) => (
      <option key={o} value={o}>{o}</option>
    ))}
  </select>
);

/* TAG (PILL) SELECTOR */
const TagPill = ({ label, selected, toggle }) => (
  <button
    type="button"
    onClick={() => toggle(label)}
    className={`
      px-3 py-1 rounded-full border text-sm transition
      ${selected ? "bg-black text-white border-black" : "bg-white text-neutral-700 border-neutral-300"}
    `}
  >
    {label}
  </button>
);

/* MAIN COMPONENT */
export default function UserProfileForm() {
  const [form, setForm] = useState({
    user_type: "",
    goal: "",
    experience_level: "",
    background: "",
    learning_purpose: "",
    preferred_learning_style: "",
    budget: "",
    time_available_per_week: "",
    timeline: ""
  });

  const [interestArea, setInterestArea] = useState([]);
  const [platforms, setPlatforms] = useState([]);
  const [skills, setSkills] = useState(DATA.current_skills);

  const [loading, setLoading] = useState(false);

  const handleSelect = (field, value) => setForm((s) => ({ ...s, [field]: value }));

  const toggleInterest = (item) =>
    setInterestArea((prev) =>
      prev.includes(item) ? prev.filter((x) => x !== item) : [...prev, item]
    );

  const togglePlatform = (item) =>
    setPlatforms((prev) =>
      prev.includes(item) ? prev.filter((x) => x !== item) : [...prev, item]
    );

  const submitForm = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = {
            ...form,
            interest_area: interestArea,
            preferred_platforms: platforms,
            current_skills: skills
          }
    await createUserProfile(formData)
    // setTimeout(() => {
    //   setLoading(false);
    //   alert(
    //     JSON.stringify(
    //       {
    //         ...form,
    //         interest_area: interestArea,
    //         preferred_platforms: platforms,
    //         current_skills: skills
    //       },
    //       null,
    //       2
    //     )
    //   );
    // }, 800);
  };

  const createUserProfile = async (data)=>{
    const response = await fetch(`${BASE_URL}users/profile`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
      });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message || "Login failed");
    }
  }

  return (
    <div className="min-h-screen bg-neutral-100 flex items-center justify-center p-6">
      <div className="w-full max-w-5xl">
        <div className="bg-white rounded-2xl shadow-lg p-8 animate-[fadeIn_0.6s_ease]">
          <h2 className="text-2xl font-semibold text-neutral-900 text-center mb-6">
            Complete Your Profile
          </h2>

          <form onSubmit={submitForm} className="grid grid-cols-1 md:grid-cols-3 gap-8">

            {/* COLUMN 1 */}
            <div>
              <InputWrapper label="User Type">
                <StyledSelect
                  value={form.user_type}
                  onChange={(v) => handleSelect("user_type", v)}
                  options={DATA.user_type}
                />
              </InputWrapper>

              <InputWrapper label="Goal">
                <input
                  type="text"
                  placeholder="Your career or hobby goal"
                  value={form.goal}
                  onChange={(e) => handleSelect("goal", e.target.value)}
                  className="w-full rounded-lg border border-neutral-200 bg-white px-4 py-3"
                />
              </InputWrapper>

              <InputWrapper label="Experience Level">
                <StyledSelect
                  value={form.experience_level}
                  onChange={(v) => handleSelect("experience_level", v)}
                  options={DATA.experience_level}
                />
              </InputWrapper>

              <InputWrapper label="Background">
                <input
                  type="text"
                  placeholder="Your education or domain"
                  value={form.background}
                  onChange={(e) => handleSelect("background", e.target.value)}
                  className="w-full rounded-lg border border-neutral-200 bg-white px-4 py-3"
                />
              </InputWrapper>
            </div>

            {/* COLUMN 2 */}
            <div>
              <InputWrapper label="Learning Purpose">
                <StyledSelect
                  value={form.learning_purpose}
                  onChange={(v) => handleSelect("learning_purpose", v)}
                  options={DATA.learning_purpose}
                />
              </InputWrapper>

              <InputWrapper label="Preferred Learning Style">
                <StyledSelect
                  value={form.preferred_learning_style}
                  onChange={(v) => handleSelect("preferred_learning_style", v)}
                  options={DATA.preferred_learning_style}
                />
              </InputWrapper>

              <InputWrapper label="Budget">
                <StyledSelect
                  value={form.budget}
                  onChange={(v) => handleSelect("budget", v)}
                  options={DATA.budget}
                />
              </InputWrapper>

              <InputWrapper label="Timeline">
                <StyledSelect
                  value={form.timeline}
                  onChange={(v) => handleSelect("timeline", v)}
                  options={DATA.timeline}
                />
              </InputWrapper>
            </div>

            {/* COLUMN 3 */}
            <div>
              <InputWrapper label="Weekly Time Available">
                <StyledSelect
                  value={form.time_available_per_week}
                  onChange={(v) => handleSelect("time_available_per_week", v)}
                  options={DATA.time_available_per_week}
                />
              </InputWrapper>

              {/* INTEREST TAG SELECTOR */}
              <InputWrapper label="Interest Area (multi-select)">
                <div className="flex flex-wrap gap-2">
                  {DATA.interest_area.map((item) => (
                    <TagPill
                      key={item}
                      label={item}
                      selected={interestArea.includes(item)}
                      toggle={toggleInterest}
                    />
                  ))}
                </div>
              </InputWrapper>

              {/* PLATFORM TAG SELECTOR */}
              <InputWrapper label="Preferred Learning Platforms (multi-select)">
                <div className="flex flex-wrap gap-2">
                  {DATA.preferred_platforms.map((item) => (
                    <TagPill
                      key={item}
                      label={item}
                      selected={platforms.includes(item)}
                      toggle={togglePlatform}
                    />
                  ))}
                </div>
              </InputWrapper>
            </div>
          </form>

          {/* SUBMIT BUTTON */}
          <div className="text-center mt-8">
            <button
              onClick={submitForm}
              disabled={loading}
              className="
                px-6 py-3 rounded-xl bg-black text-white
                hover:bg-neutral-900 active:scale-95 transition shadow
                disabled:bg-neutral-700
              "
            >
              {loading ? "Saving..." : "Save Profile"}
            </button>
          </div>

          <p className="text-center mt-4 text-sm text-neutral-600">
            <Link to="/" className="text-black underline">Back to Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
