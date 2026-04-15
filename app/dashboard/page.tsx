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
/* AuthPage Match Themes & Classes                                    */
/* ------------------------------------------------------------------ */
const primaryButtonClass =
  "inline-flex items-center justify-center gap-2 py-2 px-4 font-bold text-[14px]  bg-[#0055cc] text-white border-2 border-t-[#3388ff] border-l-[#3388ff] border-r-[#002266] border-b-[#002266] active:border-t-[#002266] active:border-l-[#002266] active:border-b-[#3388ff] active:border-r-[#3388ff] hover:bg-[#0066ee] disabled:opacity-50 disabled:cursor-not-allowed rounded-none transition-none";

const secondaryButtonClass =
  "inline-flex items-center justify-center gap-2 py-2 px-4 font-bold text-[14px]  bg-[#dddddd] text-black border-2 border-t-[#ffffff] border-l-[#ffffff] border-r-[#888888] border-b-[#888888] active:border-t-[#888888] active:border-l-[#888888] active:border-b-[#ffffff] active:border-r-[#ffffff] hover:bg-[#ffffff] disabled:opacity-50 disabled:cursor-not-allowed rounded-none transition-none";

const dangerButtonClass =
  "inline-flex items-center justify-center gap-2 py-2 px-4 font-bold text-[14px]  bg-[#cc0000] text-white border-2 border-t-[#ff3333] border-l-[#ff3333] border-r-[#660000] border-b-[#660000] active:border-t-[#660000] active:border-l-[#660000] active:border-b-[#ff3333] active:border-r-[#ff3333] hover:bg-[#ee0000] disabled:opacity-50 disabled:cursor-not-allowed rounded-none transition-none";

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
        className="w-8 h-8 flex items-center justify-center bg-[#000000] border border-[#555555] text-[#aaaaaa] hover:text-[#dd7700] hover:border-[#dd7700] active:translate-y-[1px] transition-all duration-150 cursor-pointer rounded-none"
        title="Actions"
        aria-label="File actions"
      >
        <FaEllipsisV size={14} />
      </button>

      {open && (
        <div
          className="absolute right-0 top-full mt-1 z-[100] min-w-[160px] bg-[#1e1e1e] border border-[#444444] shadow-[4px_4px_0px_#000000] p-1 flex flex-col gap-1 rounded-none"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={(e) => {
              onDownload(e, fileKey);
              setOpen(false);
            }}
            className="w-full flex items-center gap-3 px-3 py-2 font-bold text-[13px] text-[#dddddd]  hover:bg-[#0055cc] hover:text-white transition-colors duration-150 cursor-pointer rounded-none"
          >
            <FaDownload size={13} className="shrink-0" />
            Download
          </button>
          <div className="w-full h-[1px] bg-[#444444]" />
          <button
            onClick={(e) => {
              onDelete(e, fileKey);
              setOpen(false);
            }}
            className="w-full flex items-center gap-3 px-3 py-2 font-bold text-[13px] text-[#ff4444]  hover:bg-[#cc0000] hover:text-white transition-colors duration-150 cursor-pointer rounded-none"
          >
            <FaTrash size={13} className="shrink-0" />
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
    <div className="w-full min-h-screen bg-[#111111] text-[#dddddd]  flex flex-col relative selection:bg-[#0055cc] selection:text-white">
      {/* --- Top Control Panel --- */}
      <div className="top-0 z-40 bg-[#1e1e1e] border-b border-[#444444] shadow-[0px_4px_0px_#000000]">
        <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-4 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          {/* Storage & Stats Badges (Matched Auth Badge Theme) */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-[#111111] border border-[#444444] text-[12px] font-bold text-[#aaaaaa]  tracking-wide">
              <Folder className="w-4 h-4 text-[#dd7700]" />
              <span>{totalFiles} FILES</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-[#111111] border border-[#444444] text-[12px] font-bold text-[#aaaaaa]  tracking-wide">
              <Container className="w-4 h-4 text-[#0055cc]" />
              <span>
                {formatBytes(storageUsed)} / {formatBytes(storageLimit)}
              </span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
            {/* Search */}
            <div className="flex items-center bg-[#000000] border-2 border-[#555555] focus-within:border-[#aaaaaa] flex-1 sm:flex-none transition-colors duration-150">
              <div className="pl-3 pr-2 text-[#777777]">
                <FaSearch size={14} />
              </div>
              <input
                type="text"
                placeholder="SEARCH FILES..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full sm:w-56 outline-none text-[13px] font-bold  bg-transparent px-2 py-2 text-white placeholder-[#777777]"
              />
            </div>

            <div className="flex gap-3 w-full sm:w-auto">
              {/* View Toggle */}
              <div className="flex border-2 border-[#555555] bg-[#000000]">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`px-3 py-2 flex-1 sm:flex-none flex justify-center items-center transition-colors duration-150 cursor-pointer outline-none ${
                    viewMode === "grid"
                      ? "bg-[#dddddd] text-black border-r-2 border-[#555555]"
                      : "text-[#aaaaaa] hover:bg-[#1e1e1e] border-r-2 border-[#555555]"
                  }`}
                  title="Grid View"
                >
                  <FaThLarge size={14} />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`px-3 py-2 flex-1 sm:flex-none flex justify-center items-center transition-colors duration-150 cursor-pointer outline-none ${
                    viewMode === "list"
                      ? "bg-[#dddddd] text-black"
                      : "text-[#aaaaaa] hover:bg-[#1e1e1e]"
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
                className={`${primaryButtonClass} flex-1 sm:flex-none text-[13px]`}
              >
                {isUploading ? (
                  <FaSpinner className="animate-spin" size={14} />
                ) : (
                  <FaCloudUploadAlt size={16} />
                )}
                {isUploading ? "UPLOADING" : "UPLOAD"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* --- Main Content Area --- */}
      <div className="flex-1 w-full max-w-[1600px] mx-auto p-4 md:p-8 z-10">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4">
            <div className="mb-2 bg-[#000000] border border-[#444444] p-4 shadow-[4px_4px_0px_#000000]">
              <FaSpinner className="animate-spin text-[#0055cc]" size={32} />
            </div>
            <h2 className="text-[16px] font-bold text-white  tracking-tight">
              LOADING WORKSPACE
            </h2>
          </div>
        ) : filteredFiles.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[40vh] p-8 bg-[#1e1e1e] border border-[#444444] shadow-[6px_6px_0px_#000000] max-w-lg mx-auto mt-10">
            <div className="mb-4 bg-[#000000] border border-[#444444] p-4">
              <FaFileAlt className="text-4xl text-[#dd7700]" />
            </div>
            <h3 className="text-[18px] font-bold text-white mb-2  tracking-tight">
              NO FILES FOUND
            </h3>
            <div className="border-t border-[#444444] w-full max-w-[200px] my-3"></div>
            <p className="text-[13px] font-bold text-[#aaaaaa] text-center">
              Upload documents, images, or videos <br /> to get started.
            </p>
          </div>
        ) : (
          <>
            {/* ===================== LIST VIEW ===================== */}
            {viewMode === "list" ? (
              <div className="overflow-x-auto bg-[#1e1e1e] border border-[#444444] shadow-[6px_6px_0px_#000000]">
                <table className="w-full border-collapse text-left whitespace-nowrap font-bold">
                  <thead className="border-b border-[#444444] text-[#aaaaaa] bg-[#111111] text-[12px] tracking-wide ">
                    <tr>
                      <th className="p-4 w-16 text-center border-r border-[#444444]">
                        Type
                      </th>
                      <th className="p-4 border-r border-[#444444]">
                        File Name
                      </th>
                      <th className="p-4 w-28 text-center hidden sm:table-cell border-r border-[#444444]">
                        Format
                      </th>
                      <th className="p-4 w-20 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredFiles.map((file) => {
                      const fileName = getFileName(file.key);
                      const fileType = getFileType(fileName);
                      const ext = getFileExtension(fileName);
                      return (
                        <tr
                          key={file.key}
                          className="hover:bg-[#111111] cursor-pointer transition-colors duration-150 group border-b border-[#333333] last:border-none"
                          onClick={() => setSelectedFile(file)}
                        >
                          <td className="p-3 flex justify-center items-center">
                            <div className="w-8 h-8 bg-[#000000] border border-[#444444] flex items-center justify-center group-hover:border-[#dd7700] transition-colors">
                              {getFileIcon(
                                fileType,
                                "text-sm text-[#777777] group-hover:text-[#dd7700]",
                              )}
                            </div>
                          </td>
                          <td className="p-3 text-[14px] text-[#dddddd] truncate max-w-[150px] sm:max-w-xs md:max-w-md lg:max-w-xl group-hover:text-white transition-colors">
                            <span className="block truncate">{fileName}</span>
                            <span className="inline-block sm:hidden mt-1 text-[10px] text-[#aaaaaa]  tracking-wider">
                              {ext}
                            </span>
                          </td>
                          <td className="p-3 text-center hidden sm:table-cell">
                            <span className="inline-block text-[11px] text-[#aaaaaa] bg-[#000000] px-2 py-0.5 border border-[#444444] tracking-wider ">
                              {ext}
                            </span>
                          </td>
                          <td
                            className="p-3 flex justify-center items-center"
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
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5 md:gap-6">
                {filteredFiles.map((file) => {
                  const fileName = getFileName(file.key);
                  const fileType = getFileType(fileName);
                  const ext = getFileExtension(fileName);
                  return (
                    <div
                      key={file.key}
                      onClick={() => setSelectedFile(file)}
                      className="relative bg-[#1e1e1e] border border-[#444444] shadow-[4px_4px_0px_#000000] hover:-translate-y-1 hover:shadow-[6px_6px_0px_#000000] hover:border-[#dd7700] transition-all duration-150 cursor-pointer flex flex-col group rounded-none"
                    >
                      {/* Action Menu (always visible on mobile, hover on desktop) */}
                      <div
                        className="absolute top-2 right-2 z-30 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-150"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ActionMenu
                          fileKey={file.key}
                          onDownload={handleDownload}
                          onDelete={handleDeleteClick}
                        />
                      </div>

                      {/* Preview Area */}
                      <div className="h-28 sm:h-32 md:h-36 bg-[#000000] border-b border-[#444444] flex flex-col items-center justify-center relative overflow-hidden group-hover:border-[#dd7700] transition-colors duration-150">
                        {fileType === "image" ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={file.url}
                            alt={fileName}
                            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-300 scale-100 group-hover:scale-105"
                            loading="lazy"
                          />
                        ) : fileType === "video" ? (
                          <>
                            <video
                              src={file.url}
                              className="w-full h-full object-cover opacity-50 group-hover:opacity-90 transition-opacity duration-300"
                            />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                              <div className="w-10 h-10 bg-[#0055cc] border-2 border-[#000000] flex items-center justify-center shadow-[2px_2px_0px_#000000] group-hover:bg-[#dd7700] transition-colors duration-150">
                                <FaPlay className="text-white ml-1" size={14} />
                              </div>
                            </div>
                          </>
                        ) : (
                          <div className="w-14 h-14 bg-[#111111] border border-[#555555] flex items-center justify-center group-hover:border-[#dd7700] transition-colors duration-150">
                            {getFileIcon(
                              fileType,
                              "text-2xl text-[#777777] group-hover:text-[#dd7700]",
                            )}
                          </div>
                        )}
                      </div>

                      {/* File Info Footer */}
                      <div className="p-3 flex items-center justify-between gap-2 bg-[#1e1e1e]">
                        <span
                          className="text-[12px] truncate text-white font-bold group-hover:text-[#dd7700] transition-colors duration-150 flex-1 min-w-0 "
                          title={fileName}
                        >
                          {fileName}
                        </span>
                        <span className="text-[9px] sm:text-[10px] px-1.5 py-0.5 bg-[#111111] text-[#aaaaaa] border border-[#444444] font-bold tracking-wider flex-shrink-0">
                          {ext}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {hasMore && (
              <div className="flex justify-center mt-10 mb-6">
                <button
                  onClick={handleLoadMore}
                  disabled={isLoadingMore}
                  className={secondaryButtonClass}
                >
                  {isLoadingMore && (
                    <FaSpinner className="animate-spin" size={14} />
                  )}
                  {isLoadingMore ? "LOADING..." : "LOAD MORE FILES"}
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* --- File Viewer Overlay --- */}
      {selectedFile && (
        <div
          className="fixed inset-0 z-[100] bg-black/95 flex flex-col"
          onClick={() => setSelectedFile(null)}
        >
          {/* Viewer Header */}
          <div
            className="bg-[#1e1e1e] border border-[#444444] p-3 flex justify-between items-center text-white shadow-[6px_6px_0px_#000000] m-3 rounded-none"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-[14px] font-bold  tracking-wide truncate max-w-[50%] md:max-w-[60%] flex items-center gap-3">
              <div className="w-8 h-8 bg-[#000000] border border-[#444444] flex items-center justify-center shrink-0">
                {getFileIcon(
                  getFileType(getFileName(selectedFile.key)),
                  "text-[#dd7700]",
                )}
              </div>
              {getFileName(selectedFile.key)}
            </div>
            <div className="flex gap-2 sm:gap-3">
              <button
                onClick={(e) => handleDownload(e, selectedFile.key)}
                className={`${primaryButtonClass} hidden sm:flex text-[12px] py-1.5 px-3`}
              >
                <FaDownload size={12} /> Download
              </button>
              <button
                onClick={(e) => handleDeleteClick(e, selectedFile.key)}
                className={`${dangerButtonClass} hidden sm:flex text-[12px] py-1.5 px-3`}
              >
                <FaTrash size={12} /> Delete
              </button>
              <div className="w-[1px] bg-[#444444] mx-1 hidden sm:block" />
              <button
                onClick={() => setSelectedFile(null)}
                className={`${secondaryButtonClass} w-10 h-10 p-0 flex items-center justify-center`}
                title="Close"
              >
                <FaTimes size={16} />
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
                className="max-w-full max-h-full object-contain bg-[#1e1e1e] border border-[#444444] shadow-[8px_8px_0px_#000000]"
              />
            )}
            {getFileType(getFileName(selectedFile.key)) === "video" && (
              <video
                src={selectedFile.url}
                controls
                autoPlay
                className="max-w-full max-h-full object-contain bg-[#000000] border border-[#444444] shadow-[8px_8px_0px_#000000]"
              />
            )}
            {getFileType(getFileName(selectedFile.key)) === "pdf" && (
              <iframe
                src={selectedFile.url}
                className="w-full h-full max-w-5xl bg-[#ffffff] border border-[#444444] shadow-[8px_8px_0px_#000000]"
              />
            )}
            {!["image", "video", "pdf"].includes(
              getFileType(getFileName(selectedFile.key)),
            ) && (
              <div className="bg-[#1e1e1e] p-8 md:p-10 border border-[#444444] shadow-[6px_6px_0px_#000000] text-center flex flex-col items-center max-w-sm w-full">
                <div className="mb-6 bg-[#000000] border border-[#444444] p-4">
                  {getFileIcon(
                    getFileType(getFileName(selectedFile.key)),
                    "text-4xl text-[#dd7700]",
                  )}
                </div>
                <h3 className="text-[18px] font-bold text-white mb-2  tracking-tight">
                  NO RICH PREVIEW
                </h3>
                <div className="border-t border-[#444444] w-full max-w-[200px] my-3"></div>
                <p className="text-[13px] font-bold text-[#aaaaaa] mb-8 leading-relaxed ">
                  Format requires a dedicated application. <br /> Download to
                  view.
                </p>
                <button
                  onClick={(e) => handleDownload(e, selectedFile.key)}
                  className={primaryButtonClass}
                >
                  <FaDownload size={14} /> DOWNLOAD FILE
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- Delete Confirmation Modal --- */}
      {fileToDelete && (
        <div
          className="fixed inset-0 z-[110] bg-black/90 flex items-center justify-center p-4"
          onClick={() => setFileToDelete(null)}
        >
          <div
            className="bg-[#1e1e1e] border border-[#444444] shadow-[6px_6px_0px_#000000] p-6 w-full max-w-sm flex flex-col gap-6 rounded-none"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col items-center text-center gap-4">
              <div className="bg-[#440000] border border-[#ff0000] p-4 text-[#ffaaaa]">
                <FaExclamationTriangle size={28} />
              </div>
              <div>
                <h3 className="text-[18px] font-bold text-white mb-2  tracking-tight">
                  DELETE FILE?
                </h3>
                <div className="border-t border-[#444444] w-full mx-auto max-w-[150px] my-3"></div>
                <p className="text-[#aaaaaa] font-bold text-[13px] leading-relaxed ">
                  Are you sure you want to delete <br />
                  <span className="text-white bg-[#000000] border border-[#555555] px-2 py-1 inline-block mt-2 mb-2 break-all">
                    {getFileName(fileToDelete)}
                  </span>
                  <br /> This action cannot be undone.
                </p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full">
              <button
                onClick={() => setFileToDelete(null)}
                className={`${secondaryButtonClass} flex-1`}
              >
                CANCEL
              </button>
              <button
                onClick={confirmDelete}
                className={`${dangerButtonClass} flex-1`}
              >
                <FaTrash size={13} /> DELETE
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
