// components/ui/SubmitButton.jsx
import React from "react";

const SubmitButton = ({
  children = "Отправить запрос",
  loading = false,
  icon = "send",
  className = "",
}) => {
  return (
    <button
      type="submit"
      disabled={loading}
      className={`w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-4 px-6 rounded-xl transition-all flex items-center justify-center gap-3 shadow-lg shadow-blue-500/25 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {icon && (
        <span className="material-symbols-outlined text-[20px]">{icon}</span>
      )}
      {loading ? "Отправка..." : children}
    </button>
  );
};

export default SubmitButton;
