import React from "react";
import { Link } from "react-router-dom";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-900">
      <main className="p-6">
        <div className="max-w-6xl mx-auto">{children}</div>
      </main>

      <footer className="p-4 text-center text-sm text-slate-600">
        © {new Date().getFullYear()} Next Hire
      </footer>
    </div>
  );
}
