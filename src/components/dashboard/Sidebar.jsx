// Sidebar.jsx - Updated with toggle prop
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";
import Link from "next/link";
import { useRouter } from "next/router";
import { signOut } from "next-auth/react";
import Modal from "@/components/modal";
import toast from "react-hot-toast";

const Sidebar = ({ isCollapsed, onToggle }) => {
  const router = useRouter();
  const currentPath = router.asPath;
  const isEmployeeRoute = currentPath.startsWith("/employee-permission");
  const [showExitModal, setShowExitModal] = useState(false);
  const managerFolderMenuItems = [
    {
      id: "active-requests",
      label: "Активные заявки",
      icon: "pending_actions",
    },
    { id: "", label: "Все заявки", icon: "list_alt" },
    { id: "archive", label: "Архив", icon: "inventory_2" },
    // { id: "employees", label: "Сотрудники", icon: "people" },
  ];

  const employeeMenuItems = [
    { id: "main", label: "Все заявки", icon: "list_alt" },
    { id: "request", label: "Создать заявку", icon: "add_circle" },
    // { id: "archive", label: "Архив", icon: "inventory_2" },
  ];

  const menuItems = isEmployeeRoute
    ? employeeMenuItems
    : managerFolderMenuItems;

  const sidebarVariants = {
    expanded: { width: 256 },
    collapsed: { width: 80 },
  };

  const itemVariants = {
    expanded: { opacity: 1, x: 0 },
    collapsed: { opacity: 0, x: -20 },
  };

  const getItemHref = (item) => {
    if (isEmployeeRoute) {
      return item.id === "main"
        ? "/employee-permission"
        : `/employee-permission/${item.id}`;
    }
    return `/manager-login/dashboard/${item.id}`;
  };

  const isItemActive = (item) => {
    const href = getItemHref(item);
    if (isEmployeeRoute && item.id === "main") {
      return currentPath === "/employee-permission";
    }
    // For manager dashboard root (id: ""), match exactly
    if (!isEmployeeRoute && item.id === "") {
      return (
        currentPath === "/manager-login/dashboard" ||
        currentPath === "/manager-login/dashboard/"
      );
    }
    // For other items, check if path starts with href
    return currentPath.startsWith(href);
  };

  const handleLogout = async () => {
    try {
      await signOut({ redirect: false });
      toast.success("Вы успешно вышли из системы");
      router.push("/manager-login");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Ошибка при выходе из системы");
    }
  };

  return (
    <>
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
              <Link href={"/manager-login"}>
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
            <Link
              key={item.id}
              href={getItemHref(item)}
              className={clsx(
                "w-full flex items-center rounded-lg px-4 py-3 transition-all duration-200",
                isItemActive(item)
                  ? "bg-blue-600 text-white shadow-md"
                  : "hover:bg-gray-800 text-gray-300 hover:text-white",
              )}
            >
              <span className="material-symbols-outlined shrink-0">
                {item.icon}
              </span>

              <AnimatePresence>
                {!isCollapsed && (
                  <motion.span
                    variants={itemVariants}
                    initial="collapsed"
                    animate="expanded"
                    exit="collapsed"
                    className="ml-4 font-medium"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          ))}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-gray-800">
          <button
            onClick={() => setShowExitModal(true)}
            className="w-full flex items-center rounded-lg px-4 py-3 hover:bg-gray-800 transition-colors"
          >
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

      {/* Exit Confirmation Modal */}
      <Modal
        isOpen={showExitModal}
        onClose={() => setShowExitModal(false)}
        onConfirm={handleLogout}
        title="Выход из системы"
        message="Вы уверены, что хотите выйти из панели управления?"
        confirmText="Да, выйти"
        cancelText="Отмена"
        confirmButtonStyle="danger"
        icon="logout"
      />
    </>
  );
};

export default Sidebar;
