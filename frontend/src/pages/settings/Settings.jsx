
import React from 'react';
import {
  User,
  Mail,
  Lock,
  Palette,
  Shield,
  Trash2,
  Save,
  ChevronDown,
} from 'lucide-react';

const Settings = () => {
  return (
    <div className="min-h-full bg-[#0b0e13] text-white p-4 sm:p-6 lg:p-8">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-semibold">
          Settings
        </h1>

        <p className="mt-2 text-sm text-white/40">
          Manage your account and application preferences.
        </p>
      </div>

      <div className="max-w-4xl space-y-6">

        {/* Profile */}
        <section className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden">

          <div className="p-5 sm:p-6 border-b border-white/10">
            <div className="flex items-center gap-3">

              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400">
                <User size={19} />
              </div>

              <div>
                <h2 className="text-base font-medium">
                  Profile
                </h2>

                <p className="mt-1 text-xs text-white/35">
                  Manage your personal information.
                </p>
              </div>

            </div>
          </div>

          <div className="p-5 sm:p-6">

            {/* Profile Preview */}
            <div className="flex items-center gap-4 mb-7">

              <div className="flex items-center justify-center w-14 h-14 rounded-full bg-purple-500/15 text-purple-300 text-lg font-semibold">
                H
              </div>

              <div className="min-w-0">
                <h3 className="text-sm font-medium">
                  Harsh Singh
                </h3>

                <p className="mt-1 text-xs text-white/35 truncate">
                  harsh.task@example.com
                </p>
              </div>

            </div>

            {/* Form */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

              {/* Name */}
              <div>
                <label className="block mb-2 text-xs font-medium text-white/50">
                  Full Name
                </label>

                <div className="flex items-center gap-2 h-10 px-3 rounded-lg border border-white/10 bg-white/[0.02] focus-within:border-purple-500/40">

                  <User
                    size={16}
                    className="shrink-0 text-white/25"
                  />

                  <input
                    type="text"
                    defaultValue="Harsh Singh"
                    className="w-full bg-transparent outline-none text-sm text-white"
                  />

                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block mb-2 text-xs font-medium text-white/50">
                  Email Address
                </label>

                <div className="flex items-center gap-2 h-10 px-3 rounded-lg border border-white/10 bg-white/[0.02] focus-within:border-purple-500/40">

                  <Mail
                    size={16}
                    className="shrink-0 text-white/25"
                  />

                  <input
                    type="email"
                    defaultValue="harsh.task@example.com"
                    className="w-full bg-transparent outline-none text-sm text-white"
                  />

                </div>
              </div>

            </div>

            {/* Save */}
            <div className="flex justify-end mt-6">

              <button className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#7C3AED] hover:bg-[#9465e6] active:bg-[#6D28D9] text-sm font-medium transition-colors">

                <Save size={16} />

                Save Changes

              </button>

            </div>

          </div>

        </section>

        {/* Appearance */}
        <section className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden">

          <div className="p-5 sm:p-6 border-b border-white/10">

            <div className="flex items-center gap-3">

              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400">
                <Palette size={19} />
              </div>

              <div>
                <h2 className="text-base font-medium">
                  Appearance
                </h2>

                <p className="mt-1 text-xs text-white/35">
                  Customize how DocTalk AI looks.
                </p>
              </div>

            </div>

          </div>

          <div className="p-5 sm:p-6">

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

              <div>
                <h3 className="text-sm font-medium">
                  Theme
                </h3>

                <p className="mt-1 text-xs text-white/35">
                  Choose your preferred application theme.
                </p>
              </div>

              <button className="flex items-center justify-between gap-5 w-full sm:w-40 px-3 py-2.5 rounded-lg border border-white/10 bg-white/[0.02] text-sm text-white/70 hover:bg-white/[0.05] transition-colors">

                <span>
                  Dark
                </span>

                <ChevronDown
                  size={15}
                  className="text-white/30"
                />

              </button>

            </div>

          </div>

        </section>

        {/* Security */}
        <section className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden">

          <div className="p-5 sm:p-6 border-b border-white/10">

            <div className="flex items-center gap-3">

              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400">
                <Shield size={19} />
              </div>

              <div>
                <h2 className="text-base font-medium">
                  Security
                </h2>

                <p className="mt-1 text-xs text-white/35">
                  Manage your account security.
                </p>
              </div>

            </div>

          </div>

          <div className="divide-y divide-white/5">

            {/* Password */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-5 sm:p-6">

              <div className="flex items-start gap-3">

                <Lock
                  size={18}
                  className="mt-0.5 text-white/30"
                />

                <div>
                  <h3 className="text-sm font-medium">
                    Password
                  </h3>

                  <p className="mt-1 text-xs text-white/35">
                    Change your account password.
                  </p>
                </div>

              </div>

              <button className="w-full sm:w-auto px-4 py-2 rounded-lg border border-white/10 text-sm text-white/60 hover:text-white hover:bg-white/[0.05] transition-colors">
                Change Password
              </button>

            </div>

            {/* Delete Account */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-5 sm:p-6">

              <div className="flex items-start gap-3">

                <Trash2
                  size={18}
                  className="mt-0.5 text-red-400/70"
                />

                <div>
                  <h3 className="text-sm font-medium">
                    Delete Account
                  </h3>

                  <p className="mt-1 text-xs text-white/35">
                    Permanently delete your account and data.
                  </p>
                </div>

              </div>

              <button className="w-full sm:w-auto px-4 py-2 rounded-lg border border-red-500/20 text-sm text-red-400/80 hover:bg-red-500/10 hover:text-red-400 transition-colors">
                Delete Account
              </button>

            </div>

          </div>

        </section>

      </div>

    </div>
  );
};

export default Settings;