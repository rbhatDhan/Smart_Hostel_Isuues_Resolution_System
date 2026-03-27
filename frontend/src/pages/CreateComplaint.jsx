import React, { useState } from "react";
import Layout from "../components/Layout";

const CreateComplaint = () => {
  const [form, setForm] = useState({
    title: "",
    category: "",
    priority: "",
    room: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      console.log(form);
      alert("Complaint submitted ✅");

      setForm({
        title: "",
        category: "",
        priority: "",
        room: "",
        description: "",
      });

      setLoading(false);
    }, 1000);
  };

  return (
    <Layout>
      <div className="flex justify-center items-center min-h-[80vh]">

        {/* MAIN CARD */}
        <div className="w-full max-w-2xl glass p-8">

          {/* HEADER */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Create Complaint
            </h2>
            <p className="text-sm text-gray-500">
              Report your issue quickly and clearly
            </p>
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">

            {/* TITLE */}
            <div>
              <label className="text-sm text-gray-600">Title</label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="e.g. Water leakage in bathroom"
                className="w-full mt-1 p-3 rounded-xl bg-white/70 border border-gray-200 focus:ring-2 focus:ring-indigo-400 outline-none"
                required
              />
            </div>

            {/* ROW */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              {/* CATEGORY */}
              <div>
                <label className="text-sm text-gray-600">Category</label>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="w-full mt-1 p-3 rounded-xl bg-white/70 border border-gray-200 focus:ring-2 focus:ring-indigo-400 outline-none"
                  required
                >
                  <option value="">Select</option>
                  <option>Water</option>
                  <option>Electricity</option>
                  <option>WiFi</option>
                  <option>Cleaning</option>
                  <option>Furniture</option>
                  <option>Other</option>
                </select>
              </div>

              {/* PRIORITY */}
              <div>
                <label className="text-sm text-gray-600">Priority</label>
                <select
                  name="priority"
                  value={form.priority}
                  onChange={handleChange}
                  className="w-full mt-1 p-3 rounded-xl bg-white/70 border border-gray-200 focus:ring-2 focus:ring-indigo-400 outline-none"
                  required
                >
                  <option value="">Select</option>
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                  <option>Urgent</option>
                </select>
              </div>

            </div>

            {/* ROOM */}
            <div>
              <label className="text-sm text-gray-600">Room Number</label>
              <input
                type="text"
                name="room"
                value={form.room}
                onChange={handleChange}
                placeholder="e.g. 204"
                className="w-full mt-1 p-3 rounded-xl bg-white/70 border border-gray-200 focus:ring-2 focus:ring-indigo-400 outline-none"
                required
              />
            </div>

            {/* DESCRIPTION */}
            <div>
              <label className="text-sm text-gray-600">Description</label>
              <textarea
                name="description"
                rows="4"
                value={form.description}
                onChange={handleChange}
                placeholder="Explain the issue in detail..."
                className="w-full mt-1 p-3 rounded-xl bg-white/70 border border-gray-200 focus:ring-2 focus:ring-indigo-400 outline-none"
                required
              />
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="mt-2 bg-gradient-to-r from-indigo-500 to-blue-500 text-white p-3 rounded-xl font-medium hover:opacity-90 transition"
            >
              {loading ? "Submitting..." : "Submit Complaint"}
            </button>

          </form>
        </div>

      </div>
    </Layout>
  );
};

export default CreateComplaint;