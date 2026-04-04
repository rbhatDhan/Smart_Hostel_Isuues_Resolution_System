import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import api from "../services/api";
import { useLocation } from "react-router-dom";

const MyComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  // ✅ Fetch complaints
  const fetchComplaints = async () => {
    try {
      const res = await api.get("/api/complaints/my");
      setComplaints(res.data);
    } catch (error) {
      console.error("Error fetching complaints", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Run on page load + navigation
  useEffect(() => {
    fetchComplaints();
  }, [location]);

  // ✅ Cancel complaint
  const handleCancel = async (id) => {
    try {
      await api.put(`/api/complaints/${id}/cancel`);

      setComplaints((prev) =>
        prev.map((c) =>
          c._id === id ? { ...c, status: "cancelled" } : c
        )
      );
    } catch (error) {
      alert(error.response?.data?.message || "Cancel failed");
    }
  };

  return (
    <Layout>
      <h2 className="text-xl font-semibold mb-4">My Complaints</h2>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="flex flex-col gap-4">

          {complaints.length === 0 && (
            <p className="text-gray-500">No complaints found</p>
          )}

          {complaints.map((c) => (
            <div
              key={c._id}
              className="card p-4 flex justify-between items-center"
            >
              <div>
                <p className="font-semibold">{c.category}</p>
                <p className="text-sm text-gray-500">
                  Room {c.roomNumber}
                </p>

                <p
                  className={`text-sm mt-1 ${
                    c.status === "cancelled" ? "text-gray-400" : ""
                  }`}
                >
                  {c.status}
                </p>
              </div>

              <div className="flex gap-2">
                <button className="px-3 py-1 text-sm bg-blue-500 text-white rounded-lg">
                  Edit
                </button>

                <button
                  onClick={() => handleCancel(c._id)}
                  disabled={c.status === "cancelled"}
                  className="px-3 py-1 text-sm bg-red-500 text-white rounded-lg disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          ))}

        </div>
      )}
    </Layout>
  );
};

export default MyComplaints;