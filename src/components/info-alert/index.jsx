// components/ui/InfoAlert.jsx
import React from "react";

const InfoAlert = ({ children, icon = "info", className = "" }) => {
  return (
    <div
      className={`flex items-start gap-3 p-4 bg-blue-50 rounded-xl ${className}`}
    >
      <span className="material-symbols-outlined text-blue-600 text-[20px]">
        {icon}
      </span>
      <p className="text-xs text-slate-600 leading-normal">{children}</p>
    </div>
  );
};

export default InfoAlert;
