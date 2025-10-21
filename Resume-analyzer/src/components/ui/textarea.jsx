import React from "react";

export function Textarea(props) {
  return <textarea {...props} className={`w-full p-2 rounded bg-slate-800 text-white border border-slate-700 ${props.className || ""}`} />;
}
