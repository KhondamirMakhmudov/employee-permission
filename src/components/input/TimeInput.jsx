// components/ui/TimeInput.jsx
import React from "react";

const TimeInput = ({
  id,
  label,
  timeLabel = "", // 'C' or 'По'
  required = false,
  icon = "schedule",
  className = "",
  ...props
}) => {
  return (
    <div className="relative">
      <input
        id={id}
        type="time"
        required={required}
        className={`w-full bg-slate-50 text-slate-900 border border-slate-200 rounded-xl px-4 py-3 pl-11 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all ${className}`}
        {...props}
      />
      <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">
        {icon}
      </span>
      {timeLabel && (
        <span className="absolute -top-2.5 left-3 px-1 bg-white text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          {timeLabel}
        </span>
      )}
    </div>
  );
};

export default TimeInput;
