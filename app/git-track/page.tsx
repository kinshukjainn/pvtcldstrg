"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";

// ============================================================================
// Types
// ============================================================================

interface CommitAuthor {
  name: string;
  email: string;
  date: string;
}

interface CommitData {
  message: string;
  author: CommitAuthor;
}

interface GithubCommit {
  sha: string;
  html_url: string;
  commit: CommitData;
  author: {
    login: string;
    avatar_url: string;
  } | null;
}

// ============================================================================
// Configuration
// ============================================================================

const GITHUB_CONFIG = {
  username: "kinshukjainn",
  repository: "pvtcldstrg",
  branch: "master",
  perPage: 100,
  maxPages: 10,
};

const COMMIT_TYPES = [
  { id: "all", label: "All Types" },
  { id: "feat", label: "Features" },
  { id: "fix", label: "Bug Fixes" },
  { id: "chore", label: "Chores" },
  { id: "docs", label: "Documentation" },
  { id: "refactor", label: "Refactors" },
];

// ============================================================================
// Utility Functions
// ============================================================================

const timeAgo = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.round((now.getTime() - date.getTime()) / 1000);
  const minutes = Math.round(seconds / 60);
  const hours = Math.round(minutes / 60);
  const days = Math.round(hours / 24);

  if (seconds < 60) return "just now";
  if (minutes < 60) return `${minutes} mins ago`;
  if (hours < 24) return `${hours} hours ago`;
  if (days < 30) return `${days} days ago`;

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
};

const getCommitTitle = (message: string) => message.split("\n")[0];

// ============================================================================
// Main Component
// ============================================================================

export default function ChangelogTracker() {
  const [commits, setCommits] = useState<GithubCommit[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [fetchingProgress, setFetchingProgress] = useState<number>(0);

  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [authorFilter, setAuthorFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [dateRange] = useState({ start: "", end: "" });
  const [showFilters, setShowFilters] = useState(false);

  const fetchCommits = async () => {
    setLoading(true);
    setError(null);
    setFetchingProgress(0);

    try {
      let allCommits: GithubCommit[] = [];
      let page = 1;
      let shouldFetchMore = true;

      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

      while (shouldFetchMore && page <= GITHUB_CONFIG.maxPages) {
        setFetchingProgress(page);

        const response = await fetch(
          `https://api.github.com/repos/${GITHUB_CONFIG.username}/${GITHUB_CONFIG.repository}/commits?sha=${GITHUB_CONFIG.branch}&per_page=${GITHUB_CONFIG.perPage}&page=${page}`,
          {
            headers: {
              Accept: "application/vnd.github.v3+json",
            },
          },
        );

        if (!response.ok) {
          if (response.status === 403)
            throw new Error("GitHub API rate limit exceeded.");
          if (response.status === 404) throw new Error("Repository not found.");
          throw new Error(
            `Failed to fetch commits (Status: ${response.status})`,
          );
        }

        const data: GithubCommit[] = await response.json();

        if (data.length === 0) {
          break;
        }

        allCommits = [...allCommits, ...data];

        const oldestDateInBatch = new Date(
          data[data.length - 1].commit.author.date,
        );

        if (oldestDateInBatch < oneYearAgo) {
          shouldFetchMore = false;
        } else {
          page++;
        }
      }

      setCommits(allCommits);
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCommits();
  }, []);

  // --------------------------------------------------------------------------
  // Data Processing & Filtering
  // --------------------------------------------------------------------------

  const uniqueAuthors = useMemo(() => {
    return Array.from(new Set(commits.map((c) => c.commit.author.name)));
  }, [commits]);

  const displayCommits = useMemo(() => {
    return commits.filter((commit) => {
      const msg = commit.commit.message.toLowerCase();
      const authorName = commit.commit.author.name;
      const commitDate = new Date(commit.commit.author.date);
      const sha = commit.sha.toLowerCase();

      if (
        searchQuery &&
        !msg.includes(searchQuery.toLowerCase()) &&
        !sha.includes(searchQuery.toLowerCase())
      )
        return false;
      if (authorFilter !== "all" && authorName !== authorFilter) return false;
      if (
        typeFilter !== "all" &&
        !(msg.startsWith(`${typeFilter}:`) || msg.startsWith(`${typeFilter}(`))
      )
        return false;

      if (dateRange.start) {
        const startDate = new Date(dateRange.start);
        startDate.setHours(0, 0, 0, 0);
        if (commitDate < startDate) return false;
      }
      if (dateRange.end) {
        const endDate = new Date(dateRange.end);
        endDate.setHours(23, 59, 59, 999);
        if (commitDate > endDate) return false;
      }
      return true;
    });
  }, [commits, searchQuery, authorFilter, typeFilter, dateRange]);

  const lastChangeDate =
    commits.length > 0
      ? new Date(commits[0].commit.author.date).toUTCString()
      : "N/A";

  return (
    <div className="min-h-screen bg-black text-[#cccccc]  text-[14px] sm:text-[15px] p-2 sm:p-4 selection:bg-[#ffff00] selection:text-black">
      <div className="max-w-7xl mx-auto">
        {/* ── TOP HEADER (Breadcrumbs & Links) ── */}
        <div className="mb-1 border-b-2 border-[#444444] pb-2">
          <h1 className="text-[20px] sm:text-[24px] font-bold m-0 p-0 text-white">
            <a
              href="#"
              className="text-[#3399ff] hover:underline hover:bg-[#3399ff] hover:text-black no-underline"
            >
              Github
            </a>{" "}
            /{" "}
            <a
              href="#"
              className="text-[#3399ff] hover:underline hover:bg-[#3399ff] hover:text-black no-underline"
            >
              {GITHUB_CONFIG.repository}
            </a>{" "}
            / summary
          </h1>
        </div>

        <div className="text-[15px] sm:text-[14px] mb-3 mt-2 text-[#888888]">
          summary |{" "}
          <Link
            href="/git-track/tree"
            className="text-black font-bold px-1 py-0 bg-[#00cc00] border border-[#00ff00] hover:bg-[#00ff00] no-underline"
          >
            View repo tree {"->"}
          </Link>
        </div>

        {/* ── META INFO TABLE ── */}
        <div className="bg-[#111111] border border-[#333333] py-2 px-2 sm:px-4 mb-4">
          <div className="grid grid-cols-1 sm:grid-cols-[120px_1fr] gap-y-1 sm:gap-x-4 text-[13px] sm:text-[14px]">
            <div className="text-[#ffcc00] font-bold">Description</div>
            <div className="text-[#ffffff]">
              {GITHUB_CONFIG.repository} git repo
            </div>

            <div className="text-[#ffcc00] font-bold">Last change</div>
            <div className="text-[#ffffff]">{lastChangeDate}</div>

            <div className="text-[#ffcc00] font-bold">URL</div>
            <div>
              <a
                href={`https://github.com/${GITHUB_CONFIG.username}/${GITHUB_CONFIG.repository}`}
                className="text-[#3399ff] hover:underline break-all"
              >
                https://github.com/{GITHUB_CONFIG.username}/
                {GITHUB_CONFIG.repository}.git
              </a>
            </div>

            {/* Classic-style Filters Toggle */}
            <div className="text-[#ffcc00] font-bold">filters</div>
            <div className="mt-1 sm:mt-0">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="text-[#ff66bb] underline cursor-pointer bg-transparent border-none p-0"
              >
                [
                {showFilters
                  ? "hide search & filters"
                  : "show search & filters"}
                ]
              </button>
            </div>
          </div>
        </div>

        {/* ── FILTERS BLOCK ── */}
        {showFilters && (
          <div className="bg-[#0a0a0a] border-2 border-[#555555] p-3 mb-4 text-[13px]">
            <div className="flex flex-wrap gap-4 items-end">
              <label className="flex flex-col gap-1">
                <span className="text-[#dddddd] font-bold">Search:</span>
                <input
                  type="text"
                  placeholder="search commits..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-[#222222] text-[#ffffff] border border-[#777777] px-2 py-1 w-48 rounded-none outline-none focus:border-[#ffffff]"
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-[#dddddd] font-bold">Author:</span>
                <select
                  value={authorFilter}
                  onChange={(e) => setAuthorFilter(e.target.value)}
                  className="bg-[#222222] text-[#ffffff] border border-[#777777] px-2 py-1 rounded-none outline-none focus:border-[#ffffff]"
                >
                  <option value="all">all</option>
                  {uniqueAuthors.map((a) => (
                    <option key={a} value={a}>
                      {a}
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-[#dddddd] font-bold">Type:</span>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="bg-[#222222] text-[#ffffff] border border-[#777777] px-2 py-1 rounded-none outline-none focus:border-[#ffffff]"
                >
                  {COMMIT_TYPES.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </label>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setAuthorFilter("all");
                  setTypeFilter("all");
                }}
                className="bg-[#dddddd] text-black px-3 py-1 font-bold cursor-pointer border-2 border-t-[#ffffff] border-l-[#ffffff] border-r-[#555555] border-b-[#555555] active:border-t-[#555555] active:border-l-[#555555] active:border-b-[#ffffff] active:border-r-[#ffffff] rounded-none"
              >
                clear
              </button>
            </div>
          </div>
        )}

        {/* ── SECTION HEADER ── */}
        <div className="py-1.5 px-2 text-[20px] text-white font-bold mb-2 bg-[#222222] border-b border-[#555555]">
          Commits List
        </div>

        {/* ── ERROR & LOADING STATES ── */}
        {loading && (
          <div className="p-4 text-[#ffff00] font-bold bg-[#333300] border border-[#ffff00]">
            Fetching repository history (page {fetchingProgress})...
          </div>
        )}

        {error && (
          <div className="p-4 text-[#ffffff] font-bold bg-[#880000] border border-[#ff0000] mb-4">
            FATAL ERROR: {error}
            <button
              onClick={fetchCommits}
              className="ml-4 text-[#ffff00] underline bg-transparent border-none cursor-pointer"
            >
              [Retry]
            </button>
          </div>
        )}

        {!loading && !error && displayCommits.length === 0 && (
          <div className="p-4 text-[#888888] italic">
            No commits found matching the current criteria.
          </div>
        )}

        {/* ── LIST ── */}
        {!loading && !error && displayCommits.length > 0 && (
          <div className="w-full flex flex-col border border-[#333333]">
            {displayCommits.map((commit, index) => {
              const title = getCommitTitle(commit.commit.message);
              // Harsh dark mode alternating colors
              const rowClass =
                index % 2 === 0 ? "bg-[#000000]" : "bg-[#0d0d0d]";

              return (
                <div
                  key={commit.sha}
                  className={`${rowClass} flex flex-col md:flex-row md:items-center py-1.5 px-2 hover:bg-[#2a2a2a] border-b border-[#222222] gap-1 md:gap-4`}
                >
                  {/* Time & Author */}
                  <div className="flex flex-row md:flex-row gap-2 md:gap-4 shrink-0 text-[#999999] text-[13px] md:w-[220px]">
                    <span className="w-[85px] shrink-0">
                      {timeAgo(commit.commit.author.date)}
                    </span>
                    <span className="truncate w-[120px] text-[#ff5555] font-bold">
                      {"<"}
                      {commit.commit.author.name}
                      {">"}
                    </span>
                  </div>

                  {/* Message & Tag */}
                  <div className="flex-1 min-w-0 text-[#eeeeee] flex items-center flex-wrap gap-2 text-[14px]">
                    <span className="break-words">{title}</span>
                    {/* Harsh branch tag */}
                    {index === 0 && (
                      <span className="bg-[#00ff00] text-black text-[10px] font-bold px-1 py-0  border border-[#008800]">
                        master
                      </span>
                    )}
                  </div>

                  {/* Links */}
                  <div className="shrink-0 text-[12px] md:text-[13px] mt-1 md:mt-0 md:text-right">
                    <a
                      href={commit.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#3399ff] hover:bg-[#3399ff] hover:text-black no-underline px-1"
                    >
                      commit
                    </a>{" "}
                    |{" "}
                    <a
                      href={commit.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#3399ff] hover:bg-[#3399ff] hover:text-black no-underline px-1"
                    >
                      commitdiff
                    </a>{" "}
                    |{" "}
                    <a
                      href={commit.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#3399ff] hover:bg-[#3399ff] hover:text-black no-underline px-1"
                    >
                      tree
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination Indicator */}
        {!loading && !error && displayCommits.length > 0 && (
          <div className="mt-2 px-2 text-[#3399ff] text-[13px] font-bold cursor-pointer hover:underline">
            [ load more... ]
          </div>
        )}
      </div>
    </div>
  );
}
