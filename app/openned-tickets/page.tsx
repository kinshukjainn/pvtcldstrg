"use client";

import React, { useState, useEffect, useMemo } from "react";
import ReactMarkdown from "react-markdown";
import {
  Search,
  User,
  Clock,
  Mail,
  CheckCircle2,
  ChevronRight,
} from "lucide-react";
import Fuse from "fuse.js";
import { getFeedbacksAction } from "../actions"; // Adjust import path as needed
import { LuGithub } from "react-icons/lu";
import { FaSpinner } from "react-icons/fa";
import { BsCloudRain } from "react-icons/bs";

// --- Types ---
type Feedback = {
  id: string;
  created_at: string;
  category: "Blogs" | "Projects" | "Portfolio Website";
  project_name: "Kosha" | "MScada" | null;
  name: string;
  github_id: string | null;
  email: string;
  feedback: string;
  status: "pending" | "approved" | "rejected";
  reviewed_at: string | null;
};

// --- Helper Component ---
const HighlightText = ({
  text,
  highlight,
}: {
  text: string;
  highlight: string;
}) => {
  if (!highlight.trim() || !text) return <>{text}</>;
  const regex = new RegExp(`(${highlight})`, "gi");
  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, i) =>
        regex.test(part) ? (
          // Azure standard text highlight
          <mark
            key={i}
            className="bg-[#fff100] text-black px-0.5 rounded-xl font-semibold"
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

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("All");

  // Azure Theme Classes
  const inputClass =
    "w-full px-3 py-1.5 bg-white border border-gray-300 text-[13px] text-gray-900 placeholder-gray-500 focus:outline-none focus:border-[#0078D4] focus:ring-1 focus:ring-[#0078D4] rounded-xl transition-all";

  const primaryTabClass =
    "px-4 py-2 text-[15px] font-semibold text-[#0078D4] border-b-2 border-[#0078D4]  transition-colors";

  const secondaryTabClass =
    "px-4 py-2 text-[15px] font-normal text-gray-600 border-b-2 border-transparent hover:text-gray-900 hover:bg-gray-50 transition-colors";

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    setIsLoading(true);
    try {
      const result = await getFeedbacksAction();
      if (!result.success) throw new Error(result.error);

      // The server already strictly filters for 'approved' AND 'Kosha'.
      // We safely set the state directly.
      const allFeedbacks = (result.data as Feedback[]) || [];
      setFeedbacks(allFeedbacks);
    } catch (error) {
      console.error("Error fetching feedbacks:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Debounce the search query
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Memoize the dynamic UI filtered and searched results
  const filteredFeedbacks = useMemo(() => {
    let baseList = feedbacks;
    if (activeCategory !== "All") {
      baseList = feedbacks.filter((fb) => fb.category === activeCategory);
    }

    if (!debouncedQuery.trim()) {
      return baseList;
    }

    const fuse = new Fuse(baseList, {
      keys: [
        { name: "name", weight: 2 },
        { name: "feedback", weight: 1 },
      ],
      threshold: 0.3,
      ignoreLocation: true,
    });

    return fuse.search(debouncedQuery).map((result) => result.item);
  }, [feedbacks, activeCategory, debouncedQuery]);

  const filterOptions = ["All", "Projects", "Blogs", "Portfolio Website"];

  return (
    <div className="w-full min-h-screen bg-[#faf9f8] text-gray-900 ">
      {/* --- Page Header (Azure Style) --- */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-4 max-w-7xl mx-auto w-full">
          {/* Breadcrumbs */}
          <div className="text-[12px] font-medium text-[#0078D4] flex items-center gap-1.5 mb-3 w-fit">
            <span className="hover:underline cursor-pointer">Home</span>
            <ChevronRight size={14} className="text-gray-500" />
            <span className="hover:underline cursor-pointer">Projects</span>
            <ChevronRight size={14} className="text-gray-500" />
            <span className="text-gray-600">Kosha Logs</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-[#0078D4] rounded-xl flex items-center justify-center shrink-0">
              <BsCloudRain size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900 tracking-tight leading-tight">
                Kosha Logs & Issues
              </h1>
              <p className="text-[13px] text-gray-600 mt-0.5 uppercase tracking-wide">
                System Feedback — Strictly Kosha Project
              </p>
            </div>
          </div>
        </div>

        {/* --- Command Bar (Tabs & Search) --- */}
        <div className="bg-white px-6 py-2 border-t border-gray-200">
          <div className="max-w-7xl mx-auto w-full flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Filter Tabs */}
            <div className="flex overflow-x-auto hide-scrollbar gap-1">
              {filterOptions.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={
                    activeCategory === cat ? primaryTabClass : secondaryTabClass
                  }
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative flex items-center w-full md:w-72">
              <Search size={14} className="absolute left-2.5 text-gray-500" />
              <input
                type="text"
                placeholder="Search logs by keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`${inputClass} pl-8`}
              />
            </div>
          </div>
        </div>
      </div>

      {/* --- Main Content Area --- */}
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {isLoading ? (
          <div className="bg-white border border-gray-200 shadow-sm flex flex-col items-center justify-center min-h-[40vh] gap-3 p-8 rounded-xl">
            <FaSpinner className="animate-spin text-[#0078D4]" size={24} />
            <span className="text-[13px] font-semibold text-gray-600">
              Fetching telemetry data...
            </span>
          </div>
        ) : filteredFeedbacks.length === 0 ? (
          <div className="bg-white border border-gray-200 shadow-sm flex flex-col items-center justify-center min-h-[40vh] p-8 text-center rounded-xl">
            <Search className="text-4xl text-gray-300 mb-4" />
            <h3 className="text-[16px] font-semibold text-gray-900 mb-1">
              No Results Found
            </h3>
            <p className="text-[13px] text-gray-500 max-w-sm">
              No logs matching your search or criteria in the Kosha project.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredFeedbacks.map((fb) => (
              <article
                key={fb.id}
                className="bg-white border border-gray-200 p-5 rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col"
              >
                {/* Card Header */}
                <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-gray-700 bg-gray-100 px-2 py-0.5 rounded-xl font-semibold uppercase">
                      {fb.category}
                    </span>
                    <span className="text-gray-400 text-[12px]">/</span>
                    <span className="text-[12px] font-semibold text-[#0078D4] uppercase">
                      KOSHA
                    </span>
                    <span className="ml-2 flex items-center gap-1 text-[11px] font-semibold text-green-700 bg-green-50 px-1.5 py-0.5 rounded-xl border border-green-200 uppercase">
                      <CheckCircle2 size={12} /> {fb.status}
                    </span>
                  </div>
                  <span className="text-gray-500 text-[12px] flex items-center gap-1.5 font-medium">
                    <Clock size={12} className="text-gray-400" />
                    {new Date(fb.created_at).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>

                {/* Markdown Content Area */}
                <div
                  className="prose prose-sm max-w-none mb-6 flex-grow text-gray-800 text-[13px]
                  prose-p:leading-relaxed prose-headings:text-gray-900 prose-headings:font-semibold
                  prose-code:bg-gray-100 prose-code:text-[#a4262c] prose-code:px-1 prose-code:py-0.5 prose-code:rounded-xl
                  prose-pre:bg-gray-50 prose-pre:border prose-pre:border-gray-200 prose-pre:rounded-xl prose-pre:p-3
                  prose-a:text-[#0078D4] hover:prose-a:underline"
                >
                  <ReactMarkdown>{fb.feedback}</ReactMarkdown>
                </div>

                {/* Card Footer */}
                <footer className="pt-3 border-t border-gray-100 flex flex-wrap items-center justify-between mt-auto gap-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 shrink-0">
                      <User size={14} />
                    </div>
                    <span className="text-[13px] font-medium text-gray-900">
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
                        className="text-gray-500 hover:text-[#0078D4] hover:bg-gray-100 p-1.5 rounded-xl transition-colors"
                        title="View GitHub Profile"
                      >
                        <LuGithub size={16} />
                      </a>
                    )}
                    <a
                      href={`mailto:${fb.email}`}
                      className="text-gray-500 hover:text-[#0078D4] hover:bg-gray-100 p-1.5 rounded-xl transition-colors"
                      title="Send Email"
                    >
                      <Mail size={16} />
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
