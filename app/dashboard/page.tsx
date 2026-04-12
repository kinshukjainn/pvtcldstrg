"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  FaCloudUploadAlt,
  FaTrash,
  FaDownload,
  FaSpinner,
  FaFileImage,
  FaFileVideo,
  FaFilePdf,
  FaFileAlt,
  FaFilePowerpoint,
  FaFileExcel,
  FaSearch,
  FaThLarge,
  FaListUl,
  FaTimes,
  FaPlay,
  FaExclamationTriangle,
  FaEllipsisV,
} from "react-icons/fa";
import {
  getUploadUrl,
  confirmUploadDB,
  listPhotos,
  deletePhoto,
  getDownloadUrl,
  getStorageInfo,
} from "@/actions/drive";

type DriveFile = {
  key: string;
  url: string;
  size?: number;
};

type PhotoItem = {
  key?: string;
  url: string;
  size?: number;
};

const formatBytes = (bytes: number, decimals = 2) => {
  if (!+bytes) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};

/* ------------------------------------------------------------------ */
/*  Reusable Action Menu (kebab ⋮ dropdown)                           */
/* ------------------------------------------------------------------ */
function ActionMenu({
  fileKey,
  onDownload,
  onDelete,
}: {
  fileKey: string;
  onDownload: (e: React.MouseEvent, key: string) => void;
  onDelete: (e: React.MouseEvent, key: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open]);

  return (
    <div ref={menuRef} className="relative">
      <button
        onClick={(e) => {
          e.stopPropagation();
          setOpen((prev) => !prev);
        }}
        className="
          w-9 h-9 flex items-center justify-center rounded-lg
          bg-white/[0.05] hover:bg-white/[0.12] active:bg-white/[0.18]
          text-neutral-400 hover:text-white
          transition-all duration-200 cursor-pointer active:scale-90
        "
        title="Actions"
        aria-label="File actions"
      >
        <FaEllipsisV size={14} />
      </button>

      {open && (
        <div
          className="
            absolute right-0 top-full mt-1.5 z-[100]
            min-w-[160px] py-1.5
            bg-[#181818] border border-white/[0.1]
            rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.5)]
            animate-[menuIn_0.18s_cubic-bezier(0.23,1,0.32,1)]
            overflow-hidden
          "
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={(e) => {
              onDownload(e, fileKey);
              setOpen(false);
            }}
            className="
              w-full flex items-center gap-3 px-4 py-2.5
              text-[13px] font-medium text-neutral-300
              hover:bg-white/[0.06] hover:text-white
              transition-colors duration-150 cursor-pointer
            "
          >
            <FaDownload size={13} className="text-blue-400" />
            Download
          </button>
          <div className="mx-3 my-1 border-t border-white/[0.06]" />
          <button
            onClick={(e) => {
              onDelete(e, fileKey);
              setOpen(false);
            }}
            className="
              w-full flex items-center gap-3 px-4 py-2.5
              text-[13px] font-medium text-red-400
              hover:bg-red-500/[0.08] hover:text-red-300
              transition-colors duration-150 cursor-pointer
            "
          >
            <FaTrash size={12} />
            Delete
          </button>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */
export default function DriveManager() {
  const [files, setFiles] = useState<DriveFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [page, setPage] = useState(0);
  const [totalFiles, setTotalFiles] = useState(0);
  const [storageUsed, setStorageUsed] = useState(0);
  const [storageLimit, setStorageLimit] = useState(0);

  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [selectedFile, setSelectedFile] = useState<DriveFile | null>(null);
  const [fileToDelete, setFileToDelete] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchFiles(0, true);
    fetchStorageInfo();
  }, []);

  const fetchStorageInfo = async () => {
    try {
      const info = await getStorageInfo();
      setStorageUsed(info.used);
      setStorageLimit(info.limit);
    } catch (e) {
      console.error("Failed to fetch storage info", e);
    }
  };

  const fetchFiles = async (pageNum = 0, replace = false) => {
    if (replace) {
      setIsLoading(true);
    } else {
      setIsLoadingMore(true);
    }

    try {
      const data = await listPhotos(pageNum);
      const mapped = data.files.map((item: PhotoItem) => ({
        key: item.key || item.url,
        url: item.url,
        size: item.size,
      }));

      setFiles((prev) => (replace ? mapped : [...prev, ...mapped]));
      setHasMore(data.hasMore);
      setTotalFiles(data.total);
      setPage(pageNum);
    } catch (error) {
      console.error("Failed to fetch:", error);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  const handleLoadMore = () => fetchFiles(page + 1, false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles || selectedFiles.length === 0) return;

    setIsUploading(true);
    try {
      const uploadPromises = Array.from(selectedFiles).map(async (file) => {
        const { url, fields, key } = await getUploadUrl(
          file.name,
          file.type,
          file.size,
        );

        const formData = new FormData();
        Object.entries(fields).forEach(([k, v]) =>
          formData.append(k, v as string),
        );
        formData.append("file", file);

        const response = await fetch(url, {
          method: "POST",
          body: formData,
        });

        if (!response.ok && response.status !== 204) {
          throw new Error(`S3 upload failed: ${response.status}`);
        }

        await confirmUploadDB(key, file.name, file.size, file.type);
      });

      await Promise.all(uploadPromises);
      await fetchFiles(0, true);
      await fetchStorageInfo();
    } catch (error) {
      console.error("Upload failed", error);
      alert(
        (error instanceof Error ? error.message : String(error)) ||
          "Failed to upload one or more files. Storage limit may be reached.",
      );
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDeleteClick = useCallback((e: React.MouseEvent, key: string) => {
    e.stopPropagation();
    setFileToDelete(key);
  }, []);

  const confirmDelete = async () => {
    if (!fileToDelete) return;
    const fileObj = files.find((f) => f.key === fileToDelete);
    if (!fileObj) return;

    const key = fileToDelete;
    setFileToDelete(null);
    setFiles((prev) => prev.filter((p) => p.key !== key));
    if (selectedFile?.key === key) setSelectedFile(null);
    setTotalFiles((t) => t - 1);

    try {
      await deletePhoto(key, fileObj.size || 0);
      await fetchStorageInfo();
    } catch (error) {
      console.error("Delete failed", error);
      fetchFiles(0, true);
    }
  };

  const handleDownload = useCallback(
    async (e: React.MouseEvent, key: string) => {
      e.stopPropagation();
      try {
        const downloadUrl = await getDownloadUrl(key);
        const link = document.createElement("a");
        link.href = downloadUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (error) {
        console.error("Download failed", error);
      }
    },
    [],
  );

  const getFileName = (key: string) => key.split("/").pop() || key;

  const getFileExtension = (fileName: string) =>
    fileName.split(".").pop()?.toUpperCase() || "UNKNOWN";

  const getFileType = (fileName: string) => {
    const ext = fileName.split(".").pop()?.toLowerCase() || "";
    if (["mp4", "webm", "ogg", "mov"].includes(ext)) return "video";
    if (["pdf"].includes(ext)) return "pdf";
    if (["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(ext))
      return "image";
    if (["pptx", "ppt"].includes(ext)) return "presentation";
    if (["xlsx", "xls", "csv"].includes(ext)) return "spreadsheet";
    if (["md", "txt"].includes(ext)) return "text";
    return "other";
  };

  const getFileIcon = (type: string, className: string) => {
    switch (type) {
      case "video":
        return <FaFileVideo className={className} />;
      case "pdf":
        return <FaFilePdf className={className} />;
      case "image":
        return <FaFileImage className={className} />;
      case "presentation":
        return <FaFilePowerpoint className={className} />;
      case "spreadsheet":
        return <FaFileExcel className={className} />;
      default:
        return <FaFileAlt className={className} />;
    }
  };

  const filteredFiles = files.filter((file) =>
    getFileName(file.key).toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const storagePercent =
    storageLimit > 0 ? Math.min((storageUsed / storageLimit) * 100, 100) : 0;

  return (
    <div className="w-full min-h-screen bg-[#1e1e1e] text-neutral-200 flex flex-col relative overflow-hidden">
      {/* --- Top Control Panel --- */}
      <div className="bg-[#121212]/80 backdrop-blur-2xl rounded-3xl mr-2 mt-2 ml-2 border border-[#444444] p-3 md:px-8 md:py-5 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-5 z-10 sticky top-0">
        <div className="flex flex-wrap items-center gap-2.5 text-neutral-100">
          <span className="text-sm bg-white/[0.04] border border-white/[0.06] rounded-full px-3.5 py-1.5 flex gap-2 items-center tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></span>
            {totalFiles} files
          </span>
          <span className="text-sm bg-white/[0.04] border border-white/[0.06] rounded-full px-3.5 py-1.5 flex gap-2 items-center tracking-wide">
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                storagePercent > 90
                  ? "bg-red-400"
                  : storagePercent > 70
                    ? "bg-amber-400"
                    : "bg-emerald-400"
              }`}
            ></span>
            {formatBytes(storageUsed)} / {formatBytes(storageLimit)}
          </span>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
          {/* Search */}
          <div className="group flex items-center border border-white/[0.06] hover:border-white/[0.12] focus-within:border-white/[0.18] focus-within:bg-white/[0.04] rounded-xl bg-white/[0.02] px-3.5 py-2 flex-1 sm:flex-none transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] focus-within:shadow-[0_0_0_1px_rgba(255,255,255,0.06),0_4px_24px_rgba(0,0,0,0.3)]">
            <FaSearch
              className="text-neutral-600 group-focus-within:text-neutral-400 mr-3 transition-colors duration-500"
              size={13}
            />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-44 md:w-56 outline-none text-[13px] bg-transparent placeholder-neutral-600 text-neutral-200 transition-all duration-500"
            />
          </div>

          <div className="flex gap-2.5 w-full sm:w-auto">
            {/* View Toggle */}
            <div className="flex bg-white/[0.03] border border-white/[0.06] rounded-xl p-0.5">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2.5 px-3.5 rounded-[10px] flex-1 sm:flex-none flex justify-center items-center transition-all duration-300 ${
                  viewMode === "grid"
                    ? "bg-white/[0.1] text-white shadow-sm"
                    : "text-neutral-600 cursor-pointer hover:text-neutral-400"
                }`}
                title="Grid View"
              >
                <FaThLarge size={13} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2.5 px-3.5 rounded-[10px] flex-1 sm:flex-none flex justify-center items-center transition-all duration-300 ${
                  viewMode === "list"
                    ? "bg-white/[0.1] text-white shadow-sm"
                    : "text-neutral-600 cursor-pointer hover:text-neutral-400"
                }`}
                title="List View"
              >
                <FaListUl size={13} />
              </button>
            </div>

            <input
              type="file"
              accept="image/*,video/*,application/pdf,.pptx,.ppt,.xlsx,.xls,.csv,.txt,.md"
              className="hidden"
              ref={fileInputRef}
              onChange={handleUpload}
              disabled={isUploading}
              multiple
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="group flex-1 sm:flex-none flex items-center justify-center gap-2 bg-blue-400 text-black px-4 cursor-pointer py-1 rounded-lg font-semibold text-[17px] active:scale-[0.97] transition-all duration-200"
            >
              {isUploading ? (
                <FaSpinner className="animate-spin" size={14} />
              ) : (
                <FaCloudUploadAlt
                  size={15}
                  className="group-hover:-translate-y-px transition-transform duration-300"
                />
              )}
              {isUploading ? "Uploading..." : "Upload"}
            </button>
          </div>
        </div>
      </div>

      {/* --- Main Content Area --- */}
      <div className="flex-1 p-4 md:p-8 overflow-auto z-10">
        {isLoading ? (
          <div className="flex items-center justify-center gap-3 p-16 text-neutral-600 text-xs font-medium tracking-[0.2em] uppercase">
            <FaSpinner className="animate-spin" size={16} /> Loading...
          </div>
        ) : filteredFiles.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-24 text-neutral-600 border border-white/[0.04] rounded-2xl border-dashed">
            <FaFileAlt className="text-3xl mb-4 text-neutral-700" />
            <span className="text-xs font-medium tracking-[0.2em] uppercase">
              No files found
            </span>
          </div>
        ) : (
          <>
            {/* ===================== LIST VIEW ===================== */}
            {viewMode === "list" ? (
              <div className="overflow-x-auto border border-white/[0.06] bg-[#181818] backdrop-blur-xl rounded-2xl">
                <table className="w-full border-collapse text-left whitespace-nowrap">
                  <thead className="border-b border-white/[0.06] text-neutral-100 bg-[#020202] font-medium text-[14px] tracking-[0.12em]">
                    <tr>
                      <th className="p-4 w-14 text-center">Type</th>
                      <th className="p-4">Name of file</th>
                      <th className="p-4 w-20 text-center hidden sm:table-cell">
                        Extension
                      </th>
                      <th className="p-4 w-14 text-center">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredFiles.map((file, index) => {
                      const fileName = getFileName(file.key);
                      const fileType = getFileType(fileName);
                      const ext = getFileExtension(fileName);
                      return (
                        <tr
                          key={file.key}
                          className="border-b border-[#444444] last:border-b-0 hover:bg-[#121212] cursor-pointer transition-colors duration-200 group"
                          onClick={() => setSelectedFile(file)}
                          style={{ animationDelay: `${index * 30}ms` }}
                        >
                          <td className="p-4 text-neutral-500 flex justify-center items-center">
                            {getFileIcon(fileType, "text-lg")}
                          </td>
                          <td className="p-4 text-[13px] text-neutral-300 truncate max-w-[200px] md:max-w-md lg:max-w-xl font-medium group-hover:text-white transition-colors duration-200">
                            <span className="block truncate">{fileName}</span>
                            {/* Show extension badge inline on mobile */}
                            <span className="inline-block sm:hidden mt-1 text-[11px] text-green-500 px-1.5 py-0.5 bg-black rounded font-medium tracking-wider">
                              {ext}
                            </span>
                          </td>
                          <td className="p-4 text-center hidden sm:table-cell">
                            <span className="text-[13px] text-green-500 p-2 bg-black rounded-lg font-medium tracking-wider">
                              {ext}
                            </span>
                          </td>
                          <td
                            className="p-4"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <ActionMenu
                              fileKey={file.key}
                              onDownload={handleDownload}
                              onDelete={handleDeleteClick}
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              /* ===================== GRID VIEW ===================== */
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {filteredFiles.map((file, index) => {
                  const fileName = getFileName(file.key);
                  const fileType = getFileType(fileName);
                  const ext = getFileExtension(fileName);
                  return (
                    <div
                      key={file.key}
                      onClick={() => setSelectedFile(file)}
                      className="bg-[#121212] border border-[#444444] rounded-xl transition-all duration-500 cursor-pointer flex flex-col group overflow-hidden active:scale-[0.98]"
                      style={{ animationDelay: `${index * 40}ms` }}
                    >
                      {/* Thumbnail */}
                      <div className="h-32 sm:h-36 md:h-40 bg-black border-b border-[#444444] flex flex-col items-center justify-center relative overflow-hidden">
                        {fileType === "image" ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={file.url}
                            alt={fileName}
                            className="w-full h-full object-cover opacity-75 group-hover:opacity-100 transition-all duration-700 ease-out group-hover:scale-[1.03]"
                            loading="lazy"
                          />
                        ) : fileType === "video" ? (
                          <>
                            <video
                              src={file.url}
                              className="w-full h-full object-cover opacity-75 group-hover:opacity-100 transition-opacity duration-500"
                            />
                            <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/10 transition-colors duration-500">
                              <div className="p-4 bg-black backdrop-blur-xl rounded-full group-hover:scale-110 transition-transform duration-500">
                                <FaPlay
                                  className="text-white ml-0.5"
                                  size={16}
                                />
                              </div>
                            </div>
                          </>
                        ) : (
                          getFileIcon(
                            fileType,
                            "text-4xl text-blue-400 transition-all duration-500 group-hover:scale-105",
                          )
                        )}

                        {/* Kebab menu pinned top-right of thumbnail — always visible */}
                        <div
                          className="absolute top-2 right-2"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <ActionMenu
                            fileKey={file.key}
                            onDownload={handleDownload}
                            onDelete={handleDeleteClick}
                          />
                        </div>
                      </div>

                      {/* Info bar */}
                      <div className="p-3.5 flex items-center justify-between gap-2">
                        <span
                          className="text-[13px] truncate text-white font-medium group-hover:text-white transition-colors duration-300 flex-1 min-w-0"
                          title={fileName}
                        >
                          {fileName}
                        </span>
                        <span className="text-[11px] px-2 py-0.5 rounded-md bg-green-500 text-black font-semibold tracking-wider flex-shrink-0">
                          {ext}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {hasMore && (
              <div className="flex justify-center mt-10">
                <button
                  onClick={handleLoadMore}
                  disabled={isLoadingMore}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl border border-white/[0.08] bg-white/[0.03] text-neutral-400 hover:bg-white/[0.06] hover:text-white hover:border-white/[0.12] transition-all duration-300 font-medium text-[13px] disabled:opacity-40 cursor-pointer active:scale-[0.97]"
                >
                  {isLoadingMore ? (
                    <FaSpinner className="animate-spin" size={12} />
                  ) : null}
                  {isLoadingMore ? "Loading..." : "Load More"}
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* --- File Viewer Overlay --- */}
      {selectedFile && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-2xl flex flex-col animate-[fadeIn_0.3s_ease-out]"
          onClick={() => setSelectedFile(null)}
        >
          <div
            className="bg-white/[0.04] m-3 border border-white/[0.08] rounded-2xl p-3.5 flex justify-between items-center text-white backdrop-blur-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-[13px] font-medium truncate max-w-[55%] text-neutral-200">
              {getFileName(selectedFile.key)}
            </div>
            <div className="flex gap-2">
              <button
                onClick={(e) => handleDownload(e, selectedFile.key)}
                className="flex items-center gap-2 bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.06] rounded-xl cursor-pointer px-3.5 py-2 text-[12px] font-medium transition-all duration-200 active:scale-95"
                title="Download"
              >
                <FaDownload size={12} />
                <span className="hidden sm:inline">Download</span>
              </button>
              <button
                onClick={(e) => handleDeleteClick(e, selectedFile.key)}
                className="flex items-center gap-2 bg-white/[0.06] hover:bg-red-500/15 hover:text-red-400 border border-white/[0.06] rounded-xl cursor-pointer px-3.5 py-2 text-[12px] font-medium transition-all duration-200 active:scale-95"
                title="Delete"
              >
                <FaTrash size={12} />
                <span className="hidden sm:inline">Delete</span>
              </button>
              <button
                onClick={() => setSelectedFile(null)}
                className="flex items-center justify-center w-9 h-9 bg-white/[0.06] hover:bg-white/[0.12] rounded-xl cursor-pointer transition-all duration-200 active:scale-90"
                title="Close"
              >
                <FaTimes size={14} />
              </button>
            </div>
          </div>

          <div
            className="flex-1 overflow-hidden p-6 md:p-10 flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {getFileType(getFileName(selectedFile.key)) === "image" && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={selectedFile.url}
                alt="preview"
                className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl animate-[scaleIn_0.4s_cubic-bezier(0.23,1,0.32,1)]"
              />
            )}
            {getFileType(getFileName(selectedFile.key)) === "video" && (
              <video
                src={selectedFile.url}
                controls
                autoPlay
                className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl"
              />
            )}
            {getFileType(getFileName(selectedFile.key)) === "pdf" && (
              <iframe
                src={selectedFile.url}
                className="w-full h-full max-w-5xl rounded-2xl shadow-2xl bg-white"
              />
            )}
            {!["image", "video", "pdf"].includes(
              getFileType(getFileName(selectedFile.key)),
            ) && (
              <div className="bg-white/[0.03] backdrop-blur-xl p-10 md:p-14 rounded-3xl border border-white/[0.06] text-center flex flex-col items-center max-w-sm w-full shadow-2xl animate-[scaleIn_0.4s_cubic-bezier(0.23,1,0.32,1)]">
                <div className="w-20 h-20 rounded-2xl bg-white/[0.04] flex items-center justify-center mb-6">
                  <FaFileAlt className="text-4xl text-neutral-500" />
                </div>
                <h3 className="font-medium text-neutral-300 text-base mb-2">
                  No Preview
                </h3>
                <p className="text-[13px] text-neutral-600 mb-8 leading-relaxed">
                  This file type can&apos;t be previewed here.
                </p>
                <button
                  onClick={(e) => handleDownload(e, selectedFile.key)}
                  className="bg-white text-black hover:bg-neutral-200 rounded-xl px-6 py-3 font-medium cursor-pointer text-[13px] w-full transition-all duration-200 flex justify-center items-center gap-2.5 active:scale-[0.97]"
                >
                  <FaDownload size={13} />
                  Download
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- Delete Confirmation Modal --- */}
      {fileToDelete && (
        <div
          className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-xl flex items-center justify-center p-4 animate-[fadeIn_0.2s_ease-out]"
          onClick={() => setFileToDelete(null)}
        >
          <div
            className="bg-[#1c1c1e] border border-white/[0.08] rounded-2xl p-6 w-full max-w-xs flex flex-col gap-5 animate-[scaleIn_0.3s_cubic-bezier(0.23,1,0.32,1)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col items-center text-center gap-3">
              <div className="w-12 h-12 rounded-full bg-red-500/15 flex items-center justify-center text-red-400">
                <FaExclamationTriangle size={20} />
              </div>
              <div>
                <h3 className="text-base font-medium text-white mb-1.5">
                  Delete File?
                </h3>
                <p className="text-neutral-500 text-[13px] leading-relaxed">
                  <span className="text-neutral-300 font-medium break-all">
                    &quot;{getFileName(fileToDelete)}&quot;
                  </span>{" "}
                  will be permanently removed.
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-2 w-full">
              <button
                onClick={confirmDelete}
                className="w-full px-5 py-2.5 rounded-xl bg-red-500/15 hover:bg-red-500/25 text-red-400 cursor-pointer font-medium text-[13px] transition-all duration-200 flex items-center justify-center gap-2 active:scale-[0.97]"
              >
                <FaTrash size={12} />
                Delete
              </button>
              <button
                onClick={() => setFileToDelete(null)}
                className="w-full px-5 py-2.5 rounded-xl text-neutral-400 font-medium text-[13px] bg-white/[0.04] hover:bg-white/[0.08] cursor-pointer transition-all duration-200 active:scale-[0.97]"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
