// components/ui/FormSection.jsx
import React from "react";

const FormSection = ({ title, description, children, className = "" }) => {
  return (
    <div className={`space-y-6 ${className}`}>
      <div className="mb-8 text-center">
        <h1 className="text-slate-900 text-3xl font-black mb-3">{title}</h1>
        {description && (
          <p className="text-slate-500 text-base max-w-md mx-auto">
            {description}
          </p>
        )}
      </div>
      {children}
    </div>
  );
};

export default FormSection;
