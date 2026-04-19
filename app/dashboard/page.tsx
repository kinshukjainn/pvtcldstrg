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
  FaEllipsisV,
  FaExclamationCircle,
  FaCheckCircle,
  FaInfoCircle,
} from "react-icons/fa";
import {
  getUploadUrl,
  confirmUploadDB,
  listPhotos,
  deletePhoto,
  getDownloadUrl,
  getStorageInfo,
} from "@/actions/drive";
import { Database, HardDrive, ChevronRight } from "lucide-react";

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

type ToastItem = {
  id: string;
  message: string;
  type: "error" | "success" | "info";
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
/* Azure Standard Button Classes                                      */
/* ------------------------------------------------------------------ */
const primaryButtonClass =
  "inline-flex items-center justify-center gap-2 py-1.5 px-4 font-semibold text-[13px] bg-[#0078D4] text-white hover:bg-[#005a9e] rounded-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed";

const secondaryButtonClass =
  "inline-flex items-center justify-center gap-2 py-1.5 px-4 font-semibold text-[13px] bg-white border border-gray-300 text-gray-800 hover:bg-gray-50 rounded-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed";

const dangerButtonClass =
  "inline-flex items-center justify-center gap-2 py-1.5 px-4 font-semibold text-[13px] bg-[#d13438] text-white hover:bg-[#a4262c] rounded-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed";

const iconButtonClass =
  "p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-sm transition-colors cursor-pointer outline-none";

/* ------------------------------------------------------------------ */
/* Toast Notification Component                                       */
/* ------------------------------------------------------------------ */
function ToastContainer({
  toasts,
  onDismiss,
}: {
  toasts: ToastItem[];
  onDismiss: (id: string) => void;
}) {
  if (toasts.length === 0) return null;

  const config = {
    error: {
      border: "border-l-[#d13438]",
      bg: "bg-[#fdf3f4]",
      icon: (
        <FaExclamationCircle
          size={16}
          className="text-[#d13438] shrink-0 mt-0.5"
        />
      ),
      title: "Error",
      titleColor: "text-[#d13438]",
    },
    success: {
      border: "border-l-[#107c10]",
      bg: "bg-[#f1faf1]",
      icon: (
        <FaCheckCircle size={16} className="text-[#107c10] shrink-0 mt-0.5" />
      ),
      title: "Success",
      titleColor: "text-[#107c10]",
    },
    info: {
      border: "border-l-[#0078D4]",
      bg: "bg-[#f0f6ff]",
      icon: (
        <FaInfoCircle size={16} className="text-[#0078D4] shrink-0 mt-0.5" />
      ),
      title: "Info",
      titleColor: "text-[#0078D4]",
    },
  };

  return (
    <div className="fixed top-4 right-4 z-[200] flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const c = config[toast.type];
        return (
          <div
            key={toast.id}
            className={`pointer-events-auto ${c.bg} border border-gray-200 border-l-4 ${c.border} shadow-lg rounded-sm animate-[slideIn_0.25s_ease-out]`}
          >
            <div className="flex items-start gap-3 px-4 py-3">
              {c.icon}
              <div className="flex-1 min-w-0">
                <p
                  className={`text-[12px] font-semibold ${c.titleColor} uppercase tracking-wide mb-0.5`}
                >
                  {c.title}
                </p>
                <p className="text-[13px] text-gray-700 leading-snug">
                  {toast.message}
                </p>
              </div>
              <button
                onClick={() => onDismiss(toast.id)}
                className="p-0.5 text-gray-400 hover:text-gray-700 transition-colors shrink-0"
                aria-label="Dismiss notification"
              >
                <FaTimes size={12} />
              </button>
            </div>
          </div>
        );
      })}

      {/* Inline keyframes for the slide-in animation */}
      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(24px); }
          to   { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Reusable Action Menu (kebab ⋮ dropdown)                            */
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

  return (
    <div ref={menuRef} className="relative">
      <button
        onClick={(e) => {
          e.stopPropagation();
          setOpen((prev) => !prev);
        }}
        className={iconButtonClass}
        title="More actions"
        aria-label="File actions"
      >
        <FaEllipsisV size={14} />
      </button>

      {open && (
        <div
          className="absolute right-0 top-full mt-1 z-[100] min-w-[160px] bg-white border border-gray-200 shadow-md py-1 flex flex-col rounded-sm"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={(e) => {
              onDownload(e, fileKey);
              setOpen(false);
            }}
            className="w-full flex items-center gap-3 px-4 py-2 text-[13px] text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <FaDownload size={14} className="text-gray-500" />
            Download
          </button>
          <div className="w-full h-px bg-gray-100 my-1" />
          <button
            onClick={(e) => {
              onDelete(e, fileKey);
              setOpen(false);
            }}
            className="w-full flex items-center gap-3 px-4 py-2 text-[13px] text-[#d13438] hover:bg-[#fdf3f4] transition-colors"
          >
            <FaTrash size={14} />
            Delete
          </button>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Main Component                                                     */
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
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  /* ── Toast helpers ── */
  const showToast = useCallback(
    (message: string, type: ToastItem["type"] = "error") => {
      const id = crypto.randomUUID();
      setToasts((prev) => [...prev, { id, message, type }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 5000);
    },
    [],
  );

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const fetchStorageInfo = useCallback(async () => {
    try {
      const info = await getStorageInfo();
      setStorageUsed(info.used);
      setStorageLimit(info.limit);
    } catch (e) {
      console.error("Failed to fetch storage info", e);
    }
  }, []);

  const fetchFiles = useCallback(
    async (pageNum = 0, replace = false) => {
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
        showToast("Failed to load files. Please try again.", "error");
      } finally {
        setIsLoading(false);
        setIsLoadingMore(false);
      }
    },
    [showToast],
  );

  useEffect(() => {
    fetchFiles(0, true);
    fetchStorageInfo();
  }, [fetchFiles, fetchStorageInfo]);

  const handleLoadMore = () => fetchFiles(page + 1, false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles || selectedFiles.length === 0) return;

    setIsUploading(true);

    let successCount = 0;
    const failedItems: { name: string; reason: string }[] = [];

    const uploadPromises = Array.from(selectedFiles).map(async (file) => {
      try {
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
          throw new Error(`Upload failed with status ${response.status}`);
        }

        await confirmUploadDB(key, file.name, file.size, file.type);
        successCount++;
      } catch (error) {
        const reason = error instanceof Error ? error.message : "Unknown error";
        failedItems.push({ name: file.name, reason });
      }
    });

    await Promise.all(uploadPromises);

    // Show results via toast
    if (successCount > 0) {
      showToast(
        successCount === 1
          ? "File uploaded successfully."
          : `${successCount} files uploaded successfully.`,
        "success",
      );
    }

    if (failedItems.length > 0) {
      // Show one toast per unique error reason to avoid flooding
      const reasonGroups = new Map<string, string[]>();
      for (const item of failedItems) {
        const existing = reasonGroups.get(item.reason) || [];
        existing.push(item.name);
        reasonGroups.set(item.reason, existing);
      }
      for (const [reason, names] of reasonGroups) {
        const fileLabel =
          names.length === 1 ? names[0] : `${names.length} files`;
        showToast(`${fileLabel} — ${reason}`, "error");
      }
    }

    await fetchFiles(0, true);
    await fetchStorageInfo();

    setIsUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
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
    const fileName = key.split("/").pop() || key;
    setFileToDelete(null);
    setFiles((prev) => prev.filter((p) => p.key !== key));
    if (selectedFile?.key === key) setSelectedFile(null);
    setTotalFiles((t) => t - 1);

    try {
      await deletePhoto(key);
      await fetchStorageInfo();
      showToast(`${fileName} deleted successfully.`, "success");
    } catch (error) {
      console.error("Delete failed", error);
      showToast(
        error instanceof Error
          ? error.message
          : "Failed to delete file. Please try again.",
        "error",
      );
      fetchFiles(0, true);
      fetchStorageInfo();
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
    fileName.split(".").pop()?.toLowerCase() || "UNKNOWN";

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

  return (
    <div className="w-full min-h-screen bg-[#faf9f8] text-gray-900 font-sans flex flex-col">
      {/* ── Toast Notifications ── */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      {/* --- Page Header & Breadcrumbs --- */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="text-[13px] font-medium text-[#0078D4] flex items-center gap-1.5 mb-4 w-fit cursor-pointer hover:underline">
            Home <ChevronRight size={14} className="text-gray-500" /> Storage
            Explorer
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#0078D4] rounded-sm flex items-center justify-center shrink-0">
              <HardDrive size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900 tracking-tight leading-tight">
                Storage Explorer
              </h1>
              <p className="text-[13px] text-gray-600 mt-0.5">
                Manage and review your secure files
              </p>
            </div>
          </div>
        </div>

        {/* --- Command Bar --- */}
        <div className="bg-[#f3f2f1] px-4 sm:px-6 py-2 flex flex-wrap items-center justify-between border-t border-gray-200 gap-3">
          <div className="flex flex-wrap items-center gap-2">
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
              className={primaryButtonClass}
            >
              {isUploading ? (
                <FaSpinner className="animate-spin" size={14} />
              ) : (
                <FaCloudUploadAlt size={16} />
              )}
              {isUploading ? "Uploading..." : "Upload Files"}
            </button>

            <div className="w-px h-5 bg-gray-300 mx-2 hidden sm:block" />

            {/* View Mode Toggles */}
            <div className="flex items-center bg-white border border-gray-300 rounded-sm overflow-hidden">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1.5 transition-colors ${
                  viewMode === "grid"
                    ? "bg-gray-100 text-[#0078D4]"
                    : "text-gray-500 hover:bg-gray-50"
                }`}
                title="Grid View"
              >
                <FaThLarge size={14} />
              </button>
              <div className="w-px h-4 bg-gray-200" />
              <button
                onClick={() => setViewMode("list")}
                className={`p-1.5 transition-colors ${
                  viewMode === "list"
                    ? "bg-gray-100 text-[#0078D4]"
                    : "text-gray-500 hover:bg-gray-50"
                }`}
                title="List View"
              >
                <FaListUl size={14} />
              </button>
            </div>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <FaSearch
              size={12}
              className="absolute left-2.5 top-2.5 text-gray-500"
            />
            <input
              type="text"
              placeholder="Filter by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-white border border-gray-300 rounded-sm text-[13px] text-gray-900 focus:outline-none focus:border-[#0078D4] focus:ring-1 focus:ring-[#0078D4] transition-all placeholder-gray-400"
            />
          </div>
        </div>
      </div>

      {/* --- Main Content Area --- */}
      <div className="flex-1 w-full max-w-[1600px] mx-auto p-4 md:p-6 lg:p-8 z-10">
        {/* Essentials Block */}
        <div className="mb-6">
          <h2 className="font-semibold text-[14px] text-gray-900 mb-3">
            Essentials
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-12 gap-y-4 text-[13px] ml-1">
            <div className="flex flex-col gap-1">
              <span className="text-gray-500">Total Resources</span>
              <span className="text-gray-900 font-medium">
                {totalFiles} items
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-gray-500">Storage Used</span>
              <span className="text-[#0078D4] font-medium">
                {formatBytes(storageUsed)}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-gray-500">Storage Capacity</span>
              <span className="text-gray-900">{formatBytes(storageLimit)}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-gray-500">Status</span>
              <span className="text-[#107c10] font-medium flex items-center gap-1">
                <Database size={14} /> Online
              </span>
            </div>
          </div>
        </div>

        {/* Content View */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <FaSpinner className="animate-spin text-[#0078D4]" size={24} />
            <span className="text-[13px] text-gray-600">
              Loading resources...
            </span>
          </div>
        ) : filteredFiles.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 bg-white border border-gray-200 rounded-sm">
            <FaFileAlt className="text-4xl text-gray-300 mb-3" />
            <h3 className="text-[15px] font-semibold text-gray-900 mb-1">
              No files found
            </h3>
            <p className="text-[13px] text-gray-500 text-center">
              Upload documents or media to populate this directory.
            </p>
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-sm">
            {/* ===================== LIST VIEW ===================== */}
            {viewMode === "list" ? (
              <div className="overflow-x-auto w-full">
                <table className="w-full text-left border-collapse whitespace-nowrap">
                  <thead className="bg-[#fafafa] border-b border-gray-200 text-[12px] font-semibold text-gray-700 uppercase">
                    <tr>
                      <th className="px-4 py-2.5 w-12 text-center">Type</th>
                      <th className="px-4 py-2.5">Name</th>
                      <th className="px-4 py-2.5 w-32 hidden sm:table-cell">
                        Extension
                      </th>
                      <th className="px-4 py-2.5 w-20 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredFiles.map((file) => {
                      const fileName = getFileName(file.key);
                      const fileType = getFileType(fileName);
                      const ext = getFileExtension(fileName);
                      return (
                        <tr
                          key={file.key}
                          onClick={() => setSelectedFile(file)}
                          className="hover:bg-[#f6f6f6] cursor-pointer transition-colors group"
                        >
                          <td className="px-4 py-3 text-center">
                            {getFileIcon(
                              fileType,
                              "text-[16px] text-[#0078D4] mx-auto",
                            )}
                          </td>
                          <td className="px-4 py-3 text-[13px] text-[#0078D4] font-medium truncate max-w-[200px] md:max-w-md group-hover:underline">
                            {fileName}
                            <span className="block sm:hidden text-[11px] text-gray-500 mt-0.5 no-underline">
                              {ext.toUpperCase()}
                            </span>
                          </td>
                          <td className="px-4 py-3 hidden sm:table-cell">
                            <span className="bg-gray-100 text-gray-700 px-2 py-0.5 text-[11px] font-semibold rounded-sm">
                              {ext.toUpperCase()}
                            </span>
                          </td>
                          <td
                            className="px-4 py-3 text-center"
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
              <div className="p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {filteredFiles.map((file) => {
                  const fileName = getFileName(file.key);
                  const fileType = getFileType(fileName);
                  const ext = getFileExtension(fileName);
                  return (
                    <div
                      key={file.key}
                      onClick={() => setSelectedFile(file)}
                      className="relative bg-white border border-gray-200 hover:border-[#0078D4] hover:shadow-sm transition-all duration-150 cursor-pointer flex flex-col group rounded-sm overflow-hidden"
                    >
                      <div
                        className="absolute top-1.5 right-1.5 z-10 bg-white/90 rounded-sm opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity shadow-sm"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ActionMenu
                          fileKey={file.key}
                          onDownload={handleDownload}
                          onDelete={handleDeleteClick}
                        />
                      </div>

                      {/* Preview Area */}
                      <div className="h-28 sm:h-32 bg-[#fafafa] border-b border-gray-100 flex items-center justify-center relative overflow-hidden">
                        {fileType === "image" ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={file.url}
                            alt={fileName}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                          />
                        ) : fileType === "video" ? (
                          <div className="w-full h-full relative">
                            <video
                              src={file.url}
                              className="w-full h-full object-cover opacity-80"
                            />
                            <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                              <div className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow-sm">
                                <FaPlay
                                  className="text-[#0078D4] ml-0.5"
                                  size={12}
                                />
                              </div>
                            </div>
                          </div>
                        ) : (
                          getFileIcon(
                            fileType,
                            "text-3xl text-gray-400 group-hover:text-[#0078D4] transition-colors",
                          )
                        )}
                      </div>

                      {/* File Info Footer */}
                      <div className="p-2.5 flex flex-col gap-1">
                        <span
                          className="text-[12px] font-semibold text-gray-900 truncate"
                          title={fileName}
                        >
                          {fileName}
                        </span>
                        <span className="text-[11px] text-gray-500">
                          {ext.toUpperCase()} file
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Load More Row */}
            {hasMore && (
              <div className="border-t border-gray-200 bg-[#fafafa] p-3 text-center">
                <button
                  onClick={handleLoadMore}
                  disabled={isLoadingMore}
                  className="text-[#0078D4] hover:text-[#005a9e] hover:underline text-[13px] font-semibold disabled:no-underline disabled:opacity-50"
                >
                  {isLoadingMore ? "Loading more..." : "Load more resources"}
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* --- File Viewer Overlay (Modal) --- */}
      {selectedFile && (
        <div
          className="fixed inset-0 z-[100] bg-black/80 flex flex-col backdrop-blur-sm"
          onClick={() => setSelectedFile(null)}
        >
          {/* Viewer Header */}
          <div
            className="bg-white px-4 py-3 flex justify-between items-center shadow-sm"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2 min-w-0">
              {getFileIcon(
                getFileType(getFileName(selectedFile.key)),
                "text-[#0078D4] text-lg shrink-0",
              )}
              <span className="text-[14px] font-semibold text-gray-900 truncate">
                {getFileName(selectedFile.key)}
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0 ml-4">
              <button
                onClick={(e) => handleDownload(e, selectedFile.key)}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 text-[13px] font-semibold rounded-sm transition-colors"
              >
                <FaDownload size={12} /> Download
              </button>
              <button
                onClick={(e) => handleDeleteClick(e, selectedFile.key)}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-[#fdf3f4] hover:bg-[#f8d7da] text-[#a4262c] text-[13px] font-semibold rounded-sm transition-colors"
              >
                <FaTrash size={12} /> Delete
              </button>
              <div className="w-px h-5 bg-gray-300 mx-1 hidden sm:block" />
              <button
                onClick={() => setSelectedFile(null)}
                className="p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-sm transition-colors"
                title="Close Viewer"
              >
                <FaTimes size={18} />
              </button>
            </div>
          </div>

          {/* Viewer Content */}
          <div
            className="flex-1 overflow-hidden p-4 md:p-8 flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {getFileType(getFileName(selectedFile.key)) === "image" && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={selectedFile.url}
                alt="preview"
                className="max-w-full max-h-full object-contain shadow-2xl rounded-sm"
              />
            )}
            {getFileType(getFileName(selectedFile.key)) === "video" && (
              <video
                src={selectedFile.url}
                controls
                autoPlay
                className="max-w-full max-h-full object-contain shadow-2xl rounded-sm bg-black"
              />
            )}
            {getFileType(getFileName(selectedFile.key)) === "pdf" && (
              <iframe
                src={selectedFile.url}
                className="w-full h-full max-w-5xl bg-white shadow-2xl rounded-sm"
              />
            )}
            {!["image", "video", "pdf"].includes(
              getFileType(getFileName(selectedFile.key)),
            ) && (
              <div className="bg-white p-8 md:p-10 shadow-xl rounded-sm text-center flex flex-col items-center max-w-sm w-full">
                <div className="mb-4">
                  {getFileIcon(
                    getFileType(getFileName(selectedFile.key)),
                    "text-5xl text-gray-300",
                  )}
                </div>
                <h3 className="text-[16px] font-semibold text-gray-900 mb-1">
                  Preview not available
                </h3>
                <p className="text-[13px] text-gray-500 mb-6">
                  This file format requires a dedicated application to view.
                  Please download it locally.
                </p>
                <button
                  onClick={(e) => handleDownload(e, selectedFile.key)}
                  className={primaryButtonClass}
                >
                  <FaDownload size={14} /> Download File
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- Delete Confirmation Dialog (Azure Style) --- */}
      {fileToDelete && (
        <div
          className="fixed inset-0 z-[110] bg-black/40 flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={() => setFileToDelete(null)}
        >
          <div
            className="bg-white shadow-xl w-full max-w-md rounded-sm overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-start gap-3">
                <FaExclamationCircle
                  size={24}
                  className="text-[#d13438] shrink-0 mt-0.5"
                />
                <div>
                  <h3 className="text-[16px] font-semibold text-gray-900 mb-2">
                    Delete Resource
                  </h3>
                  <p className="text-[13px] text-gray-600 leading-relaxed">
                    Are you sure you want to permanently delete{" "}
                    <span className="font-semibold text-gray-900 break-all">
                      {getFileName(fileToDelete)}
                    </span>
                    ? This action cannot be undone.
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end gap-2">
              <button onClick={confirmDelete} className={dangerButtonClass}>
                Delete
              </button>
              <button
                onClick={() => setFileToDelete(null)}
                className={secondaryButtonClass}
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
