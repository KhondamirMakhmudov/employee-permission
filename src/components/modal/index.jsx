// Universal Modal Component
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";

const Modal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Подтвердить",
  cancelText = "Отмена",
  confirmButtonStyle = "danger", // "danger" | "primary" | "success"
  icon,
  children,
}) => {
  const getConfirmButtonClasses = () => {
    const baseClasses =
      "px-6 py-2.5 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 active:scale-95";

    switch (confirmButtonStyle) {
      case "danger":
        return `${baseClasses} bg-red-600 hover:bg-red-700 text-white shadow-md hover:shadow-lg`;
      case "primary":
        return `${baseClasses} bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg`;
      case "success":
        return `${baseClasses} bg-green-600 hover:bg-green-700 text-white shadow-md hover:shadow-lg`;
      default:
        return `${baseClasses} bg-gray-600 hover:bg-gray-700 text-white shadow-md hover:shadow-lg`;
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={handleBackdropClick}
          >
            {/* Modal Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-start gap-4">
                  {icon && (
                    <div className="shrink-0">
                      <div
                        className={clsx(
                          "flex h-12 w-12 items-center justify-center rounded-full",
                          confirmButtonStyle === "danger" && "bg-red-100",
                          confirmButtonStyle === "primary" && "bg-blue-100",
                          confirmButtonStyle === "success" && "bg-green-100",
                        )}
                      >
                        <span
                          className={clsx(
                            "material-symbols-outlined text-3xl",
                            confirmButtonStyle === "danger" && "text-red-600",
                            confirmButtonStyle === "primary" && "text-blue-600",
                            confirmButtonStyle === "success" &&
                              "text-green-600",
                          )}
                        >
                          {icon}
                        </span>
                      </div>
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900">{title}</h3>
                    {message && (
                      <p className="mt-2 text-sm text-gray-600">{message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Content */}
              {children && (
                <div className="p-6 border-b border-gray-200">{children}</div>
              )}

              {/* Footer / Actions */}
              <div className="p-6 bg-gray-50 flex items-center justify-end gap-3">
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-lg font-semibold text-gray-700 hover:bg-gray-200 transition-all duration-200"
                >
                  {cancelText}
                </button>
                <button
                  onClick={() => {
                    onConfirm();
                    onClose();
                  }}
                  className={getConfirmButtonClasses()}
                >
                  {confirmText}
                </button>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Modal;
