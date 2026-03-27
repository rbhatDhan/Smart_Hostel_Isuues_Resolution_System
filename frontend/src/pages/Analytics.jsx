import React from "react";
import Layout from "../components/Layout";

const Analytics = () => {
  return (
    <Layout>
      <h2 className="text-xl font-semibold mb-4">Analytics</h2>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">

        <div className="glass p-6">
          <p>Total</p>
          <h2 className="text-2xl font-bold">50</h2>
        </div>

        <div className="glass p-6">
          <p>Resolved</p>
          <h2 className="text-2xl font-bold text-green-500">30</h2>
        </div>

        <div className="glass p-6">
          <p>Pending</p>
          <h2 className="text-2xl font-bold text-yellow-500">20</h2>
        </div>

      </div>

      {/* Fake Chart */}
      <div className="glass p-6">
        <p className="mb-4">Monthly Trends</p>

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

export default Analytics;