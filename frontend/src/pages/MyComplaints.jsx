import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import api from "../services/api";
import { useLocation } from "react-router-dom";

const MyComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  // ✅ Edit modal state
  const [editingComplaint, setEditingComplaint] = useState(null);
  const [formData, setFormData] = useState({
    roomNumber: "",
    category: "",
    description: "",
  });

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

  // ✅ Open edit modal
  const handleEditClick = (complaint) => {
    setEditingComplaint(complaint);
    setFormData({
      roomNumber: complaint.roomNumber,
      category: complaint.category,
      description: complaint.description,
    });
  };

  // ✅ Handle edit submit
  const handleEditSubmit = async () => {
    try {
      const res = await api.put(
        `/api/complaints/${editingComplaint._id}/edit`,
        formData
      );

      // update UI
      setComplaints((prev) =>
        prev.map((c) =>
          c._id === editingComplaint._id ? res.data.complaint : c
        )
      );

      setEditingComplaint(null);
    } catch (error) {
      alert(error.response?.data?.message || "Edit failed");
    }
  };

  // ⏱️ Check 15 min window
  const canEdit = (createdAt) => {
    const diff =
      (Date.now() - new Date(createdAt).getTime()) / (1000 * 60);
    return diff <= 15;
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
                <button
                  onClick={() => handleEditClick(c)}
                  disabled={!canEdit(c.createdAt) || c.status !== "pending"}
                  className="px-3 py-1 text-sm bg-blue-500 text-white rounded-lg disabled:opacity-50"
                >
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

      {/* ✅ EDIT MODAL */}
      {editingComplaint && (
        <div className="fixed inset-0 bg-black/30 flex justify-center items-center">
          <div className="bg-white p-6 rounded-xl w-96 shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Edit Complaint</h3>

            <input
              type="text"
              placeholder="Room Number"
              value={formData.roomNumber}
              onChange={(e) =>
                setFormData({ ...formData, roomNumber: e.target.value })
              }
              className="w-full mb-3 p-2 border rounded"
            />

            <input
              type="text"
              placeholder="Category"
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              className="w-full mb-3 p-2 border rounded"
            />

            <textarea
              placeholder="Description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full mb-3 p-2 border rounded"
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setEditingComplaint(null)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleEditSubmit}
                className="px-4 py-2 bg-green-500 text-white rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default MyComplaints;