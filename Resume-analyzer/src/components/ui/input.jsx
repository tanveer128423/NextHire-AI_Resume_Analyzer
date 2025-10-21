import React from "react";

export function Input(props) {
  return <input {...props} className={`px-3 py-2 rounded bg-slate-800 text-white border border-slate-700 ${props.className || ""}`} />;
}
