import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import api from "../services/api";
import { Bell } from "lucide-react";

const Dashboard = () => {
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    resolved: 0,
  });

  const [todayCount, setTodayCount] = useState(0);
  const [yesterdayCount, setYesterdayCount] = useState(0);

  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
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

    const fetchNotifications = async () => {
      try {
        const res = await api.get("/api/notifications");
        setNotifications(res.data);
      } catch (err) {
        console.error("Notification error:", err);
      }
    };

    fetchData();
    fetchNotifications();

    // 🔥 LIVE NOTIFICATIONS
    const interval = setInterval(fetchNotifications, 5000);

    return () => clearInterval(interval);

  }, []);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <Layout>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Dashboard</h2>

        <div className="relative">
          <button
            onClick={() => setOpen(!open)}
            className="relative p-2 rounded-full hover:bg-gray-100"
          >
            <Bell size={22} />

            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1 rounded-full">
                {unreadCount}
              </span>
            )}
          </button>

          {open && (
            <div className="absolute right-0 mt-2 w-80 glass p-4 rounded-xl shadow-lg z-50">
              <h4 className="font-semibold mb-2">Notifications</h4>

              {notifications.length === 0 ? (
                <p className="text-gray-500 text-sm">
                  No notifications
                </p>
              ) : (
                <div className="max-h-64 overflow-y-auto">
                  {notifications.map((n) => (
                    <div
                      key={n._id}
                      className={`p-2 mb-2 rounded-lg ${
                        n.isRead
                          ? "bg-gray-100"
                          : "bg-blue-50"
                      }`}
                    >
                      <p className="text-sm">{n.message}</p>
                      <span className="text-xs text-gray-400">
                        {new Date(n.createdAt).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* STATS (unchanged) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="glass p-6 rounded-2xl shadow-md">
          <p className="text-gray-500 text-sm">Total Complaints</p>
          <h2 className="text-3xl font-bold mt-2">{stats.total}</h2>
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

      {/* TODAY/YESTERDAY */}
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