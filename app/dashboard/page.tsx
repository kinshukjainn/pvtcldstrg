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

// Reusable sharp mechanical button class
const solidButtonClass =
  "inline-flex items-center justify-center gap-2 font-bold px-5 py-2.5 border-2 border-[#000000] shadow-[4px_4px_0px_#000000] active:translate-y-[4px] active:translate-x-[4px] active:shadow-none transition-all duration-150 uppercase text-[14px] cursor-pointer rounded-none outline-none disabled:opacity-50 disabled:cursor-not-allowed";

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
        className="w-10 h-10 flex items-center justify-center bg-[#000000] border-2 border-[#444444] text-[#aaaaaa] hover:text-[#ff9900] hover:border-[#ff9900] shadow-[2px_2px_0px_#000000] active:translate-y-[2px] active:translate-x-[2px] active:shadow-none transition-all duration-150 cursor-pointer rounded-none"
        title="Actions"
        aria-label="File actions"
      >
        <FaEllipsisV size={16} />
      </button>

      {open && (
        <div
          className="absolute right-0 top-full mt-2 z-[100] min-w-[180px] bg-[#1e1e1e] border-4 border-[#000000] shadow-[6px_6px_0px_#000000] p-1 flex flex-col gap-1 rounded-none"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={(e) => {
              onDownload(e, fileKey);
              setOpen(false);
            }}
            className="w-full flex items-center gap-3 px-4 py-3 font-bold text-[14px] text-white uppercase hover:bg-[#ffffff] hover:text-black border-2 border-transparent hover:border-[#000000] transition-colors duration-150 cursor-pointer rounded-none"
          >
            <FaDownload size={14} className="shrink-0" />
            Download
          </button>
          <div className="w-full h-1 bg-[#000000]" />
          <button
            onClick={(e) => {
              onDelete(e, fileKey);
              setOpen(false);
            }}
            className="w-full flex items-center gap-3 px-4 py-3 font-bold text-[14px] text-[#ff3333] uppercase hover:bg-[#ff3333] hover:text-white border-2 border-transparent hover:border-[#000000] transition-colors duration-150 cursor-pointer rounded-none"
          >
            <FaTrash size={14} className="shrink-0" />
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

  return (
    <div className="w-full min-h-screen bg-[#111111] text-[#dddddd] font-sans flex flex-col relative selection:bg-[#ff9900] selection:text-black">
      {/* --- Top Control Panel --- */}
      <div className="top-0 z-40 bg-[#111111] border-b-4 border-[#000000]">
        <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-5 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-5">
          {/* Storage & Stats */}
          <div className="flex flex-wrap items-center gap-4 text-white font-bold uppercase tracking-wide">
            <span className="flex gap-2 items-center bg-[#1e1e1e] border-2 border-[#444444] px-3 py-1.5 shadow-[2px_2px_0px_#000000]">
              <Folder size={18} className="text-[#ff9900]" />
              {totalFiles} FILES
            </span>
            <span className="flex gap-2 items-center bg-[#1e1e1e] border-2 border-[#444444] px-3 py-1.5 shadow-[2px_2px_0px_#000000]">
              <Container size={18} className="text-[#0088ff]" />
              {formatBytes(storageUsed)} / {formatBytes(storageLimit)}
            </span>
          </div>

          {/* Controls */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full lg:w-auto">
            {/* Search */}
            <div className="flex items-center bg-[#000000] border-2 border-[#444444] focus-within:border-[#ff9900] flex-1 sm:flex-none transition-colors duration-150">
              <div className="pl-4 pr-2 text-[#777777]">
                <FaSearch size={16} />
              </div>
              <input
                type="text"
                placeholder="SEARCH FILES..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full sm:w-64 outline-none text-[14px] font-bold uppercase bg-transparent px-2 py-3 text-white placeholder-[#555555]"
              />
            </div>

            <div className="flex gap-4 w-full sm:w-auto">
              {/* View Toggle */}
              <div className="flex bg-[#000000] border-2 border-[#444444] shadow-[2px_2px_0px_#000000]">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-3 flex-1 sm:flex-none flex justify-center items-center transition-colors duration-150 cursor-pointer outline-none ${
                    viewMode === "grid"
                      ? "bg-[#ffffff] text-black border-r-2 border-[#444444]"
                      : "text-[#aaaaaa] hover:bg-[#1e1e1e] border-r-2 border-[#444444]"
                  }`}
                  title="Grid View"
                >
                  <FaThLarge size={16} />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-3 flex-1 sm:flex-none flex justify-center items-center transition-colors duration-150 cursor-pointer outline-none ${
                    viewMode === "list"
                      ? "bg-[#ffffff] text-black"
                      : "text-[#aaaaaa] hover:bg-[#1e1e1e]"
                  }`}
                  title="List View"
                >
                  <FaListUl size={16} />
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
                className={`${solidButtonClass} bg-[#ff9900] text-black flex-1 sm:flex-none`}
              >
                {isUploading ? (
                  <FaSpinner className="animate-spin" size={16} />
                ) : (
                  <FaCloudUploadAlt size={18} />
                )}
                {isUploading ? "UPLOADING..." : "UPLOAD"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* --- Main Content Area --- */}
      <div className="flex-1 w-full max-w-[1600px] mx-auto p-4 md:p-8 z-10">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center min-h-[40vh] gap-5">
            <div className="w-16 h-16 bg-[#000000] border-4 border-[#444444] flex items-center justify-center shadow-[6px_6px_0px_#000000]">
              <FaSpinner className="animate-spin text-[#ff9900]" size={28} />
            </div>
            <span className="text-[16px] font-bold tracking-widest uppercase text-white bg-[#000000] px-4 py-2 border-2 border-[#444444]">
              LOADING WORKSPACE...
            </span>
          </div>
        ) : filteredFiles.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[50vh] p-8 bg-[#1e1e1e] border-4 border-[#000000] shadow-[8px_8px_0px_#000000] max-w-2xl mx-auto mt-10">
            <div className="w-24 h-24 bg-[#000000] border-4 border-[#444444] flex items-center justify-center mb-6 shadow-[6px_6px_0px_#000000]">
              <FaFileAlt className="text-4xl text-[#aaaaaa]" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2 uppercase tracking-wide">
              NO FILES FOUND
            </h3>
            <p className="text-[16px] font-bold text-[#aaaaaa] text-center">
              UPLOAD DOCUMENTS, IMAGES, OR VIDEOS TO GET STARTED.
            </p>
          </div>
        ) : (
          <>
            {/* ===================== LIST VIEW ===================== */}
            {viewMode === "list" ? (
              <div className="overflow-x-auto bg-[#1e1e1e] border-4 border-[#000000] shadow-[8px_8px_0px_#000000]">
                <table className="w-full border-collapse text-left whitespace-nowrap font-bold">
                  <thead className="border-b-4 border-[#000000] text-white bg-[#000000] text-[14px] tracking-wider uppercase">
                    <tr>
                      <th className="p-5 w-20 text-center">Type</th>
                      <th className="p-5">File Name</th>
                      <th className="p-5 w-32 text-center hidden sm:table-cell">
                        Format
                      </th>
                      <th className="p-5 w-24 text-center">Actions</th>
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
                          className="hover:bg-[#000000] cursor-pointer transition-colors duration-150 group border-b-2 border-[#333333]"
                          onClick={() => setSelectedFile(file)}
                        >
                          <td className="p-4 flex justify-center items-center">
                            <div className="w-10 h-10 bg-[#000000] border-2 border-[#444444] flex items-center justify-center group-hover:border-[#ff9900] transition-colors">
                              {getFileIcon(
                                fileType,
                                "text-xl text-[#aaaaaa] group-hover:text-[#ff9900]",
                              )}
                            </div>
                          </td>
                          <td className="p-4 text-[15px] text-[#dddddd] truncate max-w-[200px] md:max-w-md lg:max-w-xl group-hover:text-white transition-colors">
                            <span className="block truncate">{fileName}</span>
                            <span className="inline-block sm:hidden mt-2 text-[11px] text-black bg-[#ffffff] px-2 py-0.5 border-2 border-[#000000] tracking-wider shadow-[2px_2px_0px_#000000]">
                              {ext}
                            </span>
                          </td>
                          <td className="p-4 text-center hidden sm:table-cell">
                            <span className="inline-block text-[12px] text-black bg-[#ffffff] px-3 py-1 border-2 border-[#000000] tracking-wider shadow-[2px_2px_0px_#000000]">
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
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 md:gap-8">
                {filteredFiles.map((file) => {
                  const fileName = getFileName(file.key);
                  const fileType = getFileType(fileName);
                  const ext = getFileExtension(fileName);
                  return (
                    <div
                      key={file.key}
                      onClick={() => setSelectedFile(file)}
                      className="relative bg-[#1e1e1e] border-4 border-[#000000] shadow-[6px_6px_0px_#000000] hover:-translate-y-1 hover:shadow-[10px_10px_0px_#000000] hover:border-[#ff9900] transition-all duration-150 cursor-pointer flex flex-col group rounded-none"
                    >
                      {/* Action Menu (always visible on mobile, hover on desktop) */}
                      <div
                        className="absolute top-3 right-3 z-30 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-150"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ActionMenu
                          fileKey={file.key}
                          onDownload={handleDownload}
                          onDelete={handleDeleteClick}
                        />
                      </div>

                      {/* Preview Area */}
                      <div className="h-32 sm:h-36 md:h-44 bg-[#000000] border-b-4 border-[#000000] flex flex-col items-center justify-center relative overflow-hidden group-hover:border-[#ff9900] transition-colors duration-150">
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
                              className="w-full h-full object-cover opacity-60 group-hover:opacity-90 transition-opacity duration-300"
                            />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                              <div className="w-12 h-12 bg-[#ff9900] border-2 border-[#000000] flex items-center justify-center shadow-[4px_4px_0px_#000000] group-hover:bg-[#ffffff] transition-colors duration-150">
                                <FaPlay className="text-black ml-1" size={16} />
                              </div>
                            </div>
                          </>
                        ) : (
                          <div className="w-20 h-20 bg-[#1e1e1e] border-2 border-[#444444] flex items-center justify-center group-hover:border-[#ff9900] group-hover:bg-[#000000] transition-colors duration-150 shadow-[4px_4px_0px_#000000]">
                            {getFileIcon(
                              fileType,
                              "text-4xl text-[#aaaaaa] group-hover:text-[#ff9900]",
                            )}
                          </div>
                        )}
                      </div>

                      {/* File Info Footer */}
                      <div className="p-4 flex items-center justify-between gap-3 bg-[#1e1e1e]">
                        <span
                          className="text-[14px] truncate text-white font-bold group-hover:text-[#ff9900] transition-colors duration-150 flex-1 min-w-0 uppercase"
                          title={fileName}
                        >
                          {fileName}
                        </span>
                        <span className="text-[10px] md:text-[11px] px-2 py-1 bg-[#ffffff] text-black border-2 border-[#000000] font-bold tracking-wider flex-shrink-0 shadow-[2px_2px_0px_#000000]">
                          {ext}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {hasMore && (
              <div className="flex justify-center mt-14 mb-8">
                <button
                  onClick={handleLoadMore}
                  disabled={isLoadingMore}
                  className={`${solidButtonClass} bg-[#ffffff] text-black`}
                >
                  {isLoadingMore && (
                    <FaSpinner className="animate-spin" size={16} />
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
            className="bg-[#1e1e1e] border-4 border-[#000000] p-4 flex justify-between items-center text-white shadow-[8px_8px_0px_#000000] m-4 rounded-none"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-[16px] font-bold uppercase tracking-wide truncate max-w-[50%] md:max-w-[60%] flex items-center gap-4">
              <div className="w-10 h-10 bg-[#000000] border-2 border-[#444444] flex items-center justify-center shrink-0">
                {getFileIcon(
                  getFileType(getFileName(selectedFile.key)),
                  "text-[#ff9900]",
                )}
              </div>
              {getFileName(selectedFile.key)}
            </div>
            <div className="flex gap-3">
              <button
                onClick={(e) => handleDownload(e, selectedFile.key)}
                className="hidden sm:flex items-center gap-2 bg-[#0055cc] text-white border-2 border-[#000000] font-bold uppercase px-4 py-2 shadow-[4px_4px_0px_#000000] active:translate-y-[4px] active:translate-x-[4px] active:shadow-none transition-all duration-150"
              >
                <FaDownload size={14} /> Download
              </button>
              <button
                onClick={(e) => handleDeleteClick(e, selectedFile.key)}
                className="hidden sm:flex items-center gap-2 bg-[#ff3333] text-white border-2 border-[#000000] font-bold uppercase px-4 py-2 shadow-[4px_4px_0px_#000000] active:translate-y-[4px] active:translate-x-[4px] active:shadow-none transition-all duration-150"
              >
                <FaTrash size={14} /> Delete
              </button>
              <div className="w-1 bg-[#000000] mx-2 hidden sm:block" />
              <button
                onClick={() => setSelectedFile(null)}
                className="flex items-center justify-center w-12 h-12 bg-[#ffffff] text-black border-2 border-[#000000] shadow-[4px_4px_0px_#000000] active:translate-y-[4px] active:translate-x-[4px] active:shadow-none transition-all duration-150 cursor-pointer"
                title="Close"
              >
                <FaTimes size={20} />
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
                className="max-w-full max-h-full object-contain bg-[#1e1e1e] border-4 border-[#000000] shadow-[12px_12px_0px_#000000]"
              />
            )}
            {getFileType(getFileName(selectedFile.key)) === "video" && (
              <video
                src={selectedFile.url}
                controls
                autoPlay
                className="max-w-full max-h-full object-contain bg-[#000000] border-4 border-[#ffffff] shadow-[12px_12px_0px_#000000]"
              />
            )}
            {getFileType(getFileName(selectedFile.key)) === "pdf" && (
              <iframe
                src={selectedFile.url}
                className="w-full h-full max-w-6xl bg-[#ffffff] border-4 border-[#000000] shadow-[12px_12px_0px_#000000]"
              />
            )}
            {!["image", "video", "pdf"].includes(
              getFileType(getFileName(selectedFile.key)),
            ) && (
              <div className="bg-[#1e1e1e] p-10 md:p-14 border-4 border-[#000000] shadow-[12px_12px_0px_#000000] text-center flex flex-col items-center max-w-md w-full">
                <div className="w-24 h-24 bg-[#000000] border-4 border-[#444444] flex items-center justify-center mb-8 shadow-[6px_6px_0px_#000000]">
                  {getFileIcon(
                    getFileType(getFileName(selectedFile.key)),
                    "text-5xl text-[#ff9900]",
                  )}
                </div>
                <h3 className="font-bold text-white text-2xl mb-4 uppercase tracking-wide">
                  NO RICH PREVIEW
                </h3>
                <p className="text-[15px] font-bold text-[#aaaaaa] mb-10 leading-relaxed uppercase">
                  This file format requires a dedicated application. Download it
                  to your device to open it.
                </p>
                <button
                  onClick={(e) => handleDownload(e, selectedFile.key)}
                  className={`${solidButtonClass} bg-[#0055cc] text-white w-full py-4 text-[16px]`}
                >
                  <FaDownload size={16} /> DOWNLOAD FILE
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
            className="bg-[#1e1e1e] border-4 border-[#000000] shadow-[12px_12px_0px_#000000] p-8 w-full max-w-md flex flex-col gap-8 rounded-none"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col items-center text-center gap-5">
              <div className="w-20 h-20 bg-[#000000] border-4 border-[#ff3333] flex items-center justify-center text-[#ff3333] shadow-[6px_6px_0px_#000000]">
                <FaExclamationTriangle size={32} />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-3 uppercase tracking-wide">
                  DELETE FILE?
                </h3>
                <p className="text-[#aaaaaa] font-bold text-[15px] leading-relaxed uppercase">
                  Are you sure you want to delete <br />
                  <span className="text-white bg-[#000000] border-2 border-[#444444] px-2 py-1 inline-block mt-2 mb-2 break-all shadow-[2px_2px_0px_#000000]">
                    {getFileName(fileToDelete)}
                  </span>
                  <br /> This action cannot be undone.
                </p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 w-full">
              <button
                onClick={() => setFileToDelete(null)}
                className={`${solidButtonClass} bg-[#ffffff] text-black flex-1 py-4 text-[15px]`}
              >
                CANCEL
              </button>
              <button
                onClick={confirmDelete}
                className={`${solidButtonClass} bg-[#ff3333] text-white flex-1 py-4 text-[15px]`}
              >
                <FaTrash size={15} /> DELETE
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
