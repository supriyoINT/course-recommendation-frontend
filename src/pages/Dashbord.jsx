import React, { useState } from "react";
import MainComp from "../components/mainComp";
import SearchResultsDemo from "../components/SearchResult";



export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const nav = [
    { id: 1, label: "Dashboard", icon: DashboardIcon },
    { id: 2, label: "Quiz", icon: QuizIcon }
    // { id: 2, label: "Analytics", icon: AnalyticsIcon },
    // { id: 3, label: "Projects", icon: ProjectsIcon },
    // { id: 4, label: "Settings", icon: SettingsIcon },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Top navbar */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-[0_1px_10px_rgba(0,0,0,0.20)]">
        <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen((s) => !s)}
                className="md:hidden p-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                aria-label="Toggle menu"
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>

              <div className="flex items-center gap-3">
                <div className="text-xl font-semibold text-pink-600">Course Recomentation</div>
              </div>
            </div>

            <div className="flex items-center gap-4">

              <div className="flex items-center gap-2">
                <img className="w-8 h-8 rounded-full" src="https://ui-avatars.com/api/?name=JD&background=0D8ABC&color=fff" alt="avatar" />
                <div className="hidden sm:block text-sm text-cyan-600">John Doe</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Desktop sidebar */}
        <aside className="hidden md:block w-64 bg-white border-r border-gray-200 p-4 overflow-auto">
          <nav className="space-y-1">
            {nav.map((n) => (
              <a key={n.id} href="#" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-50 text-gray-700">
                <n.icon className="w-5 h-5" />
                <span className="font-medium">{n.label}</span>
              </a>
            ))}
          </nav>
        </aside>

        {/* Mobile overlay sidebar */}
        {sidebarOpen && (
          <div className="md:hidden fixed inset-0 z-40">
            <div className="absolute inset-0 bg-black/30" onClick={() => setSidebarOpen(false)} />
            <div className="absolute left-0 top-0 bottom-0 w-72 bg-white p-4 overflow-auto shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <div className="text-lg font-semibold">Menu</div>
                <button onClick={() => setSidebarOpen(false)} className="p-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <nav className="space-y-1">
                {nav.map((n) => (
                  <a key={n.id} href="#" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-50 text-gray-700" onClick={() => setSidebarOpen(false)}>
                    <n.icon className="w-5 h-5" />
                    <span className="font-medium">{n.label}</span>
                  </a>
                ))}
              </nav>
            </div>
          </div>
        )}

        {/* Main content */}
        <main className="flex-1 overflow-auto p-6">
          <MainComp/>
        </main>
      </div>
    </div>
  );
}

/* helper components */
function StatCard({ title, value }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="text-sm text-gray-500">{title}</div>
      <div className="mt-2 text-2xl font-semibold">{value}</div>
    </div>
  );
}




