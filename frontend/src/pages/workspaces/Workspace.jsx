import React, { useEffect, useState } from "react";
import {
  BriefcaseBusiness,
  FileText,
  Clock3,
  ArrowRight,
  MoreVertical,
  X,
  Plus,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Workspaces = () => {
  const navigate = useNavigate();

  const [workspaces, setWorkspaces] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  const [error, setError] = useState("");

  // ==========================================
  // API URL
  // ==========================================

  const API_URL = import.meta.env.VITE_API_URL;

  // ==========================================
  // FETCH WORKSPACES
  // ==========================================

  const fetchWorkspaces = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Authentication token not found.");
      }

      const response = await fetch(
        `${API_URL}/api/workspaces`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to fetch workspaces"
        );
      }

      setWorkspaces(result.data || []);
    } catch (error) {
      console.error(
        "FETCH WORKSPACES ERROR:",
        error
      );

      setError(
        error.message ||
          "Failed to fetch workspaces"
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // INITIAL LOAD
  // ==========================================

  useEffect(() => {
    fetchWorkspaces();
  }, []);

  // ==========================================
  // CREATE WORKSPACE
  // ==========================================

  const handleCreateWorkspace = async (e) => {
    e.preventDefault();

    if (!name.trim() || !description.trim()) {
      setError(
        "Please enter name and description"
      );
      return;
    }

    try {
      setCreating(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error(
          "Authentication token not found."
        );
      }

      const response = await fetch(
        `${API_URL}/api/workspaces`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: name.trim(),
            description: description.trim(),
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Failed to create workspace"
        );
      }

      setWorkspaces((prev) => [
        result.data,
        ...prev,
      ]);

      setName("");
      setDescription("");
      setShowModal(false);
    } catch (error) {
      console.error(
        "CREATE WORKSPACE ERROR:",
        error
      );

      setError(
        error.message ||
          "Failed to create workspace"
      );
    } finally {
      setCreating(false);
    }
  };

  // ==========================================
  // FORMAT DATE
  // ==========================================

  const formatDate = (date) => {
    if (!date) {
      return "";
    }

    const now = new Date();
    const created = new Date(date);

    const diff = Math.floor(
      (now - created) / 1000
    );

    if (diff < 60) {
      return "Just now";
    }

    const minutes = Math.floor(diff / 60);

    if (minutes < 60) {
      return `${minutes}m ago`;
    }

    const hours = Math.floor(minutes / 60);

    if (hours < 24) {
      return `${hours}h ago`;
    }

    const days = Math.floor(hours / 24);

    if (days < 7) {
      return `${days}d ago`;
    }

    return created.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // ==========================================
  // OPEN WORKSPACE
  // ==========================================

  const openWorkspace = (workspaceId) => {
    navigate(
      `/workspaces/${workspaceId}/documents`
    );
  };

  // ==========================================
  // MAIN UI
  // ==========================================

  return (
    <div className="min-h-full bg-[#0b0e13] text-white p-4 sm:p-6 lg:p-8">

      {/* ======================================
          HEADER
      ======================================= */}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">

        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold">
            Workspaces
          </h1>

          <p className="mt-2 text-sm text-white/40">
            Organize your documents into separate
            workspaces.
          </p>
        </div>

        <button
          onClick={() => {
            setError("");
            setShowModal(true);
          }}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#7C3AED] hover:bg-[#9465e6] active:bg-[#6D28D9] text-sm font-medium transition-colors"
        >
          <Plus size={18} />
          Create Workspace
        </button>

      </div>

      {/* ======================================
          ERROR
      ======================================= */}

      {error && (
        <div className="mb-5 px-4 py-3 rounded-xl border border-red-500/20 bg-red-500/10 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* ======================================
          LOADING
      ======================================= */}

      {loading ? (

        <div className="flex items-center justify-center py-20 text-sm text-white/40">
          Loading workspaces...
        </div>

      ) : workspaces.length === 0 ? (

        /* ====================================
           EMPTY STATE
        ===================================== */

        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-10 text-center">

          <BriefcaseBusiness
            size={35}
            className="mx-auto text-white/20"
          />

          <h2 className="mt-4 text-lg font-medium">
            No workspaces yet
          </h2>

          <p className="mt-2 text-sm text-white/35">
            Create your first workspace to organize
            your documents.
          </p>

          <button
            onClick={() => {
              setError("");
              setShowModal(true);
            }}
            className="mt-5 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#7C3AED] hover:bg-[#9465e6] text-sm font-medium transition-colors"
          >
            <Plus size={17} />
            Create Workspace
          </button>

        </div>

      ) : (

        /* ====================================
           WORKSPACE GRID
        ===================================== */

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">

          {workspaces.map((workspace) => (

            <div
              key={workspace._id}
              className="group rounded-2xl border border-white/10 bg-white/[0.02] p-5 hover:bg-white/[0.04] hover:border-white/15 transition-all"
            >

              {/* =================================
                  CARD HEADER
              ================================== */}

              <div className="flex items-start justify-between">

                <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-purple-500/10 text-purple-400">
                  <BriefcaseBusiness size={21} />
                </div>

                <button
                  className="flex items-center justify-center w-8 h-8 rounded-lg text-white/30 hover:text-white hover:bg-white/[0.05] transition-colors"
                >
                  <MoreVertical size={18} />
                </button>

              </div>

              {/* =================================
                  WORKSPACE INFO
              ================================== */}

              <div className="mt-5">

                <h2 className="text-base font-medium truncate">
                  {workspace.name}
                </h2>

                <p className="mt-1 text-sm text-white/35 line-clamp-2">
                  {workspace.description}
                </p>

              </div>

              {/* =================================
                  META INFORMATION
              ================================== */}

              <div className="flex items-center gap-4 mt-5 text-xs text-white/35">

                <div className="flex items-center gap-1.5">
                  <FileText size={14} />

                  {workspace.documentCount || 0}{" "}
                  {workspace.documentCount === 1
                    ? "Document"
                    : "Documents"}
                </div>

                <div className="flex items-center gap-1.5">
                  <Clock3 size={14} />

                  {formatDate(
                    workspace.createdAt
                  )}
                </div>

              </div>

              {/* =================================
                  OPEN WORKSPACE
              ================================== */}

              <button
                onClick={() =>
                  openWorkspace(workspace._id)
                }
                className="w-full mt-5 flex items-center justify-between px-3.5 py-2.5 rounded-xl border border-white/10 bg-white/[0.02] text-sm text-white/60 hover:text-white hover:bg-white/[0.05] transition-colors"
              >

                <span>
                  Open Workspace
                </span>

                <ArrowRight
                  size={16}
                  className="text-white/30 group-hover:text-purple-400 transition-colors"
                />

              </button>

            </div>

          ))}

        </div>

      )}

      {/* ======================================
          CREATE WORKSPACE MODAL
      ======================================= */}

      {showModal && (

        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={() => {
            if (!creating) {
              setShowModal(false);
            }
          }}
        >

          <div
            className="w-full max-w-md rounded-2xl border border-white/10 bg-[#11151c] p-5 sm:p-6 shadow-2xl"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            {/* =================================
                MODAL HEADER
            ================================== */}

            <div className="flex items-center justify-between mb-5">

              <div>
                <h2 className="text-lg font-semibold">
                  Create Workspace
                </h2>

                <p className="mt-1 text-xs text-white/35">
                  Create a workspace for your
                  documents.
                </p>
              </div>

              <button
                onClick={() => {
                  if (!creating) {
                    setShowModal(false);
                  }
                }}
                disabled={creating}
                className="flex items-center justify-center w-8 h-8 rounded-lg text-white/40 hover:text-white hover:bg-white/[0.05] disabled:opacity-40"
              >
                <X size={18} />
              </button>

            </div>

            {/* =================================
                FORM
            ================================== */}

            <form
              onSubmit={handleCreateWorkspace}
              className="space-y-4"
            >

              {/* WORKSPACE NAME */}

              <div>

                <label className="block mb-2 text-xs text-white/50">
                  Workspace Name
                </label>

                <input
                  type="text"
                  value={name}
                  onChange={(e) =>
                    setName(e.target.value)
                  }
                  placeholder="e.g. Engineering Notes"
                  disabled={creating}
                  className="w-full h-11 px-3 rounded-xl border border-white/10 bg-white/[0.03] text-sm text-white outline-none placeholder:text-white/25 focus:border-purple-500/50 disabled:opacity-50"
                />

              </div>

              {/* DESCRIPTION */}

              <div>

                <label className="block mb-2 text-xs text-white/50">
                  Description
                </label>

                <textarea
                  rows="3"
                  value={description}
                  onChange={(e) =>
                    setDescription(e.target.value)
                  }
                  placeholder="Describe this workspace..."
                  disabled={creating}
                  className="w-full px-3 py-3 rounded-xl border border-white/10 bg-white/[0.03] text-sm text-white outline-none resize-none placeholder:text-white/25 focus:border-purple-500/50 disabled:opacity-50"
                />

              </div>

              {/* CREATE BUTTON */}

              <button
                type="submit"
                disabled={creating}
                className="w-full h-11 rounded-xl bg-[#7C3AED] hover:bg-[#9465e6] disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium transition-colors"
              >
                {creating
                  ? "Creating..."
                  : "Create Workspace"}
              </button>

            </form>

          </div>

        </div>

      )}

    </div>
  );
};

export default Workspaces;