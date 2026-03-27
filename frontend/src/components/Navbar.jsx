import React from "react";

const Navbar = () => {
  return (
    <div className="bg-white/60 backdrop-blur-lg rounded-2xl p-4 mb-4 flex justify-between shadow">
      <h2 className="font-semibold">Dashboard</h2>

      <div className="flex gap-4">
        <span>🔔</span>
        <span>User</span>
      </div>
    </div>
  );
};

export default Navbar;