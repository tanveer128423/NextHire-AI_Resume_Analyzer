import React from "react";

export function Badge({ children, className = "", variant = "secondary", ...props }) {
  return (
    <span {...props} className={`inline-block px-2 py-1 rounded ${className}`}>
      {children}
    </span>
  );
}
