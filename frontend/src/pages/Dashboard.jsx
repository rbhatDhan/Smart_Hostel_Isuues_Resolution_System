import React from "react";
import Layout from "../components/Layout";
import ComplaintCard from "../components/ComplaintCard";

const Dashboard = () => {
  return (
    <Layout>

      {/* TOP CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <div className="glass p-6">
          <p className="text-gray-600">Total Complaints</p>
          <h2 className="text-3xl font-bold">24</h2>
        </div>

        <div className="glass p-6">
          <p className="text-gray-600">Pending</p>
          <h2 className="text-3xl font-bold text-yellow-500">10</h2>
        </div>

        <div className="glass p-6">
          <p className="text-gray-600">Resolved</p>
          <h2 className="text-3xl font-bold text-green-500">14</h2>
        </div>

      </div>

      {/* TRANSACTION STYLE LIST */}
      <div className="mt-6 flex flex-col gap-4">

        <p className="text-sm text-gray-600">Today</p>

        <ComplaintCard title="Water Leakage" room="Room 204" status="Resolved" />
        <ComplaintCard title="WiFi Issue" room="Room 101" status="Pending" />

        <p className="text-sm text-gray-600 mt-4">Yesterday</p>

        <ComplaintCard title="Electricity Problem" room="Room 305" status="Delayed" />

      </div>

      {/* CHART UI */}
      <div className="glass p-6 mt-6">
        <p className="mb-4 font-semibold">Complaint Trends</p>

        <div className="h-40 flex items-end gap-1">
          {[...Array(40)].map((_, i) => (
            <div
              key={i}
              className="w-2 bg-gray-400/60 rounded-full"
              style={{ height: `${Math.random() * 100}%` }}
            />
          ))}
        </div>
      </div>

    </Layout>
  );
};

export default Dashboard;