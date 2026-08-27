import React, { useState } from "react";
import {
  Menu,
  Search,
  Bell,
  ChevronDown,
  LogOut,
  User,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

const TopNavbar = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [profileOpen, setProfileOpen] = useState(false);

  const userName = user?.name || "User";

  const getInitials = (name) => {
    if (!name) return "U";

    const parts = name.trim().split(" ");

    if (parts.length === 1) {
      return parts[0].charAt(0).toUpperCase();
    }

    return (
      parts[0].charAt(0) +
      parts[parts.length - 1].charAt(0)
    ).toUpperCase();
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="relative w-full h-16 shrink-0 bg-[#0b0e13] border-b border-white/10 flex items-center px-4 sm:px-6">

      {/* LEFT */}
      <div className="flex items-center gap-3 min-w-0">

        {/* Mobile Menu */}
        <button
          onClick={onMenuClick}
          className="md:hidden flex items-center justify-center w-9 h-9 shrink-0 rounded-lg text-white/60 hover:text-white hover:bg-white/[0.05] transition-colors"
        >
          <Menu size={21} />
        </button>

        {/* Page Title */}
        <div className="min-w-0">
          <h1 className="text-sm sm:text-base font-medium text-white truncate">
            DocTalk AI
          </h1>

          <p className="hidden sm:block text-xs text-white/35 truncate">
            Your AI document assistant
          </p>
        </div>
      </div>

      {/* RIGHT */}
      <div className="ml-auto flex items-center gap-1.5 sm:gap-3">

        {/* Desktop Search */}
        <div className="hidden sm:flex items-center w-[200px] md:w-[240px] lg:w-[280px] h-9 px-3 gap-2 rounded-lg border border-white/10 bg-white/[0.02] focus-within:border-purple-500/40 transition-colors">

          <Search
            size={17}
            className="shrink-0 text-white/35"
          />

          <input
            type="text"
            placeholder="Search documents..."
            className="w-full min-w-0 bg-transparent outline-none text-sm text-white placeholder:text-white/30"
          />

        </div>

        {/* Mobile Search */}
        <button
          className="sm:hidden flex items-center justify-center w-9 h-9 shrink-0 rounded-lg text-white/50 hover:text-white hover:bg-white/[0.05] transition-colors"
        >
          <Search size={19} />
        </button>

        {/* Notification */}
        <button
          className="relative flex items-center justify-center w-9 h-9 shrink-0 rounded-lg text-white/50 hover:text-white hover:bg-white/[0.05] transition-colors"
        >
          <Bell size={19} />

          <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-[#7C3AED]" />
        </button>

        {/* PROFILE */}
        <div className="relative">

          <button
            onClick={() => setProfileOpen((prev) => !prev)}
            className="flex items-center gap-2 rounded-lg px-1.5 sm:px-2 py-1.5 hover:bg-white/[0.05] transition-colors"
          >

            {/* Avatar */}
            <div className="flex items-center justify-center w-8 h-8 shrink-0 rounded-full bg-[#7C3AED]/20 text-purple-300 text-xs font-semibold">
              {getInitials(userName)}
            </div>

            {/* User Information */}
            <div className="hidden lg:block text-left max-w-[130px]">

              <p className="text-xs font-medium text-white truncate">
                {userName}
              </p>

              <p className="text-[10px] text-white/35 truncate">
                {user?.email || "Free Plan"}
              </p>

            </div>

            <ChevronDown
              size={15}
              className="hidden lg:block text-white/30"
            />

          </button>

          {/* PROFILE DROPDOWN */}
          {profileOpen && (
            <div className="absolute right-0 top-12 z-50 w-60 rounded-xl border border-white/10 bg-[#151820] shadow-2xl overflow-hidden">

              {/* User Info */}
              <div className="p-4 border-b border-white/10">

                <div className="flex items-center gap-3">

                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#7C3AED]/20 text-purple-300 text-sm font-semibold">
                    {getInitials(userName)}
                  </div>

                  <div className="min-w-0">

                    <p className="text-sm font-medium text-white truncate">
                      {userName}
                    </p>

                    <p className="text-xs text-white/35 truncate">
                      {user?.email || ""}
                    </p>

                  </div>

                </div>

              </div>

              {/* Profile */}
              <button
                onClick={() => {
                  setProfileOpen(false);
                  navigate("/profile");
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-white/60 hover:text-white hover:bg-white/[0.05] transition-colors"
              >
                <User size={16} />
                Profile
              </button>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
              >
                <LogOut size={16} />
                Logout
              </button>

            </div>
          )}

        </div>

      </div>

    </header>
  );
};

export default TopNavbar;