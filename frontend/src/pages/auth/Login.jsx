import React, { useState } from 'react';
import { Mail, Lock, Eye, ArrowRight } from 'lucide-react';
import logo from '../../assets/logo/logo.png';
import { useAuth } from '../../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL;

const Login = () => {
  const navigate = useNavigate();

  const {
    login,
    user,
    isAuthenticated,
    loading,
  } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  console.log('user:', user);
  console.log('Authenticated:', isAuthenticated);

  const handleGoogleLogin = () => {
    window.location.href = `${API_URL}/api/auth/google`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    const success = await login(email, password);

    if (success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0e13] text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <img
            src={logo}
            alt="DocTalk AI"
            className="w-48 h-auto"
          />
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8 shadow-xl">
          <div className="text-center mb-7">
            <h1 className="text-2xl font-semibold">
              Welcome back
            </h1>

            <p className="mt-2 text-sm text-white/40">
              Sign in to continue to DocTalk AI
            </p>
          </div>

          <form
            className="space-y-5"
            onSubmit={handleSubmit}
          >
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  placeholder="Enter your email"
                  disabled={loading}
                  className="w-full bg-transparent outline-none text-sm text-white placeholder:text-white/25 disabled:opacity-50"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-medium text-white/60">
                  Password
                </label>

                <button
                  type="button"
                  disabled={loading}
                  className="text-xs text-purple-400 hover:text-purple-300 disabled:opacity-50 transition-colors"
                >
                  Forgot password?
                </button>
              </div>

              <div className="flex items-center gap-2 h-11 px-3 rounded-xl border border-white/10 bg-white/[0.02] focus-within:border-purple-500/50 transition-colors">
                <Lock
                  size={17}
                  className="shrink-0 text-white/30"
                />

                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  placeholder="Enter your password"
                  disabled={loading}
                  className="w-full bg-transparent outline-none text-sm text-white placeholder:text-white/25 disabled:opacity-50"
                />

                <button
                  type="button"
                  disabled={loading}
                  className="shrink-0 text-white/30 hover:text-white/60 disabled:opacity-50 transition-colors"
                >
                  <Eye size={17} />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="remember"
                disabled={loading}
                className="accent-[#7C3AED]"
              />

              <label
                htmlFor="remember"
                className="text-xs text-white/40 cursor-pointer"
              >
                Remember me
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 rounded-xl bg-[#7C3AED] hover:bg-[#9465e6] active:bg-[#6D28D9] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm font-medium transition-colors"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight size={17} />
                </>
              )}
            </button>
          </form>

          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-white/10" />

            <span className="text-xs text-white/25">
              OR
            </span>

            <div className="flex-1 h-px bg-white/10" />
          </div>

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

          <p className="text-center text-sm text-white/40 mt-6">
            Don't have an account?{' '}

            <button
              type="button"
              disabled={loading}
              onClick={() => navigate('/register')}
              className="text-purple-400 hover:text-purple-300 disabled:opacity-50 font-medium transition-colors"
            >
              Create account
            </button>
          </p>
        </div>

        <p className="text-center mt-6 text-[11px] text-white/20">
          © 2026 DocTalk AI. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Login;