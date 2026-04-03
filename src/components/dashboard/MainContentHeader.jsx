// MainHeader.jsx - Updated with your requirements
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import Modal from "@/components/modal";

const MainHeader = ({ onToggleSidebar, headerTitle = " Главная" }) => {
  const router = useRouter();
  const { data: session } = useSession();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  const isEmployeeRoute = router.asPath.startsWith("/employee-permission");

  const handleLogout = async () => {
    try {
      const callbackUrl = "http://10.20.6.139:8080";
      await signOut({ callbackUrl });
      if (typeof window !== "undefined") {
        localStorage.removeItem("login_type");
      }
      toast.success("Вы успешно вышли из системы");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Ошибка при выходе из системы");
    }
  };

  const notifications = [
    {
      id: 1,
      text: "Новая заявка от Петрова А.И.",
      time: "5 мин назад",
      read: false,
    },
    {
      id: 2,
      text: "Отчет за неделю сформирован",
      time: "2 часа назад",
      read: false,
    },
    { id: 3, text: "Заявка #1234 одобрена", time: "Вчера", read: true },
    {
      id: 4,
      text: "Система обновлена до версии 2.1.4",
      time: "2 дня назад",
      read: true,
    },
  ];

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
      <div className="flex items-center justify-between">
        {/* Left: Sidebar toggle and page info */}
        <div className="flex items-center space-x-4">
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors material-symbols-outlined text-gray-600"
            aria-label="Toggle sidebar"
          >
            menu
          </button>

          <div>
            <h1 className="text-xl font-bold text-gray-900">{headerTitle}</h1>
            <p className="text-sm text-gray-500">Обзор системы пропусков</p>
          </div>
        </div>

        {/* Right: Actions and user */}
        <div className="flex items-center space-x-3">
          {/* Notifications dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setNotificationsOpen(!notificationsOpen);
                setUserMenuOpen(false);
              }}
              className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Уведомления"
            >
              <span className="material-symbols-outlined text-gray-700">
                notifications
              </span>
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
              )}
            </button>

            <AnimatePresence>
              {notificationsOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
                >
                  <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-900">
                        Уведомления
                      </h3>
                      {unreadCount > 0 && (
                        <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded-full">
                          {unreadCount} новых
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="max-h-80 overflow-y-auto">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={clsx(
                          "p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer",
                          !notification.read && "bg-blue-50",
                        )}
                      >
                        <div className="flex items-start space-x-3">
                          <span className="material-symbols-outlined text-blue-500 mt-0.5">
                            {notification.read
                              ? "mark_email_read"
                              : "mark_unread"}
                          </span>
                          <div className="flex-1">
                            <p className="text-gray-900">{notification.text}</p>
                            <p className="text-gray-500 text-sm mt-1">
                              {notification.time}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="p-3 border-t border-gray-200">
                    <button className="w-full text-center text-blue-600 hover:text-blue-800 text-sm font-medium py-2">
                      Показать все уведомления
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* User menu */}
          <div className="relative">
            <button
              onClick={() => {
                setUserMenuOpen(!userMenuOpen);
                setNotificationsOpen(false);
              }}
              className="flex items-center space-x-3 p-1 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Меню пользователя"
            >
              <div className="w-9 h-9 bg-linear-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center text-white">
                <span className="material-symbols-outlined text-lg">
                  person
                </span>
              </div>
              <div className="text-left hidden md:block">
                <p className="font-medium text-gray-900 text-sm">
                  {session?.user?.name}
                </p>
                <p className="text-xs text-gray-500">Руководитель отдела</p>
              </div>
              <span className="material-symbols-outlined text-gray-500">
                arrow_drop_down
              </span>
            </button>

            <AnimatePresence>
              {userMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
                >
                  <div className="p-4 border-b border-gray-200">
                    <p className="font-semibold text-gray-900">
                      {session?.user?.name}
                    </p>
                    {/* <p className="text-sm text-gray-500">a.ivanov@company.ru</p> */}
                  </div>

                  <div className="p-2">
                    <a
                      href="#"
                      className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50"
                    >
                      <span className="material-symbols-outlined text-gray-500">
                        account_circle
                      </span>
                      <span className="text-sm">Мой профиль</span>
                    </a>
                    <a
                      href="#"
                      className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50"
                    >
                      <span className="material-symbols-outlined text-gray-500">
                        settings
                      </span>
                      <span className="text-sm">Настройки</span>
                    </a>
                  </div>

                  <div className="p-2 border-t border-gray-200">
                    <button
                      onClick={() => setShowExitModal(true)}
                      className="flex items-center justify-center space-x-2 w-full p-2 text-red-600 hover:bg-red-50 rounded-lg text-sm"
                    >
                      <span className="material-symbols-outlined">logout</span>
                      <span>Выйти</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Backdrop for closing dropdowns */}
      {(notificationsOpen || userMenuOpen) && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => {
            setNotificationsOpen(false);
            setUserMenuOpen(false);
          }}
        />
      )}

      <Modal
        isOpen={showExitModal}
        onClose={() => setShowExitModal(false)}
        onConfirm={handleLogout}
        title="Выход из системы"
        message="Вы уверены, что хотите выйти из системы?"
        confirmText="Да, выйти"
        cancelText="Отмена"
        confirmButtonStyle="danger"
        icon="logout"
      />
    </header>
  );
};

export default MainHeader;
