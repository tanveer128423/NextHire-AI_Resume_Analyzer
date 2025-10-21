import React from "react";

export function Progress({ value = 0, className = "" }) {
  return (
    <div className={`w-full bg-slate-800 rounded ${className}`}>
      <div style={{ width: `${value}%` }} className="h-2 bg-blue-500 rounded"></div>
    </div>
  );
}
