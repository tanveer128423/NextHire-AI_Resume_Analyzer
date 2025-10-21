import React from "react";

export function Button({ children, className = "", variant = "default", size = "base", ...props }) {
  const base = "inline-flex items-center justify-center rounded-md";
  return <button {...props} className={`${base} ${className}`}>{children}</button>;
}
