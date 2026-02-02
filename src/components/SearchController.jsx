import React, { useState } from "react";
import SearchResultsDemo from "./SearchResult";

export default function SearchController() {
  const [query, setQuery] = useState("");
  const [filtered, setFiltered] = useState([]);

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setQuery(value);

    const results = fakeResults.filter((c) =>
      c.course_name.toLowerCase().includes(value) ||
      c.platform.toLowerCase().includes(value) ||
      c.why_recommended.toLowerCase().includes(value)
    );

    setFiltered(results);
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Search courses..."
        value={query}
        onChange={handleSearch}
        className="w-full border px-4 py-2 rounded-xl mb-6"
      />

      <SearchResultsDemo results={filtered.length ? filtered : fakeResults} />
    </div>
  );
}
