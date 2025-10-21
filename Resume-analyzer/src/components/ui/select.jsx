import React, { useState, createContext, useContext } from "react";

const SelectContext = createContext(null);

export function Select({ children, value, onValueChange }) {
  const [open, setOpen] = useState(false);
  return (
    <SelectContext.Provider value={{ value, onValueChange, open, setOpen }}>
      <div className="relative inline-block w-full">{children}</div>
    </SelectContext.Provider>
  );
}

export function SelectTrigger({ children, className = "" }) {
  const ctx = useContext(SelectContext);
  return (
    <button type="button" onClick={() => ctx.setOpen(!ctx.open)} className={`w-full text-left px-3 py-2 rounded ${className}`}>
      {children}
      <span className="ml-3 text-sm opacity-70">▽</span>
      
    </button>
  );
}

export function SelectValue() {
  const ctx = useContext(SelectContext);
  return <span>{ctx.value}</span>;
}

export function SelectContent({ children, className = "" }) {
  const ctx = useContext(SelectContext);
  if (!ctx.open) return null;
  return (
    <div className={`absolute mt-2 left-0 w-full z-20 ${className}`}>
      <div className="bg-slate-200 border border-slate-700 rounded p-2">{children}</div>
    </div>
  );
}

export function SelectItem({ value, children }) {
  const ctx = useContext(SelectContext);
  return (
    <div className="py-1 px-2 cursor-pointer hover:bg-slate-400 rounded" onClick={() => { ctx.onValueChange(value); ctx.setOpen(false); }}>
      {children}
    </div>
  );
}
