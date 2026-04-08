"use client";

import { useState, useEffect, useRef } from "react";
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
} from "react-icons/fa";
import {
  getUploadUrl,
  confirmUploadDB, // <-- New import
  listPhotos,
  deletePhoto,
  getDownloadUrl,
} from "@/actions/drive";

type DriveFile = {
  key: string;
  url: string;
  size?: number; // Added to support storage calculation
};

type PhotoItem = {
  key?: string;
  url: string;
  size?: number;
};

// Helper function to format file size
const formatBytes = (bytes: number, decimals = 2) => {
  if (!+bytes) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};

export default function DriveManager() {
  const [files, setFiles] = useState<DriveFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [selectedFile, setSelectedFile] = useState<DriveFile | null>(null);

  // New state for custom delete confirmation modal
  const [fileToDelete, setFileToDelete] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    setIsLoading(true);
    try {
      const data = await listPhotos();
      setFiles(
        data.map((item: PhotoItem) => ({
          key: item.key || item.url,
          url: item.url,
          size: item.size,
        })),
      );
    } catch (error) {
      console.error("Failed to fetch:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles || selectedFiles.length === 0) return;

    setIsUploading(true);
    try {
      const uploadPromises = Array.from(selectedFiles).map(async (file) => {
        // 1. Get URL and check DB size limit
        const { url, key } = await getUploadUrl(
          file.name,
          file.type,
          file.size,
        );

        // 2. Upload to S3 directly
        const response = await fetch(url, {
          method: "PUT",
          body: file,
          headers: { "Content-Type": file.type },
        });

        if (!response.ok) throw new Error("S3 Upload Failed");

        // 3. Confirm in Neon DB so storage usage updates
        await confirmUploadDB(key, file.name, file.size);
      });

      await Promise.all(uploadPromises);
      await fetchFiles();
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

  const handleDeleteClick = (e: React.MouseEvent, key: string) => {
    e.stopPropagation();
    setFileToDelete(key);
  };

  const confirmDelete = async () => {
    if (!fileToDelete) return;

    // Find the file to get its size before deleting
    const fileObj = files.find((f) => f.key === fileToDelete);
    if (!fileObj) return;

    const key = fileToDelete;
    setFileToDelete(null);

    setFiles((prev) => prev.filter((p) => p.key !== key));
    if (selectedFile?.key === key) setSelectedFile(null);

    try {
      // Pass the size so the backend can subtract it from the DB
      await deletePhoto(key, fileObj.size || 0);
    } catch (error) {
      console.error("Delete failed", error);
      fetchFiles();
    }
  };

  const handleDownload = async (e: React.MouseEvent, key: string) => {
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
  };

  // --- Helper Functions ---
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
      case "text":
        return <FaFileAlt className={className} />;
      default:
        return <FaFileAlt className={className} />;
    }
  };

  const filteredFiles = files.filter((file) =>
    getFileName(file.key).toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Calculate total size of all fetched files
  const totalSize = files.reduce((acc, file) => acc + (file.size || 0), 0);

  return (
    // Changed to  and standard neutral-950 base
    <div className="w-full min-h-screen bg-[#0d1014] text-neutral-200  flex flex-col relative overflow-hidden">
      {/* --- Top Control Panel --- */}
      <div className="bg-[#0d1014] backdrop-blur-md border-b border-neutral-800 p-4 md:p-6 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 z-10">
        {/* Title & Info */}
        <div className="flex flex-wrap items-center gap-3 font-medium text-neutral-100">
          <span className="text-xs md:text-sm bg-transparent backdrop-blur-sm border border-neutral-800 rounded-full px-4 py-1.5 flex gap-2 items-center shadow-lg">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
            Files: {files.length}
          </span>
          <span className="text-xs md:text-sm bg-transparent backdrop-blur-sm border border-neutral-800 rounded-full px-4 py-1.5 flex gap-2 items-center shadow-lg">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            Storage: {formatBytes(totalSize)}
          </span>
        </div>

        {/* Toolbar Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full lg:w-auto">
          {/* Search */}
          <div className="flex items-center border-b-3 border-blue-500 border-2  rounded-t-xl bg-transparent backdrop-blur-md px-4 py-2 flex-1 sm:flex-none  transition-colors">
            <FaSearch className="text-neutral-500 mr-3" size={16} />
            <input
              type="text"
              placeholder="Search files , images , pdf etc ..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-48 md:w-64 outline-none text-md md:text-base bg-transparent placeholder-neutral-600 text-neutral-200"
            />
          </div>

          <div className="flex gap-3 w-full sm:w-auto">
            {/* View Toggles */}
            <div className="flex border border-neutral-800 rounded-xl bg-neutral-900/40 overflow-hidden p-1 backdrop-blur-md">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 px-4 rounded-lg flex-1 sm:flex-none flex justify-center items-center transition-all ${
                  viewMode === "grid"
                    ? "bg-neutral-200 text-neutral-950 cursor-pointer shadow-sm"
                    : "text-neutral-500 cursor-pointer hover:text-neutral-300"
                }`}
                title="Grid View"
              >
                <FaThLarge size={16} />
              </button>

              <button
                onClick={() => setViewMode("list")}
                className={`p-2 px-4 rounded-lg flex-1 sm:flex-none flex justify-center items-center transition-all ${
                  viewMode === "list"
                    ? "bg-neutral-200 text-neutral-950 cursor-pointer shadow-sm"
                    : "text-neutral-500 cursor-pointer hover:text-neutral-300"
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
              className="group flex-1 sm:flex-none flex items-center justify-center gap-2 bg-blue-700 text-neutral-100 px-6 cursor-pointer py-2 rounded-xl font-semibold text-md md:text-base "
            >
              {isUploading ? (
                <FaSpinner className="animate-spin" size={16} />
              ) : (
                <FaCloudUploadAlt
                  size={18}
                  className="group-hover:-translate-y-0.5 transition-transform"
                />
              )}
              {isUploading ? "Uploading..." : "Browse files"}
            </button>
          </div>
        </div>
      </div>

      {/* --- Main Content Area --- */}
      <div className="flex-1 p-4 md:p-8 overflow-auto z-10">
        {isLoading ? (
          <div className="flex items-center justify-center gap-3 p-10 text-neutral-500 text-sm md:text-base font-medium tracking-widest uppercase">
            <FaSpinner className="animate-spin" size={20} /> Loading files...
          </div>
        ) : filteredFiles.length === 0 ? (
          <div className="flex items-center justify-center p-20 text-neutral-600 text-sm md:text-base font-medium tracking-widest uppercase border border-neutral-800/50 rounded-2xl border-dashed">
            No Files Found
          </div>
        ) : (
          <>
            {viewMode === "list" ? (
              /* --- Data Table View --- */
              <div className="overflow-x-auto border border-neutral-800 bg-neutral-900/40 backdrop-blur-md rounded-2xl shadow-xl">
                <table className="w-full border-collapse text-left whitespace-nowrap">
                  <thead className="bg-neutral-900/60 border-b border-neutral-800 text-blue-400 font-medium text-md md:text-sm  tracking-wider">
                    <tr>
                      <th className="p-4 w-16 text-center">Type</th>
                      <th className="p-4">Filename</th>
                      <th className="p-4 w-24 text-center">Extension</th>
                      <th className="p-4 w-32 md:w-48 text-center">Actions</th>
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
                          className="border-b border-neutral-800/50 hover:bg-neutral-800/40 cursor-pointer transition-colors group"
                          onClick={() => setSelectedFile(file)}
                        >
                          <td className="p-4 text-neutral-300 flex justify-center items-center h-full">
                            {getFileIcon(fileType, "text-xl")}
                          </td>
                          <td className="p-4 text-sm md:text-base text-neutral-200 truncate max-w-[200px] md:max-w-md lg:max-w-xl font-medium group-hover:text-white transition-colors">
                            {fileName}
                          </td>
                          <td className="p-4 text-center text-xs text-neutral-500 font-medium">
                            {ext}
                          </td>
                          <td
                            className="p-4 flex items-center justify-center gap-3"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button
                              onClick={(e) => handleDownload(e, file.key)}
                              className="p-2 rounded-full bg-white/5 hover:bg-white text-neutral-400 hover:text-black transition-all cursor-pointer"
                              title="Download"
                            >
                              <FaDownload size={14} />
                            </button>
                            <button
                              onClick={(e) => handleDeleteClick(e, file.key)}
                              className="p-2 rounded-full bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white transition-all cursor-pointer"
                              title="Delete"
                            >
                              <FaTrash size={14} />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              /* --- Block/Grid View --- */
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                {filteredFiles.map((file) => {
                  const fileName = getFileName(file.key);
                  const fileType = getFileType(fileName);
                  const ext = getFileExtension(fileName);

                  return (
                    <div
                      key={file.key}
                      onClick={() => setSelectedFile(file)}
                      className="bg-neutral-900/40 border border-neutral-800 rounded-2xl backdrop-blur-md hover:bg-neutral-800/60 hover:-translate-y-1 transition-all cursor-pointer flex flex-col group overflow-hidden shadow-lg"
                    >
                      <div className="h-32 sm:h-40 md:h-48 bg-neutral-950/50 border-b border-neutral-800 flex flex-col items-center justify-center relative overflow-hidden">
                        {fileType === "image" ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={file.url}
                            alt={fileName}
                            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity group-hover:scale-105 duration-500"
                            loading="lazy"
                          />
                        ) : fileType === "video" ? (
                          <>
                            <video
                              src={file.url}
                              className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                            />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/20 transition-colors">
                              <div className="p-3 bg-white/10 backdrop-blur-md rounded-full">
                                <FaPlay className="text-white ml-1" size={20} />
                              </div>
                            </div>
                          </>
                        ) : (
                          getFileIcon(
                            fileType,
                            "text-5xl text-neutral-600 group-hover:text-neutral-400 transition-colors group-hover:scale-110 duration-300",
                          )
                        )}
                      </div>

                      <div className="p-4 flex flex-col justify-between flex-1">
                        <span
                          className="text-xs md:text-sm truncate text-neutral-200 font-medium mb-4 group-hover:text-white transition-colors"
                          title={fileName}
                        >
                          {fileName}
                        </span>

                        <div className="flex justify-between items-center gap-2 mt-auto">
                          <span className="text-[10px] px-2 py-1 rounded-md bg-neutral-800 text-neutral-400 font-medium tracking-wider">
                            {ext}
                          </span>
                          <div className="flex gap-2">
                            <button
                              onClick={(e) => handleDownload(e, file.key)}
                              className="p-1.5 rounded-full bg-white text-neutral-900 hover:text-black transition-all cursor-pointer"
                              title="Download"
                            >
                              <FaDownload size={14} />
                            </button>
                            <button
                              onClick={(e) => handleDeleteClick(e, file.key)}
                              className="p-1.5 rounded-full bg-black text-neutral-400 hover:text-white transition-all cursor-pointer"
                              title="Delete"
                            >
                              <FaTrash size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>

      {/* --- File Viewer Overlay --- */}
      {selectedFile && (
        <div
          className="fixed inset-0 z-50 bg-neutral-950/80 backdrop-blur-xl flex flex-col"
          onClick={() => setSelectedFile(null)}
        >
          {/* Overlay Toolbar */}
          <div
            className="bg-neutral-900/50 border-b border-neutral-800 p-4 flex justify-between items-center text-neutral-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-sm md:text-lg font-medium truncate max-w-[60%]">
              {getFileName(selectedFile.key)}
            </div>
            <div className="flex gap-3">
              <button
                onClick={(e) => handleDownload(e, selectedFile.key)}
                className="flex items-center gap-2 bg-white/10 hover:bg-white hover:text-black border border-white/10 rounded-lg cursor-pointer px-4 py-2 text-sm font-medium transition-all"
                title="Download"
              >
                <FaDownload size={14} />
                <span className="hidden sm:inline">Download</span>
              </button>
              <button
                onClick={(e) => handleDeleteClick(e, selectedFile.key)}
                className="flex items-center gap-2 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white border border-red-500/20 rounded-lg cursor-pointer px-4 py-2 text-sm font-medium transition-all"
                title="Delete"
              >
                <FaTrash size={14} />
                <span className="hidden sm:inline">Delete</span>
              </button>
              <button
                onClick={() => setSelectedFile(null)}
                className="flex items-center justify-center w-10 h-10 bg-neutral-800 hover:bg-neutral-700 rounded-lg cursor-pointer transition-colors"
                title="Close"
              >
                <FaTimes size={16} />
              </button>
            </div>
          </div>

          {/* Viewer Content */}
          <div
            className="flex-1 overflow-hidden p-6 md:p-10 flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {getFileType(getFileName(selectedFile.key)) === "image" && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={selectedFile.url}
                alt="preview"
                className="max-w-full max-h-full object-contain rounded-xl shadow-2xl border border-neutral-800"
              />
            )}

            {getFileType(getFileName(selectedFile.key)) === "video" && (
              <video
                src={selectedFile.url}
                controls
                autoPlay
                className="max-w-full max-h-full object-contain rounded-xl shadow-2xl border border-neutral-800"
              />
            )}

            {getFileType(getFileName(selectedFile.key)) === "pdf" && (
              <iframe
                src={selectedFile.url}
                className="w-full h-full max-w-5xl rounded-xl shadow-2xl border border-neutral-800 bg-white"
              />
            )}

            {/* Check against explicitly supported preview types */}
            {!["image", "video", "pdf"].includes(
              getFileType(getFileName(selectedFile.key)),
            ) && (
              <div className="bg-neutral-900/60 border border-neutral-800 p-12 md:p-16 rounded-3xl text-center flex flex-col items-center max-w-md w-full shadow-2xl backdrop-blur-md">
                <FaFileAlt className="text-6xl md:text-7xl text-neutral-600 mb-6" />
                <h3 className="font-medium text-neutral-200 text-lg md:text-xl mb-3 tracking-wide">
                  NO PREVIEW AVAILABLE
                </h3>
                <p className="text-sm md:text-base text-neutral-500 mb-8 leading-relaxed">
                  This file format cannot be previewed in the current
                  environment.
                </p>
                <button
                  onClick={(e) => handleDownload(e, selectedFile.key)}
                  className="bg-white text-black hover:bg-neutral-200 rounded-full px-8 py-3 font-semibold text-sm w-full tracking-wider transition-all flex justify-center items-center gap-3 shadow-[0_0_15px_rgba(255,255,255,0.15)] hover:scale-105"
                >
                  <FaDownload size={16} />
                  DOWNLOAD FILE
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- Delete Confirmation Modal --- */}
      {fileToDelete && (
        <div
          className="fixed inset-0 z-[60] bg-neutral-950/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setFileToDelete(null)}
        >
          <div
            className="bg-neutral-900 border border-neutral-800 rounded-3xl p-8 w-full max-w-sm sm:max-w-md shadow-2xl flex flex-col gap-6 transform transition-all scale-100"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col items-center text-center gap-4">
              <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center text-red-500">
                <FaExclamationTriangle size={28} />
              </div>
              <div>
                <h3 className="text-xl font-medium text-white mb-2">
                  Delete File?
                </h3>
                <p className="text-neutral-400 text-sm leading-relaxed">
                  Are you sure you want to permanently delete{" "}
                  <span className="text-neutral-200 font-medium break-all">
                    &quot;{getFileName(fileToDelete)}&quot;
                  </span>
                  ? This action cannot be undone.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-3 mt-2 w-full">
              <button
                onClick={() => setFileToDelete(null)}
                className="w-full sm:w-auto px-6 py-3 rounded-xl text-neutral-300 font-medium bg-neutral-800 hover:bg-neutral-700 cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white cursor-pointer font-medium transition-colors flex items-center justify-center gap-2 shadow-lg shadow-red-900/20"
              >
                <FaTrash size={14} />
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
