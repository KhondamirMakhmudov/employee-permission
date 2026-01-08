import React from "react";

const Input = ({
  id,
  label,
  type = "text",
  placeholder = "",
  required = false,
  icon,
  className = "",
  ...props
}) => {
  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label htmlFor={id} className="text-slate-700 text-sm font-semibold">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          required={required}
          className={`w-full bg-slate-50 text-slate-900 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder-slate-400 ${
            icon ? "pl-11" : ""
          } ${className}`}
          {...props}
        />
        {icon && (
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">
            {icon}
          </span>
        )}
      </div>
    </div>
  );
};

export default Input;
