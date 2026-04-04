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

  // 🔒 Protect route
  useEffect(() => {
    if (!user) return;

    const role = String(user.role || "").toLowerCase();
    if (role !== "warden" && role !== "admin") {
      navigate("/");
    }
  }, [user, navigate]);

  // 🔥 Fetch complaints
  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const res = await api.get("/api/complaints");
        setComplaints(res.data);
      } catch (error) {
        console.error("Error fetching complaints", error);
      }
    };

    if (user) fetchComplaints();
  }, [user]);

  // 🔥 Update status
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
      alert(error.response?.data?.message || "Update failed");
    }
  };

  // 🔥 Format date
  const formatDateTime = (date) => {
    return new Date(date).toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // 🔍 Filter
  const filtered = filter
    ? complaints.filter((c) => c.status === filter)
    : complaints;

  return (
    <Layout>
      <h2 className="text-xl font-semibold mb-4">
        All Complaints
      </h2>

      {/* FILTER */}
      <select
        onChange={(e) => setFilter(e.target.value)}
        className="mb-4 p-2 rounded-lg border"
      >
        <option value="">All</option>
        <option value="pending">Pending</option>
        <option value="resolved">Resolved</option>
        <option value="in progress">In Progress</option>
      </select>

      <div className="flex flex-col gap-4">

        {filtered.map((c) => (
          <div
            key={c._id}
            className="glass p-4 rounded-2xl shadow-md flex justify-between items-center"
          >
            {/* LEFT */}
            <div>
              <p className="font-semibold text-lg">
                {c.category}
              </p>

              <p className="text-sm text-gray-500">
                {c.studentId?.name} • Room {c.roomNumber}
              </p>

              {/* 🔥 DATE */}
              <p className="text-xs text-gray-400 mt-1">
                📅 {formatDateTime(c.createdAt)}
              </p>

              {/* STATUS BADGE */}
              <p
                className={`text-xs mt-2 px-2 py-1 rounded-full w-fit ${
                  c.status === "resolved"
                    ? "bg-green-100 text-green-600"
                    : c.status === "pending"
                    ? "bg-yellow-100 text-yellow-600"
                    : "bg-blue-100 text-blue-600"
                }`}
              >
                {c.status}
              </p>
            </div>

            {/* RIGHT (STATUS CHANGE) */}
            <select
              value={c.status}
              onChange={(e) =>
                handleStatusChange(c._id, e.target.value)
              }
              className="p-2 border rounded-lg"
            >
              <option value="pending">Pending</option>
              <option value="in progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
        ))}

      </div>
    </Layout>
  );
};

export default AllComplaints;