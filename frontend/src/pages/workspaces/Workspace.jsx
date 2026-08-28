import React, { useEffect, useState } from "react";
import {
  BriefcaseBusiness,
  FileText,
  Clock3,
  ArrowRight,
  MoreVertical,
  X,
  Plus,
  Trash2,
  AlertTriangle,
  Pencil,
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
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [error, setError] = useState("");

  // Menu state
  const [openMenu, setOpenMenu] = useState(null);

  // Workspace currently being edited
  const [editingWorkspace, setEditingWorkspace] =
    useState(null);

  // Workspace currently being deleted
  const [deleteWorkspace, setDeleteWorkspace] =
    useState(null);

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
        throw new Error(
          "Authentication token not found."
        );
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
          result.message ||
            "Failed to fetch workspaces"
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
  // OPEN EDIT MODAL
  // ==========================================

  const openEditModal = (workspace) => {
    setEditingWorkspace(workspace);

    setName(workspace.name || "");
    setDescription(
      workspace.description || ""
    );

    setError("");
    setOpenMenu(null);
    setShowModal(true);
  };

  // ==========================================
  // UPDATE WORKSPACE
  // ==========================================

  const handleUpdateWorkspace = async (e) => {
    e.preventDefault();

    if (!name.trim() || !description.trim()) {
      setError(
        "Please enter name and description"
      );
      return;
    }

    if (!editingWorkspace) {
      return;
    }

    try {
      setUpdating(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error(
          "Authentication token not found."
        );
      }

      const response = await fetch(
        `${API_URL}/api/workspaces/${editingWorkspace._id}`,
        {
          method: "PUT",
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
            "Failed to update workspace"
        );
      }

      // Update workspace in UI
      setWorkspaces((prev) =>
        prev.map((workspace) =>
          workspace._id === editingWorkspace._id
            ? result.data
            : workspace
        )
      );

      // Close modal
      setEditingWorkspace(null);
      setName("");
      setDescription("");
      setShowModal(false);

    } catch (error) {
      console.error(
        "UPDATE WORKSPACE ERROR:",
        error
      );

      setError(
        error.message ||
          "Failed to update workspace"
      );

    } finally {
      setUpdating(false);
    }
  };

  // ==========================================
  // DELETE WORKSPACE
  // ==========================================

  const handleDeleteWorkspace = async () => {
    if (!deleteWorkspace) {
      return;
    }

    try {
      setDeleting(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error(
          "Authentication token not found."
        );
      }

      const response = await fetch(
        `${API_URL}/api/workspaces/${deleteWorkspace._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Failed to delete workspace"
        );
      }

      // Remove from UI
      setWorkspaces((prev) =>
        prev.filter(
          (workspace) =>
            workspace._id !==
            deleteWorkspace._id
        )
      );

      setDeleteWorkspace(null);

    } catch (error) {
      console.error(
        "DELETE WORKSPACE ERROR:",
        error
      );

      setError(
        error.message ||
          "Failed to delete workspace"
      );

    } finally {
      setDeleting(false);
      setOpenMenu(null);
    }
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
  // CLOSE WORKSPACE FORM
  // ==========================================

  const closeWorkspaceModal = () => {
    if (creating || updating) {
      return;
    }

    setShowModal(false);
    setEditingWorkspace(null);
    setName("");
    setDescription("");
    setError("");
  };

  // ==========================================
  // MAIN UI
  // ==========================================

  return (
    <div
      className="min-h-full bg-[#0b0e13] text-white p-4 sm:p-6 lg:p-8"
      onClick={() => setOpenMenu(null)}
    >

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
          onClick={(e) => {
            e.stopPropagation();

            setEditingWorkspace(null);
            setName("");
            setDescription("");
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
              setEditingWorkspace(null);
              setName("");
              setDescription("");
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

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">

          {workspaces.map((workspace) => (

            <div
              key={workspace._id}
              onClick={(e) =>
                e.stopPropagation()
              }
              className="group rounded-2xl border border-white/10 bg-white/[0.02] p-5 hover:bg-white/[0.04] hover:border-white/15 transition-all"
            >

              {/* CARD HEADER */}

              <div className="flex items-start justify-between">

                <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-purple-500/10 text-purple-400">
                  <BriefcaseBusiness size={21} />
                </div>

                {/* MENU */}

                <div className="relative">

                  <button
                    onClick={(e) => {
                      e.stopPropagation();

                      setOpenMenu(
                        openMenu === workspace._id
                          ? null
                          : workspace._id
                      );
                    }}
                    className="flex items-center justify-center w-8 h-8 rounded-lg text-white/30 hover:text-white hover:bg-white/[0.05] transition-colors"
                  >
                    <MoreVertical size={18} />
                  </button>

                  {openMenu === workspace._id && (

                    <div
                      className="absolute right-0 top-10 z-30 w-48 rounded-xl border border-white/10 bg-[#151922] shadow-2xl p-1"
                      onClick={(e) =>
                        e.stopPropagation()
                      }
                    >

                      {/* EDIT */}

                      <button
                        onClick={() =>
                          openEditModal(workspace)
                        }
                        className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-white/70 hover:text-white hover:bg-white/[0.05] transition-colors"
                      >
                        <Pencil size={16} />
                        Edit Workspace
                      </button>

                      {/* DELETE */}

                      <button
                        onClick={() => {
                          setDeleteWorkspace(
                            workspace
                          );
                          setOpenMenu(null);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                      >
                        <Trash2 size={16} />
                        Delete Workspace
                      </button>

                    </div>

                  )}

                </div>

              </div>

              {/* WORKSPACE INFO */}

              <div className="mt-5">

                <h2 className="text-base font-medium truncate">
                  {workspace.name}
                </h2>

                <p className="mt-1 text-sm text-white/35 line-clamp-2">
                  {workspace.description}
                </p>

              </div>

              {/* META */}

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

              {/* OPEN */}

              <button
                onClick={() =>
                  openWorkspace(
                    workspace._id
                  )
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
          CREATE / EDIT MODAL
      ======================================= */}

      {showModal && (

        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={closeWorkspaceModal}
        >

          <div
            className="w-full max-w-md rounded-2xl border border-white/10 bg-[#11151c] p-5 sm:p-6 shadow-2xl"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            {/* HEADER */}

            <div className="flex items-center justify-between mb-5">

              <div>

                <h2 className="text-lg font-semibold">
                  {editingWorkspace
                    ? "Edit Workspace"
                    : "Create Workspace"}
                </h2>

                <p className="mt-1 text-xs text-white/35">
                  {editingWorkspace
                    ? "Update your workspace details."
                    : "Create a workspace for your documents."}
                </p>

              </div>

              <button
                onClick={closeWorkspaceModal}
                disabled={
                  creating || updating
                }
                className="flex items-center justify-center w-8 h-8 rounded-lg text-white/40 hover:text-white hover:bg-white/[0.05] disabled:opacity-40"
              >
                <X size={18} />
              </button>

            </div>

            {/* FORM */}

            <form
              onSubmit={
                editingWorkspace
                  ? handleUpdateWorkspace
                  : handleCreateWorkspace
              }
              className="space-y-4"
            >

              {/* NAME */}

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
                  disabled={
                    creating || updating
                  }
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
                    setDescription(
                      e.target.value
                    )
                  }
                  placeholder="Describe this workspace..."
                  disabled={
                    creating || updating
                  }
                  className="w-full px-3 py-3 rounded-xl border border-white/10 bg-white/[0.03] text-sm text-white outline-none resize-none placeholder:text-white/25 focus:border-purple-500/50 disabled:opacity-50"
                />

              </div>

              {/* SUBMIT */}

              <button
                type="submit"
                disabled={
                  creating || updating
                }
                className="w-full h-11 rounded-xl bg-[#7C3AED] hover:bg-[#9465e6] disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium transition-colors"
              >

                {creating
                  ? "Creating..."
                  : updating
                  ? "Saving Changes..."
                  : editingWorkspace
                  ? "Save Changes"
                  : "Create Workspace"}

              </button>

            </form>

          </div>

        </div>

      )}

      {/* ======================================
          DELETE CONFIRMATION MODAL
      ======================================= */}

      {deleteWorkspace && (

        <div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={() => {
            if (!deleting) {
              setDeleteWorkspace(null);
            }
          }}
        >

          <div
            className="w-full max-w-md rounded-2xl border border-white/10 bg-[#11151c] p-6 shadow-2xl"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            {/* TITLE */}

            <div className="flex items-center gap-3">

              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-red-500/10 text-red-400">
                <AlertTriangle size={20} />
              </div>

              <div>

                <h2 className="text-lg font-semibold">
                  Delete Workspace?
                </h2>

                <p className="text-xs text-white/35 mt-1">
                  This action cannot be undone.
                </p>

              </div>

            </div>

            {/* MESSAGE */}

            <p className="mt-5 text-sm text-white/50">

              Are you sure you want to delete{" "}

              <span className="text-white font-medium">
                "{deleteWorkspace.name}"
              </span>
              ?

            </p>

            <p className="mt-2 text-xs text-red-400/80">
              All documents and related data in this
              workspace may also be deleted.
            </p>

            {/* BUTTONS */}

            <div className="flex gap-3 mt-6">

              <button
                type="button"
                disabled={deleting}
                onClick={() =>
                  setDeleteWorkspace(null)
                }
                className="flex-1 h-11 rounded-xl border border-white/10 bg-white/[0.03] text-sm text-white/60 hover:text-white hover:bg-white/[0.05] disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={deleting}
                onClick={
                  handleDeleteWorkspace
                }
                className="flex-1 h-11 rounded-xl bg-red-500 hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium transition-colors flex items-center justify-center gap-2"
              >

                {deleting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 size={16} />
                    Delete
                  </>
                )}

              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
};

export default Workspaces;