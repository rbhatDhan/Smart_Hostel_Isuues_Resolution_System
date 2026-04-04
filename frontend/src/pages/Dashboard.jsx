import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import api from "../services/api";

const Dashboard = () => {
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    resolved: 0,
  });

  const [todayCount, setTodayCount] = useState(0);
  const [yesterdayCount, setYesterdayCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/api/complaints");
        const complaints = res.data;

        // 🔥 BASIC STATS
        const total = complaints.length;
        const pending = complaints.filter(
          (c) => c.status === "pending"
        ).length;
        const resolved = complaints.filter(
          (c) => c.status === "resolved"
        ).length;

        setStats({ total, pending, resolved });

        // 🔥 TODAY & YESTERDAY
        const today = new Date();
        const yesterday = new Date();
        yesterday.setDate(today.getDate() - 1);

        const todayStr = today.toDateString();
        const yesterdayStr = yesterday.toDateString();

        let todayC = 0;
        let yesterdayC = 0;

        complaints.forEach((c) => {
          const date = new Date(c.createdAt).toDateString();

          if (date === todayStr) todayC++;
          if (date === yesterdayStr) yesterdayC++;
        });

        setTodayCount(todayC);
        setYesterdayCount(yesterdayC);

      } catch (error) {
        console.error("Dashboard error:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <Layout>
      <h2 className="text-2xl font-bold mb-6">Dashboard</h2>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">

        <div className="glass p-6 rounded-2xl shadow-md">
          <p className="text-gray-500 text-sm">Total Complaints</p>
          <h2 className="text-3xl font-bold mt-2">
            {stats.total}
          </h2>
        </div>

        <div className="glass p-6 rounded-2xl shadow-md">
          <p className="text-gray-500 text-sm">Pending</p>
          <h2 className="text-3xl font-bold text-yellow-500 mt-2">
            {stats.pending}
          </h2>
        </div>

        <div className="glass p-6 rounded-2xl shadow-md">
          <p className="text-gray-500 text-sm">Resolved</p>
          <h2 className="text-3xl font-bold text-green-500 mt-2">
            {stats.resolved}
          </h2>
        </div>

      </div>

      {/* TODAY / YESTERDAY */}
      <div className="glass p-6 rounded-2xl shadow-md w-fit">

        <div className="flex gap-10 text-center">

          <div>
            <p className="text-sm text-gray-500">Today</p>
            <p className="text-xl font-bold text-green-500">
              {todayCount}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Yesterday</p>
            <p className="text-xl font-bold text-gray-700">
              {yesterdayCount}
            </p>
          </div>

        </div>

      </div>

    </Layout>
  );
};

export default Dashboard;