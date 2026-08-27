import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';

import Sidebar from '../sidebar/Sidebar';
import TopNavbar from '../navbar/TopNavbar';

const AppLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#0b0e13]">

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 md:hidden"
        />
      )}

      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Area */}
      <div className="flex min-w-0 flex-1 flex-col">

        {/* Navbar */}
        <TopNavbar
          onMenuClick={() => setSidebarOpen(true)}
        />

        {/* Page Content */}
        <main className="min-w-0 flex-1 overflow-auto">
          <Outlet />
        </main>

      </div>

    </div>
  );
};

export default AppLayout;