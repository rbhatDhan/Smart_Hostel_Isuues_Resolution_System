import React, { useState } from "react";
import Layout from "../components/Layout";

const AllComplaints = () => {
  const [filter, setFilter] = useState("");

  const complaints = [
    { name: "John", title: "Water Issue", room: "204", status: "Pending" },
    { name: "Alex", title: "WiFi Issue", room: "101", status: "Resolved" },
    { name: "Sam", title: "Electricity", room: "305", status: "Delayed" },
  ];

  const filtered = filter
    ? complaints.filter((c) => c.status === filter)
    : complaints;

  return (
    <Layout>
      <h2 className="text-xl font-semibold mb-4">All Complaints</h2>

      {/* FILTER */}
      <select
        onChange={(e) => setFilter(e.target.value)}
        className="mb-4 p-2 rounded-lg border"
      >
        <option value="">All</option>
        <option>Pending</option>
        <option>Resolved</option>
        <option>Delayed</option>
      </select>

      <div className="flex flex-col gap-4">

        {filtered.map((c, i) => (
          <div key={i} className="card p-4 flex justify-between">

            <div>
              <p className="font-semibold">{c.title}</p>
              <p className="text-sm text-gray-500">
                {c.name} • Room {c.room}
              </p>
              <p className="text-sm mt-1">{c.status}</p>
            </div>

            <select className="p-2 border rounded-lg">
              <option>Pending</option>
              <option>In Progress</option>
              <option>Resolved</option>
            </select>

          </div>
        ))}

      </div>
    </Layout>
  );
};

export default AllComplaints;