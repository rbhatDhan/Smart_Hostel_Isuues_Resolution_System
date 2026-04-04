import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import api from "../services/api";

// 🔥 Chart imports
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";

import { Pie, Bar } from "react-chartjs-2";

// 🔥 Register chart components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

const Analytics = () => {
  const [stats, setStats] = useState({
    total: 0,
    resolved: 0,
    pending: 0,
  });

  const [categoryData, setCategoryData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await api.get("/api/complaints");
        const complaints = res.data;

        // 🔥 STATS
        const total = complaints.length;
        const resolved = complaints.filter(
          (c) => c.status === "resolved"
        ).length;
        const pending = complaints.filter(
          (c) => c.status === "pending"
        ).length;

        setStats({ total, resolved, pending });

        // 🔥 CATEGORY COUNT
        const categoryMap = {};
        complaints.forEach((c) => {
          const category = c.category || "Other";
          categoryMap[category] =
            (categoryMap[category] || 0) + 1;
        });

        setCategoryData(categoryMap);

      } catch (error) {
        console.error("Analytics error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  // 🔥 PIE DATA
  const pieData = {
    labels: ["Resolved", "Pending"],
    datasets: [
      {
        data: [stats.resolved, stats.pending],
        backgroundColor: ["#22c55e", "#facc15"],
      },
    ],
  };

  // 🔥 BAR DATA
  const barData = {
    labels: Object.keys(categoryData),
    datasets: [
      {
        label: "Complaints",
        data: Object.values(categoryData),
        backgroundColor: "#60a5fa",
      },
    ],
  };

  // 🔥 BAR OPTIONS (fix tilted labels)
  const barOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: {
        ticks: {
          maxRotation: 0,
          minRotation: 0,
        },
      },
    },
  };

  return (
    <Layout>
      {/* HEADER */}
      <h2 className="text-2xl font-bold mb-6 tracking-wide">
        📊 Analytics Dashboard
      </h2>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

        <div className="glass p-6 rounded-2xl shadow-md hover:scale-[1.02] transition">
          <p className="text-gray-500 text-sm">Total Complaints</p>
          <h2 className="text-3xl font-bold mt-2">
            {loading ? "..." : stats.total}
          </h2>
        </div>

        <div className="glass p-6 rounded-2xl shadow-md hover:scale-[1.02] transition">
          <p className="text-gray-500 text-sm">Resolved</p>
          <h2 className="text-3xl font-bold text-green-500 mt-2">
            {loading ? "..." : stats.resolved}
          </h2>
        </div>

        <div className="glass p-6 rounded-2xl shadow-md hover:scale-[1.02] transition">
          <p className="text-gray-500 text-sm">Pending</p>
          <h2 className="text-3xl font-bold text-yellow-500 mt-2">
            {loading ? "..." : stats.pending}
          </h2>
        </div>

      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* PIE CHART */}
        <div className="glass p-6 rounded-2xl shadow-md">
          
          <div className="flex justify-between items-center mb-4">
            <p className="font-semibold text-lg">
              Status Distribution
            </p>
            <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">
              Live
            </span>
          </div>

          <div className="h-72 flex items-center justify-center">
            {loading ? (
              <p>Loading...</p>
            ) : (
              <Pie
                data={pieData}
                options={{ maintainAspectRatio: false }}
              />
            )}
          </div>

        </div>

        {/* BAR CHART */}
        <div className="glass p-6 rounded-2xl shadow-md">

          <div className="flex justify-between items-center mb-4">
            <p className="font-semibold text-lg">
              Category Analysis
            </p>
            <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
              Live
            </span>
          </div>

          <div className="h-72">
            {loading ? (
              <p>Loading...</p>
            ) : (
              <Bar
                data={barData}
                options={{
                  ...barOptions,
                  maintainAspectRatio: false,
                }}
              />
            )}
          </div>

        </div>

      </div>
    </Layout>
  );
};

export default Analytics;