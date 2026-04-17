"use client";

import React, { useState, useEffect, useMemo } from "react";
import ReactMarkdown from "react-markdown";
import { Search, User, Clock, Mail, CheckCircle2 } from "lucide-react";
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
          <mark
            key={i}
            className="bg-[#0055cc] text-white px-1 font-bold rounded-none border border-[#3388ff]"
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

  // Auth Theme Classes
  const inputClass =
    "w-full px-3 py-2 bg-[#000000] border-2 border-[#555555] text-[15px] text-white placeholder:text-[#777777] focus:outline-none focus:border-[#aaaaaa] rounded-none";

  const primaryButtonClass =
    "flex items-center justify-center gap-2 py-1.5 px-4 font-bold text-[13px] bg-[#0055cc] text-white border-2 border-t-[#3388ff] border-l-[#3388ff] border-r-[#002266] border-b-[#002266] active:border-t-[#002266] active:border-l-[#002266] active:border-b-[#3388ff] active:border-r-[#3388ff] hover:bg-[#0066ee] rounded-none  transition-none";

  const secondaryButtonClass =
    "flex items-center justify-center gap-2 py-1.5 px-4 font-bold text-[13px] bg-[#111111] text-[#aaaaaa] border-2 border-[#444444] hover:border-[#888888] hover:text-white active:border-[#222222] rounded-none  transition-none";

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
    <div className="w-full min-h-screen bg-[#111111] text-[#dddddd]  selection:bg-[#0055cc] selection:text-white flex flex-col items-center p-4 sm:p-6 lg:p-8">
      {/* --- Main Dashboard Container --- */}
      <div className="w-full max-w-7xl flex flex-col gap-6">
        {/* --- Top Control Panel --- */}
        <div className="bg-[#1e1e1e] border border-[#444444] shadow-[6px_6px_0px_#000000] p-6 w-full flex flex-col md:flex-row md:items-start justify-between gap-6">
          {/* Header Title & Branding */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="bg-[#000000] border border-[#444444] p-2">
                <BsCloudRain size={24} className="text-[#dd7700]" />
              </div>
              <h1 className="text-[20px] sm:text-[24px] font-bold text-white  tracking-tight">
                Kosha Logs & Issues
              </h1>
            </div>
            <p className="text-[13px] text-[#aaaaaa] font-bold  tracking-wide">
              SYSTEM FEEDBACK — STRICTLY KOSHA PROJECT
            </p>
          </div>

          {/* Controls / Search */}
          <div className="flex flex-col gap-4 w-full md:w-auto md:min-w-[320px]">
            <div className="relative flex items-center w-full">
              <Search size={18} className="absolute left-3 text-[#777777]" />
              <input
                type="text"
                placeholder="Search logs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`${inputClass} pl-10`}
              />
            </div>

            {/* Filter Bar */}
            <div className="flex flex-wrap gap-2">
              {filterOptions.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={
                    activeCategory === cat
                      ? primaryButtonClass
                      : secondaryButtonClass
                  }
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* --- Main Content Area --- */}
        <main className="w-full z-10">
          {isLoading ? (
            <div className="bg-[#1e1e1e] border border-[#444444] shadow-[6px_6px_0px_#000000] flex flex-col items-center justify-center min-h-[40vh] gap-4 p-8">
              <FaSpinner className="animate-spin text-[#0055cc]" size={32} />
              <span className="text-[13px] font-bold text-[#aaaaaa]  tracking-widest">
                Fetching Data...
              </span>
            </div>
          ) : filteredFeedbacks.length === 0 ? (
            <div className="bg-[#1e1e1e] border border-[#444444] border-dashed shadow-[6px_6px_0px_#000000] flex flex-col items-center justify-center min-h-[40vh] p-8 text-center">
              <div className="bg-[#000000] border border-[#444444] p-4 mb-4">
                <Search className="text-3xl text-[#dd7700]" />
              </div>
              <h3 className="text-[18px] font-bold text-white  tracking-tight mb-2">
                No Results Found
              </h3>
              <p className="text-[13px] text-[#aaaaaa] font-bold max-w-sm">
                NO LOGS MATCHING YOUR SEARCH OR CRITERIA IN THE KOSHA PROJECT.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredFeedbacks.map((fb, index) => (
                <article
                  key={fb.id}
                  style={{ animationDelay: `${index * 30}ms` }}
                  className="bg-[#1e1e1e] border border-[#444444] p-5 sm:p-6 shadow-[6px_6px_0px_#000000] hover:shadow-[6px_6px_0px_#0055cc] hover:-translate-y-1 hover:-translate-x-1 transition-all duration-200 flex flex-col relative animate-[fadeIn_0.3s_ease-out_both]"
                >
                  {/* Card Header */}
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-4 border-b border-[#333333]">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] sm:text-[11px] text-[#dd7700] px-2 py-1 bg-[#000000] border border-[#444444] font-bold tracking-wider ">
                        {fb.category}
                      </span>
                      <span className="text-[12px] text-[#aaaaaa] font-bold">
                        /
                      </span>
                      <span className="text-[13px] text-white font-bold  tracking-tight">
                        KOSHA
                      </span>
                      <span className="ml-2 flex items-center gap-1 text-[10px] font-bold text-green-500 uppercase tracking-widest border border-green-500/30 bg-[#000000] px-1.5 py-0.5">
                        <CheckCircle2 size={10} /> {fb.status}
                      </span>
                    </div>
                    <span className="text-[#aaaaaa] text-[11px] flex items-center gap-1.5 font-bold  bg-[#000000] border border-[#444444] px-2 py-1">
                      <Clock size={12} className="text-[#dd7700]" />
                      {new Date(fb.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Markdown Content Area */}
                  <div
                    className="prose prose-sm max-w-none mb-6 flex-grow text-[#dddddd]
                    prose-p:leading-relaxed prose-headings:text-white prose-headings:font-bold prose-headings:
                    prose-code:bg-[#000000] prose-code:text-[#0088ff] prose-code:px-1 prose-code:py-0.5 prose-code:rounded-none prose-code:border prose-code:border-[#444444]
                    prose-pre:bg-[#000000] prose-pre:border prose-pre:border-[#444444] prose-pre:rounded-none
                    prose-a:text-[#0088ff] prose-a:underline hover:prose-a:bg-[#0055cc] hover:prose-a:text-white transition-none"
                  >
                    <ReactMarkdown>{fb.feedback}</ReactMarkdown>
                  </div>

                  {/* Card Footer */}
                  <footer className="pt-4 border-t border-[#333333] flex flex-wrap items-center justify-between mt-auto gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-[#000000] border border-[#444444] flex items-center justify-center text-[#dd7700]">
                        <User size={14} />
                      </div>
                      <span className="text-[13px] font-bold text-white  tracking-wide">
                        <HighlightText
                          text={fb.name}
                          highlight={debouncedQuery}
                        />
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {fb.github_id && (
                        <a
                          href={`https://github.com/${fb.github_id.replace("@", "")}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[#aaaaaa] border border-[#444444] bg-[#111111] hover:text-white hover:border-[#888888] p-2 transition-none"
                          title="View GitHub Profile"
                        >
                          <LuGithub size={16} />
                        </a>
                      )}
                      <a
                        href={`mailto:${fb.email}`}
                        className="text-[#aaaaaa] border border-[#444444] bg-[#111111] hover:text-white hover:border-[#888888] p-2 transition-none"
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
    </div>
  );
}
