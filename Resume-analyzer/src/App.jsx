import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import History from "./pages/History";

export default function App() {
  return (
    <Router>
      <div className="min-h-screen rounded-lg">
        {/* Navbar */}
        <nav className="bg-slate-800 text-white p-4 flex gap-6">
          <Link to="/dashboard" className="hover:underline">
            Dashboard
          </Link>
          <Link to="/history" className="hover:underline">
            History
          </Link>
        </nav>

        {/* Page Content */}
        <main className="p-6 rounded-lg">
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/history" element={<History />} />
            <Route path="*" element={<Dashboard />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
