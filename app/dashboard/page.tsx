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
import { Container, Folder } from "lucide-react";

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
/* Reusable Action Menu (kebab ⋮ dropdown)                           */
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
          bg-black/50 hover:bg-black/80 backdrop-blur-md
          border border-white/10 hover:border-white/30
          text-neutral-200 hover:text-white shadow-sm
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
            absolute right-0 top-full mt-2 z-[100]
            min-w-[160px] py-1.5
            bg-[#18181b]/95 backdrop-blur-xl border border-white/10
            rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.8)]
            animate-[fadeIn_0.15s_ease-out]
          "
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={(e) => {
              onDownload(e, fileKey);
              setOpen(false);
            }}
            className="
              w-full flex items-center gap-3 px-4 py-3 md:py-2.5
              text-[14px] md:text-[13px] font-medium text-neutral-300
              hover:bg-white/[0.06] hover:text-white
              transition-colors duration-150 cursor-pointer
            "
          >
            <FaDownload size={14} className="text-blue-400" />
            Download
          </button>
          <div className="mx-3 my-1 border-t border-white/[0.06]" />
          <button
            onClick={(e) => {
              onDelete(e, fileKey);
              setOpen(false);
            }}
            className="
              w-full flex items-center gap-3 px-4 py-3 md:py-2.5
              text-[14px] md:text-[13px] font-medium text-red-400
              hover:bg-red-500/[0.08] hover:text-red-300
              transition-colors duration-150 cursor-pointer
            "
          >
            <FaTrash size={13} />
            Delete
          </button>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Main Component                                                    */
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
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
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
    if (replace) setIsLoading(true);
    else setIsLoadingMore(true);

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
    <div className="w-full min-h-screen bg-[#1e1e1e] text-neutral-200 flex flex-col relative font-sans">
      {/* --- Top Control Panel --- */}
      <div className=" top-0 z-40">
        <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-4 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          {/* Storage & Stats */}
          <div className="flex flex-wrap items-center gap-3 text-neutral-100">
            <span className="text-sm md:text-md flex gap-2.5 items-center font-medium shadow-sm">
              <span>
                <Folder />
              </span>
              {totalFiles} files
            </span>
            <span className="text-neutral-400 text-lg">{"|"}</span>
            <span className="text-sm md:text-md  flex gap-2.5 items-center font-medium shadow-sm">
              <span className="text-sm md:text-md  flex gap-2.5 items-center font-medium shadow-sm">
                <span>
                  <Container />
                </span>
                {formatBytes(storageUsed)} / {formatBytes(storageLimit)}
              </span>
            </span>
          </div>

          {/* Controls */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
            {/* Search */}
            <div className="group flex items-center bg-[#18181b] border border-white/10 rounded-xl px-4 py-2 flex-1 sm:flex-none transition-all duration-300 focus-within:border-blue-500/50 focus-within:shadow-[0_0_15px_rgba(59,130,246,0.15)]">
              <FaSearch
                className="text-neutral-500 group-focus-within:text-blue-400 mr-3 transition-colors"
                size={14}
              />
              <input
                type="text"
                placeholder="Search your files..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full sm:w-56 outline-none text-[13px] bg-transparent placeholder-neutral-500 text-neutral-100"
              />
            </div>

            <div className="flex gap-2.5 w-full sm:w-auto">
              {/* View Toggle */}
              <div className="flex bg-[#18181b] border border-white/10 rounded-xl p-1 shadow-sm">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 px-3.5 rounded-lg flex-1 sm:flex-none flex justify-center items-center transition-all duration-200 ${
                    viewMode === "grid"
                      ? "bg-white/10 text-white shadow-sm"
                      : "text-neutral-500 hover:text-neutral-300 hover:bg-white/5"
                  }`}
                  title="Grid View"
                >
                  <FaThLarge size={14} />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 px-3.5 rounded-lg flex-1 sm:flex-none flex justify-center items-center transition-all duration-200 ${
                    viewMode === "list"
                      ? "bg-white/10 text-white shadow-sm"
                      : "text-neutral-500 hover:text-neutral-300 hover:bg-white/5"
                  }`}
                  title="List View"
                >
                  <FaListUl size={14} />
                </button>
              </div>

              {/* Upload Button */}
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
                className="group flex-1 sm:flex-none flex items-center justify-center gap-2.5 bg-blue-500 hover:bg-blue-400 text-white px-5 py-2 rounded-xl font-medium text-[14px] shadow-[0_4px_14px_rgba(59,130,246,0.3)] hover:shadow-[0_6px_20px_rgba(59,130,246,0.4)] transition-all duration-200 active:scale-[0.96]"
              >
                {isUploading ? (
                  <FaSpinner className="animate-spin" size={14} />
                ) : (
                  <FaCloudUploadAlt
                    size={16}
                    className="group-hover:-translate-y-px transition-transform duration-300"
                  />
                )}
                {isUploading ? "Uploading..." : "Upload Files"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* --- Main Content Area --- */}
      <div className="flex-1 w-full max-w-[1600px] mx-auto p-4 md:p-8 z-10">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4 text-neutral-500">
            <FaSpinner className="animate-spin text-blue-500" size={28} />
            <span className="text-xs font-semibold tracking-widest uppercase">
              Loading workspace...
            </span>
          </div>
        ) : filteredFiles.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[50vh] p-8 text-neutral-500 border border-white/5 rounded-3xl border-dashed bg-white/[0.01]">
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6 shadow-inner">
              <FaFileAlt className="text-3xl text-neutral-600" />
            </div>
            <h3 className="text-lg font-medium text-neutral-300 mb-2">
              No files found
            </h3>
            <p className="text-sm text-neutral-500 text-center max-w-sm">
              Upload documents, images, or videos to get started. They will
              securely appear here.
            </p>
          </div>
        ) : (
          <>
            {/* ===================== LIST VIEW ===================== */}
            {viewMode === "list" ? (
              <div className="overflow-x-auto border border-white/10 bg-[#18181b] rounded-2xl shadow-xl">
                <table className="w-full border-collapse text-left whitespace-nowrap">
                  <thead className="border-b border-white/10 text-neutral-400 bg-[#1f1f22] font-semibold text-[12px] tracking-wider uppercase">
                    <tr>
                      <th className="p-5 w-16 text-center">Type</th>
                      <th className="p-5">File Name</th>
                      <th className="p-5 w-28 text-center hidden sm:table-cell">
                        Format
                      </th>
                      <th className="p-5 w-20 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredFiles.map((file, index) => {
                      const fileName = getFileName(file.key);
                      const fileType = getFileType(fileName);
                      const ext = getFileExtension(fileName);
                      return (
                        <tr
                          key={file.key}
                          className="hover:bg-white/[0.03] cursor-pointer transition-colors duration-200 group"
                          onClick={() => setSelectedFile(file)}
                          style={{ animationDelay: `${index * 20}ms` }}
                        >
                          <td className="p-4 text-neutral-500 flex justify-center items-center">
                            {getFileIcon(
                              fileType,
                              "text-xl group-hover:text-blue-400 transition-colors",
                            )}
                          </td>
                          <td className="p-4 text-[14px] text-neutral-300 truncate max-w-[200px] md:max-w-md lg:max-w-xl font-medium group-hover:text-white transition-colors">
                            <span className="block truncate">{fileName}</span>
                            <span className="inline-block sm:hidden mt-1.5 text-[10px] text-emerald-400 px-2 py-0.5 bg-emerald-400/10 border border-emerald-400/20 rounded-md font-bold tracking-wider">
                              {ext}
                            </span>
                          </td>
                          <td className="p-4 text-center hidden sm:table-cell">
                            <span className="text-[11px] text-emerald-400 px-2.5 py-1 bg-emerald-400/10 border border-emerald-400/20 rounded-md font-bold tracking-wider">
                              {ext}
                            </span>
                          </td>
                          <td
                            className="p-4 flex justify-center items-center"
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
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
                {filteredFiles.map((file, index) => {
                  const fileName = getFileName(file.key);
                  const fileType = getFileType(fileName);
                  const ext = getFileExtension(fileName);
                  return (
                    <div
                      key={file.key}
                      onClick={() => setSelectedFile(file)}
                      className="relative bg-[#18181b] border border-white/10 rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_40px_-10px_rgba(0,0,0,0.6)] hover:border-white/20 cursor-pointer flex flex-col group"
                      style={{ animationDelay: `${index * 30}ms` }}
                    >
                      {/* FIX: Always visible on mobile (opacity-100), hover effect only on md and up */}
                      <div
                        className="absolute top-2.5 right-2.5 z-30 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ActionMenu
                          fileKey={file.key}
                          onDownload={handleDownload}
                          onDelete={handleDeleteClick}
                        />
                      </div>

                      <div className="h-32 sm:h-36 md:h-44 bg-black/40 border-b border-white/5 flex flex-col items-center justify-center relative overflow-hidden rounded-t-2xl">
                        {fileType === "image" ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={file.url}
                            alt={fileName}
                            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-500 ease-out group-hover:scale-105"
                            loading="lazy"
                          />
                        ) : fileType === "video" ? (
                          <>
                            <video
                              src={file.url}
                              className="w-full h-full object-cover opacity-60 group-hover:opacity-90 transition-opacity duration-500"
                            />
                            <div className="absolute inset-0 bg-black/20 flex items-center justify-center transition-colors duration-500">
                              <div className="p-3 bg-black/60 backdrop-blur-md rounded-full group-hover:scale-110 group-hover:bg-blue-500 transition-all duration-300 shadow-lg">
                                <FaPlay
                                  className="text-white ml-0.5"
                                  size={14}
                                />
                              </div>
                            </div>
                          </>
                        ) : (
                          <div className="transform transition-transform duration-500 group-hover:scale-110 drop-shadow-lg">
                            {getFileIcon(
                              fileType,
                              "text-4xl md:text-5xl text-neutral-500 group-hover:text-blue-400 transition-colors",
                            )}
                          </div>
                        )}
                      </div>

                      <div className="p-4 flex items-center justify-between gap-3 bg-gradient-to-b from-transparent to-black/20 rounded-b-2xl">
                        <span
                          className="text-[13px] md:text-[14px] truncate text-neutral-300 font-medium group-hover:text-white transition-colors duration-300 flex-1 min-w-0"
                          title={fileName}
                        >
                          {fileName}
                        </span>
                        <span className="text-[10px] md:text-[11px] px-2 py-1 rounded border border-emerald-400/20 bg-emerald-400/10 text-emerald-400 font-bold tracking-wider flex-shrink-0 shadow-sm">
                          {ext}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {hasMore && (
              <div className="flex justify-center mt-12 mb-6">
                <button
                  onClick={handleLoadMore}
                  disabled={isLoadingMore}
                  className="flex items-center gap-3 px-8 py-3 rounded-full border border-white/10 bg-[#18181b] text-neutral-300 hover:bg-white/10 hover:text-white hover:border-white/20 transition-all duration-300 font-medium text-[14px] shadow-lg disabled:opacity-50 cursor-pointer active:scale-95"
                >
                  {isLoadingMore && (
                    <FaSpinner
                      className="animate-spin text-blue-400"
                      size={14}
                    />
                  )}
                  {isLoadingMore ? "Loading more files..." : "Load More"}
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* --- File Viewer Overlay --- */}
      {selectedFile && (
        <div
          className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-xl flex flex-col animate-[fadeIn_0.2s_ease-out]"
          onClick={() => setSelectedFile(null)}
        >
          {/* Viewer Header */}
          <div
            className="bg-[#121212]/90 m-4 border border-white/10 rounded-2xl p-4 flex justify-between items-center text-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-[14px] font-semibold truncate max-w-[50%] md:max-w-[70%] text-neutral-100 flex items-center gap-3">
              {getFileIcon(
                getFileType(getFileName(selectedFile.key)),
                "text-blue-400",
              )}
              {getFileName(selectedFile.key)}
            </div>
            <div className="flex gap-2">
              <button
                onClick={(e) => handleDownload(e, selectedFile.key)}
                className="flex items-center gap-2.5 bg-white/5 hover:bg-white/15 border border-white/10 rounded-xl cursor-pointer px-4 py-2 text-[13px] font-medium transition-all duration-200 active:scale-95"
              >
                <FaDownload size={13} className="text-blue-400" />
                <span className="hidden sm:inline">Download</span>
              </button>
              <button
                onClick={(e) => handleDeleteClick(e, selectedFile.key)}
                className="flex items-center gap-2.5 bg-white/5 hover:bg-red-500/20 hover:text-red-400 border border-white/10 hover:border-red-500/30 rounded-xl cursor-pointer px-4 py-2 text-[13px] font-medium transition-all duration-200 active:scale-95"
              >
                <FaTrash size={12} />
                <span className="hidden sm:inline">Delete</span>
              </button>
              <div className="w-px h-6 bg-white/10 mx-1 self-center hidden sm:block" />
              <button
                onClick={() => setSelectedFile(null)}
                className="flex items-center justify-center w-10 h-10 bg-white/5 hover:bg-white/20 rounded-xl cursor-pointer transition-all duration-200 active:scale-90"
                title="Close"
              >
                <FaTimes size={16} />
              </button>
            </div>
          </div>

          {/* Viewer Content */}
          <div
            className="flex-1 overflow-hidden p-4 md:p-10 flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {getFileType(getFileName(selectedFile.key)) === "image" && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={selectedFile.url}
                alt="preview"
                className="max-w-full max-h-full object-contain rounded-xl shadow-[0_20px_60px_rgba(0,0,0,0.8)] animate-[scaleIn_0.3s_ease-out]"
              />
            )}
            {getFileType(getFileName(selectedFile.key)) === "video" && (
              <video
                src={selectedFile.url}
                controls
                autoPlay
                className="max-w-full max-h-full object-contain rounded-xl shadow-[0_20px_60px_rgba(0,0,0,0.8)]"
              />
            )}
            {getFileType(getFileName(selectedFile.key)) === "pdf" && (
              <iframe
                src={selectedFile.url}
                className="w-full h-full max-w-6xl rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.8)] bg-white/5"
              />
            )}
            {!["image", "video", "pdf"].includes(
              getFileType(getFileName(selectedFile.key)),
            ) && (
              <div className="bg-[#18181b] p-12 md:p-16 rounded-3xl border border-white/10 text-center flex flex-col items-center max-w-md w-full shadow-2xl animate-[scaleIn_0.3s_ease-out]">
                <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mb-6 shadow-inner">
                  {getFileIcon(
                    getFileType(getFileName(selectedFile.key)),
                    "text-5xl text-neutral-400",
                  )}
                </div>
                <h3 className="font-semibold text-white text-lg mb-2">
                  No Rich Preview
                </h3>
                <p className="text-[14px] text-neutral-400 mb-8 leading-relaxed">
                  This file format requires a dedicated application to view.
                  Download it to your device to open it.
                </p>
                <button
                  onClick={(e) => handleDownload(e, selectedFile.key)}
                  className="bg-blue-500 hover:bg-blue-400 text-white rounded-xl px-8 py-3.5 font-medium cursor-pointer text-[14px] w-full transition-all duration-200 flex justify-center items-center gap-3 active:scale-[0.98] shadow-lg"
                >
                  <FaDownload size={15} />
                  Download File
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- Delete Confirmation Modal --- */}
      {fileToDelete && (
        <div
          className="fixed inset-0 z-[110] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-[fadeIn_0.15s_ease-out]"
          onClick={() => setFileToDelete(null)}
        >
          <div
            className="bg-[#18181b] border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.8)] rounded-3xl p-8 w-full max-w-sm flex flex-col gap-6 animate-[scaleIn_0.25s_ease-out]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col items-center text-center gap-4">
              <div className="w-14 h-14 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 shadow-inner">
                <FaExclamationTriangle size={24} />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  Delete File
                </h3>
                <p className="text-neutral-400 text-[14px] leading-relaxed">
                  Are you sure you want to delete{" "}
                  <span className="text-white font-medium break-all bg-white/5 px-1.5 py-0.5 rounded">
                    {getFileName(fileToDelete)}
                  </span>
                  ? This action cannot be undone.
                </p>
              </div>
            </div>
            <div className="flex gap-3 w-full mt-2">
              <button
                onClick={() => setFileToDelete(null)}
                className="flex-1 py-3 rounded-xl text-neutral-300 font-medium text-[14px] bg-white/5 hover:bg-white/10 border border-white/5 cursor-pointer transition-all duration-200 active:scale-[0.97]"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white shadow-[0_4px_14px_rgba(239,68,68,0.3)] cursor-pointer font-medium text-[14px] transition-all duration-200 flex items-center justify-center gap-2 active:scale-[0.97]"
              >
                <FaTrash size={13} />
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
