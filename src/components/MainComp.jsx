
import React, { useState } from "react";
import MetricCards from "./MatricCard";  
import ProfileCard from "./ProfileCard";
import SearchBanner from "./SearchBanner";


export default function MainComp() {
  return (
    <div className="max-w-full mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <section className="bg-white border border-gray-200 rounded-lg p-4">
                  <SearchBanner/>
                </section>
              </div>

              <aside className="space-y-6">
                  <ProfileCard/>
              </aside>
            </div>
          </div>
  );
}