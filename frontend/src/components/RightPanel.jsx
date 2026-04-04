import React, { useEffect, useState } from "react";
import api from "../services/api";

const RightPanel = () => {
  const [stats, setStats] = useState({ total: 0 });
  const [todayCount, setTodayCount] = useState(0);
  const [latest, setLatest] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/api/complaints");
        const complaints = res.data;

        // 🔥 Total
        setStats({ total: complaints.length });

        // 🔥 Today count
        const today = new Date().toDateString();
        const todayData = complaints.filter(
          (c) =>
            new Date(c.createdAt).toDateString() === today
        );

        setTodayCount(todayData.length);

        // 🔥 Latest complaint
        setLatest(complaints[0]);

      } catch (err) {
        console.error("Right panel error:", err);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="w-[280px] glass p-5 rounded-2xl shadow-md flex flex-col gap-4">

      <p className="text-sm text-gray-600">
        Hi, User 👋
      </p>

      {/* Highlight */}
      <div className="bg-gradient-to-r from-yellow-300 to-yellow-400 rounded-2xl p-5">
        <p className="text-sm">Total Complaints</p>
        <h2 className="text-3xl font-bold">{stats.total}</h2>
        <p className="text-sm">+{todayCount} today</p>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-3 gap-3 text-center text-sm">
        <div className="bg-white/70 p-2 rounded-xl">➕ Add</div>
        <div className="bg-white/70 p-2 rounded-xl">📍 Track</div>
        <div className="bg-white/70 p-2 rounded-xl">✅ Resolve</div>
      </div>

      {/* Latest */}
      <div className="bg-white/70 rounded-xl p-3 text-sm">
        <p className="text-gray-500">Latest</p>

        <div className="flex justify-between mt-2">
          <span>{latest?.category || "No data"}</span>
          <span className="text-red-500">
            {latest?.status || "-"}
          </span>
        </div>
      </div>

    </div>
  );
};

export default RightPanel;