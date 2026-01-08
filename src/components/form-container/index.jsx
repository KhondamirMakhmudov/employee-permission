// components/ui/FormContainer.jsx
import React from "react";

const FormContainer = ({ children, className = "" }) => {
  return (
    <div
      className={`bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-200 p-6 md:p-10 ${className}`}
    >
      {children}
    </div>
  );
};

export default FormContainer;
