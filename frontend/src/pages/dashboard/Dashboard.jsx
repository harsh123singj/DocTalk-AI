import React, { useEffect, useState } from "react";
import {
  FileText,
  BriefcaseBusiness,
  MessageSquare,
  Upload,
  Sparkles,
  ArrowRight,
  Clock3,
  LoaderCircle,
  AlertCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  const [workspaces, setWorkspaces] = useState([]);
  const [documents, setDocuments] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================
  // FETCH DASHBOARD DATA
  // ==========================================

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      // ----------------------------------------
      // Fetch workspaces
      // ----------------------------------------

      const workspaceResponse = await fetch(
        "http://localhost:5000/api/workspaces",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const workspaceData = await workspaceResponse.json();

      if (!workspaceResponse.ok) {
        throw new Error(
          workspaceData.message || "Failed to fetch workspaces"
        );
      }

      const workspaceList = workspaceData.data || [];

      setWorkspaces(workspaceList);

      // ----------------------------------------
      // Fetch documents from all workspaces
      // ----------------------------------------

      let allDocuments = [];

      for (const workspace of workspaceList) {
        try {
          const response = await fetch(
            `http://localhost:5000/api/docs/${workspace._id}`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          const data = await response.json();

          if (response.ok && Array.isArray(data.data)) {
            allDocuments.push(
              ...data.data.map((document) => ({
                ...document,
                workspaceId: workspace._id,
              }))
            );
          }
        } catch (error) {
          console.error(
            `Failed to fetch documents for workspace ${workspace._id}`,
            error
          );
        }
      }

      // Newest documents first
      allDocuments.sort(
        (a, b) =>
          new Date(b.createdAt || 0) -
          new Date(a.createdAt || 0)
      );

      setDocuments(allDocuments);
    } catch (error) {
      console.error("DASHBOARD ERROR:", error);

      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // ==========================================
  // HELPERS
  // ==========================================

  const formatSize = (bytes) => {
    if (!bytes) return "0 KB";

    const mb = bytes / (1024 * 1024);

    if (mb >= 1) {
      return `${mb.toFixed(1)} MB`;
    }

    return `${Math.max(
      1,
      Math.round(bytes / 1024)
    )} KB`;
  };

  const formatDate = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const recentDocuments = documents.slice(0, 5);

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="min-h-full bg-[#0b0e13] text-white flex items-center justify-center">
        <div className="flex items-center gap-3 text-sm text-white/40">
          <LoaderCircle
            size={20}
            className="animate-spin"
          />
          Loading dashboard...
        </div>
      </div>
    );
  }

  // ==========================================
  // DASHBOARD
  // ==========================================

  return (
    <div className="min-h-full bg-[#0b0e13] text-white p-4 sm:p-6 lg:p-8">

      {/* ========================================
          HEADER
      ======================================== */}

      <div className="mb-8">

        <h1 className="text-2xl sm:text-3xl font-semibold">
          Dashboard
        </h1>

        <p className="mt-2 text-sm sm:text-base text-white/40">
          Manage your documents and chat with your
          knowledge using DocTalk AI.
        </p>

      </div>

      {/* ========================================
          ERROR
      ======================================== */}

      {error && (
        <div className="mb-6 flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      {/* ========================================
          STATISTICS
      ======================================== */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">

        {/* Documents */}

        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 hover:bg-white/[0.04] transition-colors">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm text-white/40">
                Documents
              </p>

              <h2 className="mt-2 text-3xl font-semibold">
                {documents.length}
              </h2>

            </div>

            <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-purple-500/10 text-purple-400">
              <FileText size={21} />
            </div>

          </div>

          <p className="mt-4 text-xs text-white/30">
            Documents across your workspaces
          </p>

        </div>

        {/* Workspaces */}

        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 hover:bg-white/[0.04] transition-colors">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm text-white/40">
                Workspaces
              </p>

              <h2 className="mt-2 text-3xl font-semibold">
                {workspaces.length}
              </h2>

            </div>

            <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-purple-500/10 text-purple-400">
              <BriefcaseBusiness size={21} />
            </div>

          </div>

          <p className="mt-4 text-xs text-white/30">
            Your available workspaces
          </p>

        </div>

        {/* AI Questions */}

        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 hover:bg-white/[0.04] transition-colors sm:col-span-2 lg:col-span-1">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm text-white/40">
                AI Questions
              </p>

              <h2 className="mt-2 text-3xl font-semibold">
                —
              </h2>

            </div>

            <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-purple-500/10 text-purple-400">
              <MessageSquare size={21} />
            </div>

          </div>

          <p className="mt-4 text-xs text-white/30">
            Chat analytics coming soon
          </p>

        </div>

      </div>

      {/* ========================================
          MAIN GRID
      ======================================== */}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* ======================================
            RECENT DOCUMENTS
        ====================================== */}

        <div className="xl:col-span-2 rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden">

          {/* Header */}

          <div className="flex items-center justify-between p-5 border-b border-white/10">

            <div>

              <h2 className="text-base font-medium">
                Recent Documents
              </h2>

              <p className="mt-1 text-xs text-white/35">
                Your recently added documents
              </p>

            </div>

            <button
              onClick={() => navigate("/workspaces")}
              className="flex items-center gap-1 text-xs text-purple-400 hover:text-purple-300 transition-colors"
            >
              View all
              <ArrowRight size={14} />
            </button>

          </div>

          {/* Documents */}

          <div className="divide-y divide-white/5">

            {recentDocuments.length === 0 ? (

              <div className="flex flex-col items-center justify-center py-16 text-center">

                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400">
                  <FileText size={21} />
                </div>

                <p className="mt-4 text-sm font-medium">
                  No documents yet
                </p>

                <p className="mt-1 text-xs text-white/30">
                  Upload a document to get started.
                </p>

              </div>

            ) : (

              recentDocuments.map((document) => (

                <button
                  key={document._id}
                  onClick={() =>
                    navigate(
                      `/AIassistant?documentId=${document._id}`
                    )
                  }
                  className="w-full flex items-center gap-4 p-4 sm:p-5 text-left hover:bg-white/[0.03] transition-colors"
                >

                  {/* Icon */}

                  <div className="flex items-center justify-center w-10 h-10 shrink-0 rounded-xl bg-purple-500/10 text-purple-400">
                    <FileText size={19} />
                  </div>

                  {/* Info */}

                  <div className="min-w-0 flex-1">

                    <p className="text-sm font-medium truncate">
                      {document.name}
                    </p>

                    <p className="mt-1 text-xs text-white/35">
                      {document.fileType ===
                      "application/pdf"
                        ? "PDF"
                        : document.fileType}{" "}
                      •{" "}
                      {formatSize(document.fileSize)}
                    </p>

                  </div>

                  {/* Date */}

                  <div className="hidden sm:flex items-center gap-1.5 text-xs text-white/30">
                    <Clock3 size={13} />
                    {formatDate(document.createdAt)}
                  </div>

                </button>

              ))

            )}

          </div>

        </div>

        {/* ======================================
            QUICK ACTIONS
        ====================================== */}

        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">

          <div className="mb-5">

            <h2 className="text-base font-medium">
              Quick Actions
            </h2>

            <p className="mt-1 text-xs text-white/35">
              Get started with DocTalk AI
            </p>

          </div>

          <div className="space-y-3">

            {/* Upload */}

            <button
              onClick={() => navigate("/workspaces")}
              className="w-full flex items-center gap-3 p-4 rounded-xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] transition-colors text-left"
            >

              <div className="flex items-center justify-center w-10 h-10 shrink-0 rounded-lg bg-purple-500/10 text-purple-400">
                <Upload size={19} />
              </div>

              <div className="min-w-0 flex-1">

                <p className="text-sm font-medium">
                  Upload Document
                </p>

                <p className="mt-1 text-xs text-white/35">
                  Go to a workspace and upload a PDF
                </p>

              </div>

              <ArrowRight
                size={16}
                className="text-white/25"
              />

            </button>

            {/* Ask AI */}

            <button
              onClick={() => {
                if (recentDocuments.length > 0) {
                  navigate(
                    `/AIassistant?documentId=${recentDocuments[0]._id}`
                  );
                } else {
                  navigate("/workspaces");
                }
              }}
              className="w-full flex items-center gap-3 p-4 rounded-xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] transition-colors text-left"
            >

              <div className="flex items-center justify-center w-10 h-10 shrink-0 rounded-lg bg-purple-500/10 text-purple-400">
                <Sparkles size={19} />
              </div>

              <div className="min-w-0 flex-1">

                <p className="text-sm font-medium">
                  Ask AI
                </p>

                <p className="mt-1 text-xs text-white/35">
                  Chat with your documents
                </p>

              </div>

              <ArrowRight
                size={16}
                className="text-white/25"
              />

            </button>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Dashboard;