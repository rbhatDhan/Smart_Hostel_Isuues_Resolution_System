import React from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

const Sidebar = () => {
  const { user } = useAuth();

  // ⛔ Wait until user loads
  if (!user) return null;

  // 🔥 Normalize role (handles admin, Admin, spaces, etc.)
  const role = String(user?.role || user?.userType || "")
    .trim()
    .toLowerCase();

  // 🔥 Admin access (both admin + warden)
  const isAdmin = role === "warden" || role === "admin";

  return (
    <div className="flex flex-col gap-4">

      <h1 className="text-xl font-bold mb-4">Smart Hostel</h1>

      <nav className="flex flex-col gap-3 text-sm">

        {/* Common */}
        <Link to="/" className="p-2 rounded-xl hover:bg-white/50 transition">
          Dashboard
        </Link>

        {/* 🎓 STUDENT ONLY */}
        {role === "student" && (
          <>
            <Link
              to="/my-complaints"
              className="p-2 rounded-xl hover:bg-white/50 transition"
            >
              My Complaints
            </Link>

            <Link
              to="/create-complaint"
              className="p-2 rounded-xl hover:bg-white/50 transition"
            >
              Create Complaint
            </Link>
          </>
        )}

        {/* 🛡️ ADMIN + WARDEN */}
        {isAdmin && (
          <>
            <Link
              to="/all-complaints"
              className="p-2 rounded-xl hover:bg-white/50 transition"
            >
              All Complaints
            </Link>

            <Link
              to="/analytics"
              className="p-2 rounded-xl hover:bg-white/50 transition"
            >
              Analytics
            </Link>
          </>
        )}

      </nav>
    </div>
  );
};

export default Sidebar;