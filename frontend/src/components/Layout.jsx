import React from "react";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-blue-100 to-green-200 p-6">

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

        {/* SIDEBAR */}
        <div className="glass p-5">
          <h1 className="text-xl font-bold mb-6">Smart Hostel</h1>

          <nav className="flex flex-col gap-3 text-sm">
            <Link to="/" className="p-2 rounded-xl hover:bg-white/50">Dashboard</Link>
            <Link to="/my-complaints" className="p-2 rounded-xl hover:bg-white/50">My Complaints</Link>
            <Link to="/create-complaint" className="p-2 rounded-xl hover:bg-white/50">Create Complaint</Link>
            <Link to="/all-complaints" className="p-2 rounded-xl hover:bg-white/50">All Complaints</Link>
            <Link to="/analytics" className="p-2 rounded-xl hover:bg-white/50">Analytics</Link>
          </nav>
        </div>

        {/* MAIN */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <Navbar />
          {children}
        </div>

        {/* RIGHT FLOAT PANEL */}
        <div className="hidden lg:flex justify-center">
          <div className="w-[280px] glass p-5">

            <p className="text-sm text-gray-600 mb-3">Hi, User 👋</p>

            {/* Highlight Card */}
            <div className="bg-yellow-300 rounded-3xl p-5 mb-4">
              <p className="text-sm">Total Complaints</p>
              <h2 className="text-3xl font-bold">26</h2>
              <p className="text-sm">+4 today</p>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-3 gap-3 mb-4 text-center text-sm">
              <div className="card p-2">Add</div>
              <div className="card p-2">Track</div>
              <div className="card p-2">Resolve</div>
            </div>

            {/* Mini Activity */}
            <div className="card p-3 text-sm">
              <p>Latest</p>
              <div className="flex justify-between mt-2">
                <span>Water Issue</span>
                <span className="text-red-500">Delayed</span>
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};

export default Layout;