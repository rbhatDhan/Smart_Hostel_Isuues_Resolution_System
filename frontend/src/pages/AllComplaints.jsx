import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const AllComplaints = () => {
  const [filter, setFilter] = useState("");
  const [complaints, setComplaints] = useState([]);
  const { user } = useAuth();
  const navigate = useNavigate();

  // 🔒 Only block if NOT logged in
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const res = await api.get("/api/complaints");
        setComplaints(res.data.reverse());
      } catch (error) {
        console.error("Error fetching complaints", error);
      }
    };

    if (user) fetchComplaints();
  }, [user]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await api.put(`/api/complaints/${id}`, {
        status: newStatus,
      });

      setComplaints((prev) =>
        prev.map((c) =>
          c._id === id ? { ...c, status: newStatus } : c
        )
      );
    } catch (error) {
      alert("Update failed");
    }
  };

  const filtered = filter
    ? complaints.filter(
        (c) => c.status?.toLowerCase() === filter.toLowerCase()
      )
    : complaints;

  return (
    <Layout>
      <h2 className="text-xl font-semibold mb-4">
        All Complaints
      </h2>

      <select
        onChange={(e) => setFilter(e.target.value)}
        className="mb-4 p-2 rounded-lg border"
      >
        <option value="">All</option>
        <option value="pending">Pending</option>
        <option value="in progress">In Progress</option>
        <option value="resolved">Resolved</option>
      </select>

      {filtered.length === 0 && (
        <p className="text-center text-gray-500">
          No complaints found
        </p>
      )}

      <div className="flex flex-col gap-4">
        {filtered.map((c) => (
          <div key={c._id} className="glass p-4 rounded-2xl shadow-md flex justify-between">

            <div>
              <p className="font-semibold">{c.category}</p>
              <p className="text-sm text-gray-500">
                {c.studentId?.name} • Room {c.roomNumber}
              </p>
              <p className="text-xs text-gray-400">
                {new Date(c.createdAt).toLocaleString()}
              </p>
            </div>

            {/* 🔥 Only Warden/Admin can update */}
            {user?.role !== "student" && (
              <select
                value={c.status}
                disabled={c.status === "resolved"}
                onChange={(e) =>
                  handleStatusChange(c._id, e.target.value)
                }
                className="p-2 border rounded-lg"
              >
                <option value="pending">Pending</option>
                <option value="in progress">In Progress</option>
                <option value="resolved">Resolved</option>
              </select>
            )}

          </div>
        ))}
      </div>
    </Layout>
  );
};

export default AllComplaints;