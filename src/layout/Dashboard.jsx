// DashboardLayout.jsx
import React, { useState } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import MainHeader from "@/components/dashboard/MainContentHeader";
import clsx from "clsx";
const DashboardLayout = ({ children }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div
        className={clsx(
          "transition-all duration-300 ease-in-out",
          isSidebarCollapsed ? "w-20" : "w-64"
        )}
      >
        <Sidebar
          isCollapsed={isSidebarCollapsed}
          onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <MainHeader
          onToggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className=" mx-auto">{children}</div>
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div>© 2024 Система Пропусков. Все права защищены.</div>
            <div className="flex items-center space-x-4">
              <span>Версия 2.1.4</span>
              <span className="material-symbols-outlined text-base">
                security
              </span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default DashboardLayout;
