"use client";

import React, { useState, useEffect, useMemo } from "react";
import ReactMarkdown from "react-markdown";
import { Search, User, Clock, Mail } from "lucide-react";
import Fuse from "fuse.js";
import { getFeedbacksAction } from "../actions"; // Adjust import path as needed
import { LuGithub } from "react-icons/lu";
import { FaSpinner } from "react-icons/fa"; // Added for the loading state

// 1. Types
type Feedback = {
  id: string;
  created_at: string;
  category: "Blogs" | "Projects" | "Portfolio Website";
  project_name: string | null;
  name: string;
  github_id: string | null;
  email: string;
  feedback: string;
};

// Helper Component for Highlighting Text - Updated to Dark Mode Theme
const HighlightText = ({
  text,
  highlight,
}: {
  text: string;
  highlight: string;
}) => {
  if (!highlight.trim() || !text) return <>{text}</>;
  // Create a case-insensitive regex to split the text
  const regex = new RegExp(`(${highlight})`, "gi");
  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <mark
            key={i}
            className="bg-blue-500/30 text-blue-300 rounded px-1 font-bold bg-transparent border border-blue-500/20"
          >
            {part}
          </mark>
        ) : (
          part
        ),
      )}
    </>
  );
};

export default function FeedbacksList() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Search State & Debounce State
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("All");

  // Fetch data on mount
  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    setIsLoading(true);
    try {
      const result = await getFeedbacksAction();
      if (!result.success) throw new Error(result.error);
      setFeedbacks((result.data as Feedback[]) || []);
    } catch (error) {
      console.error("Error fetching feedbacks:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Debounce the search query (waits 300ms after user stops typing)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Memoize the filtered and searched results so it only recalculates when necessary
  const filteredFeedbacks = useMemo(() => {
    // 1. First, filter by Category (Faster to search a smaller list)
    let baseList = feedbacks;
    if (activeCategory !== "All") {
      baseList = feedbacks.filter((fb) => fb.category === activeCategory);
    }

    // 2. If no search query, return the category list
    if (!debouncedQuery.trim()) {
      return baseList;
    }

    // 3. Apply Fuzzy Search with weighted keys
    const fuse = new Fuse(baseList, {
      keys: [
        { name: "project_name", weight: 3 }, // Highest priority
        { name: "name", weight: 2 }, // Medium priority
        { name: "feedback", weight: 1 }, // Lowest priority
      ],
      threshold: 0.3, // 0.0 is perfect match, 1.0 matches anything. 0.3 is a good balance for typos.
      ignoreLocation: true, // Searches the whole string, not just the beginning
    });

    return fuse.search(debouncedQuery).map((result) => result.item);
  }, [feedbacks, activeCategory, debouncedQuery]);

  const filterOptions = ["All", "Projects", "Blogs", "Portfolio Website"];

  return (
    <div className="w-full min-h-screen bg-[#1e1e1e] text-neutral-200 flex flex-col relative">
      {/* --- Top Control Panel --- */}
      <div className="top-0 z-40 border-b border-white/5 bg-[#1e1e1e]/80 backdrop-blur-xl">
        <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            {/* Header Titles */}
            <div>
              <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white mb-2">
                Opened and Closed Issues
              </h1>
              <p className="text-sm md:text-[15px] text-neutral-400 max-w-2xl">
                Documenting Suggestions, Bugs, and Feedback since 2025.
              </p>
            </div>

            {/* Controls / Search */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
              <div className="group flex items-center bg-[#18181b] border border-white/10 rounded-xl px-4 py-2.5 flex-1 sm:flex-none transition-all duration-300 hover:border-white/20 focus-within:border-white/20 focus-within:shadow-[0_0_15px_rgba(255,255,255,0.03)]">
                <Search
                  size={16}
                  className="text-neutral-500 group-focus-within:text-blue-400 mr-3 transition-colors"
                />
                <input
                  type="text"
                  placeholder="Search logs (e.g., 'auth', 'typo')..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full sm:w-64 outline-none text-[15px] bg-transparent placeholder-neutral-500 text-white"
                />
              </div>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="flex overflow-x-auto hide-scrollbar gap-2 sm:gap-3 mt-6 pb-1">
            {filterOptions.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-[14px] font-medium whitespace-nowrap cursor-pointer transition-all duration-200 ${
                  activeCategory === cat
                    ? "bg-white/10 text-white border border-white/10 shadow-sm"
                    : "bg-[#18181b] border border-white/5 text-neutral-500 hover:text-neutral-300 hover:bg-white/5 hover:border-white/10"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* --- Main Content Area --- */}
      <main className="flex-1 w-full max-w-[1600px] mx-auto p-4 md:p-8 z-10">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4 text-neutral-500">
            <FaSpinner className="animate-spin text-blue-500" size={28} />
            <span className="text-xs font-semibold tracking-widest uppercase">
              Loading logs...
            </span>
          </div>
        ) : filteredFeedbacks.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[50vh] p-8 text-neutral-500 border border-white/5 rounded-3xl border-dashed bg-white/[0.01]">
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6 shadow-inner">
              <Search className="text-3xl text-neutral-600" />
            </div>
            <h3 className="text-lg font-medium text-neutral-300 mb-2">
              No logs found
            </h3>
            <p className="text-sm text-neutral-500 text-center max-w-sm">
              No logs matching your search or category criteria were found.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 md:gap-6">
            {filteredFeedbacks.map((fb, index) => (
              <article
                key={fb.id}
                style={{ animationDelay: `${index * 30}ms` }}
                className="bg-[#18181b] border border-white/10 rounded-2xl p-5 md:p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_40px_-10px_rgba(0,0,0,0.6)] hover:border-white/20 flex flex-col relative group animate-[fadeIn_0.3s_ease-out_both]"
              >
                {/* Card Header */}
                <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
                  <div className="flex items-center gap-2.5">
                    <span className="text-[11px] text-emerald-400 px-2.5 py-1 bg-emerald-400/10 border border-emerald-400/20 rounded-md font-bold tracking-wider uppercase">
                      {fb.category}
                    </span>
                    {fb.project_name && (
                      <>
                        <span className="text-neutral-600 font-bold">/</span>
                        <span className="text-[14px] text-neutral-300 font-medium truncate max-w-[150px] sm:max-w-[200px]">
                          <HighlightText
                            text={fb.project_name}
                            highlight={debouncedQuery}
                          />
                        </span>
                      </>
                    )}
                  </div>
                  <span className="text-neutral-400 text-[12px] flex items-center gap-1.5 font-medium bg-white/5 px-2.5 py-1.5 rounded-lg border border-white/5">
                    <Clock size={12} className="text-neutral-500" />
                    {new Date(fb.created_at).toLocaleDateString()}
                  </span>
                </div>

                {/* Markdown Content Area */}
                <div
                  className="prose prose-sm md:prose-base max-w-none mb-8 flex-grow text-neutral-300
                  prose-p:leading-relaxed prose-headings:text-white
                  prose-code:bg-white/10 prose-code:text-emerald-400 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:border prose-code:border-white/10
                  prose-pre:bg-[#121212] prose-pre:border prose-pre:border-white/10 prose-pre:rounded-xl prose-pre:shadow-inner
                  prose-a:text-blue-400 prose-a:underline hover:prose-a:text-blue-300 transition-colors"
                >
                  <ReactMarkdown>{fb.feedback}</ReactMarkdown>
                </div>

                {/* Card Footer */}
                <footer className="pt-5 border-t border-white/5 flex items-center justify-between mt-auto">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shadow-inner">
                      <User size={15} />
                    </div>
                    <span className="text-[14px] font-medium text-neutral-200">
                      <HighlightText
                        text={fb.name}
                        highlight={debouncedQuery}
                      />
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {fb.github_id && (
                      <a
                        href={`https://github.com/${fb.github_id.replace("@", "")}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-neutral-500 hover:text-white hover:bg-white/10 p-2.5 rounded-xl transition-all duration-200 active:scale-95"
                        title="View GitHub Profile"
                      >
                        <LuGithub size={18} />
                      </a>
                    )}
                    <a
                      href={`mailto:${fb.email}`}
                      className="text-neutral-500 hover:text-white hover:bg-white/10 p-2.5 rounded-xl transition-all duration-200 active:scale-95"
                      title="Send Email"
                    >
                      <Mail size={18} />
                    </a>
                  </div>
                </footer>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
