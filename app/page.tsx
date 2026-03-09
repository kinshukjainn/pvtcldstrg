// components/DriveManager.tsx
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
} from "react-icons/fa";
import {
  getUploadUrl,
  listPhotos,
  deletePhoto,
  getDownloadUrl,
} from "@/actions/drive";

type DriveFile = {
  key: string;
  url: string;
};

export default function DriveManager() {
  const [files, setFiles] = useState<DriveFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [selectedFile, setSelectedFile] = useState<DriveFile | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    setIsLoading(true);
    try {
      const data = await listPhotos();
      setFiles(data);
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
        const { url } = await getUploadUrl(file.name, file.type);
        return fetch(url, {
          method: "PUT",
          body: file,
          headers: { "Content-Type": file.type },
        });
      });

      await Promise.all(uploadPromises);
      await fetchFiles();
    } catch (error) {
      console.error("Upload failed", error);
      alert("Failed to upload one or more files.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDelete = async (e: React.MouseEvent, key: string) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this file?")) return;

    setFiles((prev) => prev.filter((p) => p.key !== key));
    if (selectedFile?.key === key) setSelectedFile(null);
    try {
      await deletePhoto(key);
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

  return (
    <div className="w-full min-h-screen bg-neutral-900 text-neutral-100  text-base md:text-lg  flex flex-col">
      {/* --- Top Control Panel --- */}
      <div className="bg-neutral-800 border-b border-neutral-800 p-3 md:p-4 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        {/* Title & Info */}
        <div className="flex items-center gap-3 font-bold text-neutral-100 text-lg md:text-xl">
          <span>Storage Manager</span>
          <span className="text-sm md:text-base  bg-neutral-700 rounded-full  px-2 py-1">
            No of files: {files.length}
          </span>
        </div>

        {/* Toolbar Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
          {/* Search */}
          <div className="flex items-center border-2 border-[#444444] rounded-full bg-[#313131] px-3 py-2 flex-1 sm:flex-none">
            <FaSearch className="text-neutral-500 mr-3" size={18} />
            <input
              type="text"
              placeholder="Filter files..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-48 md:w-64 outline-none text-base bg-transparent"
            />
          </div>

          <div className="flex gap-3  w-full sm:w-auto">
            {/* View Toggles */}
            <div className="flex border border-neutral-700 rounded-2xl bg-neutral-800 overflow-hidden">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-3 flex-1 sm:flex-none flex justify-center items-center border-r border-neutral-700 transition-colors ${
                  viewMode === "grid"
                    ? "bg-neutral-700 text-white"
                    : "text-neutral-300 hover:bg-neutral-700"
                }`}
                title="Grid View"
              >
                <FaThLarge size={18} />
              </button>

              <button
                onClick={() => setViewMode("list")}
                className={`p-3 flex-1 sm:flex-none flex justify-center items-center transition-colors ${
                  viewMode === "list"
                    ? "bg-neutral-700 text-white"
                    : "text-neutral-300 hover:bg-neutral-700"
                }`}
                title="List View"
              >
                <FaListUl size={18} />
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
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 text-white  bg-blue-700 rounded-full hover:bg-blue-600  px-2 py-1 md:py-1 text-md  md:text-base font-semibold disabled:opacity-50 uppercase tracking-wide cursor-pointer"
            >
              {isUploading ? (
                <FaSpinner className="animate-spin" size={18} />
              ) : (
                <FaCloudUploadAlt size={20} />
              )}
              {isUploading ? "UPLOADING..." : "UPLOAD"}
            </button>
          </div>
        </div>
      </div>

      {/* --- Main Content Area --- */}
      <div className="flex-1 p-3 md:p-6 overflow-auto">
        {isLoading ? (
          <div className="flex items-center gap-3 p-6 text-neutral-600  text-lg">
            <FaSpinner className="animate-spin" size={24} /> LOADING REPOSITORY
            DATA...
          </div>
        ) : filteredFiles.length === 0 ? (
          <div className="p-6 text-neutral-500  text-lg">
            [ NO FILES FOUND ]
          </div>
        ) : (
          <>
            {viewMode === "list" ? (
              /* --- Data Table View --- */
              <div className="overflow-x-auto border-2 border-[#444444] bg-[#313131] rounded-lg">
                <table className="w-full  border-collapse text-left whitespace-nowrap">
                  <thead className="bg-[#181818] border-b border-[#444444]  text-neutral-100 font-semibold text-sm md:text-base">
                    <tr>
                      <th className="border-r border-[#444444] p-2 md:p-2 w-12 text-center">
                        Type
                      </th>
                      <th className="border-r border-[#444444] p-2 md:p-2">
                        Filename
                      </th>
                      <th className="border-r border-[#444444] p-2 md:p-2 w-24 text-center">
                        Extension
                      </th>
                      <th className="p-2 md:p-2 w-32 md:w-48 text-center">
                        ACTIONS
                      </th>
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
                          className="border-b border-[#444444] hover:bg-[#252525] cursor-pointer transition-colors"
                          onClick={() => setSelectedFile(file)}
                        >
                          <td className="border-r border-[#444444] p-2 md:p-2 text-green-500 text-center flex justify-center items-center h-full">
                            {getFileIcon(fileType, "text-xl md:text-2xl")}
                          </td>
                          <td className="border-r border-[#444444] p-2 md:p-2  text-sm md:text-base text-neutral-100 truncate max-w-[200px] md:max-w-md lg:max-w-xl">
                            {fileName}
                          </td>
                          <td className="border-r border-[#444444] p-2 md:p-2 text-center  text-sm md:text-sm text-neutral-100 bg-[#313131]">
                            {ext}
                          </td>
                          <td
                            className="p-2 md:p-2 flex items-center justify-center gap-2"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button
                              onClick={(e) => handleDownload(e, file.key)}
                              className="flex items-center gap-1 bg-neutral-900 p-2 md:p-2 rounded-xl cursor-pointer font-semibold text-sm md:text-sm text-neutral-100"
                              title="Download"
                            >
                              <FaDownload size={16} />{" "}
                              <span className="hidden md:inline"></span>
                            </button>
                            <button
                              onClick={(e) => handleDelete(e, file.key)}
                              className="flex items-center gap-1 bg-red-600  hover:bg-red-500 p-2 md:p-2 font-semibold text-xs md:text-sm cursor-pointer text-white rounded-xl"
                              title="Delete"
                            >
                              <FaTrash size={16} />{" "}
                              <span className="hidden md:inline"></span>
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
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {filteredFiles.map((file) => {
                  const fileName = getFileName(file.key);
                  const fileType = getFileType(fileName);
                  const ext = getFileExtension(fileName);

                  return (
                    <div
                      key={file.key}
                      onClick={() => setSelectedFile(file)}
                      className="bg-[#202020] border border-[#444444] rounded-3xl cursor-pointer flex flex-col group transition-all"
                    >
                      <div className="h-32 sm:h-40 md:h-48 bg-[#313131] border-b border-[#444444] rounded-3xl flex flex-col items-center justify-center relative overflow-hidden">
                        {fileType === "image" ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={file.url}
                            alt={fileName}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        ) : fileType === "video" ? (
                          <>
                            <video
                              src={file.url}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-[#000000]/50 flex items-center justify-center">
                              <FaPlay
                                className="text-white drop-shadow-md"
                                size={32}
                              />
                            </div>
                          </>
                        ) : (
                          getFileIcon(
                            fileType,
                            "text-5xl md:text-6xl text-neutral-400",
                          )
                        )}
                      </div>

                      <div className="p-3 flex flex-col justify-between flex-1">
                        <span
                          className="text-sm md:text-base  truncate text-neutral-100 mb-2"
                          title={fileName}
                        >
                          {fileName}
                        </span>

                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mt-auto">
                          <span className="text-xs   px-2 py-1 font-bold text-green-500">
                            {ext}
                          </span>
                          <div className="flex gap-2 w-full sm:w-auto">
                            <button
                              onClick={(e) => handleDownload(e, file.key)}
                              className="flex-1 flex justify-center bg-blue-500 rounded-full cursor-pointer hover:bg-blue-600 border border-blue-600 p-2 text-white"
                              title="Download"
                            >
                              <FaDownload size={16} />
                            </button>
                            <button
                              onClick={(e) => handleDelete(e, file.key)}
                              className="flex-1 flex justify-center cursor-pointer bg-red-500 rounded-full hover:bg-red-600 border border-red-600 p-2 text-white"
                              title="Delete"
                            >
                              <FaTrash size={16} />
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
          className="fixed inset-0 z-50 bg-neutral-900/20 backdrop-blur-xs flex flex-col"
          onClick={() => setSelectedFile(null)}
        >
          {/* Overlay Toolbar */}
          <div
            className="bg-black/20 border-b border-neutral-600 mt-2 mr-2 ml-2   rounded-full  p-2 md:p-2 flex flex-col md:flex-row justify-between items-center text-neutral-200 gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className=" text-md md:text-lg lg:text-xl truncate  w-full md:w-auto text-center md:text-left">
              {getFileName(selectedFile.key)}
            </div>
            <div className="flex flex-wrap justify-center gap-3 w-full md:w-auto">
              <button
                onClick={(e) => handleDownload(e, selectedFile.key)}
                className="flex items-center gap-2 bg-neutral-700/20 backdrop-blur-xs border border-[#444444]/20 rounded-full cursor-pointer  px-4 py-2 text-sm md:text-base font-bold"
              >
                <FaDownload size={18} />
              </button>
              <button
                onClick={(e) => handleDelete(e, selectedFile.key)}
                className="flex items-center gap-2 bg-red-900/20 backdrop-blur-xs border border-[#444444]/20 rounded-full cursor-pointer  px-4 py-2 text-sm md:text-base font-bold text-red-100"
              >
                <FaTrash size={18} />
              </button>
              <button
                onClick={() => setSelectedFile(null)}
                className="flex items-center gap-2 bg-neutral-700/20 backdrop-blur-xs border border-[#444444]/20 rounded-full cursor-pointer  px-4 py-2 text-sm md:text-base font-bold"
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
                className="max-w-full max-h-full object-contain border border-neutral-600 bg-black shadow-2xl"
              />
            )}

            {getFileType(getFileName(selectedFile.key)) === "video" && (
              <video
                src={selectedFile.url}
                controls
                autoPlay
                className="max-w-full max-h-full object-contain border border-neutral-600 bg-black shadow-2xl w-full"
              />
            )}

            {getFileType(getFileName(selectedFile.key)) === "pdf" && (
              <iframe
                src={selectedFile.url}
                className="w-full h-full max-w-6xl border border-neutral-600 bg-white shadow-2xl"
              />
            )}

            {/* Check against explicitly supported preview types */}
            {!["image", "video", "pdf"].includes(
              getFileType(getFileName(selectedFile.key)),
            ) && (
              <div className="bg-neutral-200 border border-neutral-400 p-10 md:p-16 text-center flex flex-col items-center max-w-lg w-full">
                <FaFileAlt className="text-7xl md:text-8xl text-neutral-500 mb-6" />
                <h3 className="font-bold text-neutral-900 text-xl md:text-2xl mb-3">
                  NO PREVIEW AVAILABLE
                </h3>
                <p className="text-base md:text-lg text-neutral-700 mb-8">
                  This file format cannot be previewed in the current
                  environment.
                </p>
                <button
                  onClick={(e) => handleDownload(e, selectedFile.key)}
                  className="bg-neutral-800 text-white border border-neutral-900 hover:bg-neutral-700 px-6 py-4 font-bold text-sm md:text-base w-full tracking-wider"
                >
                  DOWNLOAD FILE
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
