import React from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import RightPanel from "./RightPanel";

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-blue-100 to-green-200 p-6">

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

        {/* SIDEBAR */}
        <div className="glass p-5 rounded-2xl shadow-md">
          <Sidebar />
        </div>

        {/* MAIN */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <Navbar />
          {children}
        </div>

        {/* RIGHT PANEL (ALWAYS VISIBLE) */}
        <div className="hidden lg:flex justify-center">
          <RightPanel />
        </div>

      </div>
    </div>
  );
};

export default Layout;