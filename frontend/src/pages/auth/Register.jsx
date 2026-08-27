import React, { useState } from "react";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
} from "lucide-react";

import logo from "../../assets/logo/logo.png";
import { useAuth } from "../../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();

  const { register, loading } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [error, setError] = useState("");

  // ==========================================
  // GOOGLE LOGIN
  // ==========================================

  const handleGoogleLogin = () => {
    if (loading) return;

    window.location.href =
      "http://localhost:5000/api/auth/google";
  };

  // ==========================================
  // VALIDATION
  // ==========================================

  const validateForm = () => {
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    // Name
    if (!trimmedName) {
      return "Please enter your name.";
    }

    if (trimmedName.length < 2) {
      return "Name must be at least 2 characters.";
    }

    // Email
    if (!trimmedEmail) {
      return "Please enter your email address.";
    }

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(trimmedEmail)) {
      return "Please enter a valid email address.";
    }

    // Password
    if (!password) {
      return "Please enter a password.";
    }

    if (password.length < 6) {
      return "Password must be at least 6 characters.";
    }

    // Confirm password
    if (!confirmPassword) {
      return "Please confirm your password.";
    }

    if (password !== confirmPassword) {
      return "Passwords do not match.";
    }

    return null;
  };

  // ==========================================
  // REGISTER
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    setError("");

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    const success = await register(
      name.trim(),
      email.trim(),
      password
    );

    if (success) {
      navigate("/dashboard");
    } else {
      setError(
        "Registration failed. Please check your details and try again."
      );
    }
  };

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <div className="min-h-screen bg-[#0b0e13] text-white flex items-center justify-center p-4">

      <div className="w-full max-w-md">

        {/* ======================================
            LOGO
        ======================================= */}

        <div className="flex justify-center mb-8">
          <img
            src={logo}
            alt="DocTalk AI"
            className="w-48 h-auto"
          />
        </div>

        {/* ======================================
            CARD
        ======================================= */}

        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8 shadow-xl">

          {/* ====================================
              HEADING
          ===================================== */}

          <div className="text-center mb-7">

            <h1 className="text-2xl font-semibold">
              Create your account
            </h1>

            <p className="mt-2 text-sm text-white/40">
              Start chatting with your documents
            </p>

          </div>

          {/* ====================================
              ERROR
          ===================================== */}

          {error && (
            <div className="mb-5 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          {/* ====================================
              FORM
          ===================================== */}

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            {/* ==================================
                NAME
            =================================== */}

            <div>

              <label className="block mb-2 text-xs font-medium text-white/60">
                Full Name
              </label>

              <div className="flex items-center gap-2 h-11 px-3 rounded-xl border border-white/10 bg-white/[0.02] focus-within:border-purple-500/50 transition-colors">

                <User
                  size={17}
                  className="shrink-0 text-white/30"
                />

                <input
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setError("");
                  }}
                  placeholder="Enter your name"
                  disabled={loading}
                  className="w-full bg-transparent outline-none text-sm text-white placeholder:text-white/25 disabled:opacity-50"
                />

              </div>

            </div>

            {/* ==================================
                EMAIL
            =================================== */}

            <div>

              <label className="block mb-2 text-xs font-medium text-white/60">
                Email Address
              </label>

              <div className="flex items-center gap-2 h-11 px-3 rounded-xl border border-white/10 bg-white/[0.02] focus-within:border-purple-500/50 transition-colors">

                <Mail
                  size={17}
                  className="shrink-0 text-white/30"
                />

                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError("");
                  }}
                  placeholder="Enter your email"
                  disabled={loading}
                  className="w-full bg-transparent outline-none text-sm text-white placeholder:text-white/25 disabled:opacity-50"
                />

              </div>

            </div>

            {/* ==================================
                PASSWORD
            =================================== */}

            <div>

              <label className="block mb-2 text-xs font-medium text-white/60">
                Password
              </label>

              <div className="flex items-center gap-2 h-11 px-3 rounded-xl border border-white/10 bg-white/[0.02] focus-within:border-purple-500/50 transition-colors">

                <Lock
                  size={17}
                  className="shrink-0 text-white/30"
                />

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                  placeholder="Create a password"
                  disabled={loading}
                  className="w-full bg-transparent outline-none text-sm text-white placeholder:text-white/25 disabled:opacity-50"
                />

                <button
                  type="button"
                  disabled={loading}
                  onClick={() =>
                    setShowPassword(
                      (prev) => !prev
                    )
                  }
                  className="shrink-0 text-white/30 hover:text-white/60 disabled:opacity-50 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff size={17} />
                  ) : (
                    <Eye size={17} />
                  )}
                </button>

              </div>

              <p className="mt-2 text-[11px] text-white/25">
                Password must be at least 6 characters.
              </p>

            </div>

            {/* ==================================
                CONFIRM PASSWORD
            =================================== */}

            <div>

              <label className="block mb-2 text-xs font-medium text-white/60">
                Confirm Password
              </label>

              <div className="flex items-center gap-2 h-11 px-3 rounded-xl border border-white/10 bg-white/[0.02] focus-within:border-purple-500/50 transition-colors">

                <Lock
                  size={17}
                  className="shrink-0 text-white/30"
                />

                <input
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(
                      e.target.value
                    );
                    setError("");
                  }}
                  placeholder="Confirm your password"
                  disabled={loading}
                  className="w-full bg-transparent outline-none text-sm text-white placeholder:text-white/25 disabled:opacity-50"
                />

                <button
                  type="button"
                  disabled={loading}
                  onClick={() =>
                    setShowConfirmPassword(
                      (prev) => !prev
                    )
                  }
                  className="shrink-0 text-white/30 hover:text-white/60 disabled:opacity-50 transition-colors"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={17} />
                  ) : (
                    <Eye size={17} />
                  )}
                </button>

              </div>

            </div>

            {/* ==================================
                CREATE ACCOUNT BUTTON
            =================================== */}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 rounded-xl bg-[#7C3AED] hover:bg-[#9465e6] active:bg-[#6D28D9] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm font-medium transition-colors"
            >

              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />

                  Creating account...
                </>
              ) : (
                <>
                  Create Account

                  <ArrowRight size={17} />
                </>
              )}

            </button>

          </form>

          {/* ====================================
              DIVIDER
          ===================================== */}

          <div className="flex items-center gap-3 my-6">

            <div className="flex-1 h-px bg-white/10" />

            <span className="text-xs text-white/25">
              OR
            </span>

            <div className="flex-1 h-px bg-white/10" />

          </div>

          {/* ====================================
              GOOGLE LOGIN
          ===================================== */}

          <button
            type="button"
            disabled={loading}
            onClick={handleGoogleLogin}
            className="w-full h-11 rounded-xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-sm font-medium transition-colors"
          >

            <span className="text-lg font-bold">
              G
            </span>

            Continue with Google

          </button>

          {/* ====================================
              LOGIN LINK
          ===================================== */}

          <p className="text-center text-sm text-white/40 mt-6">

            Already have an account?{" "}

            <button
              type="button"
              disabled={loading}
              onClick={() => navigate("/login")}
              className="text-purple-400 hover:text-purple-300 disabled:opacity-50 font-medium transition-colors"
            >
              Sign in
            </button>

          </p>

        </div>

        {/* ======================================
            FOOTER
        ======================================= */}

        <p className="text-center mt-6 text-[11px] text-white/20">
          © 2026 DocTalk AI. All rights reserved.
        </p>

      </div>

    </div>
  );
};

export default Register;