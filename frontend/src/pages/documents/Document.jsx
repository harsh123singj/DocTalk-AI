import React, { useEffect, useRef, useState } from "react";
import {
  Search,
  Upload,
  FileText,
  MoreVertical,
  Clock3,
  CheckCircle2,
  LoaderCircle,
  Trash2,
  MessageSquare,
  FileSearch,
  ArrowLeft,
  X,
  RefreshCw,
} from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";

const Document = () => {
  const { workspaceId } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // ==========================================
  // DOCUMENT STATES
  // ==========================================

  const [documents, setDocuments] = useState([]);
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const [error, setError] = useState("");
  const [menuOpen, setMenuOpen] = useState(null);

  // ==========================================
  // FILTER STATE
  // ==========================================

  const [filter, setFilter] = useState("all");

  // ==========================================
  // SUMMARY STATES
  // ==========================================

  const [summarizing, setSummarizing] = useState(false);
  const [summary, setSummary] = useState("");
  const [summaryDocumentName, setSummaryDocumentName] =
    useState("");
  const [showSummary, setShowSummary] = useState(false);

  // ==========================================
  // GET TOKEN
  // ==========================================

  const getToken = () => {
    return localStorage.getItem("token");
  };

  // ==========================================
  // FETCH DOCUMENTS
  // ==========================================

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      setError("");

      const token = getToken();

      if (!token) {
        throw new Error("Authentication token not found.");
      }

      const response = await fetch(
        `http://localhost:5000/api/docs/${workspaceId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch documents"
        );
      }

      setDocuments(data.data || []);
    } catch (error) {
      console.error("FETCH DOCUMENTS ERROR:", error);

      setError(
        error.message || "Failed to fetch documents"
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // INITIAL LOAD
  // ==========================================

  useEffect(() => {
    if (workspaceId) {
      fetchDocuments();
    }
  }, [workspaceId]);

  // ==========================================
  // UPLOAD BUTTON
  // ==========================================

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  // ==========================================
  // FILE UPLOAD
  // ==========================================

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    // Only PDF
    if (file.type !== "application/pdf") {
      setError("Only PDF files are allowed.");
      event.target.value = "";
      return;
    }

    try {
      setUploading(true);
      setError("");

      const token = getToken();

      if (!token) {
        throw new Error("Authentication token not found.");
      }

      const formData = new FormData();

      formData.append("document", file);

      const response = await fetch(
        `http://localhost:5000/api/docs/${workspaceId}/upload-file`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Document upload failed"
        );
      }

      // Refresh document list
      await fetchDocuments();

      setError("");
    } catch (error) {
      console.error("UPLOAD ERROR:", error);

      setError(
        error.message || "Document upload failed"
      );
    } finally {
      setUploading(false);

      // Reset file input
      event.target.value = "";
    }
  };

  // ==========================================
  // DELETE DOCUMENT
  // ==========================================

  const handleDelete = async (documentId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this document?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      const token = getToken();

      if (!token) {
        throw new Error("Authentication token not found.");
      }

      const response = await fetch(
        `http://localhost:5000/api/docs/delete/${documentId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to delete document"
        );
      }

      // Remove from UI immediately
      setDocuments((prev) =>
        prev.filter(
          (document) => document._id !== documentId
        )
      );

      setMenuOpen(null);
    } catch (error) {
      console.error("DELETE ERROR:", error);

      setError(
        error.message || "Failed to delete document"
      );
    }
  };

  // ==========================================
  // CHAT WITH DOCUMENT
  // ==========================================

  const handleChat = (documentId) => {
    setMenuOpen(null);

    navigate(
      `/AIassistant?documentId=${documentId}`
    );
  };

  // ==========================================
  // SUMMARIZE DOCUMENT
  // ==========================================

  const handleSummarize = async (
    documentId,
    documentName
  ) => {
    try {
      setSummarizing(true);
      setError("");
      setMenuOpen(null);

      const token = getToken();

      if (!token) {
        throw new Error(
          "Authentication token not found."
        );
      }

      const response = await fetch(
        `http://localhost:5000/api/docs/${documentId}/summarize`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to summarize document"
        );
      }

      setSummary(
        data.data?.summary ||
          "No summary generated."
      );

      setSummaryDocumentName(documentName);

      setShowSummary(true);
    } catch (error) {
      console.error("SUMMARY ERROR:", error);

      setError(
        error.message ||
          "Failed to summarize document"
      );
    } finally {
      setSummarizing(false);
    }
  };

  // ==========================================
  // SEARCH + FILTER
  // ==========================================

  const filteredDocuments = documents.filter(
    (document) => {
      const matchesSearch =
        document.name
          ?.toLowerCase()
          .includes(search.toLowerCase());

      if (!matchesSearch) {
        return false;
      }

      if (filter === "pdf") {
        return (
          document.fileType ===
          "application/pdf"
        );
      }

      if (filter === "recent") {
        const documentDate = new Date(
          document.createdAt
        );

        const sevenDaysAgo = new Date();

        sevenDaysAgo.setDate(
          sevenDaysAgo.getDate() - 7
        );

        return documentDate >= sevenDaysAgo;
      }

      return true;
    }
  );

  // ==========================================
  // FORMAT FILE SIZE
  // ==========================================

  const formatSize = (bytes) => {
    if (!bytes) {
      return "0 KB";
    }

    const mb = bytes / (1024 * 1024);

    if (mb >= 1) {
      return `${mb.toFixed(1)} MB`;
    }

    return `${Math.max(
      1,
      Math.round(bytes / 1024)
    )} KB`;
  };

  // ==========================================
  // FORMAT DATE
  // ==========================================

  const formatDate = (date) => {
    if (!date) {
      return "";
    }

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    );
  };

  // ==========================================
  // CLOSE MENU WHEN CLICKING OUTSIDE
  // ==========================================

  useEffect(() => {
    const handleClickOutside = () => {
      setMenuOpen(null);
    };

    if (menuOpen) {
      document.addEventListener(
        "click",
        handleClickOutside
      );
    }

    return () => {
      document.removeEventListener(
        "click",
        handleClickOutside
      );
    };
  }, [menuOpen]);

  // ==========================================
  // NO WORKSPACE
  // ==========================================

  if (!workspaceId) {
    return (
      <div className="min-h-full bg-[#0b0e13] text-white p-4 sm:p-6 lg:p-8">

        <div className="flex flex-col items-center justify-center min-h-[70vh] text-center">

          <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-purple-500/10 text-purple-400">
            <FileText size={26} />
          </div>

          <h2 className="mt-5 text-lg font-medium">
            No workspace selected
          </h2>

          <p className="mt-2 text-sm text-white/35 max-w-sm">
            Select a workspace to view its
            documents.
          </p>

          <button
            onClick={() =>
              navigate("/workspaces")
            }
            className="mt-5 px-4 py-2.5 rounded-xl bg-[#7C3AED] hover:bg-[#9465e6] text-sm font-medium transition-colors"
          >
            Go to Workspaces
          </button>

        </div>

      </div>
    );
  }

  // ==========================================
  // MAIN UI
  // ==========================================

  return (
    <div
      className="min-h-full bg-[#0b0e13] text-white p-4 sm:p-6 lg:p-8"
      onClick={() => setMenuOpen(null)}
    >

      {/* ======================================
          HEADER
      ======================================= */}

      <div className="flex items-center gap-3 mb-7">

        <button
          onClick={(event) => {
            event.stopPropagation();
            navigate("/workspaces");
          }}
          className="flex items-center justify-center w-9 h-9 rounded-lg border border-white/10 bg-white/[0.02] text-white/40 hover:text-white hover:bg-white/[0.05] transition-colors"
        >
          <ArrowLeft size={17} />
        </button>

        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold">
            Documents
          </h1>

          <p className="mt-1 text-sm text-white/40">
            Manage, organize and chat with your
            uploaded documents.
          </p>
        </div>

      </div>

      {/* ======================================
          SEARCH + UPLOAD
      ======================================= */}

      <div className="flex flex-col sm:flex-row gap-3 mb-6">

        {/* SEARCH */}

        <div
          className="flex items-center flex-1 h-11 px-3 gap-2 rounded-xl border border-white/10 bg-white/[0.02] focus-within:border-purple-500/40 transition-colors"
          onClick={(event) =>
            event.stopPropagation()
          }
        >

          <Search
            size={18}
            className="shrink-0 text-white/35"
          />

          <input
            type="text"
            placeholder="Search documents..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="w-full min-w-0 bg-transparent outline-none text-sm text-white placeholder:text-white/30"
          />

        </div>

        {/* HIDDEN FILE INPUT */}

        <input
          ref={fileInputRef}
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          className="hidden"
        />

        {/* UPLOAD BUTTON */}

        <button
          onClick={(event) => {
            event.stopPropagation();
            handleUploadClick();
          }}
          disabled={uploading}
          className="w-full sm:w-auto h-11 px-5 rounded-xl bg-[#7C3AED] hover:bg-[#9465e6] active:bg-[#6D28D9] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm font-medium transition-colors"
        >

          {uploading ? (
            <>
              <LoaderCircle
                size={18}
                className="animate-spin"
              />

              Uploading...
            </>
          ) : (
            <>
              <Upload size={18} />

              Upload Document
            </>
          )}

        </button>

      </div>

      {/* ======================================
          ERROR
      ======================================= */}

      {error && (
        <div className="mb-5 flex items-center justify-between gap-3 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">

          <span>{error}</span>

          <button
            onClick={() => setError("")}
            className="text-red-400/60 hover:text-red-400"
          >
            <X size={16} />
          </button>

        </div>
      )}

      {/* ======================================
          DOCUMENT CONTAINER
      ======================================= */}

      <div className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden">

        {/* ====================================
            DOCUMENT HEADER
        ===================================== */}

        <div className="p-4 sm:p-5 border-b border-white/10">

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

            <div>

              <div className="flex items-center gap-3">

                <h2 className="text-base font-medium">
                  All Documents
                </h2>

                <span className="px-2 py-0.5 rounded-md bg-white/[0.05] text-xs text-white/40">
                  {filteredDocuments.length}
                </span>

              </div>

              <p className="mt-1 text-xs text-white/35">
                Your uploaded documents
              </p>

            </div>

            {/* FILTERS */}

            <div
              className="flex items-center gap-1 p-1 rounded-lg bg-white/[0.03] border border-white/5 w-fit"
              onClick={(event) =>
                event.stopPropagation()
              }
            >

              <button
                onClick={() =>
                  setFilter("all")
                }
                className={`px-3 py-1.5 rounded-md text-xs transition-colors ${
                  filter === "all"
                    ? "bg-purple-500/15 text-purple-300"
                    : "text-white/40 hover:text-white hover:bg-white/[0.05]"
                }`}
              >
                All
              </button>

              <button
                onClick={() =>
                  setFilter("pdf")
                }
                className={`px-3 py-1.5 rounded-md text-xs transition-colors ${
                  filter === "pdf"
                    ? "bg-purple-500/15 text-purple-300"
                    : "text-white/40 hover:text-white hover:bg-white/[0.05]"
                }`}
              >
                PDF
              </button>

              <button
                onClick={() =>
                  setFilter("recent")
                }
                className={`px-3 py-1.5 rounded-md text-xs transition-colors ${
                  filter === "recent"
                    ? "bg-purple-500/15 text-purple-300"
                    : "text-white/40 hover:text-white hover:bg-white/[0.05]"
                }`}
              >
                Recent
              </button>

            </div>

          </div>

        </div>

        {/* ====================================
            DOCUMENT LIST
        ===================================== */}

        <div className="divide-y divide-white/5">

          {/* LOADING */}

          {loading ? (

            <div className="flex flex-col items-center justify-center py-20 text-white/40">

              <LoaderCircle
                size={24}
                className="animate-spin mb-3"
              />

              <span className="text-sm">
                Loading documents...
              </span>

            </div>

          ) : filteredDocuments.length === 0 ? (

            /* EMPTY */

            <div className="flex flex-col items-center justify-center py-20 text-center">

              <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-purple-500/10 text-purple-400">
                <FileText size={25} />
              </div>

              <h3 className="mt-4 text-sm font-medium">
                {search
                  ? "No documents found"
                  : "No documents yet"}
              </h3>

              <p className="mt-1 text-xs text-white/35 max-w-sm">
                {search
                  ? "Try searching with a different document name."
                  : "Upload a PDF to start chatting with your document."}
              </p>

              {!search && (
                <button
                  onClick={handleUploadClick}
                  className="mt-4 flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-500/10 text-purple-300 hover:bg-purple-500/20 text-xs transition-colors"
                >
                  <Upload size={14} />
                  Upload PDF
                </button>
              )}

            </div>

          ) : (

            /* DOCUMENTS */

            filteredDocuments.map(
              (document) => (

                <div
                  key={document._id}
                  className="flex items-center gap-3 sm:gap-4 p-4 sm:p-5 hover:bg-white/[0.025] transition-colors"
                >

                  {/* FILE ICON */}

                  <div className="flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 shrink-0 rounded-xl bg-purple-500/10 text-purple-400">
                    <FileText size={20} />
                  </div>

                  {/* DOCUMENT INFO */}

                  <div className="min-w-0 flex-1">

                    <h3 className="text-sm font-medium truncate">
                      {document.name}
                    </h3>

                    <div className="flex items-center gap-2 mt-1 text-xs text-white/35">

                      <span>
                        {document.fileType ===
                        "application/pdf"
                          ? "PDF"
                          : document.fileType}
                      </span>

                      <span>•</span>

                      <span>
                        {formatSize(
                          document.fileSize
                        )}
                      </span>

                      <span className="hidden sm:inline">
                        •
                      </span>

                      <span className="hidden sm:flex items-center gap-1">
                        <Clock3 size={12} />
                        {formatDate(
                          document.createdAt
                        )}
                      </span>

                    </div>

                  </div>

                  {/* STATUS */}

                  <div
                    className={`hidden md:flex items-center gap-1.5 text-xs ${
                      document.status ===
                      "completed"
                        ? "text-emerald-400/80"
                        : document.status ===
                          "processing"
                        ? "text-amber-400/80"
                        : "text-red-400/80"
                    }`}
                  >

                    {document.status ===
                    "completed" ? (
                      <>
                        <CheckCircle2
                          size={15}
                        />

                        Ready
                      </>
                    ) : document.status ===
                      "processing" ? (
                      <>
                        <LoaderCircle
                          size={15}
                          className="animate-spin"
                        />

                        Processing
                      </>
                    ) : (
                      <>
                        <span>●</span>

                        Failed
                      </>
                    )}

                  </div>

                  {/* MENU */}

                  <div
                    className="relative"
                    onClick={(event) =>
                      event.stopPropagation()
                    }
                  >

                    <button
                      onClick={() =>
                        setMenuOpen(
                          menuOpen ===
                            document._id
                            ? null
                            : document._id
                        )
                      }
                      className="flex items-center justify-center w-8 h-8 shrink-0 rounded-lg text-white/30 hover:text-white hover:bg-white/[0.05] transition-colors"
                    >
                      <MoreVertical
                        size={18}
                      />
                    </button>

                    {menuOpen ===
                      document._id && (

                      <div className="absolute right-0 top-9 z-30 w-44 rounded-xl border border-white/10 bg-[#151820] shadow-xl overflow-hidden">

                        {/* CHAT */}

                        <button
                          onClick={() =>
                            handleChat(
                              document._id
                            )
                          }
                          className="w-full flex items-center gap-2 px-3 py-2.5 text-xs text-white/70 hover:bg-white/[0.05] hover:text-white"
                        >

                          <MessageSquare
                            size={14}
                          />

                          Chat
                        </button>

                        {/* SUMMARIZE */}

                        <button
                          onClick={() =>
                            handleSummarize(
                              document._id,
                              document.name
                            )
                          }
                          disabled={
                            summarizing ||
                            document.status !==
                              "completed"
                          }
                          className="w-full flex items-center gap-2 px-3 py-2.5 text-xs text-white/70 hover:bg-white/[0.05] hover:text-white disabled:opacity-40 disabled:cursor-not-allowed"
                        >

                          {summarizing ? (
                            <LoaderCircle
                              size={14}
                              className="animate-spin"
                            />
                          ) : (
                            <FileSearch
                              size={14}
                            />
                          )}

                          {summarizing
                            ? "Summarizing..."
                            : "Summarize"}

                        </button>

                        {/* DELETE */}

                        <button
                          onClick={() =>
                            handleDelete(
                              document._id
                            )
                          }
                          className="w-full flex items-center gap-2 px-3 py-2.5 text-xs text-red-400 hover:bg-red-500/10"
                        >

                          <Trash2
                            size={14}
                          />

                          Delete
                        </button>

                      </div>

                    )}

                  </div>

                </div>

              )
            )

          )}

        </div>

      </div>

      {/* ======================================
          SUMMARY MODAL
      ======================================= */}

      {showSummary && (

        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={() =>
            setShowSummary(false)
          }
        >

          <div
            className="w-full max-w-3xl max-h-[85vh] flex flex-col rounded-2xl border border-white/10 bg-[#11141b] shadow-2xl"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            {/* MODAL HEADER */}

            <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">

              <div className="flex items-center gap-3 min-w-0">

                <div className="flex items-center justify-center w-9 h-9 shrink-0 rounded-xl bg-purple-500/10 text-purple-400">
                  <FileSearch
                    size={18}
                  />
                </div>

                <div className="min-w-0">

                  <h2 className="text-base font-semibold">
                    Document Summary
                  </h2>

                  <p className="text-xs text-white/35 mt-0.5 truncate max-w-[250px] sm:max-w-md">
                    {summaryDocumentName}
                  </p>

                </div>

              </div>

              <button
                onClick={() =>
                  setShowSummary(false)
                }
                className="flex items-center justify-center w-8 h-8 shrink-0 rounded-lg text-white/40 hover:text-white hover:bg-white/[0.05]"
              >
                <X size={18} />
              </button>

            </div>

            {/* SUMMARY CONTENT */}

            <div className="flex-1 overflow-y-auto px-5 py-5">

              <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5">

                <div className="flex items-center gap-2 mb-4 text-purple-400">

                  <FileText
                    size={17}
                  />

                  <span className="text-sm font-medium">
                    AI Generated Summary
                  </span>

                </div>

                <div className="text-sm leading-7 text-white/75 whitespace-pre-wrap">
                  {summary}
                </div>

              </div>

            </div>

            {/* MODAL FOOTER */}

            <div className="flex items-center justify-between px-5 py-4 border-t border-white/10">

              <p className="hidden sm:block text-[11px] text-white/25">
                Generated from your document
              </p>

              <button
                onClick={() =>
                  setShowSummary(false)
                }
                className="ml-auto px-4 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.08] text-sm text-white/70 hover:text-white transition-colors"
              >
                Close
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
};

export default Document;