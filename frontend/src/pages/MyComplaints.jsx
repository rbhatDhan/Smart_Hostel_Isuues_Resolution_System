import React from "react";
import Layout from "../components/Layout";

const MyComplaints = () => {
  const complaints = [
    {
      title: "Water Leakage",
      room: "204",
      status: "Pending",
    },
    {
      title: "WiFi Issue",
      room: "101",
      status: "Resolved",
    },
  ];

  return (
    <Layout>
      <h2 className="text-xl font-semibold mb-4">My Complaints</h2>

      <div className="flex flex-col gap-4">

        {complaints.map((c, i) => (
          <div key={i} className="card p-4 flex justify-between items-center">

            <div>
              <p className="font-semibold">{c.title}</p>
              <p className="text-sm text-gray-500">Room {c.room}</p>
              <p className="text-sm mt-1">{c.status}</p>
            </div>

            <div className="flex gap-2">
              <button className="px-3 py-1 text-sm bg-blue-500 text-white rounded-lg">
                Edit
              </button>

              <button className="px-3 py-1 text-sm bg-red-500 text-white rounded-lg">
                Cancel
              </button>
            </div>

          </div>
        ))}

      </div>
    </Layout>
  );
};

export default MyComplaints;