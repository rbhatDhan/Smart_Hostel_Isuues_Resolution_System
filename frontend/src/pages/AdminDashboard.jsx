import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import api from "../services/api";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    resolved: 0,
  });

  const [usersCount, setUsersCount] = useState(0);
  const [studentCount, setStudentCount] = useState(0);
  const [wardenCount, setWardenCount] = useState(0);
  const [adminCount, setAdminCount] = useState(0);

  const [todayCount, setTodayCount] = useState(0);
  const [yesterdayCount, setYesterdayCount] = useState(0);

  const [resolutionRate, setResolutionRate] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 📌 Complaints
        const res = await api.get("/api/complaints");
        const complaints = res.data;

        const total = complaints.length;
        const pending = complaints.filter(
          (c) => c.status === "pending"
        ).length;
        const resolved = complaints.filter(
          (c) => c.status === "resolved"
        ).length;

        setStats({ total, pending, resolved });

        // 📊 Resolution Rate
        const rate =
          total > 0 ? ((resolved / total) * 100).toFixed(1) : 0;
        setResolutionRate(rate);

        // 📅 Today vs Yesterday
        const today = new Date().toDateString();
        const yesterday = new Date(
          Date.now() - 86400000
        ).toDateString();

        let todayC = 0;
        let yesterdayC = 0;

        complaints.forEach((c) => {
          const date = new Date(c.createdAt).toDateString();
          if (date === today) todayC++;
          if (date === yesterday) yesterdayC++;
        });

        setTodayCount(todayC);
        setYesterdayCount(yesterdayC);

        // 👥 Users (FIXED)
        const usersRes = await api.get("/api/auth/users");
        const users = usersRes.data;

        setUsersCount(users.length);

        // 🔥 ROLE SPLIT
        const students = users.filter(u => u.role === "student").length;
        const wardens = users.filter(u => u.role === "warden").length;
        const admins = users.filter(u => u.role === "admin").length;

        setStudentCount(students);
        setWardenCount(wardens);
        setAdminCount(admins);

      } catch (error) {
        console.error("Admin Dashboard error:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <Layout>
      <h2 className="text-2xl font-bold mb-6">Admin Dashboard</h2>

      {/* 📊 MAIN STATS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">

        <Card title="Total Complaints" value={stats.total} />
        <Card title="Pending" value={stats.pending} color="text-yellow-500" />
        <Card title="Resolved" value={stats.resolved} color="text-green-500" />
        <Card title="Total Users" value={usersCount} color="text-indigo-500" />

      </div>

      {/* 👥 ROLE BREAKDOWN */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">

        <Card title="Students" value={studentCount} />
        <Card title="Wardens" value={wardenCount} />
        <Card title="Admins" value={adminCount} />

      </div>

      {/* 📈 INSIGHTS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">

        <div className="glass p-6 rounded-2xl shadow-md">
          <p className="text-sm text-gray-500">Resolution Rate</p>
          <h2 className="text-3xl font-bold text-green-500 mt-2">
            {resolutionRate}%
          </h2>
        </div>

        <div className="glass p-6 rounded-2xl shadow-md">
          <p className="text-sm text-gray-500">Today</p>
          <h2 className="text-2xl font-bold text-green-500 mt-2">
            {todayCount}
          </h2>
        </div>

        <div className="glass p-6 rounded-2xl shadow-md">
          <p className="text-sm text-gray-500">Yesterday</p>
          <h2 className="text-2xl font-bold mt-2">
            {yesterdayCount}
          </h2>
        </div>

      </div>

      {/* SYSTEM INFO */}
      <div className="glass p-6 rounded-2xl shadow-md">
        <h3 className="font-semibold mb-2">System Overview</h3>
        <p className="text-gray-500 text-sm">
          Monitor complaints, user roles, and resolution efficiency.
          Helps admin track system performance in real-time.
        </p>
      </div>

    </Layout>
  );
};

// 🔹 Reusable card
const Card = ({ title, value, color }) => (
  <div className="glass p-6 rounded-2xl shadow-md">
    <p className="text-gray-500 text-sm">{title}</p>
    <h2 className={`text-3xl font-bold mt-2 ${color || ""}`}>
      {value}
    </h2>
  </div>
);

export default AdminDashboard;