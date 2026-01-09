// Sidebar.jsx - Updated with toggle prop
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";
import Link from "next/link";

const Sidebar = ({ isCollapsed, onToggle }) => {
  const [activeItem, setActiveItem] = useState("Главная");

  const menuItems = [
    { id: "main", label: "Главная", icon: "dashboard" },
    { id: "applications", label: "Активные заявки", icon: "pending_actions" },
    { id: "employees", label: "Сотрудники", icon: "people" },
    { id: "reports", label: "Отчеты", icon: "assessment" },
    { id: "settings", label: "Настройки", icon: "settings" },
  ];

  const sidebarVariants = {
    expanded: { width: 256 },
    collapsed: { width: 80 },
  };

  const itemVariants = {
    expanded: { opacity: 1, x: 0 },
    collapsed: { opacity: 0, x: -20 },
  };

  return (
    <motion.aside
      className="flex flex-col justify-center items-center h-screen bg-gray-900 text-white"
      animate={isCollapsed ? "collapsed" : "expanded"}
      variants={sidebarVariants}
      initial="expanded"
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      {/* Logo/Header */}
      <div className="p-6 border-b border-gray-800">
        <div className="flex items-center justify-between">
          <AnimatePresence mode="wait">
            <Link href={"/"}>
              <div className="flex items-center gap-4">
                <div className="size-6 text-blue-400 flex items-center justify-center">
                  <span className="material-symbols-outlined text-3xl">
                    shield_person
                  </span>
                </div>
                {!isCollapsed ? (
                  <h2 className="text-lg font-bold leading-tight tracking-[-0.015em]">
                    Система пропусков
                  </h2>
                ) : (
                  ""
                )}
              </div>
            </Link>
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveItem(item.label)}
            className={clsx(
              "w-full flex items-center rounded-lg px-4 py-3 transition-all duration-200",
              activeItem === item.label
                ? "bg-blue-600 text-white shadow-md"
                : "hover:bg-gray-800 text-gray-300 hover:text-white"
            )}
          >
            <span className="material-symbols-outlined flex-shrink-0">
              {item.icon}
            </span>

            <AnimatePresence>
              {!isCollapsed && (
                <motion.span
                  variants={itemVariants}
                  initial="collapsed"
                  animate="expanded"
                  exit="collapsed"
                  className="ml-4 font-medium text-left whitespace-nowrap overflow-hidden"
                >
                  {item.label}
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-gray-800">
        <button className="w-full flex items-center rounded-lg px-4 py-3 hover:bg-gray-800 transition-colors">
          <span className="material-symbols-outlined">logout</span>
          <AnimatePresence>
            {!isCollapsed && (
              <motion.span
                variants={itemVariants}
                initial="collapsed"
                animate="expanded"
                exit="collapsed"
                className="ml-4 font-medium"
              >
                Выход
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
