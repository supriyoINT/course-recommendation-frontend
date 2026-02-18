
import React, { useState } from "react";
import MetricCards from "./MatricCard";  
import ProfileCard from "./ProfileCard";
import SearchBanner from "./SearchBanner";


export default function MainComp() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Search Section */}
          <section className="bg-white rounded-3xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-all duration-300">
            <SearchBanner/>
          </section>

          {/* Metrics Section */}
          <section className="bg-white rounded-3xl shadow-lg p-8 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Progress</h2>
            <MetricCards/>
          </section>
        </div>

        {/* Sidebar */}
        <aside className="space-y-6">
          <ProfileCard/>
        </aside>
      </div>
    </div>
  );
}