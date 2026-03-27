import React from "react";

const Sidebar = () => {
  return (
    <div className="glass p-5 flex flex-col gap-4">

      <h1 className="text-xl font-bold">Smart Hostel</h1>

      <nav className="flex flex-col gap-2 text-sm">
        <div className="p-2 rounded-xl hover:bg-white/50 cursor-pointer">Dashboard</div>
        <div className="p-2 rounded-xl hover:bg-white/50 cursor-pointer">My Complaints</div>
        <div className="p-2 rounded-xl hover:bg-white/50 cursor-pointer">Create Complaint</div>
        <div className="p-2 rounded-xl hover:bg-white/50 cursor-pointer">All Complaints</div>
        <div className="p-2 rounded-xl hover:bg-white/50 cursor-pointer">Analytics</div>
      </nav>

    </div>
  );
};
const role = "student"; // change to admin / warden

{role === "student" && (
  <>
    <div>My Complaints</div>
    <div>Create Complaint</div>
  </>
)}

{role !== "student" && (
  <>
    <div>All Complaints</div>
    <div>Analytics</div>
  </>
)}
export default Sidebar;