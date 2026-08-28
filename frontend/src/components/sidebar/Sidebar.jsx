import React, { useEffect, useRef, useState } from "react";
import {
  Plus,
  BriefcaseBusiness,
  ChevronDown,
  LayoutDashboard,
  FileText,
  Settings,
  X,
  LoaderCircle,
  LogOut,
} from "lucide-react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import logo from "../../assets/logo/logo.png";

const API_URL = import.meta.env.VITE_API_URL;

const Sidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { workspaceId } = useParams();

  const { user, logout } = useAuth();

  const fileInputRef = useRef(null);

  const [documents, setDocuments] = useState([]);
  const [loadingDocuments, setLoadingDocuments] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const userName = user?.name || "User";
  const userEmail = user?.email || "";

  const getInitials = (name) => {
    if (!name) return "U";

    const parts = name.trim().split(/\s+/);

    if (parts.length === 1) {
      return parts[0].charAt(0).toUpperCase();
    }

    return (
      parts[0].charAt(0) +
      parts[parts.length - 1].charAt(0)
    ).toUpperCase();
  };

  const getCurrentWorkspaceName = () => {
    if (location.pathname.includes("/documents")) {
      return "Documents";
    }

    if (location.pathname.includes("/AIassistant")) {
      return "AI Assistant";
    }

    return "DocTalk AI";
  };

  const currentSection = getCurrentWorkspaceName();

  const fetchRecentDocuments = async () => {
    if (!workspaceId) {
      setDocuments([]);
      return;
    }

    try {
      setLoadingDocuments(true);
      setError("");

      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_URL}/api/docs/${workspaceId}`,
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

      const docs = data.data || [];

      const recentDocs = [...docs]
        .sort(
          (a, b) =>
            new Date(b.createdAt) -
            new Date(a.createdAt)
        )
        .slice(0, 5);

      setDocuments(recentDocs);
    } catch (error) {
      console.error(
        "SIDEBAR DOCUMENT ERROR:",
        error
      );
    } finally {
      setLoadingDocuments(false);
    }
  };

  useEffect(() => {
    fetchRecentDocuments();
  }, [workspaceId]);

  const handleUploadClick = () => {
    if (!workspaceId) {
      navigate("/workspaces");
      return;
    }

    fileInputRef.current?.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (file.type !== "application/pdf") {
      setError("Only PDF files are allowed.");
      event.target.value = "";
      return;
    }

    if (!workspaceId) {
      setError("Please select a workspace first.");
      event.target.value = "";
      return;
    }

    try {
      setUploading(true);
      setError("");

      const token = localStorage.getItem("token");

      const formData = new FormData();
      formData.append("document", file);

      const response = await fetch(
        `${API_URL}/api/docs/${workspaceId}/upload-file`,
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

      await fetchRecentDocuments();

      navigate(`/documents/${workspaceId}`);
    } catch (error) {
      console.error(
        "SIDEBAR UPLOAD ERROR:",
        error
      );

      setError(
        error.message || "Document upload failed"
      );
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  const handleNavigation = (path) => {
    navigate(path);

    if (onClose) {
      onClose();
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");

    if (onClose) {
      onClose();
    }
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <aside
      className={`
        fixed inset-y-0 left-0 z-50
        w-[260px]
        min-h-screen
        bg-[#0b0e13]
        border-r border-white/10
        flex flex-col
        p-4
        transform
        transition-transform
        duration-300
        ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        md:relative
        md:translate-x-0
      `}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 md:hidden flex items-center justify-center w-8 h-8 rounded-lg text-white/50 hover:text-white hover:bg-white/[0.05] transition-colors"
      >
        <X size={19} />
      </button>

      <div className="mb-5">
        <img
          className="w-full max-w-[200px] h-auto p-3"
          src={logo}
          alt="DocTalk AI"
        />
      </div>

      <button
        onClick={() => handleNavigation("/workspaces")}
        className="w-full flex items-center gap-3 p-3 text-white border border-white/10 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] transition-colors"
      >
        <div className="shrink-0 text-white/70">
          <BriefcaseBusiness size={19} />
        </div>

        <div className="flex-1 min-w-0 text-left">
          <h1 className="text-sm font-medium truncate">
            {workspaceId
              ? "Current Workspace"
              : "Select Workspace"}
          </h1>

          <p className="text-xs text-white/40 truncate">
            {currentSection}
          </p>
        </div>

        <div className="shrink-0 text-white/40">
          <ChevronDown size={17} />
        </div>
      </button>

      <input
        ref={fileInputRef}
        type="file"
        accept="application/pdf"
        onChange={handleFileChange}
        className="hidden"
      />

      <button
        onClick={handleUploadClick}
        disabled={uploading}
        className="w-full mt-3 text-white p-2.5 rounded-xl bg-[#7C3AED] hover:bg-[#9465e6] active:bg-[#6D28D9] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2 transition-colors"
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
            <Plus size={18} />
            Upload Document
          </>
        )}
      </button>

      {error && (
        <div className="mt-3 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-[11px] text-red-400">
          {error}
        </div>
      )}

      <nav className="mt-7">
        <p className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-wider text-white/30">
          Workspace
        </p>

        <div className="space-y-1">
          <button
            onClick={() =>
              handleNavigation("/dashboard")
            }
            className={`
              w-full flex items-center justify-start gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors
              ${
                isActive("/dashboard")
                  ? "bg-purple-500/10 text-purple-300"
                  : "text-white/55 hover:bg-white/[0.05] hover:text-white"
              }
            `}
          >
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() =>
              handleNavigation("/workspaces")
            }
            className={`
              w-full flex items-center justify-start gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors
              ${
                isActive("/workspaces")
                  ? "bg-purple-500/10 text-purple-300"
                  : "text-white/55 hover:bg-white/[0.05] hover:text-white"
              }
            `}
          >
            <BriefcaseBusiness size={18} />
            <span>Workspaces</span>
          </button>
        </div>
      </nav>

      <div className="mt-7 flex-1 min-h-0 overflow-hidden">
        <div className="flex items-center justify-between mb-2 px-2">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-white/30">
            Recent Documents
          </p>
        </div>

        <div className="space-y-1 overflow-y-auto max-h-full">
          {loadingDocuments ? (
            <div className="flex items-center gap-2 px-2.5 py-3 text-xs text-white/30">
              <LoaderCircle
                size={14}
                className="animate-spin"
              />
              Loading...
            </div>
          ) : documents.length === 0 ? (
            <div className="px-2.5 py-3 text-xs text-white/25">
              No documents yet
            </div>
          ) : (
            documents.map((document) => (
              <button
                key={document._id}
                onClick={() =>
                  handleNavigation(
                    `/AIassistant?documentId=${document._id}`
                  )
                }
                className="w-full flex items-center gap-3 rounded-lg px-2.5 py-2 text-left hover:bg-white/[0.05] transition-colors"
              >
                <FileText
                  size={16}
                  className="shrink-0 text-white/30"
                />

                <span className="truncate text-xs text-white/55">
                  {document.name}
                </span>
              </button>
            ))
          )}
        </div>
      </div>

      <div className="mt-4 border-t border-white/10 pt-3">
        <button
          onClick={() =>
            handleNavigation("/settings")
          }
          className="w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-white/55 hover:bg-white/[0.05] hover:text-white transition-colors"
        >
          <Settings size={18} />
          <span>Settings</span>
        </button>

        <button
          onClick={() =>
            handleNavigation("/profile")
          }
          className="w-full mt-2 flex items-center gap-3 rounded-lg bg-white/[0.03] px-3 py-2.5 text-left hover:bg-white/[0.05] transition-colors"
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-purple-500/20 text-xs font-semibold text-purple-300">
            {getInitials(userName)}
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-white">
              {userName}
            </p>

            <p className="truncate text-[11px] text-white/40">
              {userEmail || "Free Plan"}
            </p>
          </div>

          <ChevronDown
            size={15}
            className="shrink-0 text-white/30"
          />
        </button>

        <button
          onClick={handleLogout}
          className="w-full mt-2 flex items-center gap-3 rounded-lg px-3 py-2 text-xs text-red-400/70 hover:text-red-400 hover:bg-red-500/10 transition-colors"
        >
          <LogOut size={15} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;